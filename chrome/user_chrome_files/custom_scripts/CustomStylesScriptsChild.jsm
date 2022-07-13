var EXPORTED_SYMBOLS = ["UcfCustomStylesScriptsChild"];
var UcfStylesScripts = {
    /** ************************▼ Настройки ▼************************ */
    /**
    * Настройки стилей:
    *   path: путь к файлу от папки custom_styles
    *   type: права стиля AGENT_SHEET,  AUTHOR_SHEET или USER_SHEET
    */
    stylescontent: [
        // { path: "custom_styles_content_author.css", type: "AUTHOR_SHEET", sheet(f) { preloadSheet(this, f); }, },
        // { path: "custom_styles_content_user.css", type: "USER_SHEET", sheet(f) { preloadSheet(this, f); }, },
    ],
    /**
    * Настройки скриптов:
    *   path: путь к скрипту от папки custom_scripts
    *   urlregxp: Адрес где работает скрипт, в регулярном выражении
    *   func: Функция в виде строки которая выполнится при загрузке скрипта
    */
    scriptscontent: {
        DOMWindowCreated: [ // По событию "DOMWindowCreated"

        ],
        DOMContentLoaded: [ // По событию "DOMContentLoaded"
            // { path: "example_all_about.js", urlregxp: /about:.*/, },
        ],
        pageshow: [ // По событию "pageshow"
            // { path: "example_downloads.js", urlregxp: /about:downloads/, },
        ],
    },
    /** ************************▲ Настройки ▲************************ */
};

var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var UcfSSS = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
var preloadSheet = async (obj, func) => {
    try {
        let uri = Services.io.newURI(`chrome://user_chrome_files/content/custom_styles/${obj.path}`);
        let type = UcfSSS[obj.type];
        let preload = await UcfSSS.preloadSheetAsync(uri, type);
        (obj.sheet = f => {
            try {
                f(preload, type);
            } catch (e) {}
        })(func);
    } catch (e) {
        obj.sheet = () => {};
    }
};
class UcfCustomStylesScriptsChild extends JSWindowActorChild {
    actorCreated() {
        var win = this.contentWindow;
        var href = win?.location.href;
        if (!href) return;
        var { addSheet } = win.windowUtils;
        for (let s of UcfStylesScripts.stylescontent)
            s.sheet(addSheet);
        if (href === "about:blank") return;
        this.handleEvent = e => {
            for (let s of UcfStylesScripts.scriptscontent[e.type]) {
                try {
                    if (s.urlregxp.test(href)) {
                        let win = this.contentWindow;
                        if (s.path)
                            Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/custom_scripts/${s.path}`, win, "UTF-8");
                        if (s.func)
                            new win.Function(s.func).apply(win, null);
                    }
                } catch (e) {}
            }
        }
    }
    handleEvent(e) {}
}
