(async sep => { //закладку в Sidebar Tabs
	if (!sep) return;
	var popup = sep.parentNode;
	var menuitem = document.createXULElement("menuitem");
	for(var args of Object.entries({
		label: "Открыть в Sidebar Tabs",
		id: "placesContext_open:sidebartabs",
		"node-type": "link", "selection-type": "single"
	}))
	menuitem.setAttribute(...args);
	menuitem.className = "menuitem-iconic";
	menuitem.setAttribute("image", "resource://ucf_sidebar_tabs");
	menuitem.addEventListener("command", () => {
		var {uri} = popup.triggerNode._placesNode || popup._view.selectedNode;
		Services.wm.getMostRecentBrowserWindow().ucf_custom_script_win.ucf_sidebar_tabs.setPanel(0, uri);
	});
	sep.before(menuitem);
})(document.querySelector("menupopup#placesContext > #placesContext_openSeparator"));

(async ( // Sidebar Tabs © VitaliyV, mod Dobrov
	ID = "ucf_sidebar_tabs",
	TABS = [
		{
			label: "Сайт",
			src: "https://rg.ru",
			attributes: 'messagemanagergroup="webext-browsers" type="content" disableglobalhistory="true" context="contentAreaContextMenu" tooltip="aHTMLTooltip" autocompletepopup="PopupAutoComplete" remote="true" maychangeremoteness="true" ',
			menu: {
				label: "Адрес в панель SidebarTabs",
				icon: `resource://${ID}`,
			}
		},
		{
			label: "Журнал",
			src: "chrome://browser/content/places/historySidebar.xhtml",
		},
		{
			label: "Закладки",
			src: "chrome://browser/content/places/bookmarksSidebar.xhtml",
		},
		{
			label: "Загрузки",
			src: "chrome://browser/content/downloads/contentAreaDownloadsView.xhtml",
		},
		{
			label: "Задачи", src: "about:processes",
		},
		// {
		// 	label: "Дополнения", src: "about:addons",
		// 	attributes: 'type="content" disableglobalhistory="true" context="contentAreaContextMenu" tooltip="aHTMLTooltip" autocompletepopup="PopupAutoComplete" remote="false" maychangeremoteness="true" ',
		// },
	],
	RIGHT = true, // Расположение панели
	WIDTH = 350,
	NAME = "Sidebar Tabs",
	TOOLTIP = "Открыть / Закрыть Sidebar Tabs",
	CLOSE_BTN_TOOLTIP = "Закрыть панель",
	HIDE_HEADER = true,
	HIDE_FULLSCREEN = false, // Hide in full screen mode
	SELECTOR = "#context-media-eme-separator",
	popup,
	showing = (e, g) => (e.target != popup || g.webExtBrowserType === "popup" || (g.isContentSelected || g.onTextInput || g.onImage || g.onVideo || g.onAudio || g.inFrame) && !g.linkURL),
	hiding = e => (e.target != popup),
) => (this[ID] = {
	last_open: "extensions.ucf.sidebar_tabs.last_open",
	last_index: "extensions.ucf.sidebar_tabs.last_index",
	toolbox_width: "extensions.ucf.sidebar_tabs.toolbox_width",
	eventListeners: new Map(),
	eventCListeners: [],
	urlsMap: new Map(),
	timer: null,
	init() {
		this.prefs = Services.prefs;
		var open = this._open = this.prefs.getBoolPref(this.last_open, false);
		windowUtils.loadSheetUsingURIString(`data:text/css;charset=utf-8,${encodeURIComponent(`
			#st_toolbox {
				background-color: Field !important;
				background-image: linear-gradient(var(--toolbar-bgcolor), var(--toolbar-bgcolor)) !important;
				color: var(--toolbar-color, FieldText) !important;
				overflow: hidden !important;
				border-inline-${RIGHT ? "end" : "start"}: 1px solid var(--chrome-content-separator-color, ThreeDShadow) !important;
			}
			#st_toolbox #st_header {
				padding: 6px !important;
				padding-bottom: 3px !important;
				flex-direction: ${RIGHT ? "row" : "row-reverse"} !important;
				${HIDE_HEADER ? "display: none !important;" : ""}
			}
			#st_toolbox [flex="1"] {
				flex: 1 !important;
			}
			#st_toolbox tabs > spacer {
				display: none !important;
			}
			#st_toolbox :is(tabs,tabpanels,tab,label) {
				appearance: none !important;
				background-color: transparent !important;
				color: inherit !important;
				margin: 0 !important;
				padding: 0 !important;
				border: none !important;
			}
			#st_toolbox tabs {
				justify-content: ${RIGHT ? "start" : "end"} !important;
			}
			#st_toolbox #st_tabpanels {
				background-color: Field !important;
				color: FieldText !important;
			}
			#st_toolbox tab {
				margin: 0 !important;
				padding: 3px 6px !important;
				outline: none !important;
				border-block: 2px solid transparent !important;
				--default-focusring: none !important;
			}
			#st_toolbox tab:hover {
				border-bottom-color: color-mix(in srgb, currentColor 30%, transparent) !important;
			}
			#st_toolbox tab[selected="true"] {
				border-bottom-color: color-mix(in srgb, currentColor 80%, transparent) !important;
			}
			#st_splitter {
				appearance: none !important;
				cursor: ew-resize;
				width: 6px !important;
				position: relative !important;
				z-index: 3 !important;
				background-color: transparent !important;
				border: none !important;
				margin: 0 !important;
				opacity: 0 !important;
				margin-inline-${RIGHT ? "start" : "end"}: -6px !important;
			}
			#ucf-additional-vertical-container[v_vertical_bar_start="true"] {
				order: 0 !important;
			}
			#ucf-additional-vertical-container[v_vertical_bar_start="false"] {
				order: 102 !important;
			}
			:root:is(${HIDE_FULLSCREEN ? "[inFullscreen]," : ""}[inDOMFullscreen],[chromehidden~="extrachrome"]) :is(#st_vbox_container,#st_toolbox,#st_splitter) {
				visibility: collapse !important;
			}
		`)}`, windowUtils.USER_SHEET);
		document.documentElement.setAttribute("sidebar_tabs_right", `${RIGHT}`);
		var fragment = this.fragment = MozXULElement.parseXULToFragment(`
			<vbox id="st_toolbox" class="chromeclass-extrachrome" hidden="true">
				<hbox id="st_header" align="center">
					<label>${NAME}</label>
					<spacer flex="1"/>
					<toolbarbutton id="st_close_button" class="close-icon tabbable" tooltiptext="${CLOSE_BTN_TOOLTIP}"/>
				</hbox>
				<tabbox id="st_tabbox" flex="1">
					<tabs id="sbar_tabs">
						${this.getTabs()}
					</tabs>
					<tabpanels id="st_tabpanels" flex="1">
						${this.panels_str}
					</tabpanels>
				</tabbox>
			</vbox>
			<splitter id="st_splitter" class="chromeclass-extrachrome" hidden="true" resizebefore="sibling" resizeafter="none"/>
		`);
		document.querySelector("#sidebar-box, #sidebar-main")?.before(document.importNode(fragment, true));
		this.toolbox = document.querySelector("#st_toolbox");
		this.splitter = document.querySelector("#st_splitter");
		for (let browser of this.toolbox.querySelectorAll("[id^=st_browser_]"))
			this[`${browser.id}`] = browser;
		this.st_tabpanels = this.toolbox.querySelector("#st_tabpanels");
		this.st_tabbox = this.toolbox.querySelector("#st_tabbox");
		this.st_close_btn = this.toolbox.querySelector("#st_close_button");
		this.st_tabbox.handleEvent = function() {};
		this.st_tabbox.selectedIndex = this.aIndex = this.prefs.getIntPref(this.last_index, 0);
		delete this.panels_str;
		if (open)
			this.open();
		this.addListener(this.st_close_btn, "command", this);
		if (this.menus.length) {
			popup = document.querySelector("#contentAreaContextMenu");
			this.addListener(popup, "popupshowing", this);
		}
		if (!(ID in UcfPrefs.customSandbox))
			Cu.evalInSandbox(`
				(this["${ID}"] = {
					async init() {
						Services.io.getProtocolHandler("resource")
						.QueryInterface(Ci.nsIResProtocolHandler)
						.setSubstitution("${ID}", Services.io.newURI("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><g style='fill:context-fill rgb(142, 142, 152);fill-opacity:context-fill-opacity;'><path d='M2 2C.892 2 0 2.89 0 4v9.1a2 2 0 0 0 2 2h12c1.1 0 2-.9 2-2V4a2 2 0 0 0-2-2Zm0 1h12c.6 0 1 .45 1 1v9.1c0 .5-.5.9-1 .9H1.99c-.55 0-.99-.4-.99-.9V4c0-.55.45-1 1-1Z'/> <rect width='14' height='1' x='1' y='6'/> <rect width='1' height='7' x='5' y='7'/></g></svg>"));
						CustomizableUI.createWidget({
							id: "${ID}",
							label: "${NAME}",
							tooltiptext: "${TOOLTIP}",
							defaultArea: CustomizableUI.AREA_NAVBAR,
							localized: false,
							onCreated(btn) {
								btn.style.setProperty("list-style-image", 'url("resource://${ID}")');
								btn.checked = btn.ownerGlobal.ucf_custom_script_win?.["${ID}"]?._open ?? Services.prefs.getBoolPref("${this.last_open}", true);
							},
							onCommand(e) {
							   e.view.ucf_custom_script_win["${ID}"].toggle();
							}
						});
					},
				}).init();
			`, UcfPrefs.customSandbox);
		setUnloadMap(ID, this.destructor, this);
		this.API = Cu.getGlobalForObject(Cu)[Symbol.for("UcfAPI")]; //ucb_SaveHTML.mjs
	},
	getTabs() {
		var str = panels_str = "", menus = [];
		for (let [ind, {label, src, attributes, menu}] of TABS.entries()) {
			str += `<tab id="st_tab_${ind}" label="${label}"/>`;
			panels_str += `<vbox id="st_container_${ind}" flex="1">
				<browser id="st_browser_${ind}" flex="1" autoscroll="false" ${attributes || ""}/>
			</vbox>`;
			this.urlsMap.set(ind, {url: src});
			if (menu) {
				menu.aIndex = ind;
				menus.push(menu);
			}
		}
		this.panels_str = panels_str;
		this.menus = menus;
		return str;
	},
	async loadURI(browser, url, options = {}) {
		if (browser.getAttribute("type") !== "content")
			browser.setAttribute("src", url);
		else {
			options.triggeringPrincipal ||= Services.scriptSecurityManager.getSystemPrincipal();
			browser.loadURI(Services.io.newURI(url), options);
		}
	},
	select(e, aIndex) {
		if (e.target != this.st_tabpanels || (aIndex = this.st_tabbox.selectedIndex) == this.aIndex) return;
		var browser = this[`st_browser_${this.aIndex}`];
		this.loadURI(browser, "about:blank");
		this.aIndex = aIndex;
		this.prefs.setIntPref(this.last_index, aIndex);
		var width = `${this.prefs.getIntPref(`${this.toolbox_width}${aIndex}`, WIDTH)}px`;
		this.toolbox.style.width = width;
		document.documentElement.style.setProperty("--v-sidebar-tabs-width", width);
		browser = this[`st_browser_${aIndex}`], {url, options} = this.urlsMap.get(aIndex);
		this.loadURI(browser, url, options);
	},
	open() {
		this.toolbox.hidden = this.splitter.hidden = false;
		var {aIndex} = this;
		this.toolbox.style.width = `${this.prefs.getIntPref(`${this.toolbox_width}${aIndex}`, WIDTH)}px`;
		this.addListener(this.st_tabpanels, "select", this);
		this.addListener(this.splitter, "dragstart", this);
		var browser = this[`st_browser_${aIndex}`], {url, options} = this.urlsMap.get(aIndex);
		this.loadURI(browser, url, options);
		this.prefs.setBoolPref(this.last_open, true);
		this._open = true;
	},
	toggle() {
		if (!this._open)
			this.open();
		else {
			this.delListener("select");
			this.delListener("dragstart");
			this.toolbox.hidden = this.splitter.hidden = true;
			var browser = this[`st_browser_${this.aIndex}`];
			this.loadURI(browser, "about:blank");
			this.prefs.setBoolPref(this.last_open, false);
			this._open = false;
		}
		this.togglebutton();
	},
	togglebutton() {
		if (this.button ||= CustomizableUI.getWidget(ID)?.forWindow(window).node)
			this.button.checked = this._open;
	},
	setPanel(aIndex, url, options = {}) {
		try {
			let browser = this[`st_browser_${aIndex}`];
			if (!browser || !/^(?:https?|ftp|chrome|about|moz-extension|file):/.test(url)) throw "Отсутствуют или неверные аргументы!";
			if (options.userContextId != browser.getAttribute("usercontextid")) {
				let newbrowser = (this[`cn_browser_${aIndex}`] ||= this.fragment.querySelector(`#st_browser_${aIndex}`)).cloneNode(false);
				if ("userContextId" in options)
					newbrowser.setAttribute("usercontextid", options.userContextId);
				browser.replaceWith(newbrowser);
				browser = this[`st_browser_${aIndex}`] = newbrowser;
			}
			this.urlsMap.set(aIndex, {url, options});
			if (this.st_tabbox.selectedIndex !== aIndex) {
				this.st_tabbox.selectedIndex = aIndex;
				if (!this._open) {
					this.aIndex = aIndex;
					this.open();
					this.togglebutton();
				}
				return;
			}
			if (!this._open)
				this.toggle();
			this.loadURI(browser, url, options);
		} catch (e) {console.log(e)}
	},
	click(e) {
		var url = (gContextMenu?.linkURI?.displaySpec || this.API.URL());
		url = !(e.shiftKey || e.button === 1) ? url : this.API.readFromClip() || url;
		var {staIndex} = e.currentTarget;
		var userContextId = gContextMenu?.contentData?.userContextId;
		var triggeringPrincipal = gContextMenu?.principal;
		this.setPanel(staIndex, url, {...(userContextId ? {userContextId} : {}), ...(triggeringPrincipal ? {triggeringPrincipal} : {})});
	},
	dragstart() {
		this.splitter.addEventListener("mousemove", this);
		this.splitter.addEventListener("mouseup", this, { once: true });
	},
	mousemove() {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.prefs.setIntPref(`${this.toolbox_width}${this.aIndex}`, this.toolbox.getBoundingClientRect().width);
		}, 500);
	},
	mouseup() {
		this.splitter.removeEventListener("mousemove", this);
	},
	command() {
		this.toggle();
	},
	handleEvent(e) {
		this[e.type](e);
	},
	delListener(type) {
		var {elm, type, listener} = this.eventListeners.get(type);
		elm.removeEventListener(type, listener);
	},
	addListener(elm, type, listener) {
		elm.addEventListener(type, listener);
		this.eventListeners.set(type, {elm, type, listener});
	},
	addCListener(elm, type, listener) {
		elm.addEventListener(type, listener);
		this.eventCListeners.push({elm, type, listener});
	},
	popupshowing(e) {
		if (showing(e, gContextMenu)) return;
		var contextsel = popup.querySelector(`:scope > ${SELECTOR}`) || popup.querySelector(":scope > menuseparator:last-of-type");
		var fragment = document.createDocumentFragment();
		var itemId = 0;
		this.menus.forEach(item => {
			var {label, icon, aIndex} = item;
			var mitem = document.createXULElement("menuitem");
			mitem.id = `ucf-sidebar-tabs-${++itemId}`;
			mitem.className = "menuitem-iconic ucf-sidebar-tabs";
			mitem.setAttribute("label", label);
			mitem.tooltipText = "Колёсико откроет адрес из буфера обмена";
			if (icon)
				mitem.style.cssText = `list-style-image:url("${icon}");-moz-context-properties:fill,stroke,fill-opacity;stroke:currentColor;fill:currentColor;fill-opacity:var(--toolbarbutton-icon-fill-opacity,.8);`;
			mitem.staIndex = aIndex;
			fragment.append(mitem);
			this.addCListener(mitem, "click", this);
		});
		contextsel.before(fragment);
		this.popupshowing = this.itemsShow;
		this.popuphiding = this.itemsHide;
		this.addListener(popup, "popuphiding", this);
	},
	itemsShow(e) {
		if (showing(e, gContextMenu)) return;
		for (let {elm} of this.eventCListeners)
			elm.hidden = false;
	},
	itemsHide(e) {
		if (hiding(e)) return;
		for (let {elm} of this.eventCListeners)
			elm.hidden = true;
	},
	destructor() {
		this.eventListeners.forEach(item => {
			var {elm, type, listener} = item;
			elm.removeEventListener(type, listener);
		});
		for (let {elm, type, listener} of this.eventCListeners)
			elm.removeEventListener(type, listener);
	},
}).init())();