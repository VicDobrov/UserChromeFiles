(async (id, popup, self) => (self = {

	clickInterval: 5*60,
	intervals: [
		10, 30, 60, 3*60, 5*60, 15*60, 30*60, 60*60,
	],
	async init() {
		this.addStyle();
		var dsp = e => this[e.type](e);
		var tc = document.getElementById("tabbrowser-tabs");

		var trgs = [popup, tc, tc, document.getElementById("tabbrowser-tabpanels")];
		var types = ["popupshowing", "TabClose", "SSTabRestored", "EndSwapDocShells"];

		(this.destructor = (meth = "removeEventListener") => types.forEach(
			(type, ind) => trgs[ind][meth](type, dsp, ind == 3)
		))("addEventListener");

		ucf_custom_script_win[id] = this;
		ucf_custom_script_win.unloadlisteners.push(id);

		await SessionStore.promiseAllWindowsRestored;
		for(var tab of gBrowser.tabs)
			tab.linkedPanel || this.maybeInitTab(tab);
	},
	maybeInitTab(tab) {
		var sec = this.sec(tab);
		sec && this.initTab(tab, sec, true);
	},
	mousedown(e) {
		if (e.button) return;
		e.stopImmediatePropagation();
		self.destroyTab(this.closest("tab"));
	},
	initTab(tab, sec, skipSet) {
		skipSet || SessionStore.setCustomTabValue(tab, id, sec);
		var img = document.createXULElement("hbox");
		img.className = id;
		img.onmousedown = this.mousedown;

		tab.throbber.before(img);
		tab.setAttribute(id, setInterval(this.reload, sec * 1e3, tab));
	},
	destroyTab(tab) {
		clearInterval(tab.getAttribute(id));
		SessionStore.deleteCustomTabValue(tab, id);
		tab.removeAttribute(id);
		tab.querySelector("." + id).remove();
	},
	addStyle() {
		var css = `
			tab.tabbrowser-tab[${id}] .${id} {
				width: 16px; height: 16px; position: relative;
				margin-top: -1px; margin-inline-start: -2px; margin-inline-end: -14px;
				background-position: top right; background-repeat: no-repeat; z-index: 1000;
				background-image: url("data:image/webp;base64,UklGRrQAAABXRUJQVlA4TKgAAAAvCAACEPW4yfa/iTBYgwc0YIMNBGCBhx0ZvZro3UNE8HeQORrynIabqFvGOwtKI0lSJv/4DtVrBvfvlEaSFMcbffokTwY4FKuokRRJBWaxgxzE8GePUpu2AbM69Q6MJIEkiSSNJAOUY67JL7Hctcbk3+bUQ8+3F6fMfcVjGODIfmEUyGFAABVYYNcD3s+xC2BCCv5pL5Cjhv17EKDsf6wwvxj5LbHtfww=");
			}
			tab.tabbrowser-tab[${id}]:-moz-locale-dir(rtl) .${id} {
				background-position: top right;
			}
			tab.tabbrowser-tab[${id}] .tab-icon-image {
				display: -moz-box;
			}
			tab.tabbrowser-tab[${id}][pendingicon] .tab-icon-image {
				visibility: hidden;
			}
			#context_autoreloadTab[checked] > menupopup > :nth-child(2),
			#context_autoreloadTab:not([checked]) > menupopup > :first-child {
				display: none;
			}
			#context_autoreloadTab[checked] > .menu-iconic-left > image {
				fill: currentColor; -moz-context-properties: fill;
				list-style-image: url("chrome://global/skin/icons/check.svg");
			}
			/*
			tab.tabbrowser-tab[${id}] .tab-throbber,
			tab.tabbrowser-tab[${id}] .tab-icon-pending,
			tab.tabbrowser-tab[${id}]:not([pendingicon]) .tab-icon-image:not([src],[busy],[pinned],[crashed],[sharing]) {
				display: none;
			}
			*/
		`.replace(/;\s*\n/g, " !important;\n");
		windowUtils.loadSheetUsingURIString(
			"data:text/css," + encodeURIComponent(css), windowUtils.USER_SHEET
		);
	},
	get tab() {
		return TabContextMenu.contextTab;
	},
	sec(tab) {
		return SessionStore.getCustomTabValue(tab, id);
	},
	click(menu) {
		var {tab} = this;
		var has = menu.toggleAttribute("checked");
		has
			? this.initTab(tab, this.clickInterval)
			: this.destroyTab(tab);

		var w = menu.clientWidth;
		this.setLabel(has && self.clickInterval);

		if (this.menupopup.state == "open")
			this.updMenupopup(),
			menu.clientWidth != w && setTimeout(this.move, 50);
	},
	changeInterval(tab, sec) {
		clearInterval(tab.getAttribute(id)),
		SessionStore.setCustomTabValue(tab, id, sec),
		tab.setAttribute(id, setInterval(this.reload, sec * 1e3, tab));
	},
	cmd(e) {
		var {value} = e.target;
		if (value == this.currSec) return;

		var {tab} = this;
		this.setLabel(value);

		if (this.menu.hasAttribute("checked"))
			this.changeInterval(tab, value);
		else
			this.menu.toggleAttribute("checked"),
			this.initTab(tab, value);
	},
	reload(tab) {
		gBrowser.reloadTab(tab);
	},
	get shouldHide() {
		return !this.tab.linkedBrowser.currentURI.scheme.startsWith("http");
	},
	format(sec) {
		var map = new Map();
		// resource://gre/modules/PluralForm.jsm
		var f = n => n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
		var hh = ["", "а", "ов"], ms = ["а", "ы", ""];
		return (this.format = sec => {
			var res = map.get(sec = +sec);
			if (!res) {
				var num, arr = [];
				if ((num = Math.floor(sec / 3600)) > 0)
					sec -= num * 3600,
					arr.push(`${num} час${hh[f(num)]}`);
				if ((num = Math.floor(sec / 60)) > 0)
					sec -= num * 60,
					arr.push(`${num} минут${ms[f(num)]}`);
				sec > 0 && arr.push(`${sec} секунд${ms[f(sec)]}`);
				map.set(sec, res = arr.join(" "));
			}
			return res;
		})(sec);
	},
	async prompt(val) {
		var {tab} = this, sec = this.sec(tab);
		var res = await Services.prompt.asyncPrompt(
			null, Services.prompt.MODAL_TYPE_WINDOW,
			val ? "ЕЩЁ РАЗ:" : "Задать интервал обновления",
			"Введите число секунд авто-обновления",
			val || sec || this.clickInterval, null, null
		);
		if (!res.get("ok")) return;

		var val = res.get("value");
		if (!val) return;
		if (!isFinite(val)) return this.prompt(val);

		var val = String(Math.round(val) || 1);
		sec ? this.changeInterval(tab, val) : this.initTab(tab, val);
	},
	initShadowDOM() {
		delete this.initShadowDOM;
		this.initShadowDOM();

		var df = MozXULElement.parseXULToFragment(
			`<menuitem closemenu="single" label="Не обновлять" type="radio"
				oncommand="event.stopPropagation(); parentNode.parentNode.click();"/>
			<menuitem closemenu="single" value="${self.clickInterval}"
				label="${self.format(self.clickInterval)}" type="radio"/>
			<menuitem label="Другой…"
				oncommand="event.stopPropagation(); parentNode.parentNode.linkedObject.prompt();"/>
			<menuseparator/>`
		);
		var menuitem = df.children[1];

		for(var sec of self.intervals) {
			if (sec == self.clickInterval) continue;
			menuitem = menuitem.cloneNode(false);
			menuitem.setAttribute("value", sec);
			menuitem.setAttribute("label", self.format(sec));
			df.append(menuitem);
		}
		this.append(df);
	},
	setLabel(sec) {
		this.menu.setAttribute("label", (this.currSec = sec)
			? `Обновлять раз в: ${this.format(sec)}`
			: "Период обновления ⟳"
		);
	},
	popupshowing(e) {
		if (this.shouldHide) return;
		var df = MozXULElement.parseXULToFragment(
			`<menu id="context_autoreloadTab"
				class="menu-iconic"
				onclick="if (event.target == this) linkedObject.click(this)"
			>
				<menupopup oncommand="parentNode.linkedObject.cmd(event)"/>
			</menu>`
		);
		var menu = this.menu = df.firstChild;
		menu.linkedObject = this;
		var menupopup = this.menupopup = menu.firstChild;
		menupopup.initShadowDOM = this.initShadowDOM;
		popup.querySelector("#context_duplicateTab").after(menu);

		this.clickInterval = String(this.clickInterval);
		this.move = () => menupopup.moveToAnchor(menu, "end_before");

		this.updMenupopup = () => {
			var old = menupopup.querySelector("[checked=true]");
			var cur = this.currSec && menupopup.querySelector(`[value="${this.currSec}"]`);
			if (old != cur)
				old?.removeAttribute("checked"),
				cur && cur.setAttribute("checked", true);
		}
		(this.popupshowing = e => {
			if (e.target == popup) {
				if (menu.hidden = this.shouldHide) return;

				var sec = this.sec(this.tab);
				var has = menu.hasAttribute("checked");
				if (Boolean(sec) ^ has)
					has = !has,
					menu.toggleAttribute("checked");

				var curr = has && sec;
				curr !== this.currSec && this.setLabel(curr);
			}
			else if (e.target == menupopup) this.updMenupopup();
		})(e);
	},
	TabClose(e) {
		var intervalId = e.target.getAttribute(id);
		if (!intervalId) return;
		clearInterval(intervalId);

		var tab = e.detail.adoptedBy;
		tab?.ownerGlobal.ucf_custom_script_win[id].initTab(tab, this.sec(e.target));
	},
	SSTabRestored(e) {
		var tab = e.target;
		tab.hasAttribute(id) || this.maybeInitTab(tab);
	},
	async EndSwapDocShells(e) {
		var br = e.detail, trg = e.target;
		await new Promise(requestAnimationFrame);

		var win = br.ownerGlobal;
		if (!win.closed) return;
		var tab = win.gBrowser.getTabForBrowser(br);
		if (!tab) return;

		var sec = this.sec(tab);
		if (sec)
			tab = gBrowser.getTabForBrowser(trg),
			tab.hasAttribute(id) || this.initTab(tab, sec);
	}
}).init())("ucf-tab-auto-reload", document.getElementById("tabContextMenu"));