// перехват кликов мыши, нажатий клавиш, подсказки кнопок © Dumby. mod Dobrov глобальные функции, оптимизация…
var DEBUG = 2, hmap = new Map([ ["downloads-button", // тексты: кнопка «Загрузки»
`
◧ л.держать	⬇︎ папка [Загрузки]
◧ + Shift 	Графика вкл/выкл
◧ дважды на Фото: найти Похожие\n
◨ правый клик (Alt+S) ➜ Сохранить
    в единый Html всё / выделенное\n
Колёсико ➜ Сохранить как файл .txt
◉ колёсико на Фото ➜ Сохранить`], ["PanelUI-menu", // в подсказке кнопки: Версия браузера

`◧ лев. клик	меню Firefox ${AppConstants.MOZ_APP_VERSION}
◧ + Shift	➿ краткая Справка\n
◧ держать	✕ Закрыть браузер
◧ +Alt, ◉ ролик  Окно│Развернуть

◨ прав. клик	⇲ Свернуть
◨ + Alt		Сведения о системе
Ø ролик ↑	⤾ Вернуть вкладку`], ["identity-box", // Замок

`Правый клик	 Копировать адрес в буфер
◉, Клик + Alt	 Настройки прокси
◧ держать	 Антизапрет ⇆ Без прокси\n
◧ лев + Shift	 ServiceWorkers
Ø колёсико ±	 Яркость страниц:`], ["star-button", // Звёздочка

`Правый клик	➜ Быстрая закладка
Лев.клик + Alt	Библиотека закладок
◧ держать: Перевод сайта/выд.текста\n\n`], ["favdirs-button",

`Левый клик	★ Закладки
◧ + Alt		Домашняя папка
Правый		⟳ История
◨ + Alt		Папка установки\n
◉ колёсико	⬇︎ Загрузки
◉ ролик +Alt	UserChromeFiles`], ["ToggleButton", // Частые действия, меню скрытых настроек

`левая кнопка	◧ мыши: «Журнал»
◉ Колёсико	Открыть новую вкладку
			↑ или клавиши ${AppConstants.platform == "macosx" ? "⌘" : "Ctrl+"}T\n
◧ лев.+ Alt	Библиотека закладок
◧ + Shift	масштаб Текст / Всё
Ø Ролик ±	масштаб Страницы\n
◨ прав.клик	Меню быстрых настроек
◨ + Ctrl		Медиа на странице`], ["ToggleMenu", // строка меню держать: about:config, ◨ + Alt		Захват цвета, Линза

`Правый клик: сброс по-умолчанию\n⟳ Обновить, ↯ нужен Перезапуск`], ["ReaderView",

`Клик мыши	Чтение в Reader View
Правый клик	Адаптивный дизайн
Колёсико	Простой режим чтения
Alt + R		Выбор части страницы \n
Крутить ±	Яркость страниц:`], ["print-button",

`Распечатать страницу (${AppConstants.platform == "macosx" ? "⌘" : "Ctrl+"}P)\n
Правый клик	быстрая Печать
◧ держать	краткая Справка`], ["reload-button",

`◧ держать:	Обновить все вкладки
Правый клик	Обновить без кэша`], ["tracking-protection",
`
нажатие мыши	Сведения о защите сайта
◨ правый клик	Логины и Пароли
◧ лев. держать	⇆ Web-шрифты\n
◉ колёсико		диспетчер Задач`], ["wheel-stop",`Колёсико:	Прервать все обновления`], ["AttributesInspector",

`◧ клик		Attributes Inspector
◨ прав.		Инструменты браузера
◧ держать	краткая Справка\n
◉ колёсико	Перезапустить, удалив кэш
◧ + Alt		настройки User Chrome Files
Alt + x		запустить скрипт User.js`], ["singlesave", "_531906d3-e22f-4a6c-a102-8057b88a1a63_-browser-action"], ["ssave",

`SingleFile (Alt+Shift+S)\nСохранить страницу в единый Html`], ["bright", `☀ Яркость страниц: `], ["VideoDownloadHelper",

`Video DownloadHelper\nСкачивание проигрываемого видео`], ["savedirs",

`пути сохранения Страниц и Графики\nСинтаксис «_Html/subdir|_Pics/subdir»\nsubdir: пусто | 0 заголовок | 1 домен`]]);
// "_Web||_Pics|1" результат >save Html: [Загрузки]/_Web/имя страницы.html, >Pic: [Загрузки]/_Pics/имя вкладки/картинка

if (AppConstants.platform == "macosx") for (let entry of hmap) { // замена символов в Map([…]) массиве
	['◉','Ø'].forEach(function(item, i) {hmap.set(entry[0], hmap.get(entry[0]).replace(new RegExp(item,'g'),['⦿','🂠'][i]))})};

var {prefs, dirsvc} = Services, file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile),
log = msg => Services.console.logStringMessage("[@] "+ msg), // отладка

