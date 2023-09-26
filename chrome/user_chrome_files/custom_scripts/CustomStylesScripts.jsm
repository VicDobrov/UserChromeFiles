var EXPORTED_SYMBOLS = ["UcfStylesScripts"];
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
		],
		load: [ // По событию "load"
			// { path: "special_widgets.js", ucfobj: true, }, // <-- Special Widgets
			// { path: "auto_hide_sidebar.js", ucfobj: true, }, // <-- Auto Hide Sidebar
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
		{ path: "custom_script.js", },
	],
	/** ************************▲ Настройки ▲************************ */
};

if (typeof Services != "object") var Services = globalThis.Services;
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