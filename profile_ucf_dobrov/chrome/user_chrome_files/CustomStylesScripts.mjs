export var UcfStylesScripts = {
	/** ************************▼ Settings ▼************************ */
	/**
	* Styles Settings:
	* @param {String} type: (required)
	*    style rights AGENT_SHEET,  AUTHOR_SHEET or USER_SHEET
	* @param {String} path: (required, or ospath)
	*    path to file from folder custom_styles
	* @param {String} ospath: (optional, required for isos, ver)
	*    path to file from folder custom_styles, replace %OS% with the current OS
	* @param {Array} isos: (optional)
	*    e.g. ["linux", "windows"]
	* @param {Object} ver: (optional)
	* @param {Int} ver.min: (optional)
	*    compare with <= Services.appinfo.platformVersion
	* @param {Int} ver.max: (optional)
	*    compare with >= Services.appinfo.platformVersion
	*/
	styleschrome: [ // For documents of all windows [ChromeOnly]
		{ path: "special_widgets.css", type: "USER_SHEET", }, // <-- Special Widgets
		// { path: "auto_hide_sidebar.css", type: "USER_SHEET", }, // <-- Auto Hide Sidebar
	],
	stylesall: [ // For all documents
		// { ver: {min: 117}, isos: ["linux"], ospath: "example_all.css", type: "USER_SHEET", }, // <-- Example
		{ path: "custom_styles_all_agent.css", type: "AGENT_SHEET"},
		{ path: "custom_styles_all_user.css", type: "USER_SHEET"},
	// { ospath: "custom_styles_all_user_%OS%.css", type: "USER_SHEET"},
	],
	/**
	* Scripts Settings:
	* @param {String} path: (optional, or ospath or func)
	*    path to the script from the folder custom_scripts
	* @param {String} ospath: (optional, required for isos, ver, module)
	*    path to the script from the folder custom_scripts, replace %OS% with the current OS
	*    for the module: there must be a full address, but if there is %UCFDIR% at the beginning then this will be replaced with chrome://user_chrome_files/content/custom_scripts/
	* @param {RegExp} urlregxp: (optional)
	*    address of the document where the script is run, only For documents of all windows [ChromeOnly]
	* @param {Boolean} ucfobj: (optional)
	*    if true, load the script into a specially created object, not for scripts In the background [System Principal].
	* @param {String} func: (optional)
	*    Function as a string
	* @param {Array} isos: (optional)
	*    e.g. ["linux", "windows"]
	* @param {Object} ver: (optional)
	* @param {Int} ver.min: (optional)
	*    compare with <= Services.appinfo.platformVersion
	* @param {Int} ver.max: (optional)
	*    compare with >= Services.appinfo.platformVersion
	* @param {Boolean | Array} module: (optional)
	*   importESModule e.g. ["importSymbol"], only for scripts In the background [System Principal]
	*/
	scriptschrome: { // For browser window document [ChromeOnly]
		domload: [ // By event "DOMContentLoaded"
		{ path: "sidebar_tabs_mod.js", ucfobj: true, },// Sidebar Tabs			
		{ path: "ucf_autohidetabstoolbar.js", ucfobj: true },
		{ path: "ucf_hookClicks.js", ucfobj: true }, //+ attrsInspector.js
		{ path: "ucf_contextsearch.js", ucfobj: true },
		{ path: "ucf_contextmenu_openwith.js", ucfobj: true },
		{ path: "ucf_BookmarkDir.js", ucfobj: true },
		{ path: "ucf_tab-update.js", ucfobj: true },
		{ path: "ucf_downloads_clear.js", ucfobj: true },
		{ path: "ucf_mousedrag.js", ucfobj: true },
		{ path: "LocationBarEnhancer.js", ucfobj: true },
		],
		load: [ // By event "load"
			{ path: "custom_script_win.js", ucfobj: true, },
			{ path: "special_widgets.js", ucfobj: true, }, // <-- Special Widgets
			{ path: "auto_hide_sidebar.js", ucfobj: true, }, // <-- Auto Hide Sidebar
			{ path: "ucf_findbarclose.js", ucfobj: true },
		],
	},
	scriptsallchrome: { // For documents of all windows [ChromeOnly]
		domload: [ // By event "DOMContentLoaded"

		],
		load: [ // By event "load"
			// { path: "custom_script_all_win.js", urlregxp: /^(?:chrome|about):/, ucfobj: true, }, // <-- For chrome|about protocol
			// { path: "example_places.js", urlregxp: /chrome:\/\/browser\/content\/places\/places\.xhtml/, ucfobj: false, }, // <-- Example
		{ path: "places_context_open.js", urlregxp: /chrome:\/\/browser\/content\/(?:browser|places\/(?:bookmarksSidebar|historySidebar|places))\.xhtml/, ucfobj: false, },
		{ path: "undoBookmarks.js", urlregxp: /^chrome:\/\/browser\/content\/(?:browser|places\/(?:bookmarksSidebar|places))\.xhtml/, },
		],
	},
	scriptsbackground: [ // In the background [System Principal]
		{ path: "custom_script.js", },
		{ path: "ucb_aom-button.js" },
		{ path: "ucb_undo-tab.js" },
		{ path: "ucb_UrlTooltip.js" },
		{ path: "ucb_SessionManager.js" },
		{ path: "ucb_loads-favicons.js" },
		{ path: "ucb_fav-export-html.js" },
		{ path: "ucb_pauseResume.js" }, //+check functions
		{ ospath: "%UCFDIR%ucb_SaveHTML.mjs", module: true }, //общие функции
		{ ospath: "%UCFDIR%ClickPicSave.mjs", module: true },
		{ ospath: "%UCFDIR%TitleChanged.mjs", module: true }, //module: ["init"], func: "init();"
	],
	/** ************************▲ Settings ▲************************ */
};

