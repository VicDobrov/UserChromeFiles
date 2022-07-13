(async sep => { // https://forum.mozilla-russia.org/viewtopic.php?pid=798678#p798678
	if (!sep) return;

	var key = "hasRemoveTransaction";
	var g = Cu.import("resource://gre/modules/PlacesTransactions.jsm", {});
	if (!g[key]) {
		Services.scriptloader.loadSubScript(
			`data:,this.${key}=TransactionsHistory.proxifiedToRaw;`, g
		);
		var raws = g[key];
		g[key] = entry => {
			for(var tr of entry)
				if (raws.get(tr) instanceof PlacesTransactions.Remove)
					return true;
		}
	}
	var menuitem = document.createXULElement("menuitem");
	for(var args of Object.entries({
		closemenu: "single",
		class: "menuitem-iconic",
		id: "placesCmd_undoRemove",
		label: "Восстановить удалённое",
		oncommand: "PlacesTransactions.undo().catch(Cu.reportError);",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB60lEQVR4XpXTTUhUURTA8f+77zkzTfMcZyRp0UKkDwJbRZsgog+ooCIkMEIXCi4zEGwVMvRFqEWFhJKLwCKmBIm02oy0KKgWSpS1aRG0CKyZcXJmfM95MzccvHB7ZNQPLtzLvYdzOO8d48fB5gAwALQBcf5NFhgDegXQD3TrwUZ4PWbj5tV9BCMQxCe2GnNBAO0ohgCgtn+UujsThE6cJnbvOdHbSYxgCCNi49MlVOZIT4L6ZzOEu3pAmFRJSSWbpjL/DfvSEHXD4/jEBQCWRfBwC5gmoeOn+NnbSWF4ALFhI97cLKX3M3gf3+FOP60mEtEYigWA5+E8fkDwSAvOkySRc1cI7N6HjnIZZ+I+RjQOpoWy8hUkGvv8IJXFHMWRQcxNjdReHcHQMhZuXsSZfIgi0FhbthPYe4ji3SGks4T3+RPu9BS6cMcZsCwUC03Nrj0AWE1bKc2+AcPAbNpG6e1L8tf6qGS+42ehEXYUADtxAzc1Vf0XanbsJNu6n9CBOdadnEdZGm+g+KgBVnqgVv56Qv5B9U6mUe9+Ows07qsUspjnb+qTH9AJNDKXpXDrMkjJWtKtzegEkEHjpiZZ7Oum/PXLWhXoVWQEMIbP8usXLHQeY6HjKLmzbappKlCdAUb1cW4HYv87zr8AgePH1FUvVbAAAAAASUVORK5CYII=",
	}))
		menuitem.setAttribute(...args);

	var desc = Object.getOwnPropertyDescriptor(XULElement.prototype, "hidden");
	var {set} = desc;
	desc.set = () => {
		var entry = PlacesTransactions.topUndoEntry;
		var vis = entry && g[key](entry);
		vis && menuitem.removeAttribute("disabled");
		set.call(menuitem, !vis);
	}
	Object.defineProperty(menuitem, "hidden", desc);
	sep.before(menuitem);
})(document.getElementById("placesContext_deleteSeparator"));
