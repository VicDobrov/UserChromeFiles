(csw => { // FIX new UCF
	window[csw.replace("ts", window[csw] == this ? "t" : "t_all")] = this;
	this.unloadlisteners = {push: key => this.setUnloadMap(key, {
		apply: () => this[key].destructor()
	})};
})("ucf_custom_scripts_win");