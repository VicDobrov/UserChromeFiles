(async win => ({ // UCF drag and go жесты мыши https://forum.mozilla-russia.org/viewtopic.php?pid=797234#p797234
	link: {
		L: {
			name: "Копировать ссылку в буфер обмена", cmd() {
				this.gClipboard.write(this.val);
				this.flash();
			}
		},
		U: {
			name: "Копировать текст ссылки в буфер", cmd() {
				this.gClipboard.write(this.txt);
				this.flash();
			}
		},
		DR: {
			name: "Открыть ссылку в новой активной странице", cmd() {
				win.openUILinkIn(this.val, "tab", this.opts);
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
		D: {
			name: "Поиск текста поисковиком по умолчанию в новой фоновой странице", cmd() {
				this.search("tabshifted");
			}
		},
		L: {
			name: "Копировать текст в буфер обмена", cmd() {
				this.gClipboard.write(this.val);
				this.flash();
			}
		}
	},
	toStatus(txt) {
		win.StatusPanel._labelElement.value = txt;
		win.StatusPanel.panel.removeAttribute("inactive");
	},
	gClipboard: {
		write(str, ch = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)) {
			(this.write = str => ch.copyStringToClipboard(str, Services.clipboard.kGlobalClipboard))(str);
		}
	},
	flash(color = 'rgba(240,176,0,0.5)', sec = 250, id = 'urlbar-input-container') {
		id = document.getElementById(id); id.style.background = color; setTimeout(() => { id.style.removeProperty('background-color');}, sec);
	},
	search(where) {
		var engine = Services.search[`default${this.opts.private ? "Private" : ""}Engine`];
		var submission = engine.getSubmission(this.val, null, "");
		win.openUILinkIn(submission.uri.spec, where, {postData: submission.postData, ...this.opts});
	},
	opts: { //relatedToCurrent: true,
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
		if (!e.dataTransfer.mozItemCount || !win.gBrowser.selectedBrowser.matches(":hover"))
			return;

		var dt = e.dataTransfer;
		this.type = this.link;
		this.dir = this.val = "";
		var txt = dt.getData("text/plain");
		var url = dt.getData("text/x-moz-url-data");
		if (url)
			this.val = url, this.txt = dt.getData("text/x-moz-url").split("\n")[1];
		else if (!txt) return;
		try {
			this.val = new URL(txt.trim());
		} catch {
			this.val = txt;
			if (!this.textLinkRe.test(txt))
				this.type = this.text;
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
		this.toStatus(txt);
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
	help(m, k = ""){
		for(o in m)
			k += "\n"+ o +" "+ m[o].name;
		return k;
	},
	init(topic, self) {
		delete this.init;
		Services.obs.addObserver(self = this, topic);
		Services.obs.addObserver(function quit(s, t) {
			Services.obs.removeObserver(self, topic);
			Services.obs.removeObserver(quit, t);
		}, "quit-application-granted");
		with (this)
			document.getElementById("nav-bar").ucf_mousedrag = "\tЖесты мыши для ссылок:"+ help(link) +"\n\n\tЖесты выделенного текста:"+ help(text);
	}
}).init("browser-delayed-startup-finished"))();