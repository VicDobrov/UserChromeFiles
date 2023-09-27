(this.specialwidgets = {
	_timer: null,
	get Customizable() {
		delete this.Customizable;
		if ("createSpecialWidget" in CustomizableUI)
			return this.Customizable = CustomizableUI;
		var scope = null;
		try {
			scope = Cu.import("resource:///modules/CustomizableUI.jsm", {}).CustomizableUIInternal;
		} catch (e) { }
		return this.Customizable = scope;
	},
	init(that) {
		if (!("CustomizableUI" in window) || !("gCustomizeMode" in window))
			return;
		that.unloadlisteners.push("specialwidgets");
		window.addEventListener("customizationready", this);
	},
	destructor() {
		window.removeEventListener("customizationready", this);
	},
	handleEvent(e) {
		this[e.type](e);
	},
	customizationchange() {
		clearTimeout(this._timer);
		this._timer = setTimeout(() => {
			this.createSpecialWidgets();
		}, 1000);
	},
	customizationready() {
		if (!this.Customizable)
			return;
		this.createSpecialWidgets();
		window.addEventListener("customizationchange", this);
		window.addEventListener("customizationending", this);
	},
	customizationending() {
		window.removeEventListener("customizationchange", this);
		window.removeEventListener("customizationending", this);
	},
	createSpecialWidgets() {
		try {
			let fragment = document.createDocumentFragment();
			if (this.findSpecialWidgets("spring")) {
				let spring = this.Customizable.createSpecialWidget("spring", document);
				spring.setAttribute("label", "Растягивающийся интервал");
				fragment.append(gCustomizeMode.wrapToolbarItem(spring, "palette"));
			}
			if (this.findSpecialWidgets("spacer")) {
				let spacer = this.Customizable.createSpecialWidget("spacer", document);
				spacer.setAttribute("label", "Интервал");
				fragment.append(gCustomizeMode.wrapToolbarItem(spacer, "palette"));
			}
			if (this.findSpecialWidgets("separator")) {
				let separator = this.Customizable.createSpecialWidget("separator", document);
				separator.setAttribute("label", "Разделитель");
				fragment.append(gCustomizeMode.wrapToolbarItem(separator, "palette"));
			}
			gCustomizeMode.visiblePalette.append(fragment);
		} catch (e) {}
	},
	findSpecialWidgets(string) {
		try {
			if (!gCustomizeMode.visiblePalette.querySelector(`toolbar${string}[id^="customizableui-special-${string}"]`))
				return true;
		} catch (e) {}
		return false;
	}
}).init(this);