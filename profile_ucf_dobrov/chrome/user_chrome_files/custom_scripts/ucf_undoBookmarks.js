(async sep => { // Dumby: https://forum.mozilla-russia.org/viewtopic.php?pid=801497#p801497

	if (!sep) return;
	var key = "hasRemoveTransaction";
	var g = Cu.import("resource://gre/modules/PlacesTransactions.jsm", {});
	var raws = (g.lazy || g).TransactionsHistory?.proxifiedToRaw;
	if (raws) g = raws;
	if (!g[key]) {
		if (!raws) {
			Services.scriptloader.loadSubScript(
				`data:,this.${key}=TransactionsHistory.proxifiedToRaw;`, g
			);
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
		label: "Восстановить удалённое", id: "placesCmd_undoRemove",
		closemenu: "single", class: "menuitem-iconic",
		oncommand: "PlacesTransactions.undo().catch(Cu.reportError);",
		image: "data:image/webp;base64,UklGRhoCAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSLAAAAABkGNb27Fn537e2DbmYNvu7QFkDkZv27Y6VqrTp3JS8c7PMUTEBIDgksD/CmZtAutfBq99HcTGMvIXwm5UD7wFEAuIuNVP1bez7hJ/wHCh76rf36r6sNfojYSc6af++74B3HZVj1My8yqbT75U6wSbHh3DAqH+W1cQQ8sktsbYEf6mi4CIB2CEWdUmAAPG4LaoOmX98dfSO70sE/4Zt/E4mWbL34TYtkInEMM/BbAMAFZQOCBEAQAAcAgAnQEqEAAQAAAAACWwAnS6AfgB+gH8ApQH2gS4BwAHk3ewB+qv7AezBcgGMA0QDSbvQZzO/LXsAfxb+Uf2P8xuNA/Sssqf6BSsPAD+/1za6OtWYOTZ19pP2//8HcWVgOQl7edDZhCbHuvCfVR/4fPze28fLJZfLtNXu0tH/TDAP6OVP588Sc6xP6NdPdp4VW8f92u6t1CdK12oRIyW+OPjon9pMFvVvp5rzPnR8HvU7b5pYxcTtsWwfrlP/8ph/dnlmpXnXj6TD/rtayvmHhv0u6Pydv4Prd9j//oqWNv0IjVokbz//tJpwKxVXuxBEaU/7f/pQSFCeryudhJugn/46FleNjKcx0//+5bMfE8gHX//zJ33+Q2upHoK/Xif+Jj/t2frcrr2IsOai76H/XYI4Zwm1rrt//+fXi9mFEfuIGAA"
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