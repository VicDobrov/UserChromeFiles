// Скрипт для документов всех окон [ChromeOnly]
var ucf_custom_script_all_win = {
	initialized: false,
	get unloadlisteners() {
		delete this.unloadlisteners;
		window.addEventListener("unload", this, { once: true });
		return this.unloadlisteners = [];
	},
	load() {
		if (this.initialized)
			return;
		this.initialized = true;
		/* ************************************************ */

		/* ************************************************ */
	},
	handleEvent(e) {
		this[e.type](e);
	},
	unload() {
		this.unloadlisteners.forEach(str => {
			try {
				this[str].destructor();
			} catch (e) {}
		});
	}
};
/* ************************************************ */
