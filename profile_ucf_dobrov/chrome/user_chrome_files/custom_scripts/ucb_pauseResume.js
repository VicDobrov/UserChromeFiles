setTimeout(() => {(async (win) => { //старт браузера: ucf_hookClicks.js подключен?
	warn =(txt,title)=> Cc["@mozilla.org/alerts-service;1"].getService(Ci.nsIAlertsService).showAlertNotification(null,"Ошибка "+ title, "Не загружен скрипт "+ txt,false);
	if (win.document.getElementById("nav-bar").tooltip.indexOf("ucf") < 0)
		warn(`ucf_hookClicks.js\n(или открыто новое окно Firefox)`, "UserScripts");
	if(typeof Cu.getGlobalForObject(Cu)[Symbol.for("UcfGlob")] != "object")
		warn(`ucb_SaveHTML.mjs`,`глобальных функций`);
})(Services.wm.getMostRecentWindow("navigator:browser"));}, 9e3);

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