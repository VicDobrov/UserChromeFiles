// Не редактировать!
var { UcfPrefs } = ChromeUtils.import("chrome://user_chrome_files/content/UcfPrefs.jsm");
ChromeUtils.defineModuleGetter(this, "UcfStylesScripts", "chrome://user_chrome_files/content/custom_scripts/CustomStylesScripts.jsm");
ChromeUtils.defineModuleGetter(this, "CustomizableUI", "resource:///modules/CustomizableUI.jsm");
var user_chrome = {
	initPrefsStyles() {
		UcfPrefs.gbranch = Services.prefs.getBranch(UcfPrefs.PREF_BRANCH);
		let branch = Services.prefs.getDefaultBranch(UcfPrefs.PREF_BRANCH);
		branch.setBoolPref("vertical_top_bottom_bar_enable", true);
		branch.setBoolPref("vertical_enable", true);
		branch.setBoolPref("top_enable", true);
		branch.setBoolPref("top_next_navbar", true);
		branch.setBoolPref("bottom_enable", true);
		branch.setBoolPref("vertical_collapsed", false);
		branch.setBoolPref("vertical_bar_start", true);
		branch.setBoolPref("vertical_autohide", false);
		branch.setBoolPref("vertical_mouseenter_sidebar", true);
		branch.setBoolPref("vertical_fullscreen", true);
		branch.setIntPref("vertical_showdelay", 300);
		branch.setIntPref("vertical_hidedelay", 2000);
		branch.setBoolPref("top_collapsed", false);
		branch.setBoolPref("bottom_collapsed", false);
		branch.setBoolPref("custom_styles_all", false);
		branch.setBoolPref("custom_styles_chrome", false);
		branch.setBoolPref("custom_scripts_background", false);
		branch.setBoolPref("custom_scripts_chrome", false);
		branch.setBoolPref("custom_scripts_all_chrome", false);
		branch.setBoolPref("custom_styles_scripts_child", false);
		branch.setStringPref("custom_styles_scripts_groups", "[\"browsers\"]");
		branch.setBoolPref("custom_safemode", true);
		branch.setBoolPref("winbuttons", false);
		branch.setBoolPref("expert", false);
		branch.setBoolPref("debug", false);
		if (UcfPrefs.vertical_top_bottom_bar_enable = UcfPrefs.gbranch.getBoolPref("vertical_top_bottom_bar_enable"))
			this.sheettoolbars(() => {});
		let noSafeMode = true;
		if (UcfPrefs.gbranch.getBoolPref("custom_safemode"))
			noSafeMode = !Services.appinfo.inSafeMode;
		if (noSafeMode) {
			UcfPrefs.custom_scripts_background = UcfPrefs.gbranch.getBoolPref("custom_scripts_background");
			UcfPrefs.custom_scripts_chrome = UcfPrefs.gbranch.getBoolPref("custom_scripts_chrome");
			UcfPrefs.custom_scripts_all_chrome = UcfPrefs.gbranch.getBoolPref("custom_scripts_all_chrome");
			if (UcfPrefs.custom_styles_chrome = UcfPrefs.gbranch.getBoolPref("custom_styles_chrome"))
				(async () => {
					for (let s of UcfStylesScripts.styleschrome)
						s.sheet(() => {});
				})();
			if (UcfPrefs.custom_styles_all = UcfPrefs.gbranch.getBoolPref("custom_styles_all"))
				(async () => {
					for (let s of UcfStylesScripts.stylesall)
						s.sheet();
				})();
			if (UcfPrefs.custom_styles_scripts_child = UcfPrefs.gbranch.getBoolPref("custom_styles_scripts_child"))
				(async () => {
					var actorOptions = {
						child: {
							moduleURI: "chrome://user_chrome_files/content/custom_scripts/CustomStylesScriptsChild.jsm",
							events: {
								DOMWindowCreated: {},
								DOMContentLoaded: {},
								pageshow: {},
							},
						},
						allFrames: true,
						matches: ["about:*", "moz-extension://*/*", "chrome://*/*"],
					};
					var group = UcfPrefs.gbranch.getStringPref("custom_styles_scripts_groups");
					if (group)
						actorOptions.messageManagerGroups = JSON.parse(group);
					ChromeUtils.registerWindowActor("UcfCustomStylesScripts", actorOptions);
				})();
		}
	},
	_aboutPrefs() {
		class AboutUcfPrefs {
			constructor() {}
			static newuri = Services.io.newURI("chrome://user_chrome_files/content/options/prefs.xhtml");
			static classid = Components.ID(Cc["@mozilla.org/uuid-generator;1"].getService(Ci.nsIUUIDGenerator).generateUUID().toString());
			classDescription = "about:user-chrome-files";
			classID = AboutUcfPrefs.classid;
			contractID = "@mozilla.org/network/protocol/about;1?what=user-chrome-files";
			QueryInterface(aIID) {
				if (aIID.equals(Ci.nsIAboutModule) || aIID.equals(Ci.nsISupports)) {
					return this;
				}
				throw "2147500034";
			}
			newChannel(uri, loadInfo) {
				var chan = Services.io.newChannelFromURIWithLoadInfo(AboutUcfPrefs.newuri, loadInfo);
				chan.owner = Services.scriptSecurityManager.getSystemPrincipal();
				return chan;
			}
			getURIFlags(uri) {
				return Ci.nsIAboutModule.ALLOW_SCRIPT;
			}
			getChromeURI(_uri) {
				return AboutUcfPrefs.newuri;
			}
			createInstance(outer, iid) {
				if (outer) {
					throw "2147746064";
				}
				return this.QueryInterface(iid);
			}
		}
		var newFactory = new AboutUcfPrefs();
		Components.manager.QueryInterface(Ci.nsIComponentRegistrar)
		.registerFactory(newFactory.classID, "AboutUcfPrefs", newFactory.contractID, newFactory);
	},
	get aboutPrefs() {
		delete this.aboutPrefs;
		try {
			this._aboutPrefs();
			return this.aboutPrefs = true;
		} catch(e) {}
		return this.aboutPrefs = false;
	},
	restartMozilla(nocache = false) {
		var cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
		Services.obs.notifyObservers(cancelQuit, "quit-application-requested", "restart");
		if (cancelQuit.data)
			return false;
		if (nocache)
			Services.appinfo.invalidateCachesOnRestart();
		var restart = Services.startup;
		restart.quit(restart.eAttemptQuit | restart.eRestart);
	},
	initArea() {
		this.initAboutCustom();
		if (UcfPrefs.vertical_top_bottom_bar_enable) {
			let v_enable = UcfPrefs.v_enable = UcfPrefs.gbranch.getBoolPref("vertical_enable");
			let t_enable = UcfPrefs.t_enable = UcfPrefs.gbranch.getBoolPref("top_enable");
			let b_enable = UcfPrefs.b_enable = UcfPrefs.gbranch.getBoolPref("bottom_enable");
			if (v_enable) {
				try {
					CustomizableUI.registerArea("ucf-additional-vertical-bar", {
						type: CustomizableUI.TYPE_TOOLBAR,
						defaultPlacements: ["ucf-view-bookmarks-sidebar-button", "ucf-view-history-sidebar-button", "ucf-additional-vertical-spring"],
						defaultCollapsed: false
					});
				} catch(e) {}
				UcfPrefs.v_collapsed = UcfPrefs.gbranch.getBoolPref("vertical_collapsed");
				UcfPrefs.v_bar_start = UcfPrefs.gbranch.getBoolPref("vertical_bar_start");
				UcfPrefs.v_autohide = UcfPrefs.gbranch.getBoolPref("vertical_autohide");
				UcfPrefs.v_mouseenter_sidebar = UcfPrefs.gbranch.getBoolPref("vertical_mouseenter_sidebar");
				UcfPrefs.v_fullscreen = UcfPrefs.gbranch.getBoolPref("vertical_fullscreen");
				UcfPrefs.v_showdelay = UcfPrefs.gbranch.getIntPref("vertical_showdelay");
				UcfPrefs.v_hidedelay = UcfPrefs.gbranch.getIntPref("vertical_hidedelay");
			}
			if (t_enable) {
				try {
					CustomizableUI.registerArea("ucf-additional-top-bar", {
						type: CustomizableUI.TYPE_TOOLBAR,
						defaultPlacements: ["ucf-open-directories-button", "ucf-open-about-config-button", "ucf-additional-top-spring", "ucf-restart-app"],
						defaultCollapsed: false
					});
				} catch(e) {}
				UcfPrefs.t_collapsed = UcfPrefs.gbranch.getBoolPref("top_collapsed");
				UcfPrefs.t_next_navbar = UcfPrefs.gbranch.getBoolPref("top_next_navbar");
			}
			if (b_enable) {
				try {
					CustomizableUI.registerArea("ucf-additional-bottom-bar", {
						type: CustomizableUI.TYPE_TOOLBAR,
						defaultPlacements: ["ucf-additional-bottom-closebutton", "ucf-additional-bottom-spring"],
						defaultCollapsed: false
					});
				} catch(e) {}
				UcfPrefs.b_collapsed = UcfPrefs.gbranch.getBoolPref("bottom_collapsed");
			}
			this.initButtons(v_enable, t_enable, b_enable);
		}
	},
	async initAboutCustom() {
		var aboutPrefs = this.aboutPrefs;
		try {
			CustomizableUI.createWidget({
				id: "ucf-open-about-config-button",
				type: "custom",
				label: "Настройки UserChromeFiles",
				tooltiptext: "ЛКМ: Открыть настройки UserChromeFiles в окне\nСКМ: Открыть about:config\nПКМ: Открыть настройки UserChromeFiles во вкладке",
				localized: false,
				onBuild(doc) {
					var win = doc.defaultView;
					var prefsInfo = "chrome://user_chrome_files/content/options/prefs.xhtml";
					if (aboutPrefs)
						prefsInfo = "about:user-chrome-files";
					if (!win.gInitialPages?.includes(prefsInfo))
						win.gInitialPages.push(prefsInfo);
					var trbn_0 = doc.createXULElement("toolbarbutton");
					trbn_0.id = "ucf-open-about-config-button";
					trbn_0.className = "toolbarbutton-1 chromeclass-toolbar-additional";
					trbn_0.setAttribute("label", "Настройки UserChromeFiles");
					trbn_0.setAttribute("context", "false");
					trbn_0.setAttribute("tooltiptext", "ЛКМ: Открыть настройки UserChromeFiles в окне\nСКМ: Открыть about:config\nПКМ: Открыть настройки UserChromeFiles во вкладке");
					trbn_0.addEventListener("click", function(e) {
						if (e.button == 0) {
							let prefwin = Services.wm.getMostRecentWindow("user_chrome_prefs:window");
							if (prefwin)
								prefwin.focus();
							else
								win.openDialog("chrome://user_chrome_files/content/options/prefs_win.xhtml", "user_chrome_prefs:window", "centerscreen,resizable,dialog=no");
						} else if (e.button == 1) {
							win.switchToTabHavingURI("about:config", true, {
								relatedToCurrent: true,
								triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
							});
						} else if (e.button == 2) {
							win.switchToTabHavingURI(prefsInfo, true, {
								relatedToCurrent: true,
								triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
							});
						}
					});
					trbn_0.style.setProperty("list-style-image", `url("chrome://user_chrome_files/content/vertical_top_bottom_bar/svg/about-config-16.svg")`, "important");
					return trbn_0;
				}
			});
		} catch(e) {}
		if (UcfPrefs.custom_scripts_background) {
			try {
				let scope = Cu.Sandbox(Services.scriptSecurityManager.getSystemPrincipal(), {
					wantComponents: true,
					sandboxName: "UserChromeFiles: custom_scripts_background",
					sandboxPrototype: globalThis,
				});
				const { XPCOMUtils } = ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");
				Object.assign(scope, {
					XPCOMUtils,
				});
				if ("defineLazyGlobalGetters" in XPCOMUtils)
					XPCOMUtils.defineLazyGlobalGetters(scope, [
						"atob",
						"btoa",
						"Blob",
						"CSS",
						"CSSRule",
						"DOMParser",
						"Event",
						"File",
						"FileReader",
						"InspectorUtils",
						"URL",
						"XMLHttpRequest",
						"fetch",
					]);
				if ("defineLazyModuleGetters" in XPCOMUtils)
					XPCOMUtils.defineLazyModuleGetters(scope, {
						console: "resource://gre/modules/Console.jsm",
						AddonManager: "resource://gre/modules/AddonManager.jsm",
						AppConstants: "resource://gre/modules/AppConstants.jsm",
						E10SUtils: "resource://gre/modules/E10SUtils.jsm",
						FileUtils: "resource://gre/modules/FileUtils.jsm",
						OS: "resource://gre/modules/osfile.jsm",
						PlacesUtils: "resource://gre/modules/PlacesUtils.jsm",
						setTimeout: "resource://gre/modules/Timer.jsm",
						setTimeoutWithTarget: "resource://gre/modules/Timer.jsm",
						clearTimeout: "resource://gre/modules/Timer.jsm",
						setInterval: "resource://gre/modules/Timer.jsm",
						setIntervalWithTarget: "resource://gre/modules/Timer.jsm",
						clearInterval: "resource://gre/modules/Timer.jsm",
					});
				for (let s of UcfStylesScripts.scriptsbackground) {
					try {
						if (s.path)
							Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/custom_scripts/${s.path}`, scope, "UTF-8");
						if (s.func)
							new scope.Function(s.func).apply(scope, null);
					} catch (e) {}
				}
			} catch(e) {}
		}
	},
	async initButtons(v_enable, t_enable, b_enable) {
		if (v_enable) {
			try {
				CustomizableUI.createWidget({
					id: "ucf-additional-vertical-spring",
					type: "custom",
					label: "Растягивающийся интервал",
					localized: false,
					onBuild(doc) {
						var trim = doc.createXULElement("toolbaritem");
						trim.id = "ucf-additional-vertical-spring";
						trim.className = "ucf-additional-springs";
						trim.setAttribute("label", "Растягивающийся интервал");
						trim.setAttribute("type", "custom");
						trim.setAttribute("flex", "1");
						return trim;
					}
				});
			} catch(e) {}
			try {
				CustomizableUI.createWidget({
					id: "ucf-additional-vertical-toggle-button",
					label: "Переключить Верт. панель",
					tooltiptext: "Скрыть / Показать Вертикальную панель",
					localized: false,
					defaultArea: CustomizableUI.AREA_NAVBAR,
					onCommand(e) {
						CustomizableUI.setToolbarVisibility("ucf-additional-vertical-bar", e.target.ownerDocument.querySelector("#ucf-additional-vertical-bar").collapsed);
					}
				});
			} catch(e) {}
		}
		if (t_enable) {
			try {
				CustomizableUI.createWidget({
					id: "ucf-additional-top-spring",
					type: "custom",
					label: "Растягивающийся интервал",
					localized: false,
					onBuild(doc) {
						var trim = doc.createXULElement("toolbaritem");
						trim.id = "ucf-additional-top-spring";
						trim.className = "ucf-additional-springs";
						trim.setAttribute("label", "Растягивающийся интервал");
						trim.setAttribute("type", "custom");
						trim.setAttribute("flex", "1");
						return trim;
					}
				});
			} catch(e) {}
			try {
				CustomizableUI.createWidget({
					id: "ucf-additional-top-toggle-button",
					label: "Переключить Доп. панель",
					tooltiptext: "Скрыть / Показать Дополнительную панель",
					localized: false,
					defaultArea: CustomizableUI.AREA_NAVBAR,
					onCommand(e) {
						CustomizableUI.setToolbarVisibility("ucf-additional-top-bar", e.target.ownerDocument.querySelector("#ucf-additional-top-bar").collapsed);
					}
				});
			} catch(e) {}
		}
		if (b_enable) {
			try {
				CustomizableUI.createWidget({
					id: "ucf-additional-bottom-spring",
					type: "custom",
					label: "Растягивающийся интервал",
					localized: false,
					onBuild(doc) {
						var trim = doc.createXULElement("toolbaritem");
						trim.id = "ucf-additional-bottom-spring";
						trim.className = "ucf-additional-springs";
						trim.setAttribute("label", "Растягивающийся интервал");
						trim.setAttribute("type", "custom");
						trim.setAttribute("flex", "1");
						return trim;
					}
				});
			} catch(e) {}
			try {
				CustomizableUI.createWidget({
					id: "ucf-additional-bottom-toggle-button",
					label: "Переключить Ниж. панель",
					tooltiptext: "Скрыть / Показать Нижнюю панель",
					localized: false,
					defaultArea: CustomizableUI.AREA_NAVBAR,
					onCommand(e) {
						CustomizableUI.setToolbarVisibility("ucf-additional-bottom-bar", e.target.ownerDocument.querySelector("#ucf-additional-bottom-bar").collapsed);
					}
				});
			} catch(e) {}
		}
		try {
			CustomizableUI.createWidget({
				id: "ucf-restart-app",
				type: "custom",
				label: "Перезагрузка",
				tooltiptext: "ЛКМ: Перезапустить приложение\nСКМ: Перезапустить без дополнений\nПКМ: Перезапустить и заново создать кэш быстрого запуска",
				localized: false,
				onBuild(doc) {
					var win = doc.defaultView;
					var trbn_0 = doc.createXULElement("toolbarbutton");
					trbn_0.id = "ucf-restart-app";
					trbn_0.className = "toolbarbutton-1 chromeclass-toolbar-additional";
					trbn_0.setAttribute("label", "Перезагрузка");
					trbn_0.setAttribute("context", "false");
					trbn_0.setAttribute("tooltiptext", "ЛКМ: Перезапустить приложение\nСКМ: Перезапустить без дополнений\nПКМ: Перезапустить и заново создать кэш быстрого запуска");
					trbn_0.addEventListener("click", function(e) {
						if (e.button == 0)
							user_chrome.restartMozilla();
						else if (e.button == 1)
							win.safeModeRestart();
						else if (e.button == 2) {
							e.preventDefault();
							e.stopPropagation();
							user_chrome.restartMozilla(true);
						}
					});
					return trbn_0;
				}
			});
		} catch(e) {}
		try {
			CustomizableUI.createWidget({
				id: "ucf-view-history-sidebar-button",
				label: "История",
				tooltiptext: "Показать / Скрыть Историю",
				localized: false,
				onCommand(e) {
					e.view.SidebarUI.toggle("viewHistorySidebar");
				}
			});
		} catch(e) {}
		try {
			CustomizableUI.createWidget({
				id: "ucf-view-bookmarks-sidebar-button",
				label: "Закладки",
				tooltiptext: "Показать / Скрыть Закладки",
				localized: false,
				onCommand(e) {
					e.view.SidebarUI.toggle("viewBookmarksSidebar");
				}
			});
		} catch(e) {}
		try {
			CustomizableUI.createWidget({
				id: "ucf-open-directories-button",
				type: "custom",
				label: "Открыть папку",
				tooltiptext: "ЛКМ: Папка user_chrome_files\nСКМ: Папка профиля\nПКМ: Папка установки",
				localized: false,
				onBuild(doc) {
					var trbn_0 = doc.createXULElement("toolbarbutton");
					trbn_0.id = "ucf-open-directories-button";
					trbn_0.className = "toolbarbutton-1 chromeclass-toolbar-additional";
					trbn_0.setAttribute("label", "Открыть папку");
					trbn_0.setAttribute("context", "false");
					trbn_0.setAttribute("tooltiptext", "ЛКМ: Папка user_chrome_files\nСКМ: Папка профиля\nПКМ: Папка установки");
					trbn_0.addEventListener("click", function(e) {
						var dirs;
						if (e.button == 0) {
							dirs = Services.dirsvc.get("UChrm", Ci.nsIFile);
							dirs.append("user_chrome_files");
							if (dirs.exists()) dirs.launch();
						} else if (e.button == 1) {
							dirs = Services.dirsvc.get("ProfD", Ci.nsIFile);
							if (dirs.exists()) dirs.launch();
						} else if (e.button == 2) {
							dirs = Services.dirsvc.get("GreD", Ci.nsIFile);
							if (dirs.exists()) dirs.launch();
						}
					});
					return trbn_0;
				}
			});
		} catch(e) {}
	},
	async sheettoolbars(func) {
		try {
			let uri = Services.io.newURI("chrome://user_chrome_files/content/vertical_top_bottom_bar/vertical_top_bottom_bar.css");
			let UcfSSS = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
			let type = UcfSSS.USER_SHEET;
			let preload = UcfSSS.preloadSheet(uri, type);
			(this.sheettoolbars = f => {
				try {
					f(preload, type);
				} catch (e) {}
			})(func);
		} catch (e) {
			this.sheettoolbars = () => {};
		}
	},
	initWindow(win) {
		this.initArea();
		(this.initWindow = w => {
			(new UserChrome()).initWindow(w);
		})(win);
	},
};
class UserChrome {
	constructor() {}
	initWindow(win) {
		var href = win.location.href;
		if (!href) return;
		if (UcfPrefs.custom_styles_chrome)
			this.addStylesChrome(win);
		if (href === "chrome://browser/content/browser.xhtml") {
			if (UcfPrefs.vertical_top_bottom_bar_enable)
				win.addEventListener("MozBeforeInitialXULLayout", e => {
					this.loadToolbars(win);
				}, { once: true });
			if (UcfPrefs.custom_scripts_chrome) {
				win.addEventListener("DOMContentLoaded", e => {
					this._loadChromeScripts(win);
				}, { once: true });
				win.addEventListener("load", e => {
					this.loadChromeScripts(win);
				}, { once: true });
			}
		}
		if (UcfPrefs.custom_scripts_all_chrome && href !== "about:blank") {
			win.addEventListener("DOMContentLoaded", e => {
				this._loadAllChromeScripts(win, href);
			}, { once: true });
			win.addEventListener("load", e => {
				this.loadAllChromeScripts(win, href);
			}, { once: true });
		}
	}
	async addStylesChrome(win) {
		for (let s of UcfStylesScripts.styleschrome)
			s.sheet(win.windowUtils.addSheet);
	}
	loadToolbars(win) {
		user_chrome.sheettoolbars(win.windowUtils.addSheet);
		Object.assign(win, {
			UcfPrefs,
		});
		try {
			Services.scriptloader.loadSubScript("chrome://user_chrome_files/content/vertical_top_bottom_bar/vertical_top_bottom_bar.js", win, "UTF-8");
		} catch(e) {}
	}
	_loadChromeScripts(win) {
		try {
			Services.scriptloader.loadSubScript("chrome://user_chrome_files/content/custom_scripts/custom_script_win.js", win, "UTF-8");
		} catch (e) {}
		for (let s of UcfStylesScripts.scriptschrome.domload) {
			try {
				if (s.path)
					Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/custom_scripts/${s.path}`, s.ucfobj ? win.ucf_custom_script_win : win, "UTF-8");
				if (s.func)
					new win.Function(s.func).apply(win, null);
			} catch (e) {}
		}
	}
	loadChromeScripts(win) {
		try {
			win.ucf_custom_script_win.load();
		} catch (e) {}
		for (let s of UcfStylesScripts.scriptschrome.load) {
			try {
				if (s.path)
					Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/custom_scripts/${s.path}`, s.ucfobj ? win.ucf_custom_script_win : win, "UTF-8");
				if (s.func)
					new win.Function(s.func).apply(win, null);
			} catch (e) {}
		}
	}
	_loadAllChromeScripts(win, href) {
		try {
			Services.scriptloader.loadSubScript("chrome://user_chrome_files/content/custom_scripts/custom_script_all_win.js", win, "UTF-8");
		} catch (e) {}
		for (let s of UcfStylesScripts.scriptsallchrome.domload) {
			try {
				if (s.urlregxp.test(href)) {
					if (s.path)
						Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/custom_scripts/${s.path}`, s.ucfobj ? win.ucf_custom_script_all_win : win, "UTF-8");
					if (s.func)
						new win.Function(s.func).apply(win, null);
				}
			} catch (e) {}
		}
	}
	loadAllChromeScripts(win, href) {
		try {
			win.ucf_custom_script_all_win.load();
		} catch (e) {}
		for (let s of UcfStylesScripts.scriptsallchrome.load) {
			try {
				if (s.urlregxp.test(href)) {
					if (s.path)
						Services.scriptloader.loadSubScript(`chrome://user_chrome_files/content/custom_scripts/${s.path}`, s.ucfobj ? win.ucf_custom_script_all_win : win, "UTF-8");
					if (s.func)
						new win.Function(s.func).apply(win, null);
				}
			} catch (e) {}
		}
	}
}
user_chrome.initPrefsStyles();
