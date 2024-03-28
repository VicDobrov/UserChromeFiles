(async topic => { // В фоне [System Principal]
	var imp = (m, n = m) => Cu.import(`resource://gre/modules/${m}.jsm`, {})[n];
	var exporter = {
		get dps() {
			delete this.dps;
			return this.dps = imp("DownloadPaths");
		},
		get exporter() {
			delete this.exporter;
			return this.exporter = imp("BookmarkHTMLUtils", "BookmarkExporter");
		},
		async export(popup) {
			var win = popup.ownerGlobal, tn = popup.triggerNode;
			var node, pu = win.PlacesUtils, bm = pu.bookmarks;

			if (tn.nodeName == "treechildren") node = popup._view.selectedNode;
			else if (tn.id == "OtherBookmarks")
				node = {bookmarkGuid: bm.unfiledGuid, title: tn.getAttribute("label")};
			else node = tn._placesNode || popup._view.result.root;

			var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
			fp.init(win, parseInt(Services.appinfo.platformVersion) > 113
				? win.PlacesUIUtils.promptLocalization.formatValueSync("places-bookmarks-export")
				: win.PlacesUIUtils.getString("EnterExport"), fp.modeSave);
			fp.appendFilters(fp.filterHTML);
			fp.defaultString = (node.title ? this.dps.sanitize(node.title) : "untitled") + ".html";

			if (await new Promise(fp.open) == fp.returnCancel) return;
			var tree = await pu.promiseBookmarksTree(pu.getConcreteItemGuid(node), {includeItemIds: true});
			tree.title = bm.getLocalizedTitle(tree);
			var bookmarks = {children: [
				{root: "toolbarFolder"},
				{root: "unfiledBookmarksFolder"},
				{root: "bookmarksMenuFolder", children: [tree], guid: bm.menuGuid}
			]};
			new this.exporter(bookmarks).exportToFile(fp.file.path);
		},
		observe(doc) {
			var popup = doc.querySelector("menupopup#placesContext");
			if (!popup) return;

			var menuitem = (doc.createXULElement || doc.createElement).call(doc, "menuitem");
			for(var args of Object.entries({
				label: "Экспорт папки в HTML",
				selection: "folder",
				"node-type": "folder",
				"selection-type": "single|none",
				id: "placesContext_exportFolder",
				oncommand: "exporter.export(parentNode);"
			}))
				menuitem.setAttribute(...args);
			menuitem.exporter = this;
			doc.getElementById("placesContext_openSeparator").before(menuitem);
		}
	};
	Services.obs.addObserver(exporter, topic);
	Services.obs.addObserver(function quit(s, t) {
		Services.obs.removeObserver(quit, t);
		Services.obs.removeObserver(exporter, topic);
	}, "quit-application-granted");
})("chrome-document-loaded");