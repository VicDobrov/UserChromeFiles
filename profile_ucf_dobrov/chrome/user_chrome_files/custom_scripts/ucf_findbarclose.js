(this.findbarclose = { // панель поиска
	timer: null,
	init(that) {
		gBrowser.tabpanels.addEventListener("findbaropen", this);
		window.addEventListener("keydown", this, true);
		that.unloadlisteners.push("findbarclose");
	},
	close: function() {
		this.delay = 3000; // Задержка скрытия
		this.timer = null;
		this._init = (e) => {
			var findbar = this.findbar = e.target;
			var parent = this.parent = findbar.parentNode;
			parent.addEventListener("findbarclose", this);
			parent.addEventListener("mousedown", this);
			var tab = this.tab = gBrowser.getTabForBrowser(findbar._browser);
			tab.addEventListener("TabClose", this);
		};
		this.removeListener = () => {
			this.parent.removeEventListener("findbarclose", this);
			this.parent.removeEventListener("mousedown", this);
			this.tab.removeEventListener("TabClose", this);
		};
		this.handleEvent = (e) => {
			clearTimeout(this.timer);
			if (e.type == "mousedown") {
				if (e.target?.closest("findbar") == this.findbar)
					return;
				this.timer = setTimeout(() => {
					this.removeListener();
					if (!this.findbar.hidden)
						this.findbar.close();
				}, this.delay);
				return;
			}
			this.removeListener();
		};
	},
	keydown(e) {
		if (e.ctrlKey && e.code == "KeyF" && !e.altKey && !e.shiftKey) {
			if (this.timer != null) {
				e.preventDefault();
				return;
			}
			this.timer = setTimeout(() => {
				this.timer = null;
			}, 1000);
			if (window.gFindBarInitialized && !gFindBar.hidden) {
				e.preventDefault();
				gFindBar.close();
			}
		}
	},
	findbaropen(e) {
		(new this.close())._init(e);
	},
	handleEvent(e) {
		this[e.type](e);
	},
	destructor() {
		gBrowser.tabpanels.removeEventListener("findbaropen", this);
		window.removeEventListener("keydown", this, true);
	}
}).init(this);


(noop => addEventListener("TabSelect", { // отображать FindBar на всех вкладках
	async handleEvent(e) {
			var findbar = e.target._findBar;
			var open = findbar && !findbar.hidden;
			var prev = e.detail.previousTab._findBar;
			if (prev && !prev.hidden) {
					if (!open) {
							if (!findbar) findbar = await gFindBarPromise;
							Object.defineProperty(findbar, "removeAttribute", this);
							findbar.setAttribute("noanim", true);
							findbar.open();
							setTimeout(this.removeAttr, 50, findbar);
							var inp = findbar._findField;
							inp.value && findbar._enableFindButtons(true);
					}
			}
			else if (open) findbar.close(true);
	},
	configurable: true,
	get() {
			delete this.removeAttribute;
			return noop;
	},
	removeAttr(findbar) {
			findbar.removeAttribute("noanim");
	},
	get e() {
			delete this.e;
			return this.e = new Event("input");
	}
}, false, gBrowser.tabContainer || 1))(() => {});