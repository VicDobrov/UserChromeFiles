try {CustomizableUI.createWidget({
	label: "ПАРОЛИ/КУКИ",
	tooltiptext: "Клик мыши:	Пароли\nПравый:		Куки",
	id: "ucf-logins-sitedata",
	localized: false,
	onCreated(btn) {
		btn._handleClick = btn.oncontextmenu = e => this.view(e, btn.ownerGlobal);
		btn.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAADAElEQVR4XqXPW4iV5RoH8N/3rm/WrEEosMOFxkbCsjAKydhetDtAdKDDpi5MiUCmMCeJmKEukjaDaEaEdJFt6iq8iAKjEzXYkZQEg0myHEubyjyw2zLYOKZrWuvzfVrilTWI4g/+PHf/53lMKQ5dE+KuEHOdk5VxncHY3Zm/WR0TPu9M8Y3BmOOs3RL/sjJCVOtEvgSsin9YHRusjFZvnO21q2OPlbHGVP4Tb1ry/2GnEj8oYlgx1as3dHLMnVH/y5IEPolZ1kRlfVwOIgqnEwstiqt96jRijrFY6FaAeF09PjMn1pvhb/pjXSc7DUafxaOP693X78FOev/X7+Gxfg/seczymNQX90Ls92Ts8kuMaMauNB7DPogtZkGh96eNmvk2GSoaDWR0kdskVIlswqaxmbF7/jJ7PG8S127ElTSfYGTDAfNdVVi4u1JTAyllOVPmRAJyOi7lmvGjq+K9eat8qyWXNKtswdbiD//MqLoP3d7t/Q/XJN1lU0rklEGWVKjyhJzJVU0Lk8e+NOx2NVQlSTK6WLffUqY0fUV2qSVJJUApTqYdUuMpr19xPo2XlAmJA/vajpoQkLNaTzj4M9sv1+MZxlZDV1JPhRJSgYITL9aGQDbkj5Ky52U7F31kuntOXpdIQXcjNMeyTU9Xvv84Oea1EgEqlE6UdWm1B91x4H7yq3q8Yf3MvtjhOQxoJZKCXEi1wrQGPUXNtOOjZrdWlihAAuQ2ZXmBkeaFLvruNV/dPRC7rNU0QKJEUqglUvuwMlPLQ8IjReFIqZVDghwgdZHzDHtn/2qvgdiWXtL2qCRr1ZNy8rCazca9YMKopijusx+gVAoJlULOVJC+gNjvFeN5qVzPKjQquv23uMwKU5NI56kSJMpSrrP317Wxrf5vBy3VapBTInO4Wmq2Z50iCgAo9O5bJ+fljiPhyO9s33p9DD00T7v+otyF5rhafruYq9cZWTY217LxG/QdWTAcbo4tihjRHztEfC3iRwPOVbzj4njXjfGWm2KzhjP0J4ZWbh8gktVzAAAAAElFTkSuQmCC");
	},
	view(e, win) {
		if (e && (e.ctrlKey || e.shiftKey)) return;

		var uri = win.gBrowser.selectedBrowser.currentURI;
		try {
			var url = win.ReaderMode.getOriginalUrl(uri.spec);
			if (url) uri = Services.io.newURI(url);
		} catch {}

		try {var tld = Services.eTLD.getBaseDomain(uri);}
		catch {var tld = uri.asciiHost;}
		e ? this.viewCookies(tld, win) : this.viewPasswords(tld, uri, win);
		return false;
	},
	viewPasswords(tld, uri, win) {
		try {
			tld = Services.io.newURI(`${uri.scheme}://${tld}`).displayHost;
		} catch {}

		var params = new win.URLSearchParams({...(tld && {filter: tld})});
		var gb = win.gBrowser;
		var separator = params.toString() ? "?" : "";
		var tabToSelect, url = `about:logins${separator}${params}`;

		for (var tab of gb.visibleTabs) {
			var {spec} = tab.linkedBrowser.currentURI;
			if (!spec.startsWith("about:logins")) continue;

			if (spec != url) {
				var pending = tab.hasAttribute("pending");
				if (pending) gb.selectedTab = tab;
				tab.linkedBrowser.loadURI(	url, { triggeringPrincipal: tab.nodePrincipal} );
				if (pending) return;
			}
			tabToSelect = tab;
			break;
		}
		gb.selectedTab = tabToSelect || gb.addTrustedTab(url);
	},
	async viewCookies(tld, window) {
		var notFound, wt = "Browser:SiteDataSettings";
		var url = "chrome://browser/content/preferences/dialogs/siteDataSettings.xhtml";
		var win = Services.wm.getMostRecentWindow(wt);

		if (!win) {
			notFound = true;
			await window.SiteDataManager.updateSites();
			win = window.openDialog(url, wt, "chrome,dialog=no,centerscreen,resizable");

			var e = await new Promise(resolve =>
				win.windowRoot.addEventListener("DOMContentLoaded", resolve, {once: true})
			);
			win = e.target.ownerGlobal;
		}
		var doc = win.document, de = doc.documentElement;
		de.setAttribute("persist", "screenX screenY width height");
		if (notFound) {
			de.setAttribute("windowtype", wt);
			var xs = Services.xulStore, {id} = de;

			var x = xs.getValue(url, id, "screenX"), y = xs.getValue(url, id, "screenY");
			x && de.setAttribute("screenX", x); y && de.setAttribute("screenY", y);
		}
		var sb = doc.querySelector("#searchBox");
		sb.inputField.setUserInput(tld);
		setTimeout(() => sb.editor.selection.collapseToEnd(), 50);
		notFound || win.focus();
	}

});} catch(ex) {Cu.reportError(ex);}