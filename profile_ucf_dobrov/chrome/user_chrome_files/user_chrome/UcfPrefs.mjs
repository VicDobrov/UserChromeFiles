
export var UcfPrefs = {
	// ▼ Default settings ▼
	toolbars_enable: true,
	t_enable: false,
	t_collapsed: false,
	t_next_navbar: true,
	t_autohide: false,
	t_showdelay: 300,
	t_hidedelay: 2000,
	t_hoversel: "#nav-bar",
	v_enable: true,
	v_collapsed: false,
	v_bar_start: true,
	v_autohide: false,
	v_mouseenter_sidebar: true,
	v_fullscreen: true,
	v_showdelay: 300,
	v_hidedelay: 2000,
	b_enable: false,
	b_collapsed: false,
	custom_styles_chrome: true,
	custom_styles_all: false,
	custom_scripts_background: false,
	custom_scripts_chrome: true,
	custom_scripts_all_chrome: false,
	custom_styles_scripts_child: false,
	mystyle: true,
	expert: false,
	info: false,
	// ▲ Default settings ▲

	PREF_BRANCH: "extensions.user_chrome_files.",
	gbranch: null,
	l10n: null,
	get global() {
		delete this.global;
		return this.global = globalThis;
	},
	get L10nRegistry() {
		delete this.L10nRegistry;
		var locales = Services.locale.appLocalesAsBCP47;
		if (!locales.includes("en-US"))
			locales.push("en-US");
		var reg = new L10nRegistry();
		reg.registerSources([
			new L10nFileSource(
				"user_chrome_files",
				"app",
				locales,
				"chrome://user_chrome_files/content/locales/{locale}/"
			),
		]);
		return this.L10nRegistry = reg;
	},
	async formatMessages() {
		this.formatMessages = async () => {
			return this.l10n;
		};
		return this.l10n = (async () => {
			return this.l10n = await new Localization(["main.ftl"], false, this.L10nRegistry).formatMessages([
				"ucf-open-about-config-button",
				"ucf-additional-vertical-spring",
				"ucf-additional-vertical-toggle-button",
				"ucf-additional-top-spring",
				"ucf-additional-top-toggle-button",
				"ucf-additional-bottom-spring",
				"ucf-additional-bottom-toggle-button",
				"ucf-restart-app",
				"ucf-view-history-sidebar-button",
				"ucf-view-bookmarks-sidebar-button",
				"ucf-open-directories-button",
				"ucf-additional-top-bar",
				"ucf-additional-vertical-bar",
				"ucf-additional-bottom-bar",
				"ucf-additional-bottom-closebutton",
			]);
		})();
	},
	handleToolbars: function handleToolbars(win, externalToolbars) {
		if ((handleToolbars.wins ??= new Set()).add(win).size > 1) return;

		var rph = Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler);
		var resURL = (code, sfx = "") => {
			var subst = "ucf_on_view_toolbars" + sfx
			rph.setSubstitution(subst, Services.io.newURI("data:charset=utf-8," + encodeURIComponent(code)));
			return "resource://" + subst;
		}
		var script = 
			'window.addEventListener("toolbarvisibilitychange", ucf_toolbars);\n' +
			'window.addEventListener("unload", () => ucf_toolbars.destructor(), {once: true});';
		var oVTC = win.onViewToolbarCommand;
		if (typeof oVTC === "function") {
			var strFn = `${oVTC}`, regExr = /(BrowserUsageTelemetry\s*\.\s*recordToolbarVisibility\s*\(\s*toolbarId.+?\)\s*\;)/g;
			if (regExr.test(strFn)) {
				script += `\nwindow.onViewToolbarCommand = ${strFn.replace(/^(async\s)?.*?\(/, `$1function ${oVTC.name}(`)
					.replace(regExr, 'if (!/ucf-additional-.+?-bar/.test(toolbarId)) { $1 }')};`;
			}
		}
		if (externalToolbars) {
			var tcm = win.ToolbarContextMenu;
			var navToolbars = 'gNavToolbox.querySelectorAll("toolbar")';
			var oVTPS = tcm.onViewToolbarsPopupShowing || win.onViewToolbarsPopupShowing;
			if (typeof oVTPS == "function" && (strFn = String(oVTPS)).includes(navToolbars)) {
				strFn = strFn.replace(navToolbars, 'Array.from(document.querySelectorAll("toolbar[toolbarname]"))');
				if (strFn.startsWith("f")) script += "\n" + strFn;
				else {
					var key = "temp_ToolbarContextMenu";
					var code = `Object.assign(${key}, {${strFn.replace("gNavToolbox", "window: lazy")}});`;
					globalThis[key] = tcm;
					ChromeUtils.compileScript(resURL(code, "_mjs"))
						.then(ps => ps.executeInGlobal(globalThis), Cu.reportError)
						.finally(() => delete globalThis[key]);
				}
			}
		}
		var func;
		ChromeUtils.compileScript(resURL(script)).then(
			ps => func = win => ps.executeInGlobal(win),
			ex => func = () => Cu.reportError(ex)
		).finally(() => {
			this.handleToolbars = func;
			for(var win of handleToolbars.wins) try {func(win);} catch(ex) {Cu.reportError(ex);}
		});
	},
	get dbg() { // by Dumby
		delete this.dbg;
		var sandbox = Cu.Sandbox(Cu.getObjectPrincipal(this), { freshCompartment: true });
		Cc["@mozilla.org/jsdebugger;1"].createInstance(Ci.IJSDebugger).addClass(sandbox);
		var dbg = new sandbox.Debugger();
		var g = globalThis;
		var gref = dbg.gref = dbg.makeGlobalObjectReference(g);
		var envRef = function(name) {
			var val = this.find(name).getVariable(name);
			return val.unsafeDereference?.() || val;
		}
		dbg.ref = (arg, func, glob) => {
			var go = glob === undefined ? g : glob || Cu.getGlobalForObject(func);
			var has = dbg.hasDebuggee(go);
			has || dbg.addDebuggee(go);
			try {
				var ref = go == g ? gref : dbg.makeGlobalObjectReference(go);
				var env = ref.makeDebuggeeValue(func).environment;

				var cn = arg.constructor.name;
				if (cn == "Object") for(var name in arg) try {
					env.find(name).setVariable(name, ref.makeDebuggeeValue(arg[name]));
				} catch(err) { Cu.reportError(err); }

				else return cn == "Array" ? arg.map(envRef, env) : envRef.call(env, arg);
			} catch(ex) { Cu.reportError(ex); } finally { has || dbg.removeDebuggee(go); }
		}
		return this.dbg = dbg;
	},
	get customSandbox() {
		delete this.customSandbox;
		var scope = this.user_chrome?.customSandbox;
		if (!scope)
			scope = this.user_chrome?._initCustom();
		return this.customSandbox = scope;
	},
};
