(async sep => { // Dumby: https://forum.mozilla-russia.org/viewtopic.php?pid=801497#p801497
	if (!sep) return;
	var key = "hasRemoveTransaction";
	var g = Cu.import("resource://gre/modules/PlacesTransactions.jsm", {});
	var raws = (g.lazy || g).TransactionsHistory?.proxifiedToRaw;
	if (raws) g = raws;
	if (!g[key]) {
		if (!raws) {
			Services.scriptloader.loadSubScript(`data:,this.${key}=TransactionsHistory.proxifiedToRaw;`, g);
			raws = g[key];
		}
		g[key] = entry => {
			for(var tr of entry)
				if (raws.get(tr) instanceof PlacesTransactions.Remove)
					return true;
		}
	}
	var menuitem = document.createXULElement("menuitem");
	for(var args of Object.entries({
		label: "★Восстановить удалённое", id: "placesCmd_undoRemove",
		closemenu: "single",
		oncommand: "PlacesTransactions.undo().catch(Cu.reportError);"
	}))
	menuitem.setAttribute(...args);

	var desc = Object.getOwnPropertyDescriptor(XULElement.prototype, "hidden");
	var {set} = desc;
	desc.set = () => {
		var entry = PlacesTransactions.topUndoEntry;
		set.call(menuitem, !entry || !g[key](entry));
	}
	Object.defineProperty(menuitem, "disabled", {});
	Object.defineProperty(menuitem, "hidden", desc);
	sep.before(menuitem);
})(document.getElementById("placesContext_deleteSeparator"));