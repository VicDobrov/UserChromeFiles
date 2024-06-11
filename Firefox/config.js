// 2024-6-5
(async () => {
	var file = Services.dirsvc.get("UChrm", Ci.nsIFile);
	file.append("user_chrome_files"); file.append("user_chrome.manifest");
	if (!file.exists() || !file.isFile()) return;
	Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(file);
	Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/user_chrome/user_chrome${Services.appinfo.name == "Thunderbird" ? "_tb" : ""}.js`, Cu.Sandbox(Services.scriptSecurityManager.getSystemPrincipal(), {wantComponents: true, sandboxName: "UserChromeFiles", wantGlobalProperties: ["ChromeUtils"]}));
})();
lockPref("extensions.legacy.enabled", true);
lockPref("browser.newtabpage.activity-stream.feeds.telemetry", false);