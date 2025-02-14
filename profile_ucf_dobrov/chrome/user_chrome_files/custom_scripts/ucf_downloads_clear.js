(this.cleardownloadsbutton = { // Добавить кнопку "Очистить загрузки" на DownloadsPanel
	init(that) {
		var panel = this.panel = DownloadsPanel.panel;
		if (!panel) return;
		panel.addEventListener("popupshowing", this);
		setUnloadMap("cleardownloadsbutton", this.destructor, this);
	},
	handleEvent(e) {
		var dh = DownloadsView.downloadsHistory;
		if (!dh) {
			this.destructor();
			return;
		}
		var style = "data:text/css;charset=utf-8," + encodeURIComponent(`
		vbox#downloadsFooterButtons {
			display: grid !important;
			grid-template-columns: repeat(2, 1fr) !important;
			grid-auto-rows: auto 1fr !important;
			align-items: stretch !important;
			grid-template-areas: "a a" "b c" !important;
		}
		vbox#downloadsFooterButtons > toolbarseparator:first-of-type {
			grid-area: a !important;
			align-self: start !important;
		}
		vbox#downloadsFooterButtons > #downloadsHistory {
			grid-area: c !important;
			font-weight: bold !important;
		}
		vbox#downloadsFooterButtons > #ucf-cleardownloads-btn {
			grid-area: b !important;
		}
		#downloadsFooterButtons > button {
			margin: 0 !important;
			-moz-box-flex: 1 !important;
			-moz-box-pack: center !important;
			-moz-box-align: center !important;
		}
		#downloadsFooterButtons.panel-footer.panel-footer-menulike > button {
			margin-top: 4px !important;
		}
		#downloadsFooterButtons > #ucf-cleardownloads-btn[disabled="true"] {
			pointer-events: none !important;
		}
		`);
		windowUtils.loadSheetUsingURIString(style, windowUtils.USER_SHEET);
		var btn = this.btn = document.createXULElement("button");
		btn.id = "ucf-cleardownloads-btn";
		btn.className = "downloadsPanelFooterButton subviewbutton panel-subview-footer-button toolbarbutton-1";
		btn.setAttribute("label", "Очистить загрузки");
		btn.setAttribute("disabled", "true");
		dh.after(btn);
		btn.addEventListener("command", this);
		(this.handleEvent = e => {
			this[e.type](e);
		})(e);
	},
	command(e) {
		DownloadsCommon.getData(window, true).removeFinished();
		PlacesUtils.history.removeVisitsByFilter({
			transition: PlacesUtils.history.TRANSITIONS.DOWNLOAD,
		}).catch(Cu.reportError);
		this.btn.disabled = true;
	},
	async setbutton() {
		var {_downloads} = await DownloadsCommon.getData(window, true)._promiseList;
		for (let download of _downloads) {
			if (download.stopped && !(download.canceled && download.hasPartialData)) {
				this.btn.disabled = false;
				return;
			}
		}
		this.btn.disabled = true;
	},
	popupshowing(e) {
		if (e.target != this.panel) return;
		this.setbutton();
		var list = DownloadsCommon.getData(window, true);
		list.addView(this);
		this.panel.addEventListener("popuphiding", e => {
			if (e.target != this.panel) return;
			list.removeView(this);
		}, { once: true });
	},
	onDownloadChanged(download) {
		this.setbutton();
	},
	onDownloadRemoved(download) {
		if (!this.btn.disabled)
			this.setbutton();
	},
	destructor() {
		this.panel?.removeEventListener("popupshowing", this);
		this.btn?.removeEventListener("command", this);
	}
}).init(this);