var EXPORTED_SYMBOLS = ["UcfStylesScripts"];
const {AppConstants} = ChromeUtils.import("resource://gre/modules/AppConstants.jsm");
var os = name => `${name.replace(/\.[^.$]+$/,'')}_${AppConstants.platform}${name.lastIndexOf('.') > 0 ? "."+ name.split('.').pop() : ""}`, //linux win macosx
osonly = (name, oss = []) => oss.includes(AppConstants.platform) ? name : "", //для указанных OS
mjsmLoad = (s, e = /\.mjs$/i.test(s) ? "ESModule" : "") => `ChromeUtils.import${e}("chrome://user_chrome_files/content/custom_scripts/${s}")`;

var UcfStylesScripts = {
	/** ************************▼ Настройки ▼************************ */
	/**
	* Настройки стилей:
	*   path: путь к файлу от папки custom_styles
	*   type: права стиля AGENT_SHEET,  AUTHOR_SHEET или USER_SHEET
	*/
	styleschrome: [ // Для докум. всех окон [ChromeOnly]
		// { path: "custom_styles_chrome_author.css", type: "AUTHOR_SHEET", sheet(f) { preloadSheet(this, f); }, },
		// { path: "custom_styles_chrome_user.css", type: "USER_SHEET", sheet(f) { preloadSheet(this, f); }, },
		// { path: "special_widget.css", type: "USER_SHEET", sheet(f) { preloadSheet(this, f); }, }, // <-- Special Widgets
		// { path: "auto_hide_sidebar.css", type: "USER_SHEET", sheet(f) { preloadSheet(this, f); }, }, // <-- Auto Hide Sidebar
	],
	stylesall: [ // Для всех документов
		{ path: "custom_styles_all_agent.css", type: "AGENT_SHEET", sheet() { registerSheet(this); }, },
		{ path: "custom_styles_all_user.css", type: "USER_SHEET", sheet() { registerSheet(this); }, },
	// стиль для вашей операционной системы: *_macosx.css, *_linux.css, *_win.css
		{ path: os("custom_styles_all_agent.css"), type: "AGENT_SHEET", sheet() { registerSheet(this); }, },
		{ path: os("custom_styles_all_user.css"), type: "USER_SHEET", sheet() { registerSheet(this); }, },
	],
	/**
	* Настройки скриптов:
	*   path: путь к скрипту от папки custom_scripts
	*   urlregxp: Адрес где работает скрипт в регулярном выражении, только Для докум. всех окон [ChromeOnly]
	*   ucfobj: true - загружать скрипт в специально созданный объект либо в window, для скриптов В фоне [System Principal] не используется
	*   func: Функция в виде строки которая выполнится при загрузке скрипта
	*/
	scriptschrome: { // Для докум. окна браузера [ChromeOnly]
		domload: [ // По событию "DOMContentLoaded"
		{ path: "ucf_hookClicks.js", ucfobj: true, }, // используется скриптами, грузит attrsInspector.js
		{ path: "ucf_QuickToggle.js", ucfobj: true, }, // нужен ucf_hookClicks
		{ path: "ucf_mousedrag.js", ucfobj: true, },
		{ path: "ucf_contextsearch.js", ucfobj: true, },
		{ path: "ucf_BookmarkDir.js", ucfobj: true, },
		{ path: "ucf_cooks-pass.js", ucfobj: true, },
		{ path: "ucf_LocationBarEnhancer.js", ucfobj: true, },
		{ path: "ucf_autohidetabstoolbar.js", ucfobj: true, },
		{ path: "ucf_tab-update.js", ucfobj: true, },
		{ path: "ucf_contextmenuopenwith.js", ucfobj: true, },
		{ path: "ucf_downloads_clear.js", ucfobj: true, },
		{ path: "ucf_undoBookmarks.js", ucfobj: true, },
		{ path: osonly("menubarVisibilityChance.js", ["linux","win"]), ucfobj: true, }, //кроме MacOS
		],
		load: [ // По событию "load"
			{ path: "special_widgets.js", ucfobj: true, }, // <-- Special Widgets
			// { path: "auto_hide_sidebar.js", ucfobj: true, }, // <-- Auto Hide Sidebar
		{ path: "ucf_findbarclose.js", ucfobj: true, },
		{ func: osonly("ucf_custom_script_win.menubarvisibilitychance.settoolbarvisibility();", ["linux","win"])},
		],
	},
	scriptsallchrome: { // Для докум. всех окон [ChromeOnly]
		domload: [ // По событию "DOMContentLoaded"
		],
		load: [ // По событию "load"
		{ path: "ucf_undoBookmarks.js", urlregxp: /chrome:\/\/browser\/content\/places\/places\.xhtml/, ucfobj: false, },
		],
	},
	scriptsbackground: [ // В фоне [System Principal]
		{ path: "custom_script.js", }, // пусто
		{ path: "ucf_aom-button.js", },
		{ path: "ucf_undo-tab.js", },
		{ path: "ucf_pauseResume.js", },
		{ path: "ucf_UrlTooltip.js", },
		{ path: "ucf_SessionManager.js", },
		{ path: "ucf-loads-favicons.js", },
		{ path: "ucf_fav-export-html.js", },
		{ func: mjsmLoad("SingleHTML.jsm"), },
		{ func: mjsmLoad("ClickPicSave.jsm"), }, // нужен SingleHTML
		{ func: `${mjsmLoad("UCFTitleChangedChild.jsm")}.registerUCFTitleChanged();`, },
	],
	/** ************************▲ Настройки ▲************************ */
};

var Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services;
var UcfSSS = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
var chfile = f => Services.io.newURI('chrome://user_chrome_files/content/custom_styles/'+ f),
preloadSheet = (obj, func) => {
	try {
		let uri = chfile(obj.path);
		let type = UcfSSS[obj.type];
		let preload = UcfSSS.preloadSheet(uri, type);
		(obj.sheet = f => {
			try { f(preload, type);} catch (e) {}
		})(func);
	} catch (e) {
		obj.sheet = () => {};
	}
},
registerSheet = async obj => {
	try {
		let uri = chfile(obj.path);
		let type = UcfSSS[obj.type];
		if (!UcfSSS.sheetRegistered(uri, type))
			UcfSSS.loadAndRegisterSheet(uri, type);
	} catch (e) {}
};