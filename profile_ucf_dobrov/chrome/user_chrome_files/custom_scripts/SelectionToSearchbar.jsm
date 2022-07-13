var EXPORTED_SYMBOLS = ["SelectionToSearchbarChild", "SelectionToSearchbarParent"];

if (!ChromeUtils.domProcessChild.childID) {
	if (typeof Services != "object")
		var {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");

	var {prefs, obs} = Services;
	var pref = "ucf.selection-to-searchbar.enabled";
	var enabled = prefs.getBoolPref.bind(null, pref, true);

	var SelectionToSearchbarParent = class extends JSWindowActorParent {
		msg(msg, win = this.browsingContext.topChromeWindow) {
			var sb = win.document.getElementById("searchbar");
			if (sb) sb.value = msg.data;
		}
		receiveMessage(msg) {
			var win = this.browsingContext.topChromeWindow;
			win.toolbar.visible
				? (this.receiveMessage = this.msg).call(this, msg, win)
				: this.sendAsyncMessage("", false);
		}
	}
	var name = "SelectionToSearchbar";
	var id = "ucf-selection-to-searchbar";
	var check = (btn, state) => btn.toggleAttribute("checked", state);
	var cui = ChromeUtils.import("resource:///modules/CustomizableUI.jsm").CustomizableUI;

	cui.createWidget({
		id,
		label: "Автоматически добавлять выделенный текст в SearchBar",
		tooltiptext: " Автоматически добавлять выделенный текст в SearchBar",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAVCAYAAACt4nWrAAADQklEQVQ4ja3V/08adxzHcf+t/bT90HTLtmT7F5Ym/XUsy4Uu7mdKYiawudaq04DWjVoFxWgRrU5txDL5clKkIDVBVpE77j5wgPW45LkfTMgOf1gb98Pjt/fr+fntbkAIgdfrxel04nA4bszpdOL1ehFCMHDf7cbn81GtVrEs68aq1So+n4/7bjcDkiRRq9UwTZNms3ljpmlSq9WQJIkBh8OBZVnXjlRVJZFIMB9eZPr3IMG5efb399E07T8fsCwLh8NxFe92uzQajZ5qtcrCUoRYKkv8TGfzbZtQ7oyxyBaBQIBarWa779ftdu1xIQRCCBRFYSES4ZWic37Z5fTCJK29Y+20RfC14NHzQ6ZnHqPrem/T71pc13V0XSeZTLL0UqbSucToWpxemCS1dzwrGwRfCyZljeHAArlcrrfpZ4ubpkm9XqderxNaWiZaUik0LjluXpLSLtg+axE5aTKT05jMaDxYP2RlZaW36Weapj2uqiqqqvI4OEe4JNh+a7B71mLz7xbLJ02CeZ3fMnUmUnUebBUIh0K9Tb9rcUVRUBSFpwth/AenPC00WDhuMF8QzB5pTMp1Rv5S8Wc0RqJpVldXe5t+tnin06FUKlEqldjc3MQ7/5zxpMJEWmU8pTB6oOCNnzPyUuFRQmVoNEAymext+nU6HXu8WCxSLBbJ5/OMjY8zHM0wvHeOJ36OZ++chwmFX+M1PE/WGRwcZGpqio1YrLf7t2vxQqHQc3h4yMPRMYb8YX56JjO8cczPUZmhsRnu3XOSTqdZW5wl+90tTrbXbNtCoWCPt9tt8vm8zdHREbFYjIDfz9TkJIGAn52dHaanp4nMz/Bm6Q7WzJdc/vAJb/6M2rbtdtsez+Vy7yUWi7H/7ReYE59C/A4Ev8J0fkRpY7l3Y4u3Wi2y2ex7y+9s0HbegqnP4MU3MPc16o+3iS4tks1mabVa9rgsyx8k92KLzvcfw8RtrL27HKw/4Y9gEFmW7XHDMMhkMh/s1e4Wdefn7AZ/IRQKMTs7SyaTwTCMq7gkSZTLZVRVJZVK3ZiqqpTL5avvudvtxuPxUKlUMAzjxiqVCh6PB7fbzYAQApfLhSRJ/8s/VJIkXC4XQgj+AW9cSYbbZ7hEAAAAAElFTkSuQmCC",
		localized: false,
		defaultArea: cui.AREA_NAVBAR,
		onCreated(btn) {
			btn._handleClick = this.click;
			btn.setAttribute("image", this.image);
			check(btn, enabled());
		},
		click: () => prefs.setBoolPref(pref, !enabled())
	});

	var options = {
		allFrames: true,
		includeChrome: true,
		parent: {moduleURI: __URI__},
		child: {moduleURI: __URI__, events: {DOMDocElementInserted: {}}},
	};
	var reg = () => ChromeUtils.registerWindowActor(name, options);

	var handleBr = br => {
		var bbc = br.browsingContext;
		if (bbc) try {
			for(var bc of bbc.getAllBrowsingContextsInSubtree())
				bc.currentWindowGlobal?.getActor(name)?.sendAsyncMessage("", true);
		} catch {}
	}
	var observer = () => {
		var state = enabled();
		state ? reg() : ChromeUtils.unregisterWindowActor(name);
		for(var {node} of cui.getWidget(id).instances) {
			var win = node.ownerGlobal;
			if (!win.toolbar.visible) continue;
			check(node, state);
			if (state) {
				var doc = win.document;
				for(var br of doc.getElementsByTagName("browser"))
					handleBr(br);
				br = doc.getElementById("sidebar").contentDocument
					?.getElementById("#webext-panels-browser");
				br && handleBr(br);
			}
		}
	}
	enabled() && reg();
	prefs.addObserver(pref, observer);
	obs.addObserver(function quit(s, topic) {
		obs.removeObserver(quit, topic);
		prefs.removeObserver(pref, observer);
	}, "quit-application-granted");
}

var re = /\S/;
var reasons = ["MOUSEUP", "KEYPRESS", "SELECTALL"]
	.map(reason => Ci.nsISelectionListener[reason + "_REASON"]);

class SelectionListener {
	constructor(sender) {
		(this.sender = sender).listener = this;
	}
	QueryInterface = ChromeUtils.generateQI(["nsISelectionListener"]);
	notifySelectionChanged(d, sel, reason) {
		reasons.includes(reason)
		&& re.test(sel = sel.toString())
		&& this.sender.sendAsyncMessage("", sel.trim().slice(0, 160));
	}
}
class SelectionToSearchbarChild extends JSWindowActorChild {
	receiveMessage(msg) {
		msg.data ? this.handleEvent() : this.didDestroy();
	}
	handleEvent() {
		var sel = this.contentWindow.getSelection();
		sel && (this.sel = sel).addSelectionListener(new SelectionListener(this));
	}
	didDestroy() {
		if (this.sel)
			this.sel.removeSelectionListener(this.listener),
			this.sel = this.listener = null;
	}
}