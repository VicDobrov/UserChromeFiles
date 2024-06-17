(async (sep, key) => { if (!sep) return; //Undo delete bookmarks UCF2024+
	var raws = UcfPrefs.dbg.ref("lazy", PlacesTransactions.undo).TransactionsHistory.proxifiedToRaw;
	raws[key] ??= entry => {
		for(var transaction of entry) {
			if (raws.get(transaction) instanceof PlacesTransactions.Remove)
				return true;}
	}
	var menuitem = document.createXULElement("menuitem");
	for(var args of Object.entries({
		label: "★Восстановить удалённое", closemenu: "single",
		id: "placesCmd_undoRemove",
		oncommand: "PlacesTransactions.undo().catch(Cu.reportError);",
	}))
		menuitem.setAttribute(...args);
	var desc = Object.getOwnPropertyDescriptor(XULElement.prototype, "hidden");
	var {set} = desc;
	desc.set = () => {
		var entry = PlacesTransactions.topUndoEntry;
		set.call(menuitem, !entry || !raws[key](entry));
	}
	Object.defineProperty(menuitem, "disabled", {});
	Object.defineProperty(menuitem, "hidden", desc);
	sep.before(menuitem);
})(document.getElementById("placesContext_deleteSeparator"), "hasRemoveTransaction");