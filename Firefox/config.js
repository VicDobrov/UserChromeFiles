// UserChromeFiles Vitaliy V. http://forum.mozilla-russia.org/viewtopic.php?id=76642
(async () => { Cu.evalInSandbox(`
var {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm"), user_chrome_files_sandbox = {
	init() {
		Services.obs.addObserver(this, "domwindowopened");
		Services.obs.addObserver(this, "profile-after-change");
	},
	observe(aWindow, aTopic, aData) {
		Services.obs.removeObserver(this, "profile-after-change");
		this.observe = (window, topic, data) => {
			if (!(window instanceof Ci.nsIDOMChromeWindow)) return;
			var docElementInserted = e => {
				var win = e.target.defaultView;
				if (win instanceof Ci.nsIDOMChromeWindow)
					user_chrome.initWindow(win);
			};
			window.windowRoot.addEventListener("DOMDocElementInserted", docElementInserted, true);
			window.addEventListener("load", e => {
				window.addEventListener("unload", e => {
					window.windowRoot.removeEventListener("DOMDocElementInserted", docElementInserted, true);
				}, { once: true });
			}, { once: true });
		};
		var file = Services.dirsvc.get("UChrm", Ci.nsIFile);
		file.append("user_chrome_files");
		file.append("user_chrome.manifest");
		if (!file.exists() || !file.isFile()) {
			this.removeObs();
			return;
		}
		try {
			Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(file);
			Services.scriptloader.loadSubScript("chrome://user_chrome_files/content/user_chrome.js", globalThis, "UTF-8");
		} catch(ex) {
			this.removeObs();
			return;
		}
		if (aTopic === "domwindowopened")
			this.observe(aWindow, aTopic, aData);
	},
	removeObs() {
		Services.obs.removeObserver(this, "domwindowopened");
	},
};
user_chrome_files_sandbox.init();`, Cu.Sandbox(Cc["@mozilla.org/systemprincipal;1"].createInstance(Ci.nsIPrincipal), { wantComponents: true, sandboxName: "UserChromeFiles", wantGlobalProperties: ["ChromeUtils"],}));
})();