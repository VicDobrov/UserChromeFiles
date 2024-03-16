(async (pid, mp, self) => CustomizableUI.createWidget((self = { id: "ucf_SessionManager", tooltiptext:
`Менеджер сессий: запись раз в 0.15 мин\n
Правый клик на Имени сессии:
	Выделить и Открывать при запуске
Колёсико или Клик + Ctrl:
	Открыть сессию в новых вкладках\n
Сортировка: тащите строки мышью
	или курсором, удерживая Shift`, label: "Менеджер сессий", localized: false, defaultArea: CustomizableUI.AREA_NAVBAR,
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
	image: "data:image/webp;base64,UklGRogBAABXRUJQVlA4THwBAAAvD8ADEE10IaL/sRgBNW0bMOGPsussiIuT9z++RQLYtW2ravY9++EOf+7eBv+0q824uzskubk1uIlkW1Z6Xv3s//hjAMJniBBb4GxfjDiOZFtV5uOSgcZD8mSgW19R7zoPUWzbOGwpoIaVAnKIoIFSCighgJUaE1C7MINHKsB884gdOUVtnGNEwKhnrnnTRSEsRBWjoEYUUT6lZwVwM7gbaJw6WwCAY4EFUK/SA7rf4U+fk6uJz1GrH8gKVE4USp/SS7gyi2e/QNe4V30vRhkohgXmVOKd++SsDEDLwjujDCRFjqVLzbafB7CkszK7Ghg8NCxQOvQAAPzD3FwDAIhExca5rX0aWILORgSpV7gqZFhyKoEWAI5B0HkWj/7hPg1WlFQo2UuuJgCV+Wjp7fw+AQAASKjMLK5RoLPVkJH+kLAHGivsy/QJAAAAoHQAwImxUlJhyZY5dhd2YLMC0EJ3pM6+bDXMUbJlnr3MOwGYkhnfN7t5PS6A+eo/Pw==",
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
					list-style-image: url("data:image/webp;base64,UklGRo4BAABXRUJQVlA4TIIBAAAvD8ADEFfitLZtJzr3P0WwNEEh9K+QSFzOYea9NhxHkiQ1OUMELxzABPy3ihe6b/UyaCRJUR/fi3iDL5/5m2lk2072B5LEoZLDUhn14ukivQC6TPHLJwASkOAcJwfIPkAQEeQB5DD0JgASHL8H9OQT0fp/9LfT99eWH/QL2q7OyyyCyO+8n85j1+xhRJzw7zYIK5JP5BiGlR8/LhT+Ou5jsnIvz7/sqrWf6pDElPiqQkLY6JCEBBIEI5vLgZDoEBSpXIaBIiVgEPU2zgiSQEQHcBjbtlndF9vJSfJt2zb770g1RPR/Auhz0JrNmiP6Od5eX5b1vGxrX+onjQmKyjP90Cei8YkTfADwBelYI1prQghks0Ao6BsaXJkP5MqlPOCy26j9FoBMtVCoZgD+0ZhZKoCkWEwAKM5iYiv/yM688xL+4R/dwYX5QFKpJIDHziPa6UKIOE1jRIK5JqodOMEFgECQ9kMi6h90xiuKyIx9jz5rq9vdtu/n5ZB+jrrTaXdEnw==");
				}
				#${pid} [value=restoreSession] {
					list-style-image: url("data:image/webp;base64,UklGRiQCAABXRUJQVlA4TBgCAAAvD8ADEBXBqm1b2dL2T+Du7u7u7u7u/pPokww7Ix0IQRoi8UyELwJvbmPbVpX30XufO4XQfxO8c/GUWCMLHESSpMiKzsjQMtwzzuw+e3motrUti3C9BGjumjzSaUSaX4ZlzUSqw7hLmubu7u5zyCZtzNSeAoC92arFfY0qW8tpWyvpcs4rek/z2jYiV00GUpK0s5lKm4z5eNR37mvDxImJoybWmuha/xEOac9UcktUkoZgyvX0RcDHGqD0IMSQ8zrBXOp9IiSWhnkRQnitgakWojFizuWQ4M9540pI2zoSMUGU8pGedfy5clkmYWgi0ZV69V4DNLem9n2Co9S9eAgUfGBmhBMjzzXwXAFHRiaayfpAIkRspayQx4WJvhVKPpAJke+K84yMsFkxyU//0t6PF4Lj0w/u9a2luYv//mG56FsI9hsc9ze/jBetjLZE5imUrd9vNUNyXBKW0/3NMXRLKRbnH6dPCRtJwr6c0Av4ct4su8B/zgcazjPQQs86nL/Nj0/sT4EZA0v9pfKdNo2wBTXmIvw5bTDMnZAtEzPNfDnfh3cv7EMM0wEQHKdRiIcThlIHG+Yf0mio/O8R+9RhNADB8Wc0yzjW7OciWNuTVFtK2ZPKasO6p6UWfg9E/Ghu18/Q0A8zdNkAHXHCDjywUyXuQQBytYg4beuVt01CU3teV2teVVuSlzYOtTzq5qGrDtiWCTr9CQ==");
				}
				#${pid} [value=renameSession] {
					list-style-image: url("data:image/webp;base64,UklGRrQAAABXRUJQVlA4TKgAAAAvD8ADEFU4sW3bacaMeusrZIe4KKrLUDKUqN6LojOD+95V0LYNY/6s9gdLTdtIctC87q92ur1b/qtN24BJn3MGFlOIPYWYGd1ahBYtxxS2BKAF//xxRCHJPwtu+eLuxyGPFB4JvGgb3lnsW+xd3FvcTS32PlBI8s4NA2rSGU8mXTXuTCqTqkME9KkuusvfxW8Gl30In9AzR4SZKTx4HBMkqat+WfTjAgI=");
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
			}`.replace(/;$/gm, " !important;"))));
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
	io: {
		get OS() {
			delete this.OS;
			Cu.import("resource://gre/modules/osfile.jsm", this);
			return this.OS;
		},
		makeDirectory(path) {
			return (this.makeDirectory = this.OS.File.makeDir)(path);
		},
		writeJSON(path, obj) {
			var wa = this.OS.File.writeAtomic;
			return (this.writeJSON = (path, obj) => wa(path, JSON.stringify(obj)))(path, obj);
		}
	},
	async save(excWin) {
		var io = Cu.getGlobalForObject(Cu).IOUtils || this.io;
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
