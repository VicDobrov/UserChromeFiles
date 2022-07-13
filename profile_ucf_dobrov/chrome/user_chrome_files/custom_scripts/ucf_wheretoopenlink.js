var ucf_where_to_open_link = { // https://forum.mozilla-russia.org/viewtopic.php?pid=784757#p784757
	browser() {
		window.whereToOpenLink = eval(`(${`${window.whereToOpenLink}`.replace(/^.*whereToOpenLink/, "function whereToOpenLink").replace(/(return\s*"current"\s*;)(?![\s\S]*\1)/g, `
			try {
				let node;
				if (gBrowser.selectedTab.isEmpty ||
					!((node = arguments[0].composedTarget) && node.closest("#bookmarksMenuPopup,#BMB_bookmarksPopup,#PanelUI-bookmarks,#goPopup,#PanelUI-history,.search-go-button")) ||
					(node._placesNode && node._placesNode.uri.startsWith("javascript")))
					return "current";
				return "tab";
			} catch(e) { return "current"; };
		`)})`);
	},
	places() {
		window.whereToOpenLink = eval(`(${`${window.whereToOpenLink}`.replace(/^.*whereToOpenLink/, "function whereToOpenLink").replace(/(return\s*"current"\s*;)(?![\s\S]*\1)/g, `
			try {
				if (window.opener && window.opener.gBrowser.selectedTab.isEmpty)
					return "current";
				let ev = arguments[0], tree = ev.composedTarget.parentNode, row = tree.view.nodeForTreeIndex(tree.getCellAt(ev.clientX, ev.clientY).row);
				if (row.uri.startsWith("javascript"))
					return "current";
				return "tab";
			} catch(e) { return "current"; };
		`)})`);
	},
	bookmarksSidebar() {
		this.historySidebar();
	},
	historySidebar() {
		window.whereToOpenLink = eval(`(${`${window.whereToOpenLink}`.replace(/^.*whereToOpenLink/, "function whereToOpenLink").replace(/(return\s*"current"\s*;)(?![\s\S]*\1)/g, `
			try {
				if ((window._ucf_top || (window._ucf_top = Services.wm.getMostRecentWindow("navigator:browser"))).gBrowser.selectedTab.isEmpty)
					return "current";
				let ev = arguments[0], tree = ev.composedTarget.parentNode, row = tree.view.nodeForTreeIndex(tree.getCellAt(ev.clientX, ev.clientY).row);
				if (row.uri.startsWith("javascript"))
					return "current";
				return "tab";
			} catch(e) { return "current"; };
		`)})`);
	},
};