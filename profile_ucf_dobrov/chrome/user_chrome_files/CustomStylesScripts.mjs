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
        { path: "ucf_hookClicks.js", ucfobj: true }, //+ attrsInspector.js
        { path: "ucf_contextsearch.js", ucfobj: true },
        { path: "ucf_contextmenu_openwith.js", ucfobj: true },
        { path: "ucf_BookmarkDir.js", ucfobj: true },
        { path: "ucf_tab-update.js", ucfobj: true },
        { path: "ucf_downloads_clear.js", ucfobj: true },
        { path: "ucf_mousedrag.js", ucfobj: true },
        { path: "LocationBarEnhancer.js", ucfobj: true },
        { path: "undoBookmarks.js", ucfobj: true },
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
        { path: "undoBookmarks.js", urlregxp: /chrome:\/\/browser\/content\/places\/places\.xhtml/, ucfobj: false, },
        ],
    },
    scriptsbackground: [ // In background [System Principal] ucb_…
        { path: "custom_script.js", },
        { path: "ucb_aom-button.js" },
        { path: "ucb_undo-tab.js" },
        { path: "ucb_UrlTooltip.js" },
        { path: "ucb_SessionManager.js" },
        { path: "ucb_loads-favicons.js" },
        { path: "ucb_fav-export-html.js" },
        { path: "ucb_pauseResume.js" }, //+check functions
        { func: mjsmLoad("ucb_SaveHTML.mjs") }, //общие функции
        { func: mjsmLoad("ClickPicSave.mjs") },
        { func: `${mjsmLoad("UCFTitleChanged.mjs")}.registerUCFTitleChanged();` },
    ],
    /** ************************▲ Settings ▲************************ */
};

export var UcfStylesScriptsChild = {
    /** ************************▼ Сontent Settings ▼************************ */
    /**
    * Styles Settings:
    *   path: path to file from folder custom_styles
    *   type: style rights AGENT_SHEET,  AUTHOR_SHEET or USER_SHEET
    */
    stylescontent: [
        // { path: "example_content.css", type: "USER_SHEET", }, // <-- Example
    ],
    /**
    * Scripts Settings:
    *   path: path to the script from the folder custom_scripts
    *   urlregxp: The address where the script works in regular expression
    *   func: A function in the form of a string that will be executed when loading
    */
    scriptscontent: {
        DOMWindowCreated: [ // By event "DOMWindowCreated"
        ],
        DOMContentLoaded: [ // By event "DOMContentLoaded"
            // { path: "example_all_about.js", urlregxp: /about:.*/, }, // <-- Example
        ],
        pageshow: [ // By event "pageshow"
            // { path: "example_downloads.js", urlregxp: /about:downloads/, }, // <-- Example
        ],
    },
    /** ************************▲ Сontent Settings ▲************************ */
};
