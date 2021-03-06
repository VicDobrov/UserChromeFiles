(this.contextsearch = { // https://forum.mozilla-russia.org/viewtopic.php?pid=780283#p780283
	topic: "browser-search-engine-modified", hide: "browser.search.hiddenOneOffs",
	defaultImg: "chrome://browser/skin/search-engine-placeholder.png",
	searchSelect: null, popup: null,
	init(that) {
		var searchSelect = this.searchSelect = document.querySelector("#context-searchselect");
		if (!searchSelect)
			return;
		var popup = this.popup = searchSelect.closest("menupopup");
		popup.addEventListener("popupshowing", this);
		that.unloadlisteners.push("contextsearch");
		document.getElementById("context-sep-screenshots").style.setProperty("display", "none", "important");
		if (AppConstants.platform == "macosx")
			Services.prefs.setBoolPref('widget.macos.native-context-menus',false);
	},
	destructor() {
		this.popup.removeEventListener("popupshowing", this);
		if (this.popupshowing == this.handler) {
			this.popup.removeEventListener("popuphidden", this);
			Services.obs.removeObserver(this, this.topic);
			Services.prefs.removeObserver(this.hide, this);
		}
	},
	handleEvent(e) { this[e.type](e);
	},
	popupshowing(e) {
		var popup = this.popup;
		var searchSelect = this.searchSelect;
		if (e.target != popup || searchSelect.hidden) return;
		var menu = document.createXULElement("menu");
		menu.className = "menu-iconic";
		var menupopup = document.createXULElement("menupopup");
		menu.append(menupopup);
		menu.ePopup = menupopup;
		searchSelect.style.setProperty("display", "none", "important");
		// searchSelect.before(menu);
		document.getElementById("context-selectall").after(menu);
		menu.onclick = this.search.bind(this);
		this.handler = e => e.target != popup || (menu.hidden = searchSelect.hidden);
		this.handlerRebuild = e => this.handler(e) || this.rebuild(menu);
		this.popuphidden = ev => {
			if (ev.target != popup) return;
			menu.hidden = true;
		};
		this.popup.addEventListener("popuphidden", this);
		this.rebuild(menu);
	},
	async rebuild(menu) {
		var de = Services.search.defaultEngine;
		de = de.wrappedJSObject || de;
		this.setAttrs(menu, de, `???????????? ?? ${de.name} ?????? ?? ...`);
		menu.ePopup.textContent = "";
		var pref = Services.prefs.getStringPref("browser.search.hiddenOneOffs");
		var hiddenList = pref ? pref.split(",") : [];
		var engines = await Services.search.getVisibleEngines();
		for (let engine of engines.filter(e => !hiddenList.includes(e.name))) {
			if (engine == de) continue;
			var menuitem = document.createXULElement("menuitem");
			menuitem.className = "menuitem-iconic";
			this.setAttrs(menuitem, engine);
			menu.ePopup.append(menuitem);
		}
		this.popupshowing = this.handler;
		Services.obs.addObserver(this, this.topic, false);
		Services.prefs.addObserver(this.hide, this);
	},
	setAttrs(node, engine, label = engine.name) {
		node.engine = engine;
		node.setAttribute("label", label);
		node.setAttribute("image", engine.iconURI ? engine.iconURI.spec : this.defaultImg);
	},
	observe() {
		this.popupshowing = this.handlerRebuild;
		Services.obs.removeObserver(this, this.topic);
		Services.prefs.removeObserver(this.hide, this);
	},
	search(e) {
		var {engine} = e.target;
		if (!engine) return;
		var searchSelect = this.searchSelect;
		var submission = engine.getSubmission(
			searchSelect.searchTerms, null, "contextmenu"
		);
		if (submission) {
			let tab = gBrowser.addTab(submission.uri.spec, {
				postData: submission.postData,
				index: (gBrowser.selectedTab._tPos + 1),
				triggeringPrincipal: searchSelect.principal
			});
			if (e.button == 0)
				gBrowser.selectedTab = tab;
		}
		var popup = this.popup;
		e.button != 1 && popup.state == "open" && popup.hidePopup();
	}
}).init(this);