// Скрипт для документа окна браузера [ChromeOnly]
var ucf_custom_script_win = {
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

		// Здесь может быть ваш код который сработает по событию "load"

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
	},
};
/* ************************************************ */

// Здесь может быть ваш код который сработает по событию "DOMContentLoaded"