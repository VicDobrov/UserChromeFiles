var menubarvisibilitychance = {
	buttons: null,
	buttonsfullscreen: null,
	init(that) {
		var menubar = this.menubar = document.querySelector("#toolbar-menubar");
		if (!menubar) return;
		this.autohidechange = new MutationObserver(() => {
			this.settoolbarvisibility();
		});
		this.autohidechange.observe(menubar, {
			attributeFilter: ["autohide", "inactive"],
			attributes: true,
		});
		this.sizemodechange = new MutationObserver(() => {
			this.setbuttonboxwidth();
		});
		this.sizemodechange.observe(document.documentElement, {
			attributeFilter: ["sizemode"],
			attributes: true,
		});
		that.unloadlisteners?.push("menubarvisibilitychance");
		this.settoolbarvisibility();
	},
	settoolbarvisibility() {
		var docElm = document.documentElement;
		if (this.menubar.getAttribute("autohide") == "true" && this.menubar.getAttribute("inactive") == "true") {
			docElm.setAttribute("v_menubar_autohide", true);
			this.setbuttonboxwidth();
		} else
			docElm.setAttribute("v_menubar_autohide", false);
	},
	width(outerRect, innerRect) {
		if (!window.RTL_UI)
			this.width = (outerRect, innerRect) => outerRect.right - innerRect.left;
		else
			this.width = (outerRect, innerRect) => innerRect.right - outerRect.left;
		return this.width(outerRect, innerRect);
	},
	setbuttonboxwidth() {
		var buttons, docElm = document.documentElement;
		if (docElm.getAttribute("sizemode") != "fullscreen")
			buttons = (this.buttons || (this.buttons = this.menubar.querySelector(".titlebar-buttonbox-container")));
		else
			buttons = (this.buttonsfullscreen || (this.buttonsfullscreen = document.querySelector("#window-controls")));
		var innerRect = buttons.getBoundingClientRect();
		if (innerRect.width < 1) {
			docElm.style.setProperty("--v-titlebar-buttonbox-container-width", "0px");
			return;
		}
		var outerRect = docElm.getBoundingClientRect();
		docElm.style.setProperty("--v-titlebar-buttonbox-container-width", `${this.width(outerRect, innerRect)}px`);
	},
	destructor() {
		this.autohidechange.disconnect();
		this.sizemodechange.disconnect();
		this.autohidechange = null;
		this.sizemodechange = null;
	}
};
menubarvisibilitychance.init(this);