// Скрипт для документов всех окон [ChromeOnly]
var ucf_custom_script_all_win = {
	initialized: false,
	get unloadlisteners() {
		delete this.unloadlisteners;
		window.addEventListener("unload", this, { once: true });
		return this.unloadlisteners = [];
	},
	load() {
		if (this.initialized)
			return;
		this.initialized = true;
		/* ************************************************ */

(() => { // https://forum.mozilla-russia.org/viewtopic.php?pid=784757#p784757
	var loadscript = (js, win) => {
		try {
			if (!window.Services)
				ChromeUtils.import("resource://gre/modules/Services.jsm", window);
			Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/custom_scripts/${js}`, win);
			return true;
		} catch(e) {}
		return false;
	},
	load_scripts_by_url = {
		"chrome://browser/content/browser.xhtml": (win) => {
			if (win != window) return;
			var box = document.querySelector("#browser") || window;
			var listener = e => {
				var doc = e.target || ({});
				load_scripts_by_url[doc.documentURI]?.(doc.defaultView);
			};
			box.addEventListener("pageshow", listener);
			this.loadscriptsallwinorsidebar = {
				destructor: function() {
					box.removeEventListener("pageshow", listener);
				}
			};
			this.unloadlisteners.push("loadscriptsallwinorsidebar");
			setTimeout(() => {
			//>>>>>>>>>>| Загрузка скриптов для browser.xhtml |>>>>>>>>>>
				loadscript("ucf_wheretoopenlink.js", win) && win.ucf_where_to_open_link.browser();
				// loadscript("ucf_SidebarTabs.js", this) && this.unloadlisteners.push("sidebar_tabs");
				// loadscript("ucjsDownloadsManager.uc.js", win);

			//<<<<<<<<<<| Загрузка скриптов для browser.xhtml |<<<<<<<<<<
			}, 0);
		},
		//>>>>>>>>>>| Загрузка скриптов для др. документов |>>>>>>>>>>
		"chrome://browser/content/places/places.xhtml": (win) => {
			loadscript("ucf_wheretoopenlink.js", win) && win.ucf_where_to_open_link.places();

		},
		"chrome://browser/content/downloads/contentAreaDownloadsView.xhtml": (win) => {
			//loadscript("ucjsDownloadsManager2.uc.js", win);

		},
		"about:downloads": (win) => {
			//loadscript("ucjsDownloadsManager2.uc.js", win);

		},
		"chrome://browser/content/places/bookmarksSidebar.xhtml": (win) => {
			loadscript("ucf_wheretoopenlink.js", win) && win.ucf_where_to_open_link.bookmarksSidebar();

		},
		"chrome://browser/content/places/historySidebar.xhtml": (win) => {
			loadscript("ucf_wheretoopenlink.js", win) && win.ucf_where_to_open_link.historySidebar();

		},
		//<<<<<<<<<<| Загрузка скриптов для др. документов |<<<<<<<<<<
	};
	load_scripts_by_url[location.href]?.(window);
})();


		/* ************************************************ */
	},
	handleEvent(e) {
		this[e.type](e);
	},
	unload() {
		this.unloadlisteners.forEach(str => {
			try {
				this[str].destructor();
			} catch (e) {}
		});
	}
};
/* ************************************************ */
if (window.document.readyState != "complete") {
	window.addEventListener("load", function load() {
		ucf_custom_script_all_win.load();
	}, { once: true });
} else
	ucf_custom_script_all_win.load();
