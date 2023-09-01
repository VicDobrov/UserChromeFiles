try {(() => { var label = "Дополнения",
tooltiptext = "ЛКМ: Меню дополнений\nСКМ: Отладка дополнений\nПКМ: Открыть менеджер дополнений",
id = "ucf-aom-button",
img = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 48 48'><g><rect x='0' y='0' width='48' height='48' rx='3' ry='3' style='fill:rgb(0, 120, 173);'/><path style='opacity:0.25;fill:black;' d='M 24,4.5 18,12 3,23.7 12,32.7 3.9,44.1 7.8,48 H 45 C 46.7,48 48,46.7 48,45 V 26.1 L 34.8,12.9 31.8,12.3 Z'/><path style='fill:white;' d='M 19.88,3 C 16.93,3 14.55,4.662 14.55,6.701 14.63,7.474 15.11,8.438 15.37,8.762 16.59,10.41 16.59,11.44 16.29,12.06 H 6.299 C 4.476,12.06 3,13.53 3,15.35 V 23.68 C 3.625,24 4.65,24 6.299,22.77 6.625,22.52 7.587,22.02 8.363,21.94 10.4,21.94 12.06,24.35 12.06,27.29 12.06,30.24 10.4,32.65 8.363,32.65 7.725,32.63 6.774,32.07 6.299,31.82 4.65,30.59 3.625,30.59 3,30.91 V 41.71 C 3,43.53 4.476,45 6.299,45 H 19.58 C 19.88,44.38 19.88,43.35 18.65,41.71 18.4,41.38 17.91,40.42 17.82,39.65 17.82,37.6 20.23,35.94 23.18,35.94 26.14,35.94 28.55,37.6 28.55,39.65 28.53,40.28 27.97,41.23 27.71,41.71 26.47,43.35 26.47,44.38 26.79,45 H 32.65 C 34.47,45 35.96,43.53 35.96,41.71 V 32.55 C 36.56,32.23 37.59,32.23 39.23,33.47 39.72,33.73 40.68,34.29 41.29,34.29 43.35,34.29 45,31.91 45,28.94 45,25.99 43.35,23.59 41.29,23.59 40.54,23.67 39.58,24.17 39.23,24.41 37.59,25.65 36.56,25.65 35.96,25.33 V 15.35 C 35.96,13.53 34.47,12.06 32.65,12.06 H 23.49 C 23.19,11.44 23.19,10.41 24.41,8.762 24.66,8.287 25.22,7.337 25.23,6.713 25.23,4.662 22.85,3 19.88,3' /></g></svg>",
checked = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='16' width='16'><path d='M 3,7 7,11 13,5' style='fill:none;stroke:white;stroke-width:1;'/></svg>",
show_version = true,
show_description = true,
user_permissions = true,
show_hidden = true,
show_disabled = true,
enabled_first = true,
exceptions_listset = new Set([
]),
exceptions_type_listset = new Set([
]);
if (!("AddonManager" in this))
	ChromeUtils.defineModuleGetter(this, "AddonManager", "resource://gre/modules/AddonManager.jsm");
if (!("GlobalManager" in this))
	XPCOMUtils.defineLazyGetter(this, "GlobalManager", () =>
		ChromeUtils.import("resource://gre/modules/ExtensionParent.jsm").ExtensionParent.GlobalManager
);
var extensionOptionsMenu = {
	get alertsService() {
		delete this.alertsService;
		return this.alertsService = Cc["@mozilla.org/alerts-service;1"].getService(Ci.nsIAlertsService);
	},
	get clipboardHelp() {
		delete this.clipboardHelp;
		return this.clipboardHelp = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper);
	},
	get exceptions_type_listarr() {
		delete this.exceptions_type_listarr;
		var arr = ["extension", "theme", "locale", "dictionary"];
		if (!exceptions_type_listset.size)
			return this.exceptions_type_listarr = arr;
		return this.exceptions_type_listarr = arr.filter(type => !exceptions_type_listset.has(type));
	},
	async populateMenu(e) {
		var popup = e.target, doc = e.view.document;
		var addons = await AddonManager.getAddonsByTypes(this.exceptions_type_listarr);
		var addonsMap = new WeakMap(),
		setAttributesMenu = (mi, addon, extension) => {
			var permissions, uuid,
			props = {
				label: `${addon.name}${show_version ? ` ${addon.version}` : ""}`,
				class: "menuitem-iconic",
				tooltiptext: `${(show_description && addon.description) ? `${addon.description}\n` : ""}ID: ${addon.id}${addon.isActive && (uuid = extension?.uuid) ? `\nUUID: ${uuid}` : ""}${(user_permissions && (permissions = addon.userPermissions?.permissions)?.length) ? `\nРазрешения: ${permissions.join(", ")}` : ""}\n${addon.optionsURL ? "\nЛКМ: Настройки" : ""}\nCКМ: Копировать ID${uuid ? "\nShift+ЛКМ: Копировать UUID" : ""}${addon.creator?.url ? "\nCtrl+Shift+ЛКМ: Автор" : ""}${addon.homepageURL ? "\nCtrl+ЛКМ: Домашняя страница" : ""}${!addon.isBuiltin ? "\nCtrl+СКМ: Просмотр источника" : ""}\nShift+СКМ: Просмотр источника во вкладке\nПКМ: Включить/Отключить${(!addon.isSystem && !addon.isBuiltin) ? "\nCtrl+ПКМ: Удалить" : ""}`,
			};
			for (let p in props)
				mi.setAttribute(p, props[p]);
			if (addon.iconURL)
				mi.setAttribute("image", addon.iconURL);
			var cls = mi.classList;
			addon.isActive ? cls.remove("ucf-disabled") : cls.add("ucf-disabled");
			addon.optionsURL ? cls.remove("ucf-notoptions") : cls.add("ucf-notoptions");
			addon.isSystem ? cls.add("ucf-system") : cls.remove("ucf-system");
			cls.add(`ucf-type-${addon.type}`);
		};
		addons.filter(a => !(a.iconURL || "").startsWith("resource://search-extensions/")).sort((a, b) => {
			var ka = `${(enabled_first ? a.isActive ? "0" : "1" : "")}${a.type || ""}${a.name.toLowerCase()}`;
			var kb = `${(enabled_first ? b.isActive ? "0" : "1" : "")}${b.type || ""}${b.name.toLowerCase()}`;
			return (ka < kb) ? -1 : 1;
		}).forEach(addon => {
			if (!exceptions_listset.has(addon.id) &&
				(!addon.hidden || show_hidden) &&
				(!addon.userDisabled || show_disabled)) {
				let extension = GlobalManager.extensionMap.get(addon.id),
				mi = doc.createXULElement("menuitem");
				setAttributesMenu(mi, addon, extension);
				mi._Addon = addon;
				mi._Extension = extension;
				popup.append(mi);
				addonsMap.set(addon, mi);
			}
		});
		var click = e => {
			e.preventDefault();
			e.stopPropagation();
			this.handleClick(e);
		};
		popup.addEventListener("click", click);
		var listener = {
			onEnabled: addon => {
				var mi = addonsMap.get(addon);
				if (mi)
					setAttributesMenu(mi, addon, mi._Extension);
			},
			onDisabled: addon => {
				listener.onEnabled(addon);
			},
			onInstalled: addon => {
				var extension = GlobalManager.extensionMap.get(addon.id),
				mi = doc.createXULElement("menuitem");
				setAttributesMenu(mi, addon, extension);
				mi._Addon = addon;
				mi._Extension = extension;
				popup.prepend(mi);
				addonsMap.set(addon, mi);
			},
			onUninstalled: addon => {
				var mi = addonsMap.get(addon);
				if (mi) {
					mi.remove();
					addonsMap.delete(addon);
				}
			},
		};
		AddonManager.addAddonListener(listener);
		popup.addEventListener("popuphiding", () => {
			AddonManager.removeAddonListener(listener);
			popup.removeEventListener("click", click);
			addonsMap = null;
			for (let item of popup.querySelectorAll("menuitem"))
				item.remove();
		}, { once: true });
	},
	handleClick(e) {
		var win = e.view, mi = e.target;
		if (!("_Addon" in mi) || !("_Extension" in mi))
			return;
		var addon = mi._Addon, extension = mi._Extension;
		switch (e.button) {
			case 0:
				if (e.ctrlKey && e.shiftKey) {
					if (addon.creator?.url)
						win.gBrowser.selectedTab = this.addTab(win, addon.creator.url);
				} else if (e.ctrlKey) {
					win.gBrowser.selectedTab = this.addTab(win, addon.homepageURL);
				} else if (e.shiftKey) {
					if (extension?.uuid) {
						this.clipboardHelp.copyString(extension.uuid);
						win.setTimeout(() => {
							this.alertsService.showAlertNotification(`${img}`, "UUID в буфере обмена!", extension.uuid, false);
						}, 100);
					}
				} else if (addon.isActive && addon.optionsURL)
					this.openAddonOptions(addon, win);
				win.closeMenus(mi);
				break;
			case 1:
				if (e.ctrlKey) {
					if (!addon.isBuiltin)
						this.browseDir(addon);
				} else if (e.shiftKey)
					this.browseDir(addon, win);
				else if (addon.homepageURL) {
					this.clipboardHelp.copyString(addon.id);
					win.setTimeout(() => {
						this.alertsService.showAlertNotification(`${img}`, "ID в буфере обмена!", addon.id, false);
					}, 100);
				}
				win.closeMenus(mi);
				break;
			case 2:
				if (!e.ctrlKey) {
					let endis = addon.userDisabled ? "enable" : "disable";
					if (addon.id == "screenshots@mozilla.org")
						Services.prefs.setBoolPref("extensions.screenshots.disabled", !addon.userDisabled);
					else if (addon.id == "webcompat-reporter@mozilla.org")
						Services.prefs.setBoolPref("extensions.webcompat-reporter.enabled", addon.userDisabled);
					addon[endis]({ allowSystemAddons: true });
				} else if (!addon.isSystem && !addon.isBuiltin) {
					win.closeMenus(mi);
					if (Services.prompt.confirm(win, null, `Удалить ${addon.name}?`))
						addon.uninstall();
				}
			break;
		}
	},
	openAddonOptions(addon, win) {
		switch (addon.optionsType) {
			case 5:
				win.BrowserOpenAddonsMgr(`addons://detail/${encodeURIComponent(addon.id)}/preferences`);
				break;
			case 3:
				win.switchToTabHavingURI(addon.optionsURL, true);
				break;
		}
	},
	browseDir(addon, win) {
		try {
			if (!win) {
				let file = Services.io.getProtocolHandler("file")
				.QueryInterface(Ci.nsIFileProtocolHandler)
				.getFileFromURLSpec(addon.getResourceURI().QueryInterface(Ci.nsIJARURI).JARFile.spec);
				if (file.exists())
					file.launch();
			} else
				win.gBrowser.selectedTab = this.addTab(win, addon.getResourceURI().spec);
		} catch (e) {}
	},
	addTab(win, url, params = {}) {
		params.triggeringPrincipal = Services.scriptSecurityManager.getSystemPrincipal();
		params.relatedToCurrent = true;
		return win.gBrowser.addTab(url, params);
	},
};
CustomizableUI.createWidget({
	id: id,
	type: "custom",
	label: label,
	tooltiptext: tooltiptext,
	localized: false,
	defaultArea: CustomizableUI.AREA_NAVBAR,
	onBuild(doc) {
		var btn = doc.createXULElement("toolbarbutton"), win = doc.defaultView,
		props = {
			id: id,
			label: label,
			context: "",
			tooltiptext: tooltiptext,
			type: "menu",
			class: "toolbarbutton-1 chromeclass-toolbar-additional",
		};
		for (let p in props)
			btn.setAttribute(p, props[p]);
		btn.addEventListener("click", e => {
			if (e.button == 1)
				e.view.switchToTabHavingURI("about:debugging#/runtime/this-firefox", true, { ignoreFragment: "whenComparing", triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(), });
			else if (e.button == 2)
				e.view.BrowserOpenAddonsMgr("addons://list/extension");
		});
		var mp = doc.createXULElement("menupopup");
		mp.id = `${id}-popup`;
		mp.addEventListener("contextmenu", e => {
			e.preventDefault();
			e.stopPropagation();
		});
		mp.addEventListener("popupshowing", e => {
			extensionOptionsMenu.populateMenu(e);
		});
		btn.append(mp);
		var btnstyle = "data:text/css;charset=utf-8," + encodeURIComponent(`
			#${id}, #${id}-popup menuitem {
				list-style-image: url("${img}") !important;
			}
			#${id}-popup menuitem::after {
				display: -moz-box !important;
				content: "" !important;
				height: 16px !important;
				width: 16px !important;
				padding: 0 !important;
				border: 1px solid rgb(0, 116, 232) !important;
				border-radius: 0 !important;
				background-repeat: no-repeat !important;
				background-position: center !important;
				background-size: 16px !important;
				background-color: rgb(0, 116, 232) !important;
				background-image: url("${checked}") !important;
				opacity: 1 !important;
			}
			#${id}-popup menuitem.ucf-disabled::after {
				border-color: currentColor !important;
				background-color: transparent !important;
				background-image: none !important;
				opacity: .6 !important;
			}
			#${id}-popup menuitem.ucf-disabled > label,
			#${id}-popup menuitem.ucf-notoptions > label {
				opacity: .6 !important;
			}
			#${id}-popup menuitem.ucf-system > label {
				text-decoration: underline !important;
				text-decoration-style: dotted !important;
			}
			#${id}-popup menuitem > label {
				margin-inline-end: 0 !important;
			}
			#${id}-popup menuitem > .menu-accel-container {
				display: -moz-box !important;
				padding: 4px !important;
				margin: 0 !important;
				opacity: 1 !important;
			}
			#${id}-popup menuitem > .menu-accel-container .menu-iconic-accel {
				display: -moz-box !important;
				margin: 0 !important;
				height: 8px !important;
				width: 8px !important;
				border-radius: 4px !important;
				background-color: transparent !important;
				opacity: 1 !important;
				font-size: 0 !important;
			}
			#${id}-popup menuitem.ucf-type-dictionary > .menu-accel-container .menu-iconic-accel {
				background-color: rgb(227, 27, 93) !important;
			}
			#${id}-popup menuitem.ucf-type-locale > .menu-accel-container .menu-iconic-accel {
				background-color: rgb(48, 172, 55) !important;
			}
			#${id}-popup menuitem.ucf-type-theme > .menu-accel-container .menu-iconic-accel {
				background-color: rgb(219, 106, 0) !important;
			}
		`);
		try {
			win.windowUtils.loadSheetUsingURIString(btnstyle, win.windowUtils.USER_SHEET);
		} catch (e) {}
		return btn;
	},
});
})();} catch (e) {}