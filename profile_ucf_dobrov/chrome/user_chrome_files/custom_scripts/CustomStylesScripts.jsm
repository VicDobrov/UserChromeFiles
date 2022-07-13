var EXPORTED_SYMBOLS = ["UcfStylesScripts"];
var jsmImport = name => `ChromeUtils.import("chrome://user_chrome_files/content/custom_scripts/${name}")`;
var UcfStylesScripts = {
	/** ************************▼ Настройки ▼************************ */
	/**
	* Настройки стилей:
	*   path: путь к файлу от папки custom_styles
	*   type: права стиля AGENT_SHEET,  AUTHOR_SHEET или USER_SHEET
	*/
	styleschrome: [ // Для докум. всех окон [ChromeOnly]
		{ path: "custom_styles_chrome_author.css", type: "AUTHOR_SHEET", sheet(f) { preloadSheet(this, f); }, },
		{ path: "custom_styles_chrome_user.css", type: "USER_SHEET", sheet(f) { preloadSheet(this, f); }, },
		// { path: "special_widget.css", type: "USER_SHEET", sheet(f) { preloadSheet(this, f); }, }, // <-- Special Widgets
		// { path: "auto_hide_sidebar.css", type: "USER_SHEET", sheet(f) { preloadSheet(this, f); }, }, // <-- Auto Hide Sidebar
	],
	stylesall: [ // Для всех документов
		{ path: "custom_styles_all_agent.css", type: "AGENT_SHEET", sheet() { registerSheet(this); }, },
		{ path: "custom_styles_all_user.css", type: "USER_SHEET", sheet() { registerSheet(this); }, },
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
		{ path: "ucf_hookClicks.js", ucfobj: true, }, // последовательность важна?
		{ path: "ucf_QuickToggle.js", ucfobj: true, },
		{ path: "ucf_mousedrag.js", ucfobj: true, },
		{ path: "ucf_contextsearch.js", ucfobj: true, },
		{ path: "ucf_BookmarkDir.js", ucfobj: true, },
		{ path: "ucf_cooks-pass.js", ucfobj: true, },
		{ path: "ucf_LocationBarEnhancer.js", ucfobj: true, },
		{ path: "ucf_autohidetabstoolbar.js", ucfobj: true, },
		{ path: "ucf_tab-update.js", ucfobj: true, },
		{ path: "ucf_contextmenuopenwith.js", ucfobj: true, },
		{ path: "ucf_downloads_clear.js", ucfobj: true, },
		{ path: "ucf_undoBookmarks.js", ucfobj: true, }, // User script
		{ path: "menubarVisibilityChance.js", ucfobj: true, }, // menubarvisibilitychance
		],
		load: [ // По событию "load"
			// { path: "special_widgets.js", ucfobj: true, }, // <-- Special Widgets
			// { path: "auto_hide_sidebar.js", ucfobj: true, }, // <-- Auto Hide Sidebar
		{ func: "ucf_custom_script_win.menubarvisibilitychance.settoolbarvisibility();" }, // menubarvisibilitychance
		],
	},
	scriptsallchrome: { // Для докум. всех окон [ChromeOnly]
		domload: [ // По событию "DOMContentLoaded"
		],
		load: [ // По событию "load"
			// { path: "example_places.js", urlregxp: /chrome:\/\/browser\/content\/places\/places\.xhtml/, ucfobj: false, },
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
		// { path: "ucf-confirm-fav.js", },
		// { func: jsmImport("SelectionToSearchbar.jsm"), },
		{ func: jsmImport("ClickPicSave.jsm"), },
		{ func: jsmImport("AppMenuTbbSaveHTMLChild.jsm"), },
		{ func: `${jsmImport("UCFTitleChangedChild.jsm")}.registerUCFTitleChanged();`, },
	],
	/** ************************▲ Настройки ▲************************ */
};

var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var UcfSSS = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
var preloadSheet = (obj, func) => {
	try {
		let uri = Services.io.newURI(`chrome://user_chrome_files/content/custom_styles/${obj.path}`);
		let type = UcfSSS[obj.type];
		let preload = UcfSSS.preloadSheet(uri, type);
		(obj.sheet = f => {
			try {
				f(preload, type);
			} catch (e) {}
		})(func);
	} catch (e) {
		obj.sheet = () => {};
	}
};
var registerSheet = async obj => {
	try {
		let uri = Services.io.newURI(`chrome://user_chrome_files/content/custom_styles/${obj.path}`);
		let type = UcfSSS[obj.type];
		if (!UcfSSS.sheetRegistered(uri, type))
			UcfSSS.loadAndRegisterSheet(uri, type);
	} catch (e) {}
};