export var UcfStylesScriptsChild = {
	/** ************************▼ Content Settings ▼************************ */
	/**
	* Styles Settings:
	* @param {String} type: (required)
	*    style rights AGENT_SHEET,  AUTHOR_SHEET or USER_SHEET
	* @param {String} path: (required, or ospath)
	*    path to file from folder custom_styles
	* @param {String} ospath: (optional, required for isos, ver)
	*    path to file from folder custom_styles, replace %OS% with the current OS
	* @param {Array} isos: (optional)
	*    e.g. ["linux", "windows"]
	* @param {Object} ver: (optional)
	* @param {Int} ver.min: (optional)
	*    compare with <= Services.appinfo.platformVersion
	* @param {Int} ver.max: (optional)
	*    compare with >= Services.appinfo.platformVersion
	*/
	stylescontent: [
		// { path: "example_content.css", type: "USER_SHEET", }, // <-- Example
	],
	/**
	* Scripts Settings:
	* @param {String} path: (optional, or ospath or func)
	*    path to the script from the folder custom_scripts
	* @param {String} ospath: (optional, required for isos, ver)
	*    path to the script from the folder custom_scripts, replace %OS% with the current OS
	* @param {RegExp} urlregxp: (optional)
	*    address of the document where the script is run
	* @param {String} func: (optional)
	*    Function as a string
	* @param {Array} isos: (optional)
	*    e.g. ["linux", "windows"]
	* @param {Object} ver: (optional)
	* @param {Int} ver.min: (optional)
	*    compare with <= Services.appinfo.platformVersion
	* @param {Int} ver.max: (optional)
	*    compare with >= Services.appinfo.platformVersion
	*/
	scriptscontent: {
		DOMWindowCreated: [ // By event "DOMWindowCreated"

		],
		DOMContentLoaded: [ // By event "DOMContentLoaded"
			// { path: "example_all_about.js", urlregxp: /^about:/, }, // <-- Example
		],
		pageshow: [ // By event "pageshow"
		{ path: "undoBookmarks.js", urlregxp: /chrome:\/\/browser\/content\/places\/places\.xhtml/, }, // Библиотека во вкладке
		],
	},
	/** ************************▲ Content Settings ▲************************ */
};
