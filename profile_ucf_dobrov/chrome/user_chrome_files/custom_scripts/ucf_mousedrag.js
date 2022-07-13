(async win => ({ // UCF drag and go жесты мыши https://forum.mozilla-russia.org/viewtopic.php?pid=797234#p797234
	link: {
		U: {
			name: "Открыть ссылку в новой активной странице", cmd() {
				win.openUILinkIn(this.val, "tab", this.opts);
			}
		},
		L: {
			name: "Копировать ссылку в буфер обмена", cmd() {
				gClipboard.write(this.val);
				glob.flash_bg_text('urlbar-input-container', 0, 'rgba(240,176,0,0.5)', 200, 'в буфере: ' + this.val, 3e3);
			}
		},
		D: {
			name: "Открыть ссылку в новой фоновой странице", cmd() {
				win.openUILinkIn(this.val, "tabshifted", this.opts);
			}
		}
	},
	text: {
		U: {
			name: "Поиск текста поисковиком по умолчанию в новой активной странице", cmd() {
				this.search("tab");
			}
		},
		L: {
			name: "Копировать текст в буфер обмена", cmd() {
				gClipboard.write(this.val);
				glob.flash_bg_text('urlbar-input-container', 0, 'rgba(240,176,0,0.5)', 200, 'в буфере: ' + this.val, 3e3);
			}
		}
	},
	search(where) {
		var engine = Services.search[`default${this.opts.private ? "Private" : ""}Engine`];
		var submission = engine.getSubmission(this.val, null, "");
		win.openUILinkIn(submission.uri.spec, where, {postData: submission.postData, ...this.opts});
	},
	opts: { // relatedToCurrent: true,
		triggeringPrincipal: Cu.getObjectPrincipal(this),
		get userContextId() {
			return parseInt(win.gBrowser.selectedBrowser.getAttribute("usercontextid"));
		},
		get private() {
			return win.PrivateBrowsingUtils.isWindowPrivate(win);
		}
	},
	dragstart(e) {
		win = e.view.windowRoot.ownerGlobal;
		//if (!win.gBrowser.currentURI.spec.startsWith("http")) return;
		if (!e.dataTransfer.mozItemCount || !win.gBrowser.selectedBrowser.matches(":hover"))
			return;

		var dt = e.dataTransfer;
		this.type = this.link;
		this.dir = this.val = "";

		var url = dt.getData("text/x-moz-url-data");
		if (url) this.val = url;
		else {
			var txt = dt.getData("text/plain");
			if (txt) {
				this.val = txt;
				if (!this.textLinkRe.test(txt)) this.type = this.text;
			}
			else return;
		}
		this.x = e.screenX; this.y = e.screenY;
		this.drag(true);
	},
	drag(init) {
		var meth = `${init ? "add" : "remove"}EventListener`;
		for(var type of this.events) win[meth](type, this, true);
		init || win.StatusPanel.panel.setAttribute("inactive", true);
	},
	events: ["dragover", "drop", "dragend"],
	dragover(e) {
		var {x, y} = this, cx = e.screenX, cy = e.screenY;
		var dx = cx - x, ax = Math.abs(dx), dy = cy - y, ay = Math.abs(dy);
		if (ax < 10 && ay < 10) return;

		this.x = cx; this.y = cy;
		var dir = ax > ay ? dx > 0 ? "R" : "L" : dy > 0 ? "D" : "U";
		if (this.dir.endsWith(dir)) return;

		dir = this.dir += dir;
		var obj = this.type[dir];
		var txt = `${obj ? "Ж" : "Неизвестный ж"}ест мыши: ${dir + (obj ? "  " + obj.name : "")}`;
		toStatus(txt, 2500);
	},
	dragend(e) {
		var dt = e.dataTransfer;
		this.drag();
		var obj = this.type[this.dir];
		if (!obj || dt.mozUserCancelled) return;

		var x = e.screenX, y = e.screenY;
		var wx = win.mozInnerScreenX, wy = win.mozInnerScreenY;
		x > wx && y > wy && x < wx + win.innerWidth && y < wy + win.innerHeight
			&& obj.cmd.call(this);
	},
	textLinkRe: /^([a-z]+:\/\/)?([a-z]([a-z0-9\-]*\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-z][a-z0-9_]*)?$|^custombutton:\/\/\S+$/,

	observe(w) {
		this.drop = () => this.drag();
		this.handleEvent = e => this[e.type](e);
		var unload = e => {
			var w = e.target.ownerGlobal;
			w.gBrowser.tabpanels.removeEventListener("dragstart", this, true);
			if (w == win) win = null;
		}
		(this.observe = w => {
			//if (!w.toolbar.visible) return;
			w.gBrowser.tabpanels.addEventListener("dragstart", this, true);
			w.addEventListener("unload", unload, {once: true});
		})(w);
	},
	init(topic, self) {
		delete this.init;
		Services.obs.addObserver(self = this, topic);
		Services.obs.addObserver(function quit(s, t) {
			Services.obs.removeObserver(self, topic);
			Services.obs.removeObserver(quit, t);
		}, "quit-application-granted");
	}
}).init("browser-delayed-startup-finished"))();