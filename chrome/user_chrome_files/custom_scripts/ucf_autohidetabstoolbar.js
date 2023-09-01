(this.autohidetabstoolbar = {
	init(that) {
		var newtab = this.newtab = document.querySelector("#tabs-newtab-button");
		if (!newtab) return;
		newtab.addEventListener("animationstart", this);
		that.unloadlisteners.push("autohidetabstoolbar");
		var style = "data:text/css;charset=utf-8," + encodeURIComponent(`
			:root[ucfautohidetabstoolbar="true"] #TabsToolbar:not([customizing]) {
				visibility: collapse !important;
			}
			#main-window[ucfautohidetabstoolbar="true"]:not([customizing]) box > #navigator-toolbox {
				padding-bottom: 0 !important;
			}
			#tabs-newtab-button { opacity: 1;
				animation-name: toolbar_visible !important;
				animation-timing-function: step-start !important;
				animation-duration: .1s !important;
				animation-iteration-count: 1 !important;
				animation-delay: 0s !important;
			}
			${parseInt(Services.appinfo.platformVersion) < 110
		? `.tabbrowser-tab[first-visible-tab="true"][last-visible-tab="true"] ~ #tabs-newtab-button,
			.tabbrowser-tab[first-visible-tab="true"][last-visible-tab="true"] ~ #tabbrowser-arrowscrollbox-periphery > #tabs-newtab-button { opacity: 0;`
		: `.tabbrowser-tab:not([hidden]) ~ .tabbrowser-tab:not([hidden]) ~ #tabbrowser-arrowscrollbox-periphery > #tabs-newtab-button {
				animation-name: toolbar_visible !important;
			}
			#tabs-newtab-button {`}
				animation-name: toolbar_hide !important;
			}
			@keyframes toolbar_visible {
				from { opacity: 0;} to {opacity: 1;}
			}
			@keyframes toolbar_hide {
				from {opacity: 1;} to {opacity: 0;}
			}
		`);
		windowUtils.loadSheetUsingURIString(style, windowUtils.USER_SHEET);
	},
	handleEvent(e) {
		this[e.animationName]?.();
	},
	toolbar_visible() {
		document.documentElement.setAttribute("ucfautohidetabstoolbar", "false");
	},
	toolbar_hide() {
		document.documentElement.setAttribute("ucfautohidetabstoolbar", "true");
	},
	destructor() {
		this.newtab.removeEventListener("animationstart", this);
	}
}).init(this);