gClipboard = { // глобальные функции - общие для всех [ChromeOnly]-скриптов
	write(str, ch = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)) {
		(this.write = str => ch.copyStringToClipboard(str, Services.clipboard.kGlobalClipboard))(str);
	}
},
browserWindow = () => {
	if(window.location.href == "chrome://browser/content/browser.xul") return window;
	return Services.wm.getMostRecentWindow("navigator:browser");
},
switchTab = (url, go = false) => { // открыть вкладку | закрыть, если открыта | выбрать
	for(var tab of gBrowser.visibleTabs) // var win = window || e.view || e.ownerGlobal; win.gBrowser…
		if (tab.linkedBrowser.currentURI.spec == url)
			{go ? gBrowser.selectedTab = tab : gBrowser.removeTab(tab); return;}
	gBrowser.addTrustedTab(url); gBrowser.selectedTab = gBrowser.visibleTabs[gBrowser.visibleTabs.length -1];
},
toStatus = (txt, time = 5e3, init = false, StatusPanel = browserWindow().StatusPanel) => {
	if (StatusPanel.update.tid)
		clearTimeout(StatusPanel.update.tid)
	else {
		var {update} = StatusPanel;
		StatusPanel.update = () => {};
		StatusPanel.update.ret = () => {
			StatusPanel.update = update, StatusPanel.update();
		}
	}
	StatusPanel.update.tid = setTimeout(StatusPanel.update.ret, time);
	StatusPanel._label = txt;
};
if (typeof IOUtils != "object") { var // Firefox 78 ESR
	{OS} = ChromeUtils.import("resource://gre/modules/osfile.jsm"),
	PathUtils = {join: (...args) => OS.Path.join(...args)},
	IOUtils = {writeUTF8: (path, txt) => OS.File.writeAtomic(path, new TextEncoder().encode(txt))};
}
var glob = { // глобальный объект
	togglebar(bar = "viewHistorySidebar") { browserWindow().SidebarUI.toggle(bar);
	},
	FileExists(file) { // файл|папка существует?
		if (file.startsWith("chrome://")) try {
			if (Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).convertChromeURL(Services.io.newURI(file)).QueryInterface(Ci.nsIFileURL).file.exists())
				return true;} catch {}
		else
			try {return FileUtils.File(String.raw`${file}`).exists();} catch {};
		return false;
	},
	dirsvcget(cat = 'browser.download.dir', sub, open) { var dir; // DfltDwnld GreD UChrm Home
		try {dir = dirsvc.get(cat, Ci.nsIFile);} catch {dir = prefs.getComplexValue(cat, Ci.nsIFile);}
		sub && dir.append(sub);
		if (open) dir.exists() && dir.launch()
		else return dir; // вернуть объект или открыть папку
	},
	str_cut(s, cut = 33, ch = '…\n') { // сократить/разбить строку
		return s.substring(0,cut) + `${s.length > cut - 1 ? `${ch}…${s.substring(s.length - cut + ch.length, s.length)}`: ''}`;
	},
	Title(max, title) { // получить заголовок. без обрезки: max не указан, домен: max <0, + дата: max=0
		if (!title) var title = document.title || gBrowser.selectedTab.label;
		if (max == undefined) return title; // заголовок как есть или ограничить длину, убрать служебные символы
		title = title.replace(/[\\\/?*\"'`]+/g,'').replace(/\s+/g,' ').replace(/[|<>]+/g,'_').replace(/:/g,'։').trim();
		if ( max > 0 ) return title.slice(0, max);
		if ( max == 0) return title.slice(0, 100) +"_"+ new Date().toLocaleDateString('ru', {day: 'numeric', month: 'numeric', year: '2-digit'}) +'-'+ new Date().toLocaleTimeString().replace(/:/g, "։");
		var host = decodeURIComponent(gURLBar.value); // max < 0
		if (!/^file:\/\//.test(host)) host = host.replace(/^.*url=|https?:\/\/|www\.|\/.*/g,'').replace(/^ru\.|^m\.|forum\./,'').replace(/^club\.dns/,'dns');
		return host;
	},
	about_config(filter, win = browserWindow()) { // переход к указанному параметру about:config
		var setFilter = (e, win, input = (e?.target || win.content.document).getElementById("about-config-search")) => {
			if (e || input.value != filter) input.setUserInput(filter);},
		found = win.switchToTabHavingURI("about:config", true, {relatedToCurrent: true,
			triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
		if (found) setFilter(null, win);
		else gBrowser.selectedBrowser.addEventListener("pageshow", setFilter, {once: true});
	},
	showAlert(text,title = 'Firefox',img = undefined, service = "@mozilla.org/alerts-service;1"){ // Notify
		try {Cc[service].getService(Ci.nsIAlertsService).showAlertNotification(img,title,text,false);} catch {}
	},
	flash_bg_text(id = 'identity-box', style, color, ms, text, time = 5e3) { // мигание и статус
		id = document.getElementById(id); if (!id) return; // иначе Uncaught TypeError: this.selectors is undefined
		if (style) id.style.filter = style;
		if (color) id.style.background = color;
		if (ms) setTimeout(() => { id.style.removeProperty('filter'), id.style.removeProperty('background-color');}, ms);
		if (text) toStatus(text, time);
	}, // визуальное представление настроек:
	mode_skin(text, ptype = prefs.getIntPref('network.proxy.type'), t,s = 'unset',o = '',p) { // разный фон кнопки Меню
		if (prefs.getBoolPref("dom.security.https_only_mode"))
			glob.flash_bg_text('reload-button', "drop-shadow(0px 0.5px 0px #F8F)"), o = ', только HTTPS'
		else
			glob.flash_bg_text('reload-button', "none");
		p = prefs.getStringPref("network.proxy.no_proxies_on", "") == "" ? "" : ", Есть сайты-исключения";
		if (ptype == 1) t = ['sepia(100%) saturate(150%) brightness(0.9)', 'Ручная настройка прокси' + p];
		else if (ptype == 2) t = ['hue-rotate(120deg) saturate(70%)', 'Запрещённые сайты через АнтиЗапрет' + p], s = 'hue-rotate(270deg) brightness(95%)';
		else if (ptype == 4) t = ['hue-rotate(250deg) brightness(0.95) saturate(150%)','Сеть - автонастройка прокси' + p];
		else if (ptype == 0) t = ['saturate(0%) brightness(0.95)', 'Настройки сети - системные' + p]
		else t = [s, 'Сеть работает без прокси']; // серый фон кнопки
		glob.flash_bg_text('downloads-button', prefs.getIntPref("permissions.default.image") > 1 ? "hue-rotate(180deg) drop-shadow(0px 0.5px 0px #F68)" : "none");
		glob.flash_bg_text('ToggleButton', s);
		glob.flash_bg_text('PanelUI-menu-button', t[0]);
		p = typeof(text); if (p.toLowerCase() == 'string')
			toStatus(text ? text : "\u{1F6A6}"+ t[1] + o, 5e3); // символ Светофор
	}
}; // END global

(async (id) => CustomizableUI.createWidget({ label: `Панели, Папки`, id: id, tooltiptext: hmap.get(id),
onCreated(btn){btn.style.setProperty("list-style-image","url(chrome://devtools/skin/images/folder.svg)");}})
)("favdirs-button");

(async (id) => CustomizableUI.createWidget({ label: `Attributes Inspector`, id: id, tooltiptext: hmap.get(id),
	onCreated(btn) {
		btn.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXklEQVQ4y2NczuDyn4ECwMRAIWDBJhjxfzcDAwMDwwpGVwwxGIDJMeHSjE0TQS9g04DNNchsJmyaVzC6oigiKRCJ1Ui7WCAm4GjrAnxxTxMXEG0ArgRGsQsYBzw3AgAf7CIvsbv5cwAAAABJRU5ErkJggg==");
		btn.onmouseenter = btn.onmouseleave = this.onmouse;
		btn.setAttribute("oncommand", "handleCommand(this)"); btn.handleCommand = this.handleCommand;
	},
	get handleCommand() { delete this.handleCommand;
		return this.handleCommand = btn => { (btn.handleCommand = new btn.ownerGlobal.Function(this.code).bind(btn))();}
	},
	get code() { delete this.code;
		return this.code = "this.focusedWindow && this.focusedWindow.focus();\n" +
			Cu.readUTF8URI(Services.io.newURI("chrome://user_chrome_files/content/custom_scripts/attrsInspector.js"));
	},
	onmouse: e => e.target.focusedWindow = e.type.endsWith("r") && Services.wm.getMostRecentWindow(null)
}))("AttributesInspector");

(async (id, func) => { // дополнительные клики © Dumby, mod Dobrov

var br_txt = hmap.get("identity-box"), dsym = Symbol(), tooltips = {
get "PanelUI-menu-button"() {	/* delete this["PanelUI-menu-button"]; */
	glob.mode_skin(''); return hmap.get("PanelUI-menu");
},
[dsym]: GetDynamicShortcutTooltipText("downloads-button") + "\n" + hmap.get("downloads-button"),
get "pageAction-urlbar-_2495d258-41e7-4cd5-bc7d-ac15981f064e_"() {
	return hmap.get("ReaderView") + br_val();
},
"_531906d3-e22f-4a6c-a102-8057b88a1a63_-browser-action": hmap.get("ssave"), // Single Save id
"_b9db16a4-6edc-47ec-a1f4-b86292ed211d_-browser-action": hmap.get("VideoDownloadHelper"),
get "downloads-button"() {
	var hint = this[dsym], dw = glob.dirsvcget("DfltDwnld"); // if (есть id?) hint += "Add text";
	if (dw) glob.mode_skin(`${prefs.getIntPref("permissions.default.image") > 1 ? "\u{1F6A6} Графика отключена," : "💾 папка"}` + " [Загрузки] " + glob.str_cut(dw.path, 96, ''));
	return hint;
},
get "reload-button"() {
	glob.mode_skin(''); return GetDynamicShortcutTooltipText("reload-button") +"\n\n"+ hmap.get("reload-button") +"\n" + hmap.get("wheel-stop");
},
get "stop-button"() {
	return GetDynamicShortcutTooltipText("stop-button") +"\n"+ hmap.get("wheel-stop");
},
get "zoompage-we_dw-dev-browser-action"() {
	return tooltip_x(window.event.target, "⩉ Ролик ±	Изменить масштаб");
},
get "print-button"() { return hmap.get("print-button");},
get "identity-box"() {
	toStatus(hmap.get("bright") + br_val(), 1000);
	return tooltip_x(window.event.target, br_txt + br_val());
},
get "identity-icon-box"() { // нестандартная подсказка
	return tooltip_x(window.event.target, br_txt + br_val());
},
get "tracking-protection-icon-container"() { // нестандартная подсказка
	var trg = window.event?.target;
	return trg.id.endsWith("r") && trg.textContent +'\n'+ hmap.get("tracking-protection");
},
get "AttributesInspector"() { return hmap.get("AttributesInspector");},
get "ucf_SessionManager"() { toStatus("период сохранения сессий меняется в меню кнопки «Журнал»");},
get "ToggleButton"() { zoom(0, 0, 0, `, ${prefs.getBoolPref("browser.tabs.loadInBackground") ? "Не выбирать новые вкладки" : "Переключаться в новые вкладки"}`);}, // масштаб
} // end tooltips
document.getElementById("tracking-protection-icon-container").removeAttribute("tooltip");

var listener = { // дополнительные клики кнопок в data = {…} и перехват существующих. без doubleclick
	filter(sel) {
		return this.closest(sel);
	},
	find(sel) {
		return data[sel][this] || data[sel][this + 1];
	},
	handleEvent(e) {
		if (this.skip || e.detail > 1) return; var trg = e.target;
		if (e.type == "mouseenter") {
			var hint = tooltips[trg.id] || tooltips[(trg = trg.parentNode).id];
			if (hint) trg.tooltipText = hint; return; // обновить подсказку
		}
		var sels = this.selectors.filter(this.filter, trg);
		var {length} = sels;
		if (!length) return;
		var wh = e.type.startsWith("w");
		var num = e.metaKey*64 + e.ctrlKey*32 + e.shiftKey*16 + e.altKey*8 + (wh ? 2 : e.button*128 /* + dbl*4 */);
		var obj = data[
			length > 1 && sels.find(this.find, num) || sels[0]
		];
		DEBUG && log('id= «'+ trg.id +'» key: «'+ num +'» '+ Math.random());
		if (wh) return obj[num]?.(trg, e.deltaY < 0); // wheel
// mousedown
		if (e.type.startsWith("m")) {
			obj.mousedownTarget && this.stop(e);
			this.longPress = false; // даёт задержку при обычном клике
			if (++num in obj)
				this.mousedownTID = setTimeout(this.onLongPress, 640, trg, obj, num);
			if (e.button == 2)
				this.ctx = trg.getAttribute("context"),
				trg.setAttribute("context", "");
			return;
		}
		obj.mousedownTarget || this.stop(e);	// click
		if (this.longPress) return this.longPress = false;
		this.mousedownTID &&= clearTimeout(this.mousedownTID);
		if (!obj[num]) {
			if (e.button == 1) return;
			if (e.button) {
				num = "context";
				for(var p in this.a) this.a[p] = e[p];
			} else
				num = "dispatch",
				this.mdt = obj.mousedownTarget;
			obj = this;
		}
		obj[num](trg);
	},
	get selectors() {
		this.onLongPress = (trg, obj, num) => {
			this.mousedownTID = null;
			this.longPress = true;
			obj[num](trg);
		}
		delete this.selectors;
		return this.selectors = Object.keys(data);
	},
	get mdEvent() {
		delete this.mdEvent;
		return this.mdEvent = new MouseEvent("mousedown", {bubbles: true});
	},
	context(trg) {
		this.ctx
			? trg.setAttribute("context", this.ctx)
			: trg.removeAttribute("context");
		trg.dispatchEvent(new MouseEvent("contextmenu", this.a));
	},
	dispatch(trg) {
		this.skip = true;
		this.mdt ? trg.dispatchEvent(this.mdEvent) : trg.click();
		this.skip = false;
	},
	stop: e => {
		e.preventDefault();
		e.stopImmediatePropagation();
	},
	a: {__proto__: null, bubbles: true, screenX: 0, screenY: 0}
},
userjs = (myjs = "chrome://user_chrome_files/content/custom_scripts/User.js", t = "END User.js") => { // внешний скрипт
	if (!DEBUG) document.getElementById("key_browserConsole").doCommand(); // открыть консоль
	glob.FileExists(myjs) ? eval(Cu.readUTF8URI(Services.io.newURI(myjs))) : t = myjs + " — скрипт не найден";
	log(t + " " + Math.random());
},
keydown_win = e => { if (DEBUG == 1) log(e.keyCode); // нажатие клавиш
	if (e.keyCode == 83 && e.altKey) { // Alt+S [+Shift]
		var singlesave = document.getElementById("_531906d3-e22f-4a6c-a102-8057b88a1a63_-browser-action");
		e.shiftKey ? singlesave ? singlesave.click() : save() : save(); // имитировать клик по кнопке, используя её Id
	}
	if (e.keyCode == 88 && e.altKey) userjs(); // Alt+X отладка внешнего JS-кода
}
window.addEventListener("keydown", keydown_win);
var toolbars = ["nav-bar", "ucf-additional-vertical-bar", "widget-overflow-mainView"].map(i => document.getElementById(i)).filter(Boolean),
events = ["click", "mousedown", "wheel", "mouseenter"]; // appMenu-protonMainView
for(var bar of toolbars) for(var type of events)
	bar.addEventListener(type, listener, true);
ucf_custom_script_win.unloadlisteners.push(id);
ucf_custom_script_win[id] = {destructor() {
	window.removeEventListener("keydown", keydown_win);
	for(var bar of toolbars) for(var type of events)
		bar.removeEventListener(type, listener, true);
}};
var addDestructor = nextDestructor => {
	var {destructor} = ucf_custom_script_win[id];
	ucf_custom_script_win[id].destructor = () => {
		try {destructor();} catch(ex) {Cu.reportError(ex);}
		nextDestructor();
	}
} // END Hooks

glob.mode_skin(); var my_br = "ucf.tabbrowser-tabpanels.opacity", // яркость страниц
getIntPref = (p) => prefs.getIntPref(p, 100),
sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
css = `@-moz-document url(chrome://browser/content/browser.xhtml) {
	:is(${id})[rst] {filter: grayscale(1%) !important;}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabbox {background-color: black !important;}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabpanels {opacity:${getIntPref(my_br)/100} !important;}}`,
str = "ucf-tabbrowser-tabpanels-opacity-style", url = `resource://${str}/`;
Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler)
	.setSubstitution(str, Services.io.newURI("data:text/css," + encodeURIComponent(css)));
sss.loadAndRegisterSheet(Services.io.newURI(url), sss.USER_SHEET);
var st = InspectorUtils.getAllStyleSheets(document).find(s => s.href == url).cssRules[0].cssRules[2].style;
var observer = () => st.setProperty("opacity", getIntPref(my_br)/100, "important");
prefs.addObserver(my_br, observer);
this.removePrefObs = () => prefs.removeObserver(my_br, observer); // end яркость

switchProxy = (pac = 'https://antizapret.prostovpn.org/proxy.pac', pn = 'network.proxy.type') => {
	if (prefs.getIntPref(pn) != 2) // выключить
		prefs.setIntPref(pn, 2), prefs.setStringPref('network.proxy.autoconfig_url', pac)
	else
		prefs.setIntPref(pn, 5), prefs.setStringPref('network.proxy.autoconfig_url', "localhost");
	glob.mode_skin(); // разный фон замка для Прокси
	BrowserReload();
},
saveSelectionToTxt = async () => { // сохранить выделенный/весь текст страницы как .txt
	var msgName = id + ":Save:GetSelection", splice = saveURL.length == 10;
	var receiver = msg => {
		var args = ["data:text/plain," + encodeURIComponent(gBrowser.currentURI.spec + "\n\n" + msg.data),
			glob.Title(0) + '.txt', null, false, true, null, window.document];
		splice && args.splice(5, 0, null);
		saveURL(...args); toStatus(glob.str_cut("√ текст сохранён: "+ glob.Title(0), 96, ''));
	}
	messageManager.addMessageListener(msgName, receiver);
	addDestructor(() => messageManager.removeMessageListener(msgName, receiver));
	var func = fm => {
		var res, fed, win = {}, fe = fm.getFocusedElementForWindow(content, true, win);
		var sel = (win = win.value).getSelection();
		if (sel.isCollapsed) {
			var ed = fe && fe.editor;
			if (ed && ed instanceof Ci.nsIEditor)
				sel = ed.selection, fed = fe;
		}
		if (sel.isCollapsed)
			fed && fed.blur(), docShell.doCommand("cmd_selectAll"),
			res = win.getSelection().toString(), docShell.doCommand("cmd_selectNone"),
			fed && fed.focus();
		res = res || sel.toString();
		/\S/.test(res) && sendAsyncMessage("saveSelectionToTxt", res);
	}
	var url = "data:;charset=utf-8," + encodeURIComponent(`(${func})`.replace("saveSelectionToTxt", msgName)) + '(Cc["@mozilla.org/focus-manager;1"].getService(Ci.nsIFocusManager));';
	(saveSelectionToTxt = () => gBrowser.selectedBrowser.messageManager.loadFrameScript(url, false))();
},
save = async () => { // SingleHtml by Лекс, правка: Dumby, mod Dobrov
	var msgName = id + "ucfDwnldsBtnSaveSnapshotToHTML", dir,
	write = IOUtils.writeUTF8 ? "writeUTF8" : "writeAtomicUTF8",
	msgListener = async msg => {
		var [fileContent, fileName] = msg.data, dir = glob.dirsvcget("DfltDwnld"), // fileName: выделенный текст или null
		arr = prefs.getStringPref("ucf.savedirs","_Web||_Images|0").split('|').slice(0,2); // subdir: title|host
		arr[1] = (arr[1] == "0") ? glob.Title(100) : (arr[1] == "1") ? glob.Title(-1) : ""; // имя вкладки или домен
		arr.forEach(dir.append); dir.exists() && dir.isDirectory() || dir.create(dir.DIRECTORY_TYPE, 0o777);
		file.initWithPath(dir.path); if (!fileName) fileName = glob.Title(100); // убрать служебные символы
		dir.append(glob.Title(0, fileName) +'.html');
		await IOUtils[write](dir.path, fileContent) && toStatus(glob.str_cut("√ страница записана: "+ fileName, 96,''));
		var d = await Downloads.createDownload({source: "about:blank",target: FileUtils.File(dir.path)}); // Fake download
		(await Downloads.getList(Downloads.ALL)).add(d); d.refresh(d.succeeded = true); // кнопка Загрузки мигает
		gBrowser.selectedTab.style.filter = "blur(0.5px) drop-shadow(0px 1px 0px #808)";
	}
	messageManager.addMessageListener(msgName, msgListener);
	addDestructor(() => messageManager.removeMessageListener(msgName, msgListener));
	var svc = 'globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services';
	var url = "data:;charset=utf8," + encodeURIComponent(`(${func})(${svc});`.replace("%MSG_NAME%", msgName));
	(save = () => gBrowser.selectedBrowser.messageManager.loadFrameScript(url, false))();
},
br_val = () => {
	return ` ${prefs.getIntPref("ucf.tabbrowser-tabpanels.opacity",100)}%`;
},
bright = (trg, forward, step = 1, val) => { // wheel
	if (!val) var val = getIntPref(my_br) + (forward ? step : -step);
	val = val > 100 ? 100 : val < 20 ? 20 : val;
	prefs.setIntPref(my_br, val), trg.toggleAttribute("rst"), toStatus(hmap.get("bright") + val +"%", 1e3);
},
tooltip_x = (trg, text = "", ttt = "") => {
	if (!trg.id.endsWith("x")) { // box
		ttt = (trg.hasAttribute("tooltiptext")) ? trg.ttt = trg.tooltipText : trg.ttt;
		if (ttt && ttt.indexOf(text) == -1) ttt += "\n\n";
		trg.removeAttribute("tooltiptext");
	}
	return (ttt.indexOf(text) == -1) ? ttt + text : ttt;
},
zoom = (forward, toggle = false, change = true, text = '') => {
	toggle ? ZoomManager.toggleZoom() : change ? forward ? FullZoom.enlarge() : FullZoom.reduce() : 0;
	toStatus("± Масштаб "+ Math.round(ZoomManager.zoom*100) +`%${prefs.getBoolPref("browser.zoom.full") ? "" : " (только текст)"}` + text, 3e3);
},
help = (btn, help = 'chrome://user_chrome_files/content/FF-help.html') => { // встроенная справка
	(glob.FileExists(help)) ? switchTab(help) : switchTab('http://forum.puppyrus.org/index.php?topic=22762');
},
translate = (browserMM = gBrowser.selectedBrowser.messageManager) => { // перевод сайта | выделенного текста
	browserMM.addMessageListener('getSelect', function listener(msg) {
		if (msg.data) // Перевод выделенного в Яндекс
			switchTab("https://translate.google.com/#view=home&op=translate&sl=auto&tl=ru&text="+ msg.data, true)
		else // Гугл или Перевод сайта в Яндекс
			switchTab("https://translate.yandex.com/translate?url=" + gURLBar.value + "&dir=&ui=ru&lang=auto-ru", true);
	browserMM.removeMessageListener('getSelect', listener, true);
	});
	browserMM.loadFrameScript('data:,sendAsyncMessage("getSelect", content.document.getSelection().toString())', false);
},
openProxyWin = (win = browserWindow(), _win = Services.wm.getMostRecentWindow("aTaB:ProxyWin")) => {
	if (_win) _win.focus()
	else {
		_win = win.openDialog("chrome://browser/content/preferences/dialogs/connection.xhtml", "_blank", "chrome,dialog=no,centerscreen,resizable");
		_win.addEventListener("DOMContentLoaded", () => {
			_win.document.documentElement.setAttribute("windowtype","aTaB:ProxyWin");
		}, { once: true });
		_win.opener = win; _win.opener.gSubDialog = {_dialogs: []};
	}
},
bookmarkNoPopup = (bookmarks = PlacesUtils.bookmarks) => { // закладка без запроса
	var url = gBrowser.selectedBrowser.currentURI.spec;
	bookmarks.search({url}).then(async array => {
		if (array.length)
			try { await bookmarks.remove(array);} catch {}
		else
			try { await bookmarks.insert({
						url: Services.io.newURI(url),
						title: (gBrowser.contentTitle || gBrowser.selectedTab.label || url),
						parentGuid: [() => bookmarks.toolbarGuid, () => bookmarks.menuGuid, () => bookmarks.unfiledGuid][Services.prefs.getIntPref("bookmarksparentguid", 0)](),
						index: bookmarks.DEFAULT_INDEX
					});
			} catch {}
	});
}, // END functions

data = { // клики любых кнопок: meta*64 ctrl*32 shift*16 alt*8 (wh ? 2 : button*128) long*1
	"#reload-button": {
		1() { // Long
			gBrowser.selectAllTabs(); gBrowser.reloadMultiSelectedTabs(); gBrowser.clearMultiSelectedTabs();
		},
		128() { for ( var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop();}, // СКМ
		256() { BrowserReloadSkipCache();}, // ПКМ
	},
	"#stop-button": {
		128() { // СКМ
			for ( var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop();
		},
	},
	"#print-button": {
		1(btn) { help(btn);}, // Long
		128() { userjs();}, // СКМ отладка внешнего JS-кода
		256() { // ПКМ Click
			document.getElementById("menu_print").doCommand();
		},
	},
	"#downloads-button": { mousedownTarget: true, // не передавать нажатия дальше
		1() { // Long
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(), Cu.reportError);
		},
		8() { // Click + Alt
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(), Cu.reportError);
		},
		16(btn) { // Click + Shift
			var pref = "permissions.default.image", n = prefs.getIntPref(pref) == 2;
			prefs.setIntPref(pref, n ? 1 : 2); glob.mode_skin();
			toStatus("Загрузка изображений " + `${n ? '√ разрешена' : '✘ запрещена'}`,3e3); //`
			BrowserReload();
		},
		128() { saveSelectionToTxt();}, // СКМ Click (сохранить .txt)
		256() { save();}, // ПКМ Click (Single HTML)
	},
	"#PanelUI-menu-button": { mousedownTarget: true, // document.getElementById("panic-button").click()
		1(btn) { goQuitApplication(btn);}, // Long
		16(btn) { help(btn);}, // ЛКМ + Shift
		8() { 	windowState != STATE_MAXIMIZED ? maximize() : restore();}, // ЛКМ + Alt
		128() {	windowState != STATE_MAXIMIZED ? maximize() : restore();}, // СКМ
		129() {	BrowserFullScreen();}, // СКМ Long
		136(btn) { BrowserFullScreen();},// СКМ + Alt
		2(trg, forward) { // крутить + Закрыть вкладку, крутить - Восстановить вкладку
			forward ? trg.ownerGlobal.undoCloseTab() : trg.ownerGlobal.BrowserCloseTabOrWindow();
		},
		256(btn) { minimize();}, // ПКМ
		264() { switchTab('about:support');}, // Alt + ПКМ
		272(btn) { btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("History")}, // ПКМ + Shift
	},
	"#pageAction-urlbar-_2495d258-41e7-4cd5-bc7d-ac15981f064e_": { // Reader View Button
		128(btn) { // СКМ
			btn.ownerDocument.getElementById("key_toggleReaderMode").doCommand(); // штатный Режим чтения
		},
		2(trg, forward) { bright(trg, forward);}, // яркость по wheel ±
		256(btn) { // ПКМ
			btn.ownerDocument.getElementById("key_responsiveDesignMode").doCommand(); // запуск пункта меню с HotKey
			if (gBrowser.selectedBrowser.browsingContext.inRDMPane) BrowserReload();
		},
	},
	"#star-button-box": {
		1() { translate();}, // Long
		8() { // ЛКМ + Alt
			window.PlacesCommandHook.showPlacesOrganizer("BookmarksToolbar"); // Библиотека Панель закладок
		},
		128() { zoom(0, 1);}, // СКМ
		256() { bookmarkNoPopup();}, // ПКМ
	},
	"#identity-box": { // Замок, identity-permission-box: Разрешения
		1() { switchProxy();}, // Long
		8() {		openProxyWin();}, // Left + Alt
		128() {	openProxyWin();}, // СКМ
		16() { switchTab('about:serviceworkers');}, // Left + Shift
		2(trg, forward) { bright(trg, forward);}, // яркость
		10(trg, forward) { bright(trg, forward, 5);}, // яркость
		256(btn) { // ПКМ
			gClipboard.write(gURLBar.value);
			glob.flash_bg_text('urlbar-input-container', 0, 'rgba(240,176,0,0.5)', 300, "в буфере: "+ gURLBar.value.slice(0, 80));
		},
	},
	"#tracking-protection-icon-container": {
		256(btn) { // ПКМ
			var logins = btn.ownerDocument.getElementById("ucf-logins-sitedata");
			logins ? logins.click() : switchTab('about:logins');
		},
		1() { // L Long
			var pref = Services.prefs, n = "browser.display.use_document_fonts", f = pref.getIntPref(n, 0) ? 0 : 1;
			pref.setIntPref(n, f); zoom(0, 0, 0, (f > 0) ? " + Web-шрифты" : ""); BrowserReload();
		},
		128() { switchTab('about:performance');}, // СКМ
	},
	"#favdirs-button": { // CustomizableUI в скрипте
		0() {
			glob.togglebar("viewBookmarksSidebar");}, // Left Click
		256() { glob.togglebar("viewHistorySidebar");}, // ПКМ
		8() { // Click + Alt
			glob.dirsvcget("Home",undefined,true);
		},
		128(btn) { // СКМ
			btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("Downloads"); // Библиотека Загрузки
		},
		136() { // CKM + Alt
			glob.dirsvcget("UChrm","user_chrome_files",true);
		},
		264() { // Alt+ПКМ
			glob.dirsvcget("GreD",undefined,true);
		},
	},
	"#AttributesInspector": { // CustomizableUI в скрипте
		1(btn) { help(btn);}, // Long
		128() { // CKM Clean Cache
			var cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
			Services.obs.notifyObservers(cancelQuit, "quit-application-requested", "restart");
			if (cancelQuit.data) return false;
			Services.appinfo.invalidateCachesOnRestart();
			var restart = Services.startup;
			restart.quit(restart.eAttemptQuit | restart.eRestart);
		},
		136() { // Не восстанавливать сессию при следующем запуске
			Services.obs.notifyObservers(null, "browser:purge-session-history");
			Cu.import("resource:///modules/sessionstore/SessionFile.jsm", {}).SessionFileInternal.write = async () => {}; // код исполняется при выходе из браузера
		},
		256() { // ПКМ
			var pref = Services.prefs, chr = "devtools.chrome.enabled", rem = "devtools.debugger.remote-enabled";
				if (!pref.getBoolPref(chr) || !pref.getBoolPref(rem)) {
					pref.setBoolPref(chr, true); pref.setBoolPref(rem, true);
			}
			var { BrowserToolboxLauncher } = ChromeUtils.import("resource://devtools/client/framework/browser-toolbox/Launcher.jsm");
			BrowserToolboxLauncher.init();
		},
		8(btn) { // Click + Alt
			window.openDialog("chrome://user_chrome_files/content/options/prefs_win.xhtml", "user_chrome_prefs:window", "centerscreen,resizable,dialog=no"); // "about:user-chrome-files"
		},
	},
	"#zoompage-we_dw-dev-browser-action": {
		2(trg, forward) { zoom(forward); // wheel
		},
	},
	"#ToggleButton": { mousedownTarget: true,
		0(btn) { // Left Click
			if (btn.id == 'ToggleButton') { // это клик в меню кнопки
				var bar = btn.ownerDocument.querySelector("#ucf-additional-vertical-bar");
				if (!bar)
					window.SidebarUI.toggle("viewHistorySidebar")
				else
					window.setToolbarVisibility(bar, bar.collapsed),
					bar.collapsed ? window.SidebarUI.hide() : window.SidebarUI.show("viewHistorySidebar");
			}
		},
		2(trg, forward) { zoom(forward); // wheel
		},
		16(btn) { zoom(0, 1);}, // ЛКМ + Shift
		1(btn, trg) { // Long Left
			if (btn.id == 'ToggleButton')
				switchProxy()
			else { // клик в меню быстрых настроек
				glob.about_config(btn.pref.pref); // переход к указанному параметру about:config
				btn.parentNode.parentNode.secondaryPopup.hidePopup();
			}
		},
		8(btn) { // Click + Alt
			window.PlacesCommandHook.showPlacesOrganizer("BookmarksToolbar"); // Библиотека Панель закладок
		},
		256(btn) { // ПКМ
			// if (/загрузка графики/i.test(btn.label)) setTimeout(() => glob.mode_skin(), 200);
		},
		264(btn) { // ПКМ + Alt
			document.getElementById("menu_eyedropper").click(); // Линза
		},
		288(btn) { // Ctrl + ПКМ btn.ownerDocument.getElementById("key_viewInfo").doCommand();
			BrowserPageInfo(btn, "mediaTab"); // каждый раз открывает диалог feedTab permTab securityTab
		},
		272() { switchTab("about:user-chrome-files");}, // ПКМ + Shift
		128(btn) { // СКМ
			if (btn.id == 'ToggleButton')
				switchTab("about:newtab", true)
			else { // клик в меню быстрых настроек
				switchTab('about:serviceworkers');
				btn.parentNode.parentNode.secondaryPopup.hidePopup();
			}
		},
		129(btn) { btn.ownerDocument.getElementById("key_browserConsole").doCommand();}, // Консоль браузера Long CKM
		136() { // СКМ + Alt
			var pref = Services.prefs, n = "browser.display.use_document_fonts", f = pref.getIntPref(n, 0) ? 0 : 1;
			pref.setIntPref(n, f); zoom(0, 0, 0, (f > 0) ? " + Web-шрифты" : ""); BrowserReload();
		},
	},
}; document.getElementById("nav-bar").tooltipText = 'ucf_complete'; // END hookClicks

})("hookClicks-and-tooltips", ({io, focus}) => { // SingleHTML не сохраняет svg графику

var resolveURL = function (url, base) {
	try { return io.newURI(url, null, io.newURI(base)).spec;} catch {}
},
getSelWin = function (w) {
	if (w.getSelection().toString()) return w;
	for (var i = 0, f, r; f = w.frames[i]; i++) {
		try { if (r = getSelWin(f)) return r;} catch {}
	}
},
encodeImg = function (src, obj) {
	var canvas, img, ret = src;
	if (/^https?:\/\//.test(src)) {
		canvas = doc.createElement('canvas');
		if (!obj || obj.nodeName.toLowerCase() != 'img') {
			img = doc.createElement('img');
			img.src = src;
		} else
			img = obj;
		if (img.complete) try{
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext('2d').drawImage(img, 0, 0);
			ret = canvas.toDataURL((/\.jpe?g/i.test(src) ? 'image/jpeg' : 'image/png'));
		} catch {};
		if (img != obj) img.src = 'about:blank';
	};
	return ret;
},
toSrc = function (obj) {
	var strToSrc = function (str) {
		var chr, ret = '', i = 0, meta = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '\x22' : '\\\x22', '\\': '\\\\'};
		while (chr = str.charAt(i++)) {
			ret += meta[chr] || chr;
		};
		return '\x22' + ret + '\x22';
	},
	arrToSrc = function (arr) {
		var ret = [];
		for (var i = 0; i < arr.length; i++) {
			ret[i] = toSrc(arr[i]) || 'null';
		};
		return '[' + ret.join(',') + ']';
	},
	objToSrc = function (obj) {
		var val, ret = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop) && (val = toSrc(obj[prop]))) ret.push(strToSrc(prop) + ': ' + val);
		};
		return '{' + ret.join(',') + '}';
	};
	switch (Object.prototype.toString.call(obj).slice(8, -1)) {
		case 'Array': return arrToSrc(obj);
		case 'Boolean':
		case 'Function':
		case 'RegExp': return obj.toString();
		case 'Date': return 'new Date(' + obj.getTime() + ')';
		case 'Math': return 'Math';
		case 'Number': return isFinite(obj) ? String(obj) : 'null';
		case 'Object': return objToSrc(obj);
		case 'String': return strToSrc(obj);
		default: return obj ? (obj.nodeType == 1 && obj.id ? 'document.getElementById(' + strToSrc(obj.id) + ')' : '{}') : 'null';
	}
},
mainWin = {};
focus.getFocusedElementForWindow(content, true, mainWin);
mainWin = mainWin.value;
var selWin = getSelWin(mainWin), win = selWin || mainWin, doc = win.document, loc = win.location;
var ele, pEle, clone, reUrl = /(url\(\x22)(.+?)(\x22\))/g;
if (selWin) {
	var rng = win.getSelection().getRangeAt(0);
	pEle = rng.commonAncestorContainer;
	ele = rng.cloneContents();
} else {
	pEle = doc.documentElement;
	ele = (doc.body || doc.getElementsByTagName('body')[0]).cloneNode(true);
};
while (pEle) {
	if (pEle.nodeType == 1) {
		clone = pEle.cloneNode(false);
		clone.appendChild(ele);
		ele = clone;
	};
	pEle = pEle.parentNode
};
var sel = doc.createElement('div');
sel.appendChild(ele);
for (var el, all = sel.getElementsByTagName('*'), i = all.length; i--;) {
	el = all[i];
	if (el.style && el.style.backgroundImage) el.style.backgroundImage = el.style.backgroundImage.replace(reUrl, function (a, prev, url, next) {
		if (!/^[a-z]+:/.test(url)) url = resolveURL(url, loc.href);
		return prev + encodeImg(url) + next;
	});
	switch (el.nodeName.toLowerCase()) {
		case 'link':
		case 'style':
		case 'script': el.parentNode.removeChild(el); break;
		case 'a':
		case 'area': if (el.hasAttribute('href') && el.getAttribute('href').charAt(0) != '#') el.href = el.href; break;
		case 'img':
		case 'input': if (el.hasAttribute('src')) el.src = encodeImg(el.src, el); break;
		case 'audio':
		case 'video':
		case 'embed':
		case 'frame':
		case 'iframe': if (el.hasAttribute('src')) el.src = el.src; break;
		case 'object': if (el.hasAttribute('data')) el.data = el.data; break;
		case 'form': if (el.hasAttribute('action')) el.action = el.action; break;
	}
}
var head = ele.insertBefore(doc.createElement('head'), ele.firstChild), meta = doc.createElement('meta'), sheets = doc.styleSheets;
meta.httpEquiv = 'content-type'; meta.content = 'text/html; charset=utf-8';
head.appendChild(meta);
head.copyScript = function (unsafeWin) {
	if ('$' in unsafeWin) return;
	var f = doc.createElement('iframe');
	f.src = 'about:blank';
	f.setAttribute('style', 'position:fixed;left:0;top:0;visibility:hidden;width:0;height:0;');
	doc.documentElement.appendChild(f);
	var str, script = doc.createElement('script');
	script.type = 'text/javascript';
	for (var name in unsafeWin) {
		if (name in f.contentWindow || !/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name)) continue;
		try {
			str = toSrc(unsafeWin[name]);
			if (!/\{\s*\[native code\]\s*\}/.test(str)) {
				script.appendChild(doc.createTextNode('var ' + name + ' = ' + str.replace(/<\/(script>)/ig, '<\\/$1') + ';\n'));
			}
		} catch {};
	};
	f.parentNode.removeChild(f);
	if (script.childNodes.length) this.nextSibling.appendChild(script);
}
head.copyScript(win.wrappedJSObject || win);
head.copyStyle = function (s) {
	if (!s) return;
	var style = doc.createElement('style');
	style.type = 'text/css';
	if (s.media && s.media.mediaText) style.media = s.media.mediaText;
	try {
		for (var i = 0, rule; rule = s.cssRules[i]; i++) {
			if (rule.type != 3) {
				if((!rule.selectorText || rule.selectorText.indexOf(':') != -1) || (!sel.querySelector || sel.querySelector(rule.selectorText))) {
					var css = !rule.cssText ? '' : rule.cssText.replace(reUrl, function (a, prev, url, next) {
						if (!/^[a-z]+:/.test(url)) url = resolveURL(url, s.href || loc.href);
						if(rule.type == 1 && rule.style && rule.style.backgroundImage) url = encodeImg(url);
						return prev + url + next;
					});
					style.appendChild(doc.createTextNode(css + '\n'));
				}
			} else {
				this.copyStyle(rule.styleSheet);
			}
		}
	} catch {
		if (s.ownerNode) style = s.ownerNode.cloneNode(false);
	};
	this.appendChild(style);
}
for (var j = 0; j < sheets.length; j++) head.copyStyle(sheets[j]);
head.appendChild(doc.createTextNode('\n'));
var doctype = '', dt = doc.doctype;
if (dt && dt.name) {
	doctype += '<!DOCTYPE ' + dt.name;
	if (dt.publicId) doctype += ' PUBLIC \x22' + dt.publicId + '\x22';
	if (dt.systemId) doctype += ' \x22' + dt.systemId + '\x22';
	doctype += '>\n';
}
sendAsyncMessage("%MSG_NAME%", [doctype + sel.innerHTML +'\n<a href='+ (loc.protocol != 'data:' ? loc.href : 'data:uri') +'><small><blockquote>источник: '+ new Date().toLocaleString("ru") +'</blockquote></small></a>', selWin ? win.getSelection().toString().slice(0, 200) : undefined]); // выделенный текст
}); // END SingleHTML