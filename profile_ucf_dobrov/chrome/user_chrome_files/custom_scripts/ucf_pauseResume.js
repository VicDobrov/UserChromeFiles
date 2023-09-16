setTimeout(() => { // проверки при старте браузера
	(async (win, addon) => { // скрипт ucf_hookClicks.js подключен?
		if (win.document.getElementById("nav-bar").tooltip.indexOf("ucf") < 0)
			Cc["@mozilla.org/alerts-service;1"].getService(Ci.nsIAlertsService).showAlertNotification(null,"User Chrome Files",`Возможно, скрипт ucf_hookClicks.js не загружен!\n(или вы открыли новое окно Firefox)`,false);
	// есть расширение Reader View ? скрыть штатный Read View в url-bar : иначе показать
		Services.prefs.setBoolPref("reader.parse-on-load.enabled", !(await addon).isActive);
	})(Services.wm.getMostRecentWindow("navigator:browser"), AddonManager.getAddonByID("{2495d258-41e7-4cd5-bc7d-ac15981f064e}"));}, AppConstants.platform == "win" ? 9e3 : 3e3);

(async ({DownloadsViewUI}, origfunc = DownloadsViewUI.DownloadElementShell.prototype.connect) => {
	DownloadsViewUI.DownloadElementShell.prototype.connect = function connect() {
		var _origfunc = origfunc.apply(this, arguments);
		if (!this.element || !this._downloadButton)
			return _origfunc;
		var doc = this.element.ownerDocument;
		var button = doc.createXULElement("button");
		button.setAttribute("class","downloadButton downloadPauseResumeButton");
		if (this.isPanel)
			button.addEventListener("mouseover", e => {
				e.preventDefault(); e.stopPropagation();
			}, true);
		else
			button.setAttribute("tooltiptext","Пауза/Продолжить");
		button.addEventListener("command", e => {
			if (!this.element._shell?.isCommandEnabled("downloadsCmd_pauseResume"))
				return;
			e.preventDefault(); e.stopPropagation();
			this.element._shell.doCommand("downloadsCmd_pauseResume");
		});
		this._downloadButton.before(button);
		return _origfunc;
	};
})(ChromeUtils.import("resource:///modules/DownloadsViewUI.jsm"));