(async sep => { //закладку в Sidebar Tabs
	if (!sep) return;
	var popup = sep.parentNode;
	var menuitem = document.createXULElement("menuitem");
	for(var args of Object.entries({
		label: "Открыть в Sidebar Tabs",
		id: "placesContext_open:sidebartabs",
		"node-type": "link", "selection-type": "single"
	}))
	with(menuitem)
		setAttribute(...args), className = "menuitem-iconic",
		setAttribute("image", "resource://ucf_sidebar_tabs"),
		addEventListener("command", () => {
		var {uri} = popup.triggerNode._placesNode || popup._view.selectedNode;
		Services.wm.getMostRecentBrowserWindow().ucf_custom_script_win.ucf_sidebar_tabs.setPanel(0, uri);
	});
	sep.before(menuitem);
})(document.querySelector("menupopup#placesContext > #placesContext_openSeparator"));
