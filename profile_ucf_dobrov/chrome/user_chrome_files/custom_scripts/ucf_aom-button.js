try {(() => { var label = "Дополнения",
tooltiptext = "ЛКМ: Меню дополнений\nСКМ: Отладка дополнений\nПКМ: Открыть менеджер дополнений",
id = "ucf-aom-button",
img = "data:image/webp;base64,UklGRh4BAABXRUJQVlA4TBIBAAAvD8ADELfBtpEkRXPsXf4p3pnPOJ0G20aSFPXdPVP+wb33HjPDMGgkSdEeenj/7pj5d9pM2zaG1L/8d49RAzFk+OFHkAFI2IebP3l3/DtebtGLjgp2n3+J/Mr/IBQfnLvW13v8/jGZdeu73Tm/lvqgN+hHY5Szb8a7OX8AARiXqSdsG1MFDrviB4hxCsSfIMOPQPyW5ciYGmXRRSlIcpDAYWTbSnNxiYcQl/vjjtN/b99aiOj/BFxpeSPJ08RPDyrl0QN2FxPOEP8/F9UIWmcuJBi6L2FTvASZrDOD6in4KFqNkweLF3mvHRWAsOB0v4Q2wqAgDN3fttNsvv0QblEUKrcpilwzBoBVUQfIpNv5XRiX",
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
				tooltiptext: `${(show_description && addon.description) ? `${addon.description}\n` : ""}ID: ${addon.id}${addon.isActive && (uuid = extension?.uuid) ? `\nUUID: ${uuid}` : ""}${(user_permissions && (permissions = addon.userPermissions?.permissions)?.length) ? `\nРазрешения: ${permissions.join(", ")}` : ""}\n${addon.optionsURL ? "\nЛКМ: Настройки" : ""}\nПКМ: Включить/Отключить\nCКМ: Копировать ID${uuid ? "\nShift+ЛКМ: Копировать UUID" : ""}${addon.creator?.url ? "\nCtrl+Shift+ЛКМ: Автор" : ""}${addon.homepageURL ? "\nCtrl+ЛКМ: Домашняя страница" : ""}${!addon.isBuiltin ? "\nCtrl+СКМ: Просмотр источника" : ""}\nShift+СКМ: Просмотр источника во вкладке${(!addon.isSystem && !addon.isBuiltin) ? "\nCtrl+ПКМ: Удалить" : ""}`,
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
				height: 16px !important; width: 16px !important;
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
				height: 8px !important; width: 8px !important;
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