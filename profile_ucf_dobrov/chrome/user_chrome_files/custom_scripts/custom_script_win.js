// Скрипт для документа окна браузера [ChromeOnly] если включено в настройках
var ucf_custom_script_win = { // window.глобальная функция для всех подключенных скриптов
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

		// Здесь может быть ваш код который сработает по событию "load" не раньше

(async () => { // Загрузчик для custom_script_win.js https://forum.mozilla-russia.org/viewtopic.php?pid=788301#p788301

	var loadscript = (js, win = this, init) => { try {
		if (/\.jsm$/i.test(js)) { // скрипт js или jsm [инициализация]
				var obj = ChromeUtils.import('chrome://user_chrome_files/content/custom_scripts/'+ js, win);
				init && obj[init]();
			} else
				Services.scriptloader.loadSubScript('chrome://user_chrome_files/content/custom_scripts/'+ js, win);
			return true;
		} catch(e) {} return false;
	},

	load_scripts_by_url = {
		browser: win => {
			//>>>>>>>>>>| Этот блок требуется для боковой панели и др., очистите строку ниже если он нужен |>>>>>>>>>>
			/*
			var box = document.querySelector("#browser") || window;
			var listener = e => {
				var doc = e.target || ({});
				load_scripts_by_url[doc.documentURI]?.(doc.defaultView);
			};
			box.addEventListener("pageshow", listener);
			this.loadscriptswinandsidebar = {
				destructor() {
					box.removeEventListener("pageshow", listener);
				}
			};
			this.unloadlisteners.push("loadscriptswinandsidebar");
			/* <<<<<<<<<<<<<<<<<<<< */

			setTimeout(() => { //>>>>>>>>>>| Загрузка скриптов для browser.xhtml |>>>>>>>>>>

			// подключить внешние скрипты - сначала глобальные функции ["ucf_hookClicks.js"],
			var jscripts = [["ucf_findbarclose.js"]];
			for (i = 0; i < jscripts.length; i++)
				loadscript(jscripts[i][0], jscripts[i][1], jscripts[i][2]);

			//<<<<<<<<<<<<<<<<<<<<
			}, 0);

		},
		//>>>>>>>>>>| Загрузка скриптов для др. документов |>>>>>>>>>>
		"chrome://browser/content/places/bookmarksSidebar.xhtml": win => {
			// боковая панель закладок
		},
		"chrome://browser/content/places/historySidebar.xhtml": win => {
			// боковая панель истории

		},
		//<<<<<<<<<<<<<<<<<<<<
	};
	load_scripts_by_url.browser(window);

})(); // END Загрузчик для custom_script_win.js

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
	},
  setattributechromemargin: {
		init() {
			 if (AppConstants.platform != "win" || !(window.matchMedia("(-moz-os-version: windows-win8)").matches || window.matchMedia("(-moz-os-version: windows-win7)").matches)) return;
			 this.mediawindowsglass = window.matchMedia("(-moz-windows-glass)");
			 this.mediawindowsglass.addEventListener("change", this);
			 ucf_custom_script_win.unloadlisteners.push("setattributechromemargin");
			 this.update();
		},
		handleEvent() {
			 this.update();
		},
		update() {
			 var margin = this.mediawindowsglass.matches ? "0,7,7,7" : "0,0,0,0";
			 if (TabsInTitlebar.enabled)
				  document.documentElement.setAttribute("chromemargin", margin);
			 TabsInTitlebar._update = eval(`(${`${TabsInTitlebar._update}`
				  .replace(/setAttribute\s*\(\s*"\s*chromemargin\s*"\s*,\s*(?:"\s*0\s*,\s*2\s*,\s*2\s*,\s*2\s*"|"0,7,7,7"|"0,0,0,0")\s*\)/, `setAttribute("chromemargin", "${margin}")`)
				  .replace(/^_update/, "function _update")})`);
		},
		destructor() {
			 this.mediawindowsglass.removeEventListener("change", this);
		},
  },
};
/* ************************************************ */
// Здесь может быть ваш код который сработает по событию "DOMContentLoaded"

if (window.document.readyState != "complete") {
	window.addEventListener("load", function load() {
		ucf_custom_script_win.load();
	}, { once: true });
} else
	ucf_custom_script_win.load();

ucf_custom_script_win.setattributechromemargin.init();
