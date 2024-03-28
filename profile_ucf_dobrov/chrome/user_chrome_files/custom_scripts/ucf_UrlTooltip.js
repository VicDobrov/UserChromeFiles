// Тултипы с URL. В фоне [System Principal] forum.mozilla-russia.org/viewtopic.php?pid=783765#p783765

try {CustomizableUI.createWidget(({
	label: "Ссылки в подсказках", localized: false,
	id: "ucf-HrefInTooltip", pref: "ucf.HrefInTooltip.enabled",
	get state() {
		return Services.prefs.getBoolPref(this.pref, false); //по-умолчанию выкл
	},
	image: "data:image/svg+xml;charset=utf-8,<svg height='16' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M9.618 6.721a2.48 2.48 0 0 0-.39-.32l-.73.73A1.48 1.48 0 0 1 8.91 9.55l-2.12 2.12a1.48 1.48 0 0 1-2.12 0 1.48 1.48 0 0 1 0-2.12l.60-.60a3.53 3.53 0 0 1-.2-1.2L3.96 8.843a2.5 2.5 0 0 0 0 3.53 2.5 2.5 0 0 0 3.53 0l2.12-2.12a2.5 2.5 0 0 0 0-3.54z' fill='%23c22'/><path d='M6.79 9.55c.12.12.25.226.389.32l.73-.73a1.48 1.48 0 0 1-.417-2.411L9.62 4.6a1.48 1.48 0 0 1 2.12 0 1.48 1.48 0 0 1 0 2.12l-.60.60c.14.39.21.79.2 1.2l1.1-1.1a2.5 2.5 0 0 0 0-3.53 2.5 2.5 0 0 0-3.53 0L6.79 6.014a2.5 2.5 0 0 0 0 3.54z' fill='%23c22'/><circle cx='8' cy='8' r='7.4' fill='none' stroke='%23c22'/></svg>",
		setIcon(btn, state = this.state, i = this.image) {
		if (!state) i = i.replace(/23c/g, '232');
		btn.setAttribute("image", i);
	},
	onCreated(btn) {
		this.btn = btn, btn.owner = this;
		btn.setAttribute("oncommand", "owner.toggle()");
		btn.setAttribute("onmouseenter", "owner.mouseenter()");
		this.setIcon(btn);
	},
	mouseenter() {
		this.btn.tooltipText = this.label +' – '+ `${this.state ? "включены" : "скрыть по-умолчанию"}`;
	},
	toggle() {
		Services.prefs.setBoolPref(this.pref, !this.state);
	},
	observe(s, topic) {
		if (topic.startsWith("q")) return this.destroy();
		var {state} = this;
		for(var {node} of CustomizableUI.getWidget(this.id).instances)
			this.setIcon(node, state);
		state ? this.initTooltip() : this.destroyTooltip();
	},
	init() {
		Services.prefs.addObserver(this.pref, this);
		Services.obs.addObserver(this, "quit-application-granted", false);
		this.state && this.initTooltip();
		delete this.init; return this;
	},
	destroy() {
		Services.prefs.removeObserver(this.pref, this);
		Services.obs.removeObserver(this, "quit-application-granted");
	},
	initTooltip() {
		var url = this.initURL = this.createURL("psInit");
		(this.initTooltip = () => Services.ppmm.loadProcessScript(url, true))();
	},
	destroyTooltip() {
		var url = this.createURL("psDestroy");
		(this.destroyTooltip = () => {
			Services.ppmm.removeDelayedProcessScript(this.initURL);
			Services.ppmm.loadProcessScript(url, false);
		})();
		delete this.createURL;
	},
	createURL: function createURL(meth) {
		var subst = this.id + "-" + meth;
		(createURL.rph || (createURL.rph = Services.io.getProtocolHandler("resource")
				.QueryInterface(Ci.nsIResProtocolHandler)
		)).setSubstitution(subst, Services.io.newURI("data:text/javascript;charset=utf-8," + encodeURIComponent(
			`(${this[meth]})(ChromeUtils.import("resource://gre/modules/TooltipTextProvider.jsm").TooltipTextProvider.prototype)`
		)));
		delete this[meth]; return "resource://" + subst;
	},
	psInit: proto => {
		if (proto.getTextPlus) return proto.getNodeText = proto.getTextPlus.newGetNodeText;

		//================[ start content ]================

		proto.getTextPlus = node => {
			var href = getHref(node);
			if (!href || href == "#" || skipRe.test(href)) return;
			if (href.startsWith("data:")) return crop(href, 64);
			return crop(decode(href));
		}
		var skipRe = /^(?:javascript|addons):/;

		var getHref = node => {do {
			if (HTMLAnchorElement.isInstance(node) && node.href) return node.href;
		} while (node = node.flattenedTreeParentNode)}

		var crop = (url, max = 128) => url.length <= max
			? url : url.slice(0, --max) + "\u2026"; // ellipsis

		var decode = url => {
			var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
			var ldu = Cu.import("resource:///modules/UrlbarInput.jsm", {}).losslessDecodeURI;
			return (decode = url => {try {return ldu(ios.newURI(url));} catch {return url;}})(url);
		}
		//================[ end content ]==================

		var func = proto.getTextPlus.getNodeText = proto.getNodeText;
		proto.getTextPlus.newGetNodeText = proto.getNodeText = function(node, text) {
			var res = func.apply(this, arguments);
			if (!res && !(node?.localName != "browser" && node.ownerGlobal && node.ownerDocument))
				return false;
			var txt = this.getTextPlus(node), add = "\n[тащите текст или ссылку влево, чтобы скопировать]";
			return txt ? text.value = res ? text.value + "\n" + txt + add : txt + add : res;
		}
	},
	psDestroy: proto => {
		proto.getNodeText = proto.getTextPlus.getNodeText;
	}
}).init())} catch(ex) {Cu.reportError(ex);}