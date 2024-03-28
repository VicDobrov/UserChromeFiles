var Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services;
var controlSet = new Set([
	"extensions.user_chrome_files.vertical_top_bottom_bar_enable",
	"extensions.user_chrome_files.top_enable",
	"extensions.user_chrome_files.vertical_enable",
	"extensions.user_chrome_files.vertical_autohide",
]);
var PREF_BRANCH = "extensions.user_chrome_files.";
var FormObserver = {
	observe(aSubject, aTopic, aData) {
		var input = document.querySelector(`[data-pref="${aData}"]`);
		if (input)
			FillForm(aData, input);
	},
	handleEvent() {
		SaveForm();
	},
};
var FillForm = (aData, input) => {
	var val = GetPref(aData);
	if (input.type == "checkbox") {
		input.checked = val;
		if (controlSet.has(aData))
			input.parentElement.nextElementSibling.disabled = !val;
	} else
		input.value = val;
};
var SaveForm = () => {
	var inputs = document.querySelectorAll("[data-pref]");
	for (let i of inputs) {
		let pref = i.dataset.pref;
		if (i.type == "checkbox")
			SetPref(pref, i.checked);
		else
			SetPref(pref, i.value);
	}
};
var GetPref = name => {
	var type = Services.prefs.getPrefType(name);
	switch (type) {
		case Services.prefs.PREF_BOOL:
			return Services.prefs.getBoolPref(name);
		case Services.prefs.PREF_INT:
			return Services.prefs.getIntPref(name);
		case Services.prefs.PREF_STRING:
			return Services.prefs.getStringPref(name);
	}
};
var SetPref = (name, value) => {
	var type = Services.prefs.getPrefType(name);
	switch (type) {
		case Services.prefs.PREF_BOOL:
			Services.prefs.setBoolPref(name, value);
			break;
		case Services.prefs.PREF_INT:
			Services.prefs.setIntPref(name, value);
			break;
		case Services.prefs.PREF_STRING:
			Services.prefs.setStringPref(name, value);
			break;
	}
};
var RestoreDefaults = () => {
	var inputs = document.querySelectorAll("[data-pref]");
	for (let i of inputs)
		Services.prefs.clearUserPref(i.dataset.pref);
};
var Restart = (nocache = false) => {
	var cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
	Services.obs.notifyObservers(cancelQuit, "quit-application-requested", "restart");
	if (cancelQuit.data)
		return false;
	if (nocache)
		Services.appinfo.invalidateCachesOnRestart();
	var restart = Services.startup;
	restart.quit(restart.eAttemptQuit | restart.eRestart);
};
var Homepage = () => {
	var win = window;
	if (win.top && win.top.opener && !win.top.opener.closed)
		win = win.top.opener;
	else
		win = Services.wm.getMostRecentWindow("navigator:browser");
	if (win && "gBrowser" in win)
		win.gBrowser.selectedTab = win.gBrowser.addTab("https://github.com/VicDobrov/UserChromeFiles", {
			triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
		});
};
window.addEventListener("load", () => {
	var inputs = document.querySelectorAll("[data-pref]");
	for (let i of inputs)
		FillForm(i.dataset.pref, i);
	document.querySelector("#restore").onclick = () => RestoreDefaults();
	document.querySelector("#restart").onclick = () => Restart();
	document.querySelector("#restart_no_cache").onclick = () => Restart(true);
	document.querySelector("#homepage").onclick = () => Homepage();
	window.addEventListener("change", FormObserver);
	Services.prefs.addObserver(PREF_BRANCH, FormObserver);
	window.addEventListener("unload", () => {
		window.removeEventListener("change", FormObserver);
		Services.prefs.removeObserver(PREF_BRANCH, FormObserver);
	}, { once: true });
}, { once: true });
