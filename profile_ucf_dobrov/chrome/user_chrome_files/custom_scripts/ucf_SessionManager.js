(async (pid, mp, self) => CustomizableUI.createWidget((self = { id: "ucf_SessionManager", tooltiptext:
`Менеджер сессий: запись раз в 0.15 мин\n
Правый клик на Имени сессии:
	Выделить и Открывать при запуске
Колёсико или Клик + Ctrl:
	Открыть сессию в новых вкладках\n
Сортировка: тащите строки мышью
	или курсором, удерживая Shift`, label: "Менеджер сессий", localized: false,
	init() {
		this.handleEvent = e => this[e.type](e);
		this.onTimeout = async () => await this.saveSession() || this.save();
		Services.obs.addObserver(this, "quit-application");
		var {openMenu} = this;
		this.render = function() {
			this.openMenu = openMenu;
			this.constructor.prototype.render.call(this);
		}
		if (!Services.startup.wasRestarted && this.meta.boot != null) setTimeout(() => {
			var name = this.id + "-startup-notification";
			var as = Cc["@mozilla.org/alerts-service;1"].getService(Ci.nsIAlertsService);
			as.showAlertNotification(	this.image, this.label,
				"Восстановление [boot]-сессии\n\n" + this.meta.order[this.meta.boot],
				false, null, null, name );
			setTimeout(() => as.closeAlert(name), 7e3); // закрыть уведомление
		}, 3e3);
		delete this.init;
		return this;
	},
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAEnQAABJ0BfDRroQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGxSURBVDiNnZE/T1NRGMZ/7zn3lmKLkIKpaUxZFINEJZ0YHXRwcnBxMQ6aOJi4+FH8Dm5OOjA4+AEYGCTRook1JlVIVUrbW/rnPg63UtReIr7bOXmf5/ye59jDlanHS3O+wn/Mu+/DF8HFeVe5f+vaPTdfPpF4UNvk6frmhwAvXOEsvrR0IoN47xM4CHCADmDQBkAHbdTrTBRZdgYLs6NTD/MiMC+gC8MO6ke8ffWsXv3S3JpksHouv7Z4/UEeM8z6IwKfEGjYRt0G1d3m1p3n0Y1JBi/vTtfKw1Yec2CHBDFmXYjboAgL4tTc5pXsmcNcDxIDUFQHuqgfYT69OAuE9qqAoX4jIcAL7b9H+0deOYYg3tkYXxx2EAo7dQYEBF/TEULD5oow7KHut18RhGVD3GwxMZ36YWn6IJd37vQCSMSNBpYQCMs43PQMAJXlwtr6k7CGfo9iznN1ebGY7Ak1NSJwYERYJgM+Q+nClVzp/OXc3wWMwdT+jAVKCMwLC2PUeoMrrEI4m94BQq0a6mxjoca/YKFgUCfeqR8jPhoHcIAHe3ST2+UFLv2T8o/5uMvrnx9Wn65p5nMEAAAAAElFTkSuQmCC",
	onCreated(btn) {
		btn.type = "menu";
		btn.phTimestamp = 0;
		btn.render = this.render;
		btn.onclick = this.click;
		btn.setAttribute("image", this.image);
		var popup = btn.ownerDocument.createXULElement("menupopup");
		popup.filler = this;
		popup.id = pid;
		popup.setAttribute("onpopupshowing", "event.defaultPrevented || filler.fill(event)");
		btn.prepend(popup);
		this.btn = btn, btn.owner = this, btn.setAttribute("onmouseenter", "owner.mouseenter()");
		btn.addEventListener("mousedown", this);
		popup.addEventListener("command", this);
		btn.ownerGlobal.addEventListener("unload", () => {
			btn.removeEventListener("mousedown", this);
			popup.removeEventListener("command", this);
			if (popup.filler != this)
				popup.removeEventListener("dragstart", this),
				popup.removeEventListener("popuphidden", this);
		}, {once: true});
	},
	openMenu(arg) {
		var pos;
		if (this.matches(".widget-overflow-list > :scope"))
			pos = "after_start";
		else var win = this.ownerGlobal, {width, height, top, bottom, left, right} =
			this.closest("toolbar").getBoundingClientRect(), pos = width > height
				? `${win.innerHeight - bottom > top ? "after" : "before"}_start`
				: `${win.innerWidth - right > left ? "end" : "start"}_before`;
		this.firstChild.setAttribute("position", pos);
		delete this.openMenu;
		this.openMenu(arg);
	},
	mousedown(e) {
		if (e.button) return;
		var trg = e.target;
		if (trg.nodeName.startsWith("t"))
			trg.mdTimestamp = Cu.now(),
			trg.tid = e.view.setTimeout(this.onTimeout, 500),
			e.preventDefault();
	},
	mouseenter() {
		this.btn.tooltipText = self.tooltiptext.replace(new RegExp(/в .* ми/,''),'в '+ Services.prefs.getIntPref('browser.sessionstore.interval',15e3)/60e3 + ' ми');
	},
	boot(trg) {
		var popup = trg.parentNode;
		var old = popup.querySelector("[boot]");
		if (old != trg) old?.removeAttribute("boot");
		trg.toggleAttribute("boot");
		popup.bootChanged = true;
	},
	muTimestamp: 0,
	click(e) {
		var trg = e.target;
		if (trg.nodeName == "menu") {
			if (e.button > 1) self.boot(trg);
			else if (Cu.now() - self.muTimestamp > 50)
				e.view.closeMenus(trg.menupopup),
				self.restoreSession(trg.label, (e.button || e.ctrlKey) && e.view);
		}
		else if (trg != this || e.button) return;
		e.view.clearTimeout(this.tid);
		if (this.mdTimestamp - this.phTimestamp > 50) this.open = true;
	},
	async command(e) {
		var arg, trg = e.target, cmd = trg.value;
		if (cmd.startsWith("r"))
			arg = trg.parentNode.parentNode.label;
		await this[cmd](arg) || this.save();
	},
	dragstart(e) {
		var trg = e.target;
		if (trg.nodeName != "menu") return;

		var popup = trg.parentNode;
		this.dragData = {trg, mouse: true};
		trg.menupopup.hidePopup();

		var win = trg.ownerGlobal;
		win.setCursor("grabbing");
		var {width} = trg.getBoundingClientRect();
		trg.setAttribute("maxwidth", width);

		win.addEventListener("mouseup", this);
		popup.addEventListener("mousemove", this);
	},
	mousemove(e) {
		var trg = e.target, dtrg = this.dragData.trg;
		if (trg == dtrg || trg.nodeName != "menu") return;

		e.movementY > 0
			? trg.nextSibling != dtrg && trg.after(dtrg)
			: trg.previousSibling != dtrg && trg.before(dtrg);
	},
	mouseup(arg) {
		if (arg.constructor.isInstance?.(arg)) {
			arg.preventDefault();
			var {trg} = this.dragData;
			this.dragData.mouse = false;
			this.muTimestamp = Cu.now();
		}
		else var trg = arg;

		trg.removeAttribute("maxwidth");
		trg.ownerGlobal.setCursor("auto");
		trg.ownerGlobal.removeEventListener("mouseup", this);
		trg.parentNode.removeEventListener("mousemove", this);
	},
	popuphidden(e) {
		if (!e.target.id) return;
		e.view.removeEventListener("keydown", this, true);
		var popup = e.target;
		popup.parentNode.phTimestamp = Cu.now();

		var save;
		if (this.dragData) {
			var {trg, mouse} = this.dragData;
			mouse && this.mouseup(trg);

			delete this.dragData;
			var order = Array.from(popup.getElementsByTagName("menu"), m => m.label);
			if (order.toString() != this.meta.order.toString()) {
				var hasBoot = this.meta.boot != null;
				if (hasBoot) var bootName = this.meta.order[this.meta.boot];
				this.meta.order = order;
				if (hasBoot) this.meta.boot = this.meta.order.indexOf(bootName);
				save = true;
			}
		}
		if (popup.bootChanged) {
			delete popup.bootChanged;
			var {boot} = this.meta;
			var bootNode = e.target.querySelector("[boot]");
			var ind = bootNode && this.meta.order.indexOf(bootNode.label);
			if (ind != boot)
				this.meta.boot = ind,
				save = true;
		}
		save && this.save(e.view);
	},

	sku: `#${pid} > menu[maxwidth]`,
	skd: `#${pid} > menu:is([maxwidth],[_moz-menuactive]):not([open])`,
	keydown(e) {
		if (e.repeat && e.key == "Shift" || !e.shiftKey && e.key != " ") return;
		var func = this.keyHandlers[e.key];
		if (!func) return;

		var menu = e.view.windowRoot
			.ownerGlobal.document.querySelector(this.skd);
		if (menu)
			e.stopImmediatePropagation(),
			func.call(this, menu, e);
	},
	keyup(e) {
		if (e.key != "Shift") return;
		var win = e.view.windowRoot.ownerGlobal;
		win.removeEventListener("keyup", this, true);
		win.document.querySelector(this.skd)?.removeAttribute("maxwidth");
	},
	keyHandlers: {
		Enter(menu) {
			this.boot(menu);
		},
		ArrowDown(menu) {
			var ns = menu.nextSibling;
			if (ns) ns.after(menu), this.arrow(menu);
		},
		ArrowUp(menu) {
			var ps = menu.previousSibling;
			if (ps.nodeName == "menu") ps.before(menu), this.arrow(menu);
		},
		" "(menu, e) {
			e.preventDefault();
			menu.ownerGlobal.closeMenus(menu.parentNode);
			this.restoreSession(menu.label, e.ctrlKey && menu.ownerGlobal);
		}
	},
	arrow(menu) {
		if (menu.hasAttribute("maxwidth")) return;
		menu.setAttribute("maxwidth", menu.getBoundingClientRect().width);
		menu.ownerGlobal.addEventListener("keyup", this, true);
		this.dragData = {trg: menu};
	},
	fill(e) {
		var mxe = e.view.MozXULElement;

		var initFrag = mxe.parseXULToFragment(`
			<menuitem value="saveSession" class="menuitem-iconic" label="Сохранить сессию"/>
			<menuitem value="deleteAllSessions" class="menuitem-iconic" label="Удалить все сессии"/>
			<menuseparator/>
		`);
		this.menuFrag = mxe.parseXULToFragment(`<menu class="menu-iconic"><menupopup>
			<menuitem label="Переименовать"
				class="menuitem-iconic" value="renameSession"/>
			<menuitem label="Удалить"
				class="menuitem-iconic" value="removeSession"/>
		</menupopup></menu>`);

		this.regStyle();

		var filler = {fill: e => e.target.id
			? e.view.addEventListener("keydown", this, true)
				|| e.target.fillFlag || this.fillSessions(e.target)
			: this.dragData?.mouse && e.preventDefault()
		};

		(this.fill = e => {
			var trg = e.target;
			trg.setAttribute("context", "");
			trg.append(trg.ownerDocument.importNode(initFrag, true));
			(trg.filler = filler).fill(e);
			trg.addEventListener("dragstart", this);
			trg.addEventListener("popuphidden", this);
		})(e);
	},
	fillSessions(popup) {
		while(popup.lastChild.nodeName == "menu") popup.lastChild.remove();
		var ind = 0, {boot} = this.meta;
		for(var name of this.meta.order) {
			var df = popup.ownerDocument.importNode(this.menuFrag, true);
			df.firstChild.setAttribute("label", name);
			if (ind++ == boot) df.firstChild.toggleAttribute("boot");
			popup.append(df);
		}
		popup.fillFlag = true;
	},
	regStyle() {
		delete this.regStyle;
		var subst = "ucf-ssm-style-resurl";
		Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler).setSubstitution(
			subst, Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
			@-moz-document url-prefix(chrome://browser/content/browser.xhtml) {
				#${pid} > menu {
					list-style-image: url("${this.image}");
				}
				#${pid} > [value=saveSession] {
					list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKVSURBVHjajFNNTBNREJ6+7na73bLbQn8I0BKNCYWKGr0oYoiJPxeNh6oHozcOxgSVi4le1JNHQRPigRsewURNPKiJMQicSISUACelRVJ2tz/bdktpy9adBzT8xTjJ5L35ezNv5hsLHEAv7noEntguChx7EuV8oTydKRhfno8kCnt9LTuFZ7f87mAz/8rnl86GOoOBBq+LQX1S1ioLs0txWdEmsulS38Phlcy+BwZ6W0L+JsfolcjpsFDnBKNcgQ193bRUwSrwQFgr6Dkd3o9NzilqMdI/FF+sPYCZ245I4zdunw9DtQr6LxlK6bVdpdrcPAiHfGBYLDD69ltUXsmfw0oIGoPNjkHMjMHa3J9asDyRpoyEOrQR0+dq5MxR0c29Rj3Bhvn8YjeWjZmN9cpWcApSkzpkptYg8T1FdWjTfysg1Ang9YtdT+80OogTbJc7OlsD+OftzOqsBrMflqHe6QKXIEL00zLV0UpSBbM/G9DeEQy6OXKJsfPsCbdXYjb0Yu2/nmMS9LSGYGlYpXLPkxCwkq1mR98Gn8Q4XexxYhhgYKf3TPTfRDaPqklkvViaSSpaxSpw/x1v5e0UG8W10k+iW8qfF2ZiccIydFQ7ScsXKO8ep4NiYj4ai6k5+Eoev1F1Wcn8QJDgnAnHbGYRWTh800cZ77Ryzmr6eCGXzYGiZCcQ2vQ32XT5PiIMTJBI4Waw1ZtZzLu7XaSMd1s9b9paKJA+vpuKqols3y4ov7wXaPN67GPXIl1hnDOOansyVicHhGHMzHkzeDKqqPnr/UOJxX3LNNDb5BJd3KC3Uexu7wgEGxq3limRqcxH47FVWRtPreYePBpJagdu4zYhwjx1cMFus59CuVgqTmPDDlrnvwIMAGS8IFCLagHpAAAAAElFTkSuQmCC");
				}
				#${pid} [value=restoreSession] {
					list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAACzElEQVQ4jX2QPWwbZRjHf+/5vfPdObZjO3Ga2pVpGtxCP4QIDKgqDCDUNQwgJCS2qFI3hBCRCvXSCcTAAu0GY0Fi4kuq+IjUCpWAgCTq4IpS3Di2G8c+x/bZ57t7mSJFMfBf/3p+z+95BPvy3pufxqKmcVY3ZFFKmQtFGIReuNnrDze6lv5TqfSyx4EIgA/e+fzkZML6MDmVnD80mz1kxW3DMAxQCs/z6Hb6g3q1Xt1ttdfa7dbFN668vrkHkADJhPntufNnc0LTDi7AjFkkUknzcGF2LvCDuZVvfiwCj+/1GoAmhL3x6x2cZhsVqjFIGIZs15ts/LJOJCLt/Z0EiE3Y9eLpR1ONaoMH9zbHAGiC9FSKkwunWF1Z3RoDABhRg/zRPPmj+XHA/0QDaLectFLj6gcT+AHdTm9mzMC27e766lrWtCwy2Qz2hIUeNVDAaDCku9ujWW/ij3wsO9oaMzCiunf66TMU5gt4wyGbf1Upr5W5u15mq1JDhYqZQo6HIuqtueLw4vLXzwC89NZXeQFw/ePv7zx5buHEf6nf3qgMVipOGE0ko6EKhoQi3NnZ+c51BwsaQLOxM9N1uv86vNtz+aHSDn0pH9S2tl6r/Pn3s/VG/WYunzs/NZ2OSID0dKpRrzZS98v3kYbEsi1004BQcbtc9Q07bdYb229/dvmFL5aWVvVts9mq1Wo/e54vJIAQqGOPzQHgj3zcvos39BAIBshRqJQYjYZ/AFy79tQIeHVx+ctiIDRTA+g43Xud9q4PIHVJPBknk82QzqY5VZg2UUrEYhOX9s5aXL5RnMykb8Rj9kcC4OrSVZ1Hpt+PJ5PPz+SzR5KpyYRpGgRKMei7fHLr7lBmZ1XHcX4LgsCxLPt4JBLRm82Hr4j9DyuVSprdO/ZELGafkXpkXtPA94OK03Vv/R4/csEw5XOGbuieN6y6bv/S9XdfvPkPTgcoDlpQJpwAAAAASUVORK5CYII=");
				}
				#${pid} [value=renameSession] {
					list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPFJREFUeNrEU0sOgkAMbc1IIHoQT+KeY7hkBW5ccwLdsOICxI2X8peIGhggI21gggpCwsImM01f+tpOO0WlFIwR0efgeR5nsG0boihizPd91A5UwZDjuq5qwycwUkQYhttSr4Y4l76fDdtBEAQqz3OVZdnPQ09o2sQhrpBSQgnAen/qzLxZzljHcawxy7KAuCJNUyiKAm53SS0FBGQNlUW3lFO2iVCLYRhAXJEkCQPn65NGAswpL/4fWAebt1ZGXB3geHlw9maXsKqjS94CHNxF7xRM0/wKgI7jDBojvbnZAz3Gv/9E7NvGvmXCsev8EmAAWocA9ofpaRIAAAAASUVORK5CYII=");
				}
				#${pid} :is([value=removeSession], [value=deleteAllSessions]) {
					list-style-image: url("resource://usercontext-content/cart.svg");
				}
				#${pid} > menuseparator:last-child,
				#${pid} > menu[maxwidth] > .menu-right,
				#${pid} > [value=deleteAllSessions]:nth-last-child(2) {
					display: none;
				}
				#${pid} > menu[boot] {
					color: red;
					font-weight: bold;
				}
				#${pid} > menu[maxwidth] {
					color: blue;
					font-weight: bold;
					outline-offset: -2px;
					outline: 2px solid orangered;
				}
			}
		`.replace(/;$/gm, " !important;"))));
		var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
		sss.loadAndRegisterSheet(Services.io.newURI("resource://" + subst), sss.USER_SHEET);
	},
	get gs() {
		delete this.gs;
		return this.gs = Cu.import("resource:///modules/sessionstore/SessionStore.jsm", {});
	},
	splice(name, newName) {
		var ind = this.meta.order.indexOf(name);
		if (ind == -1) return;
		var args = [ind, 1];

		if (1 in arguments) args.push(newName);
		else {
			if (ind == this.meta.boot) this.meta.boot = null;
			else if (ind < this.meta.boot) this.meta.boot--;
		}
		this.meta.order.splice(...args);
	},
	get meta() {
		var file = Services.dirsvc.get("UChrm", Ci.nsIFile);
		file.append("simple_session_manager.json");
		this.path = file.path;
		try {
			this.data = JSON.parse(Cu.readUTF8File(file));
		} catch {
			this.pp = file.parent.path;
			this.data = Object.create(null);
		}
		var meta = this.data[mp];
		if (!meta) {
			var order = Object.keys(this.data);
			meta = this.data[mp] = {order, boot: null};
		}
		delete this.meta;
		return this.meta = meta;
	},
	async save(excWin) {
		var io = Cu.getGlobalForObject(Cu).IOUtils;
		if (this.pp)
			await io.makeDirectory(this.pp), delete this.pp;
		(this.save = excWin => {
			this.meta.order.length
				? io.writeJSON(this.path, this.data)
				: io.remove(this.path, {ignoreAbsent: true});
			for(var win of CustomizableUI.windows) {
				if (win == excWin) continue;
				var popup = win.document.getElementById(pid);
				if (popup) popup.fillFlag = false;
			}
		})(excWin);
	},
	get prompter() {
		var {prompt} = Services;
		var p = {}, args = [null, null, "UCF Simple Session Manager"];
		p.alert = prompt.alert.bind(...args);
		p.confirm = prompt.confirm.bind(...args);
		var pr = prompt.prompt.bind(...args);
		p.prompt = (msg, value) => {
			var res = {value};
			return pr(msg, res, null, {}) ? res.value : null;
		}
		delete this.prompter;
		return this.prompter = p;
	},
	observe(s, t, data) {
		Services.obs.removeObserver(this, "quit-application");
		if (data.includes("restart")) return;

		var {boot} = this.meta;
		if (boot == null) return;

		var state = this.data[this.meta.order[boot]];
		var ssi = this.gs.SessionStoreInternal;
		ssi.getCurrentState = () => state;
		Services.obs.removeObserver(ssi, "browser:purge-session-history");

		Services.prefs.setBoolPref("browser.sessionstore.resume_session_once", true);
	},
	get bwt() {
		delete this.bwt;
		var url = "resource:///modules/BrowserWindowTracker.jsm";
		return this.bwt = ChromeUtils.import(url).BrowserWindowTracker;
	},
	getName(state) {
		var wl = state.windows.length, tl = 0;
		for(var w of state.windows) tl += w.tabs.length;
		return `${
			this.bwt.getTopWindow().gBrowser.selectedTab.label.slice(0, 70)
		} ${wl}/${tl} [${
			new Date().toLocaleString("mn").replace(" ", "-")
		}]`;
	},
	exists(name) {
		this.meta;
		return (this.exists = name => name in this.data &&
			!this.prompter.alert("Сессия с тем же именем уже существует!"))(name);
	},
	getState() {
		return JSON.parse(this.gs.SessionStore.getBrowserState());
	},
	get spref() {
		var pref = "browser.sessionstore.interval";
		var timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
		var wait = cb => timer.initWithCallback(cb, 1e3, timer.TYPE_ONE_SHOT);
		delete this.spref;
		return this.spref = async cb => {
			var val = Services.prefs.getIntPref(pref);
			Services.prefs.setIntPref(pref, 100);
			await new Promise(wait);
			Services.prefs.setIntPref(pref, val);
		}
	},
	async saveSession(name = this.getName(this.getState())) {
		var name = this.prompter.prompt("Сохранить:", name);
		if (name == null) return true;

		if (this.exists(name)) return this.saveSession(name);

		await this.spref();
		this.data[name] = this.getState();

		this.meta.order.push(name);
		//this.meta.order.unshift(name);
		//if (this.meta.boot != null) this.meta.boot++;
	},
	restoreSession(name, win) {
		var ss = this.gs.SessionStore;
		var state = JSON.stringify(this.data[name]);
		win ? ss.setWindowState(win, state) : ss.setBrowserState(state);
	},
	renameSession(name, newName = name) {
		var newName = this.prompter.prompt(`Переименовать "${name}" в:`, newName);
		if (newName == null || newName == name) return true;

		if (this.exists(newName)) return this.renameSession(name, newName);

		var {data} = this;
		this.splice(name, newName);
		data[newName] = data[name];
		delete data[name];
	},
	removeSession(name) {
		if (!this.prompter.confirm(`Вы уверены, что хотите удалить ${name} ?`))
			return true;
		delete this.data[name];
		this.splice(name);
	},
	deleteAllSessions() {
		if (!this.prompter.confirm(`Вы уверены, что хотите удалить все сессии?`))
			return true;
		delete this.dragData;
		delete this.bwt.getTopWindow().document.getElementById(pid).bootChanged;
		this.meta = (this.data = Object.create(null))[mp] = {order: [], boot: null};
	}
}).init()))("ucf-ssm-menupopup", "{07cae4f5-18b0-487b-80eb-973304af9528}");
