(popup => { //активация вкладки равного URL вместо открытия закладки в новой вкладке
	var puu = `/PlacesUIUtils.${
		parseInt(Services.appinfo.platformVersion) >= 104 ? "sys.mjs" : "jsm"
	}:`;
	var skipRe = /\nopenMultipleLinksInTabs@|\/historySidebar.xhtml:/;
	var treeRe = /@chrome:\/\/browser\/content\/places\/(places|bookmarksSidebar)\.xhtml:/;

	var timestamp = 0, activate = 0, placesNode;

	addEventListener("activate", () => activate = Cu.now());
	addEventListener("DOMMenuItemActive", e => placesNode = e.target._placesNode);

	var check = url => {
		for(var win of BrowserWindowTracker.orderedWindows)
			if (win.toolbar.visible) for(var tab of (win.gBrowser?.tabs || []))
				if (tab.linkedBrowser?.currentURI?.spec == url)
					return win.focus(), win.gBrowser.selectedTab = tab;
	}
	var sels = [
		"menuitem[_moz-menuactive]",
		"#panelMenu_bookmarksMenu > toolbarbutton:is(:active,:focus)",
		"toolbarbutton.bookmark-item:is(:hover,:-moz-focusring)"
	];
	addEventListener("TabBrowserInserted", e => {
		if (timestamp - (timestamp = Cu.now()) > -100) return;

		var stack = Components.stack.formattedStack;
		if (!stack.includes(puu) || skipRe.test(stack)) return;

		if (treeRe.test(stack)) {
			var win;
			if (RegExp.$1.startsWith("p") && timestamp - activate < 500)
				win = Services.wm.getMostRecentWindow("Places:Organizer");
			var view = (win || window).document.commandDispatcher.focusedElement?.view;
			if (view) var node = view.nodeForTreeIndex(view.selection.currentIndex);
		} else {
			for(var node of sels) if (node = document.querySelector(node)) break;
			node = node?._placesNode || popup._view?.selectedNode || placesNode;
		}
		if (node && PlacesUtils.nodeIsBookmark(node) && check(node.uri)) {
			var tab = e.target, br = tab.linkedBrowser;
			br.fixupAndLoadURIString = () => {
				delete br.fixupAndLoadURIString;
				gBrowser.removeTab(tab);
			}
		}
	}, true, gBrowser.tabContainer);

})(document.getElementById("placesContext"));