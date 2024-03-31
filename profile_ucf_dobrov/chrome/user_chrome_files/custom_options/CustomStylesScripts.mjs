const {AppConstants} = ChromeUtils.import("resource://gre/modules/AppConstants.jsm");
var os = name => `${name.replace(/\.[^.$]+$/,'')}_${AppConstants.platform}${name.lastIndexOf('.') > 0 ? "."+ name.split('.').pop() : ""}`, //linux win macosx
osonly = (name, oss = []) => oss.includes(AppConstants.platform) ? name : "", //для указанных OS
mjsmLoad = (s, e = /\.mjs$/i.test(s) ? "ESModule" : "") => `ChromeUtils.import${e}("chrome://user_chrome_files/content/custom_scripts/${s}")`;

export var UcfStylesScripts = {
	/** ************************▼ Settings ▼************************ */
	/**
	* Styles Settings:
	*   path: path to file from folder custom_styles
	*   type: style rights AGENT_SHEET,  AUTHOR_SHEET or USER_SHEET
	*/
	styleschrome: [ // For documents of all windows [ChromeOnly]
		{ path: "special_widgets.css", type: "USER_SHEET", }, // <-- Special Widgets
		// { path: "auto_hide_sidebar.css", type: "USER_SHEET", }, // <-- Auto Hide Sidebar
	],
	stylesall: [ // For all documents
		{ path: "custom_styles_all_agent.css", type: "AGENT_SHEET"},
		{ path: "custom_styles_all_user.css", type: "USER_SHEET"},
// стиль для вашей операционной системы: *_macosx.css, *_linux.css, *_win.css
	// { path: os("custom_styles_all_agent.css"), type: "AGENT_SHEET", sheet() { registerSheet(this); }, },
		{ path: os("custom_styles_all_user.css"), type: "USER_SHEET"},
	],
	/**
	* Scripts Settings:
	*   path: path to the script from the folder custom_scripts
	*   urlregxp: The address where the script works in regular expression, only For documents of all windows [ChromeOnly]
	*   ucfobj: true - upload the script to a specially created object or to windows, not used for scripts In the background [System Principal]
	*   func: A function in the form of a string that will be executed when loading
	*/
	scriptschrome: { // For browser window document [ChromeOnly]
		domload: [ // By event "DOMContentLoaded"
		{ path: "ucf_autohidetabstoolbar.js", ucfobj: true },
		{ path: "ucf_hookClicks.js", ucfobj: true }, //общие функции + attrsInspector.js
		{ path: "ucf_contextsearch.js", ucfobj: true },
		{ path: "ucf_contextmenuopenwith.js", ucfobj: true },
		{ path: "ucf_BookmarkDir.js", ucfobj: true },
		{ path: "ucf_LocationBarEnhancer.js", ucfobj: true },
		{ path: "ucf_tab-update.js", ucfobj: true },
		{ path: "ucf_downloads_clear.js", ucfobj: true },
		{ path: "ucf_undoBookmarks.js", ucfobj: true },
		{ path: "ucf_mousedrag.js", ucfobj: true },
		],
		load: [ // By event "load"
			{ path: "special_widgets.js", ucfobj: true, }, // <-- Special Widgets
			// { path: "auto_hide_sidebar.js", ucfobj: true, }, // <-- Auto Hide Sidebar
		],
	},
	scriptsallchrome: { // For documents of all windows [ChromeOnly]
		domload: [ // By event "DOMContentLoaded"
		],
		load: [ // By event "load"
		{ path: "ucf_undoBookmarks.js", urlregxp: /chrome:\/\/browser\/content\/places\/places\.xhtml/, ucfobj: false, },
		],
	},
	scriptsbackground: [ // In the background [System Principal]
		{ path: "custom_script.js", },
		{ path: "ucf_aom-button.js" },
		{ path: "ucf_undo-tab.js" },
		{ path: "ucf_pauseResume.js" },
		{ path: "ucf_UrlTooltip.js" },
		{ path: "ucf_SessionManager.js" },
		{ path: "ucf_loads-favicons.js" },
		{ path: "ucf_fav-export-html.js" },
		{ func: mjsmLoad("SingleHTML.mjs") },
		{ func: mjsmLoad("ClickPicSave.mjs") }, // нужен SingleHTML
		{ func: `${mjsmLoad("UCFTitleChangedChild.mjs")}.registerUCFTitleChanged();` },

	],
	/** ************************▲ Settings ▲************************ */

	preloadSheet(obj) {
		try {
			let uri = Services.io.newURI(`chrome://user_chrome_files/content/custom_styles/${obj.path}`);
			let type = UcfSSS[obj.type];
			let preload = UcfSSS.preloadSheetAsync(uri, type);
			obj.sheet = async f => {
				try {
					let prd = await preload;
					f(prd, type);
				} catch (e) { }
			};
		} catch (e) {
			obj.sheet = () => {};
		}
	},
	registerSheet(obj) {
		try {
			let uri = Services.io.newURI(`chrome://user_chrome_files/content/custom_styles/${obj.path}`);
			let type = UcfSSS[obj.type];
			if (!UcfSSS.sheetRegistered(uri, type))
				UcfSSS.loadAndRegisterSheet(uri, type);
		} catch (e) {}
	},
};
var UcfSSS = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
