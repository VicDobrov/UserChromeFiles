(async(Ff,tExp)=>{ // hook MouseKeys © Dumby, mod 2.0 Dobrov кнопки команды скин…
Tag = {"downloads-button":'{'+ //нужен SingleHTML.jsm, зависимый ucf_QuickToggle
`
◉ колёсико	⬇︎ папка [Загрузки]
◨ правый клик ➜ Сохранить сайт
◉ колёсико на Фото ➜ Сохранить︰`+ //действия клавиш|мыши, подсказки

`◧ лево Держать ⬇︎ папка [Загрузки]\n
◨ правый клик (Alt+S) ➜ Сохранить\n    в единый Html всё / выделенное
◉ колёсико, ${Ff.Ctr("Super","Ctrl+Shift")}+S как Текст\n
◧ дважды на Фото: найти Похожие
◧ лево + Shift	Графика вкл/выкл
◧ + Alt	Диалог выбора вкл/выкл}`,"PanelUI-menu-button": //текст Простой режим︰Эксперт

`◧ лев. клик	меню Firefox ${Ff.ver}{\n︰
◧ + Shift	краткая Справка\n}
◧ держать	✕ Закрыть браузер\n` +`◧ +Alt, ◉ ролик  Окно│Развернуть

◨ прав. клик	⇲ Свернуть {︰` /*эксперт*/+ `
◨ + Alt		Сведения о системе}
Ø ролик ↑	⤾ Вернуть вкладку`,"zoompage-we_dw-dev-browser-action":
`
◉ + Shift		Закрыть вкладки слева
◉ колёсико +Alt	Закрыть справа`,"tabs-newtab-button":
`
◨ прав. клик	Вернуть вкладку
◧ лев.+ Alt  Оставить 1 текущую`,"identity-box": //debug ☑ команды|действия в консоль

`Правый клик	 Копировать адрес в буфер
◉, Клик + Alt	 Настройки прокси {︰\n
◧ лево + Shift	 Медиа на странице}
Ø колёсико ±	 Яркость страниц `,"favdirs-button": //боковая панель открыта: debug Вкл

`Левый клик	★ Закладки\n◧ + Alt		Домашняя папка
Правый		⟳ История\n◨ + Alt		Папка установки\n
◉ колёсико	⬇︎ Загрузки
◉ ролик +Alt	UserChromeFiles`,"ToggleButton": //◨ + Alt посл.закладка меню

`левая кнопка ◧ мыши: «Журнал»\n
◨ правая	Меню быстрых настроек
◉ Колёсико	⊞ Новая вкладка (${Ff.Ctr()}T)\n
◧ лев.+ Alt	Библиотека, Журнал {︰
◧ держать	Пипетка цвета, линза\n
◧ + Shift	масштаб Текст / Всё}
Ø Ролик ±	масштаб Страницы`,"ReaderView":

`Клик мыши	Чтение в ReaderView
Колёсико	Простой режим чтения\n`,"reader-mode-button":
`
Правый клик	Адаптивный дизайн
Alt + R		Выбор части страницы\n
Крутить ±	Яркость страниц `,"print-button":

`Распечатать страницу (${Ff.Ctr()}P)\n
Правый клик	быстрая Печать
◉ ролик режим Простой|Эксперт
◧ держать	краткая Справка`,"reload-button":

`Правый клик	Обновить без кэша\n◧ держать	Обновить всё`,"tracking-protection-icon-container":
`
нажатие мыши	Сведения о защите сайта
◨ правый клик	Логины и Пароли
◉ колёсико		диспетчер Задач {︰\n
◧ лев. держать	⇆ Web-шрифты
◧ лев + Shift		ServiceWorkers}`,"wheel-stop":

`Колёсико:	Прервать обновления {︰
◨ п.держать	Антизапрет ⇆ Без прокси}\n`,"titlebar-button.titlebar-close": //кроме Windows

`Закрыть Firefox ${Ff.ver}\n
◉ колёсико	вернуть вкладку
◧ держать	краткая Справка\n◨ пр. клик	⇲ Свернуть`,"Attributes-Inspector":

`◧ лев. клик	Атрибут-Инспектор\n
◧ держать	режим Эксперт ↔︎ Простой
◧ + Alt		Инструменты браузера
◧ + Shift	Настройки профайлера`,"@": //тексты

`Очистить панель колёсиком мыши|Запрещённые сайты через АнтиЗапрет|☀ Яркость сайтов |💾 кэш, данные сайтов, куки занимают |Захват цвета в Буфер обмена (курсор двигает на 1 точку)|⚡️ Запрещено сохранять логины и пароли|◧ about:config, ◨ пр. клик Сброс, ⟳ Обновить, ↯ Перезапуск|Долгий клик в строке меню: Править опцию │ Колёсико: Сервисы|Ошибка скрипта |↯ Не запоминать историю посещений|↯ Удалять историю посещений, закрывая браузер|период сохранения сессий меняется в меню кнопки «Журнал»|SingleFile (Alt+Ctrl+S)\nСохранить страницу в единый Html|Video DownloadHelper\nСкачивание проигрываемого видео|\n\n◨ пр. клик	настройки User Chrome Files\n◨ держать	Перезапустить, удалив кэш\nAlt + x		запустить скрипт User.js|\n◨ правый клик: Без запроса`};
var T = Tag["@"].split('|'), B = [...Object.keys(Tag),"viewHistorySidebar"], Node;

(async (id) => CustomizableUI.createWidget({label:`Панели, Папки`,id: id,tooltiptext: Tag[id],
onCreated(btn){btn.style.setProperty("list-style-image","url(chrome://devtools/skin/images/folder.svg)");}})
)(B[5]); // кнопки-подсказки-клики

klaBa = { //перехват-клавиш KeyA[_mod][_OS](e,t){код} и KeyB: "KeyA"
	KeyX_1(e,t) {userjs(e)}, // Alt+X запуск внешнего JS-кода
	KeyS_6() {saveSelToTxt()}, /* Ctrl+Shift+S */ KeyS_15: "KeyS_6",
	KeyS_1(e,t) {save()}, //Alt+S | e: Event, t: gBrowser.selectedTab
/*
	mod = e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey
	mod + I в конце: только в полях ввода, «i» кроме полей ввода
	1я буква строчная: передавать нажатия, запрет preventDefault
	отделять «_» от кода, если есть модификаторы и/или «iI»-флаг
	только в указанной OS: KeyA_1i_win(e,t){… Alt+A для винды */
},
Mouse = { // Meta*64 Ctrl*32 Шифт*16 Alt*8 (Wh ? 2 : But*128) long*1
	"urlbar-input": { // CapsLock On: skip action mouse|keyboard
		2(trg, forward){trg.value = ""} //очистить
	},
	"tabbrowser-tabs": { //<> вкладки колёсиком
		8(){},16(){},64(){}, //выбор
		2(trg,forward){
			gBrowser.tabContainer.advanceSelectedTab(forward ? -1 : 1,true);
		},
		128(btn){ // СМ
			gBrowser.removeTab(TabAct(btn))}, // вкладка под мышью
		136(btn){TabsDel(1, TabAct(btn))}, // СМ + Alt закрыть вкладки справа
		144(btn){TabsDel(0, TabAct(btn))} // СМ + Shift … слева
	},
	"stop-button": {
		128(){ // СМ
			for (var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop() },
		257(){switchProxy()}
	},
	"star-button-box": {
		1(){translate()}, //держать
		8(){ // ЛМ + Alt
			window.PlacesCommandHook.showPlacesOrganizer("BookmarksToolbar") }, //библиотека
		128(){switchTab(FavItem()) },
		129(){ // СМ+д
			switchTab(FavItem(false))	},
		256(){toFav()}
	},
	"appMenu-print-button2": { //меню Печать…
		1(){Help()}, 128(btn){Expert()},
		256(){Mouse[B[9]][256]()}
	},
	"pageAction-urlbar-_2495d258-41e7-4cd5-bc7d-ac15981f064e_": { //ReaderView
		2(trg,forward){bright(trg,forward,5)}, // яркость по wheel ±
		128(btn){
			btn.ownerDocument.getElementById("key_toggleReaderMode").doCommand() // штатный Режим чтения
		},
		256(btn){Mouse[B[8]][256](btn)}
	},
	[B[10]]: { //reload
		1(){ //д
			with (gBrowser) selectAllTabs(),reloadMultiSelectedTabs(),clearMultiSelectedTabs();
		},
		128(){for (var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop()}, // СМ
		256(){BrowserReloadSkipCache()}, //ПМ
		257(){switchProxy()} //дПМ
	},
	[B[3]]: { //newtab
		8(){gBrowser.removeAllTabsBut(gBrowser.selectedTab)},
		256(btn){btn.ownerGlobal.undoCloseTab()}
	},
	[B[9]]: { //print
		1(){Help()}, //д
		128(){Expert()},
		256(){document.getElementById("menu_print").doCommand()} //ПМ
	},
	[B[0]]: {mousedownTarget: true, // не передавать нажатия дальше
		1(){ //д
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)},
		8(){ //+Alt
			var p = "browser.download.improvements_to_download_panel", n = glob.pref(p);
			glob.pref(p, !n);
			glob.toStatus(`Подтверждение загрузки ${n ? "√ разреш" : "✘ запрещ"}ено`,3e3);
		},
		16(){ // +Shift
			var n = glob.pref(Ff.i) == 2; glob.pref(Ff.i, n ? 1 : 2);
			glob.mode_skin(); BrowserReload();
			glob.toStatus(`Загрузка изображений ${n ? "√ разреш" : "✘ запрещ"}ено`,3e3);
		},
		128(){Ff.Exp() //режим Простой/Эксперт: разные действия
			? saveSelToTxt() : //сохранить|выделен. как .txt
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)
		},
		256(){save()} //web
	},
	[B[1]]: {mousedownTarget: true, //PanelUI
		1(btn){goQuitApplication(btn)}, //д
		16(){Help()}, // ЛМ + Shift
		8(){windowState != STATE_MAXIMIZED ? maximize() : restore()}, // ЛМ + Alt
		128(){windowState != STATE_MAXIMIZED ? maximize() : restore()},
		129(){BrowserFullScreen()}, // дСМ
		136(){this[129]()},// СМ +Alt
		2(trg,forward){ // крутить +Закрыть вкладку -Восстановить
			forward ? trg.ownerGlobal.undoCloseTab() : trg.ownerGlobal.BrowserCloseTabOrWindow() },
		256(){minimize()},
		264(){switchTab('about:support')}, // Alt+ ПМ
		272(btn){btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("History")} // ПМ + Shift
	},
	[B[8]]: { //➿
		2(trg,forward){bright(trg,forward,5)}, // яркость
		256(btn){ // Mobile View
			btn.ownerDocument.getElementById("key_responsiveDesignMode").doCommand(); //пункт меню с HotKey
			if (gBrowser.selectedBrowser.browsingContext.inRDMPane) BrowserReload();}
	},
	[B[4]]: { //замок
		8(){		openProxyWin()}, //+Alt
		128(){	this[8]()},
		16(btn){ // +Shift
			BrowserPageInfo(btn,"mediaTab") // feedTab permTab securityTab
		},
		2(trg,forward){bright(trg,forward,5)}, //яркость
		10(trg,forward){bright(trg,forward)},
		256(){gClipboard.write(gURLBar.value);
			glob.flash(0,0,'rgba(240,176,0,0.5)',300,"в буфере: "+ gURLBar.value.slice(0,80));}
	},
	[B[11]]: { //щит
		1(){Mouse[B[6]][136]()}, //д Шрифты
		2(trg,forward){bright(trg,forward)},
		256(btn){ // ПМ
			var logins = btn.ownerDocument.getElementById("ucf-logins-sitedata");
			logins ? logins.click() : switchTab('about:logins');
		},
		16(){switchTab()}, // +Shift
		128(){switchTab('about:performance')} // СМ
	},
	[B[5]]: { //favdirs CustomizableUI в скрипте
		0(btn){btn.ownerGlobal.SidebarUI.toggle("viewBookmarksSidebar")}, //ЛМ
		256(btn){btn.ownerGlobal.SidebarUI.toggle(B[B.length-1])},
		8(){glob.dirsvcget("Home")}, //+ Alt
		128(btn){
			btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("Downloads") },
		136(){ // CM +Alt
			glob.dirsvcget("UChrm","user_chrome_files")},
		264(){ // ПМ +Alt
			glob.dirsvcget("GreD")}
	},
	"unified-extensions-button": {mousedownTarget: true,
		1(){Expert()}, //д
		256(){openDial()},
		257(){Mouse[B[14]][257]()}
	},
	[B[14]]: {mousedownTarget: true, //AttrView
		1(){Expert()}, //д
		256(){openDial()}, //UCFprefs
		257(){ //Пд Clean Cache
			var cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
			Services.obs.notifyObservers(cancelQuit,"quit-application-requested","restart");
			if (cancelQuit.data) return false;
			Services.appinfo.invalidateCachesOnRestart();
			var restart = Services.startup;
			restart.quit(restart.eAttemptQuit | restart.eRestart);
		},
		16(){switchTab('about:profiling')}, //+Shift
		8(){ //Л+Alt уд.отладка
			var chr = "devtools.chrome.enabled",rem = "devtools.debugger.remote-enabled";
			if (!glob.pref(chr) || !glob.pref(rem)) {
				glob.pref(chr,true); glob.pref(rem,true);
			}
			var {BrowserToolboxLauncher} = ChromeUtils.import("resource://devtools/client/framework/browser-toolbox/Launcher.jsm");
			BrowserToolboxLauncher.init();}
	},
	[B[13]]: { //title-close
		1(){Help()},
		128(btn){	btn.ownerGlobal.undoCloseTab()},
		256(){minimize()}
	},
	[B[2]]: {2(trg,forward){zoom(forward)} //zoompage
	},
	[B[6]]: {mousedownTarget: true, //ToggleButton
		0(btn){ //ЛМ
			if (btn.id == B[6]) {
				var bar = document.getElementById("ucf-additional-vertical-bar");
				if (bar) window.setToolbarVisibility(bar,document.getElementById("sidebar-box").hidden);
				window.SidebarUI.toggle(B[B.length-1]);
			} else if (btn.className == "menu-iconic") { //меню кнопки
				Node.hidePopup();
				glob.about_config(btn.pref.pref); //go параметр about:config 
			}
			else glob.mode_skin();
		},
		2(trg,forward){zoom(forward) }, // wheel
		16(btn){if (btn.id == B[6]) zoom(0,1)}, // ЛМ + Shift
		1(btn){ //д
			if (btn.id != B[6]) return; //линза
			glob.flash(0,0,'rgba(100,0,225,0.1)',500, T[4]);
			var url = `resource://devtools/shared/${parseInt(Ff.ver) > 95 ? "loader/" : ""}Loader.`;
			try {var exp = ChromeUtils.importESModule(url + "sys.mjs");} catch {exp = ChromeUtils.import(url + "jsm");}
			var obj = exp.require("devtools/client/menus").menuitems.find(menuitem => menuitem.id == "menu_eyedropper");
			(test = obj.oncommand.bind(null, {target:btn}))();
		},
		8(){switchTab('chrome://browser/content/places/places.xhtml')}, //+ Alt
		256(btn){ //для ucf_QuickToggle
			if (btn.id == B[6]) {
			if (btn.mstate != "open")
			  btn.secondaryPopup.openPopup(btn, "before_start")
			else
			  btn.secondaryPopup.hidePopup();
			setTimeout(()=> btn.mstate = btn.secondaryPopup.state, 100);
			} else glob.mode_skin();
		},
		264(){ /* ПМ +Alt */ switchTab(FavItem(false))},
		128(btn){ // СМ
			if (btn.id == B[6])
				switchTab("about:newtab", true)
			else //меню быстрых настроек
				switchTab(), Node.hidePopup();
		},
		129(btn){ /* дCM */ userjs(btn,"")}, //консоль
		136(){ // СМ +Alt
			var n = "browser.display.use_document_fonts",f = glob.pref(n) ? 0 : 1;
			glob.pref(n,f); zoom(0,0,0,(f > 0) ? " + Web-шрифты" : ""); BrowserReload();}
	}}; var M = Object.keys(Mouse);

(async (id) => CustomizableUI.createWidget({ label:id.replace('-',' '), id:id,
	defaultArea: CustomizableUI.AREA_NAVBAR, localized: false,
	onCreated(btn) {
		btn.setAttribute("image","data:image/webp;base64,UklGRjwAAABXRUJQVlA4TC8AAAAvD8ADAAoGbSM5Ov6k774XCPFP/0/03/8JGPxzroIzuOW06Ih60Genn1S/gHe+BgA=");
		btn.onmouseenter = btn.onmouseleave = this.onmouse;
		btn.setAttribute("oncommand","handleCommand(this)"); btn.handleCommand = this.handleCommand;
	},
	onmouse: e => e.target.focusedWindow = e.type.endsWith("r") && Services.wm.getMostRecentWindow(null),
	get handleCommand() {delete this.handleCommand;
		return this.handleCommand = btn => {(btn.handleCommand = new btn.ownerGlobal.Function(this.code).bind(btn))();}
	},
	get code() {delete this.code; var s = Ff.c +"custom_scripts/"+ B[14] +".js";
		try {id = 'this.focusedWindow && this.focusedWindow.focus();\n'+
			Cu.readUTF8URI(Services.io.newURI(s))} catch {id = `glob.toStatus("${T[8]}${s}",7e3)`}
		return this.code = id;}
}))(B[14]);

var {prefs} = Services,Over = { //modify Tooltips под мышью
get [B[1]]() { //PanelUI delete this[…];
	glob.mode_skin(); if (glob.pref("signon.rememberSignons"))
		Services.cache2.asyncGetDiskConsumption({onNetworkCacheDiskConsumption(bytes) {
			glob.toStatus(T[3] + glob.formatBytes(bytes),3e3) // вывод объёма кэша
		}, QueryInterface: ChromeUtils.generateQI(["nsISupportsWeakReference","nsICacheStorageConsumptionObserver"])})
	else glob.toStatus(T[5],2e3); //не хранить пароли
	return tExp(B[1]);
},
get [B[3]]() { //newtab
	return GetDynamicShortcutTooltipText(B[3]) + Tag[B[3]];
},
get [B[0]]() {var dw = glob.dirsvcget("");
	if (dw) glob.mode_skin(`${glob.pref(Ff.i) > 1 ? "\u{26A1} Графика отключена," : "💾 папка"} [Загрузки] `+ glob.crop(dw, 96,''));
	return GetDynamicShortcutTooltipText(B[0]) +"\n"+ tExp(B[0]);
},
get "tabbrowser-tab"() {var trg = window.event?.target; //get исполняет код
	trg.tooltipText = trg.label + Tag[B[2]];
},
get [B[10]]() {glob.mode_skin('');
	return GetDynamicShortcutTooltipText(B[10]) +"\n\n"+ Tag[B[10]] +"\n"+ tExp(B[12]);
},
get [M[2]]() {return GetDynamicShortcutTooltipText(M[2]) +"\n"+ tExp(B[12]); //stop
},
get [M[0]]() {glob.toStatus(T[0],2500)}, //tab
[B[9]]: Tag[B[9]], [M[4]]: Tag[B[9]], //print
"titlebar-button titlebar-close": Tag[B[13]],
get [M[3]]() { //star
	var txt = `${glob.pref("dom.disable_open_during_load") ? "Запрет" : "↯ Разреш"}ить всплывающие окна`;
	if (!glob.pref("places.history.enabled")) txt = T[9];
	if (glob.pref("privacy.sanitize.sanitizeOnShutdown")) txt = T[10];
	glob.toStatus(txt,3e3);
	var hint = document.getElementById(M[3]).tooltipText;
	return hint.indexOf(T[15]) == -1 ? hint + T[15] : hint;
},
get [B[2]]() { //custom hint
	return tooltip_x(window.event.target,"⩉ Ролик ±	Изменить масштаб");
},
get [B[14]]() {return Tag[B[14]] + T[14];},
get "identity-icon-box"() {
	return tooltip_x(window.event.target, tExp(B[4]) + br_val());
},
get [B[4]]() {glob.toStatus(this.br_exp(),2500); //+режим
	return tooltip_x(window.event.target, tExp(B[4]) + br_val());
},
get [B[11]]() {glob.toStatus(this.br_exp(),2500); //щит
	var trg = window.event?.target; //custom hint 2
	return trg.id.endsWith("r") && trg.textContent +'\n'+ tExp(B[11]);
},
get [B[6]]() { //FavMenu
	var trg = window.event?.target;
	if (trg.id == B[6]) {
		try {trg.mstate = trg.secondaryPopup.state;} catch{} //для QuickToggle.js
		zoom(0,0,0,`, ${glob.pref("browser.tabs.loadInBackground") ? "Не выбирать" : "Переключаться в"} новые вкладки`);
	} else {
		glob.toStatus(T[6],9e3);
		trg.mstate = trg.state;
	}
	if (trg.mstate != "open")
		return tExp(B[6])
	else trg.tooltipText = "";
},
get [B[8]]() { //reader
	return GetDynamicShortcutTooltipText(B[8]) +"\n"+ Tag[B[8]] + br_val();
},
get [M[5]]() { //ReaderView
	return Tag[B[7]] + Tag[B[8]] + br_val();
},
get "ucf_SessionManager"() {glob.toStatus(T[11]);},
get "unified-extensions-button"(){return "Расширения"+ T[14]},
"_531906d3-e22f-4a6c-a102-8057b88a1a63_-browser-action": T[12], //SingleFile
"_531906d3-e22f-4a6c-a102-8057b88a1a63_-BAP": T[12],
"_b9db16a4-6edc-47ec-a1f4-b86292ed211d_-browser-action": T[13], //VDH
"_b9db16a4-6edc-47ec-a1f4-b86292ed211d_-BAP": T[14],
br_exp(t = T[2] + br_val()){
	return t +` ${Ff.Exp() ? "Экспертный" : "Простой"} режим кнопок`}
};

window.glob = { //all ChromeOnly-scripts
	pref(key,set, pt = {b:"Bool",n:"Int",s:"String"}) { //или key = [key,default]
		if (typeof key != "object") key = [key];
		var t = Services.prefs.getPrefType(key[0]);
		t = pt[t == 128 ? "b" : t == 64 ? "n" : t == 32 ? "s" : ""];
		if (!t) t = pt[set != undefined ? (typeof set)[0] : (typeof key[1])[0]];
		if (!t) return; if (set != undefined)
			Services.prefs[`set${t}Pref`](key[0],set)
		else set = Services.prefs[`get${t}Pref`](...key);
		return set;
	},
	ua(real = false,ua_my = "general.useragent.override") { //текущий или вшитый ЮзерАгент
		ttt = this.pref(ua_my); Services.prefs.clearUserPref(ua_my);
		ua = Cc["@mozilla.org/network/protocol;1?name=http"].getService(Ci.nsIHttpProtocolHandler).userAgent; // костыль
		ttt && this.pref(ua_my,ttt); if (!ttt) ttt = ua; if (real) ttt = ua; return ttt;
	},
	dirsvcget() { //константа пути + subdirs, если посл. опция = "" вернуть путь, иначе открыть
		var f, d = [...arguments], r = (d[d.length-1] == ""); (r) && d.pop();
		try {f = Services.dirsvc.get(d[0] || "DfltDwnld",Ci.nsIFile);} catch {f = Services.prefs.getComplexValue("browser.download.dir",Ci.nsIFile)}
		d.slice(1, d.length).forEach((c)=>f.append(c));
		if (r) return f.path; f.exists() && f.launch();
	},
	crop(s,cut = 33,ch = '…\n') { //сократить/разбить строку
		return s.substring(0,cut) +`${s.length > cut - 1 ? `${ch}…${s.substring(s.length - cut + ch.length,s.length)}`: ''}`;
	},
	formatBytes(b = 0,d = 1) { //объём байт…Тб
		let i = Math.log2(b)/10|0; return parseFloat((b/1024**(i=i<=0?0:i)).toFixed(d))+`${i>0?'KMGT'[i-1]:''}b`;
	},
	about_config(filter) { //на опцию
		var setFilter = (e,input = (e?.target || window.content.document).getElementById("about-config-search")) => {
			if (e || input.value != filter) input.setUserInput(filter);},
		found = window.switchToTabHavingURI("about:config",true, {relatedToCurrent: true,
			triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
		if (found) setFilter(null,window);
		else gBrowser.selectedBrowser.addEventListener("pageshow",setFilter, {once: true});
	},
	toStatus(txt,time = 5e3,StatusPanel = window.StatusPanel) {
		if (StatusPanel.update.tid)
			clearTimeout(StatusPanel.update.tid)
		else {
			var {update} = StatusPanel;
			StatusPanel.update = () => {};
			StatusPanel.update.ret = () => {
				StatusPanel.update = update,StatusPanel.update();
		}}
		StatusPanel.update.tid = setTimeout(StatusPanel.update.ret,time);
		StatusPanel._label = txt;
	},
	flash(id,style,color,ms,text,time = 5e3) { //статус, мигание
		id = document.getElementById(id || 'urlbar-input-container'); if (!id) return;
		if (style) id.style.filter = style; if (color) id.style.background = color;
		if (ms) setTimeout(() => {
			id.style.removeProperty('filter'),id.style.removeProperty('background-color');},ms);
		if (text) glob.toStatus(text,time);
	},
	mode_skin(text,p,t,s = 'unset',o = '',z) {
	setTimeout(()=> {with(glob){ //подсветка кнопок и подсказки отображают настройки браузера
		if (pref("dom.security.https_only_mode"))
			flash(B[10],"drop-shadow(0px 0.5px 0px #F8F)"),o = ', только HTTPS'
		else flash(B[10],"none");
		if (ua() && (ua() != ua(true))) o = o +', чужой ЮзерАгент';
		z = pref("network.proxy.no_proxies_on") == "" ? "" : ", Есть сайты-исключения";
		p = p || this.pref('network.proxy.type');
		if (p == 1) t = ['sepia(100%) saturate(150%) brightness(0.9)', 'Ручная настройка прокси'+ z];
		else if (p == 2) t = ['hue-rotate(120deg) saturate(70%)',T[1] + z],s = 'hue-rotate(270deg) brightness(95%)';
		else if (p == 4) t = ['hue-rotate(250deg) brightness(0.95) saturate(150%)','Сеть - автонастройка прокси'+ z];
		else if (p == 0) t = ['saturate(0%) brightness(0.95)','Настройки сети - системные'+ z];
		else t = [s,'Сеть работает без прокси']; // серый фон кнопки
		flash(B[0],pref(Ff.i) > 1 ? "hue-rotate(180deg) drop-shadow(0px 0.5px 0px #F68)" : "none");
		flash(B[6],s); flash(B[1],t[0]);
		z = typeof(text); if (z == 'string')
			toStatus(text ? text : "\u{26A1}"+ t[1] + o,5e3); //светофор
	}}, 250);}
};
((obj,del,re,reos) => { // парсинг блока клавиш ускоряет обработку нажатий
	var num = -Ff.os.length - 1;
	for(var p in klaBa) reos.test(p) && del.add( p.endsWith(platform) ? p.slice(0,num) : p);
	for(var p in klaBa) del.has(klaBa[p]) && del.add(p);
	for(var d of del) delete klaBa[d]; //есть Key_OS ? удалить имена-клоны
	for(var p in klaBa) if (reos.test(p))
			klaBa[p.replace(reos,'')] = klaBa[p], delete klaBa[p]; //убрать имя вашей ОС из свойства
	for(var p in klaBa) {var func = klaBa[p]; //(){…}, bool,num
		if (typeof func == "string") func = klaBa[func]; //ссылка на функцию
		var [key,mod] = p.split("_"); mod = mod || "";
		var upper = key[0].toUpperCase(); var prevent = key[0] == upper;
		var [, m,i] = mod.match(re); m = m || 0; //modifiers bitmap
		var arr = [func,prevent, i ? i == "I" ? 0 : 1 : -1]; //textfields flag Имя_i 1 кроме полей ввода
		var prop = prevent ? key : upper + key.slice(1); //имя без mod
		var o = obj[prop] || (obj[prop] = Object.create(null));
		o[m] ? o[m].push(arr) : o[m] = [arr]; //имя со строчной: Skip preventDefault
	}; klaBa = obj; })(Object.create(null),new Set(),/(\d+)?(i)?/i,/_(?:win|linux|macosx)$/);
Mus = {}; M.forEach((k) =>{Mus["#"+ k] = Mus["."+ k] = Mouse[k]});

var Debug = (e,id = "sidebar-box") => {
	if (Services.prefs.getBoolPref(Ff.p +'debug',false)) return true;
	return !document.getElementById(id).hidden;
},
keydown_win = e => { //перехват клавиш, учитывая поля ввода
	if (e.repeat) return; // выключить e.getModifierState("CapsLock")
	var Keys = klaBa[e.code]?.[e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey];
	if (Keys) //есть HotKey
		for(var [func,p,i] of Keys)
			if (i ^ docShell.isCommandEnabled("cmd_insertText"))
				p && e.preventDefault(), func(e, gBrowser.selectedTab); //запуск по сочетанию
	if (!Debug()) return; //показ клавиш
	console.log('■ key '+ e.code + ('_'+ (e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey)).replace('_0',''));
};
listener = { //действия мыши, перехват существующих
	handleEvent(e) {
		if (this.skip || e.detail > 1) return;
		var trg = e.target, id = trg.id;
		if (id) Node = trg; //Parent || trg.tagName
		if (e.type == "mouseenter") {
			var hint = Over[id] || Over[(trg = trg.parentNode).id];
			if (hint) trg.tooltipText = hint; return; //обновить подсказку
		}
		var sels = this.selectors.filter(this.filter, trg); //#id
		var {length} = sels; if (!length) return;
		var wheel = e.type.startsWith("w");
		var num = e.metaKey*64 + e.ctrlKey*32 + e.shiftKey*16 + e.altKey*8 + (wheel ? 2 : e.button*128); //dbl*4
		var obj = Mus[
			length > 1 && sels.find(this.find,num) || sels[0]
		];
		Debug() && console.log('■ but «'+ id +'» key '+ num); //wheel дважды
		if (wheel) return obj[num]?.(trg, e.deltaY < 0);
// mousedown
		if (e.type.startsWith("m")) {
			obj.mousedownTarget && this.stop(e);
			this.longPress = false; //+ задержка при обычном клике
			if (++num in obj)
				this.mousedownTID = setTimeout(this.onLongPress, 640, trg,obj,num);
			if (e.button == 2)
				this.ctx = trg.getAttribute("context"), trg.setAttribute("context","");
			return;
		}
		obj.mousedownTarget || this.stop(e);	//click
		if (this.longPress) return this.longPress = false;
		this.mousedownTID &&= clearTimeout(this.mousedownTID);
		if (!obj[num]) {
			if (e.button == 1) return;
			if (e.button) {
				num = "context";
				for(var p in this.a) this.a[p] = e[p];
			} else
				num = "dispatch", this.mdt = obj.mousedownTarget;
			obj = this;
		}
		obj[num](trg); //click
	},
	find(sel) { //условия запуска ?
		return Mus[sel][this] || Mus[sel][this + 1];
	},
	filter(sel) {return this.closest(sel);
	},
	get selectors() {
		this.onLongPress = (trg,obj,num) => {
			this.mousedownTID = null;
			this.longPress = true;
			obj[num](trg);
		}
		delete this.selectors;
		return this.selectors = Object.keys(Mus);
	},
	get mdEvent() {
		delete this.mdEvent;
		return this.mdEvent = new MouseEvent("mousedown", {bubbles: true});
	},
	context(trg) {
		this.ctx ? trg.setAttribute("context",this.ctx) : trg.removeAttribute("context");
		trg.dispatchEvent(new MouseEvent("contextmenu",this.a));
	},
	dispatch(trg) {
		this.skip = true;
		this.mdt ? trg.dispatchEvent(this.mdEvent) : trg.click();
		this.skip = false;
	},
	stop: e => {
		e.preventDefault(); e.stopImmediatePropagation();
	},
	a: {__proto__: null,bubbles: true,screenX: 0,screenY: 0}
},
id = "ucf_hookExpert",events = ["click","mousedown","wheel","mouseenter"],
els = document.querySelectorAll("#navigator-toolbox,#ucf-additional-vertical-bar,#appMenu-popup,#widget-overflow-mainView");
for(var el of els) for(var type of events)
		el.addEventListener(type,listener,true);
window.addEventListener("keydown",keydown_win,true);
ucf_custom_script_win.unloadlisteners.push(id);
ucf_custom_script_win[id] = {destructor() {
	window.removeEventListener("keydown",keydown_win);
	for(var el of els) for(var type of events)
		el.removeEventListener(type,listener,true);
}};
var addDestructor = nextDestructor => { //для saveSelToTxt
	var {destructor} = ucf_custom_script_win[id];
	ucf_custom_script_win[id].destructor = () => {
		try {destructor();} catch(ex) {Cu.reportError(ex);}
		nextDestructor();
}};
with (document) getElementById(B[11]).removeAttribute("tooltip"),
	getElementById("nav-bar").tooltip = id; //флаг успешной загрузки

glob.mode_skin(); //подсветка кнопок и подсказки отображают настройки браузера
[['ui.prefersReducedMotion',0],['browser.download.alwaysOpenPanel',false],['browser.download.autohideButton',false] //DownloadButton FIX
].forEach((p)=>glob.pref(...p)); //lockPref опций
var tabr = Ff.p +"opacity",url = `resource://${tabr}/`, //bright tabs
getIntPref = (p) => Services.prefs.getIntPref(p,100),
sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
css = `@-moz-document url(chrome://browser/content/browser.xhtml) {
	:is(${id})[rst] {filter: grayscale(1%) !important}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabbox {background-color: black !important}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabpanels {opacity:${getIntPref(tabr)/100} !important}}`;
Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler)
	.setSubstitution(tabr,Services.io.newURI("data:text/css,"+ encodeURIComponent(css)));
sss.loadAndRegisterSheet(Services.io.newURI(url),sss.USER_SHEET);
var st = InspectorUtils.getAllStyleSheets(document).find(s => s.href == url).cssRules[0].cssRules[2].style;
var observer = () => st.setProperty("opacity", getIntPref(tabr)/100,"important");
prefs.addObserver(tabr,observer);
this.removePrefObs = () => prefs.removeObserver(tabr,observer); //end bright

var css_USER = (css) => { //локальные функции
	var style = FileExists(css) ? Services.io.newURI(css) : makeURI('data:text/css;charset=utf-8,'+ encodeURIComponent(css));
	var args = [style,sss.USER_SHEET]; // стиль: файл или CSS
	(this.css = !this.css) ? sss.loadAndRegisterSheet(...args) : sss.unregisterSheet(...args);
},
gClipboard = {write(str,ch = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)) {
		(this.write = str => ch.copyStringToClipboard(str,Services.clipboard.kGlobalClipboard))(str);}
},
TabAct = (e) => {return e.closest(".tabbrowser-tab");
},
switchTab = (url = 'about:serviceworkers',go = false) => { //открыть вкладку | закрыть, если открыта | выбрать
	for(var tab of gBrowser.visibleTabs)
		if (tab.linkedBrowser.currentURI.spec == url)
			{go ? gBrowser.selectedTab = tab : gBrowser.removeTab(tab); return;}
	gBrowser.addTrustedTab(url); gBrowser.selectedTab = gBrowser.visibleTabs[gBrowser.visibleTabs.length -1];
},
TabsDel = (right = 0,curr = gBrowser.selectedTab) => { // закрыть вкладки слева/справа от активной
	var tabs = gBrowser.visibleTabs.filter(tab => !tab.pinned), i = tabs.indexOf(curr);
	var a = (i != -1), b = (a ? i + right : !right * tabs.length);
	args = right ? [b, tabs.length] : [0,b];
	tabs.slice(...args).forEach((i) => {gBrowser.removeTab(i)});
},
switchProxy = (pac = 'https://antizapret.prostovpn.org/proxy.pac') => {
	var pn = 'network.proxy.type',p = 'network.proxy.autoconfig_url';
	if (glob.pref(pn) != 2) // выключить
		glob.pref(pn,2), glob.pref(p,pac)
	else
		glob.pref(pn,5), glob.pref(p,"localhost");
	glob.mode_skin(); //разный фон замка для Прокси
	BrowserReload();
},
Title = (max,title) => { //заголовок. без обрезки: max не указан, домен: max <0, + дата: max=0
	if (!title) var title = document.title || gBrowser.selectedTab.label;
	if (max == undefined) return title; //ограничить длину, убрать служебные символы
	title = title.replace(/[\\\/?*\"'`]+/g,'').replace(/\s+/g,' ').replace(/[|<>]+/g,'_').replace(/:/g,'։').trim();
	if ( max > 0 ) return title.slice(0,max);
	if ( max == 0) return title.slice(0,100) +"_"+ new Date().toLocaleDateString('ru', {day:'numeric',month:'numeric',year:'2-digit'}) +'-'+ new Date().toLocaleTimeString('en-GB').replace(/:/g,"։"); //дата-часы
	var host = decodeURIComponent(gURLBar.value); //max < 0
	if (!/^file:\/\//.test(host)) host = host.replace(/^.*url=|https?:\/\/|www\.|\/.*/g,'').replace(/^ru\.|^m\.|forum\./,'').replace(/^club\.dns/,'dns');
	return host;
},
save = () => { //функция из SingleHTML.jsm
	var args = [glob.crop("√ страница записана: "+ Title(0),48,''),7e3];
	try {Cu.getGlobalForObject(Cu)[Symbol.for("SingleHTML")](true,window);
		gBrowser.selectedTab.textLabel.style.textDecoration = "overline"; // ^подчёркивание
	} catch {args = ['☹ Ошибка функции SingleHTML',1e4]}
	glob.toStatus(...args);
},
saveSelToTxt = async () => { //в .txt Всё или Выбранное
	var {length} = saveURL, splice = length > 9, l11 = length == 11, msgName = id + ":Save:GetSelection"; //FIX FF103+
	var receiver = msg => {var txt = "data:text/plain,"+ encodeURIComponent(gBrowser.currentURI.spec +"\n\n"+ msg.data);
		var args = [txt,Title(0) +'.txt',null,false,true,null,window.document];
		splice && args.splice(5,0,null) && l11 && args.splice(1,0,null);
		saveURL(...args);
		glob.toStatus(glob.crop("√ текст сохранён: "+ Title(0),96,''));
	}
	messageManager.addMessageListener(msgName,receiver);
	addDestructor(() => messageManager.removeMessageListener(msgName,receiver));
	var sfunc = fm => {
		var res,fed,win = {},fe = fm.getFocusedElementForWindow(content,true,win);
		var sel = (win = win.value).getSelection();
		if (sel.isCollapsed) {
			var ed = fe && fe.editor;
			if (ed && ed instanceof Ci.nsIEditor)
				sel = ed.selection, fed = fe;
		}
		if (sel.isCollapsed)
			fed && fed.blur(),docShell.doCommand("cmd_selectAll"),
			res = win.getSelection().toString(),docShell.doCommand("cmd_selectNone"),
			fed && fed.focus();
		res = res || sel.toString();
		/\S/.test(res) && sendAsyncMessage("saveSelToTxt",res);
	}
	var url = "data:;charset=utf-8,"+ encodeURIComponent(`(${sfunc})`.replace("saveSelToTxt",msgName)) +'(Cc["@mozilla.org/focus-manager;1"].getService(Ci.nsIFocusManager));';
	(saveSelToTxt = () => gBrowser.selectedBrowser.messageManager.loadFrameScript(url,false))();
},
openDial = (args = [Ff.c +"options/prefs_win.xhtml","user_chrome_prefs:window","centerscreen,resizable,dialog=no"]) => window.openDialog(...args), //или about:user-chrome-files
tooltip_x = (trg,text = "", ttt = "") => {
	if (!trg.id.endsWith("x")) { //box
		ttt = (trg.hasAttribute("tooltiptext")) ? trg.ttt = trg.tooltipText : trg.ttt;
		if (ttt && ttt.indexOf(text) == -1) ttt += "\n\n";
		trg.removeAttribute("tooltiptext");
	}
	return (ttt.indexOf(text) == -1) ? ttt + text : ttt;
},
bright = (trg,forward,step = 1,val) => { //wheel
	if (!val) var val = getIntPref(tabr) + (forward ? step : -step);
	val = val > 100 ? 100 : val < 15 ? 15 : val;
	glob.pref(tabr,val); trg.toggleAttribute("rst"); glob.toStatus(T[2] + val +"%",1e3);
},
br_val = () => glob.pref([tabr,100]) +"%",
zoom = (forward,toggle = false, change = true,text = '') => {
	toggle ? ZoomManager.toggleZoom() : change ? forward ? FullZoom.enlarge() : FullZoom.reduce() : 0;
	glob.toStatus("± Масштаб "+ Math.round(ZoomManager.zoom*100) +`%${glob.pref("browser.zoom.full") ? "" : " (только текст)"}` + text,3e3);
},
Expert = (m = Boolean(Ff.Exp()),p = Ff.p +'expert') => {
	glob.pref(p,!m); glob.toStatus(Over.br_exp(""),3e3);
},
Help = (help = Ff.c +"help.html") => { //помощь
	(FileExists(help)) ? switchTab(help) : switchTab('victor-dobrov.narod.ru/help-FF.html');
},
FileExists = (file) => {try { //файл|папка существует?
	if (!file.startsWith("chrome://"))
		return FileUtils.File(String.raw`${file}`).exists()
	else return Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).convertChromeURL(Services.io.newURI(file)).QueryInterface(Ci.nsIFileURL).file.exists();
	} catch {}; return false;
},
userjs = (e,myjs = Ff.c +"custom_scripts/User.js") => {
	Debug() && document.getElementById("key_browserConsole").doCommand(); //фокус на консоль
	FileExists(myjs) ? eval(Cu.readUTF8URI(Services.io.newURI(myjs))) : t = myjs +" — скрипт не найден";
	console.log("✅\t"+ Math.random(),""); //ваш скрипт
},
translate = (brMM = gBrowser.selectedBrowser.messageManager) => { // перевод сайт | выдел. текст
	brMM.addMessageListener('getSelect',listener = (msg) =>{
		if (msg.data) // Перевод выделенного
			switchTab("https://translate.google.com/#view=home&op=translate&sl=auto&tl=ru&text="+ msg.data,true)
		else // Гугл или Перевод сайта в Яндекс
			switchTab("https://translate.yandex.com/translate?url="+ gURLBar.value +"&dir=&ui=ru&lang=auto-ru",true);
	brMM.removeMessageListener('getSelect',listener,true);
	});
	brMM.loadFrameScript('data:,sendAsyncMessage("getSelect",content.document.getSelection().toString())',false);
},
openProxyWin = (_win = Services.wm.getMostRecentWindow("aTaB:ProxyWin")) => {
	if (_win) _win.focus()
	else {
		_win = openDial(["chrome://browser/content/preferences/dialogs/connection.xhtml","_blank","chrome,dialog=no,centerscreen,resizable"]);
		_win.addEventListener("DOMContentLoaded",() => {
			_win.document.documentElement.setAttribute("windowtype","aTaB:ProxyWin");
		},{once: true});
		_win.opener = window; _win.opener.gSubDialog = {_dialogs: []};}
},
FavItem = (first = true,def_url = 'ua.ru') => { //первый|посл. url Меню закладок
	var query = {}, options = {}, folder = PlacesUtils.history.executeQuery(query.value, options.value).root;
	PlacesUtils.history.queryStringToQuery(`place:parent=${PlacesUtils.bookmarks.menuGuid}&excludeQueries=1`,query,options);
	folder.containerOpen = true;
	var max = folder.childCount - 1, type = Ci.nsINavHistoryResultNode.RESULT_TYPE_URI, url;
	if (first) for(var ind = 0; ind <= max; ind++) { // first
		var node = folder.getChild(ind);
		if (node.type == type) {url = node.uri; break;}
	} else		for(var ind = max; 0 <= ind; ind--) { // last
		var node = folder.getChild(ind);
		if (node.type == type) {url = node.uri; break;}
	}
	if (!url) url = def_url; return url;
},
toFav = () => {with (PlacesUtils.bookmarks){ //без диалога
	var url = gBrowser.selectedBrowser.currentURI.spec;
	search({url}).then(async array => {
		if (array.length)
			try {await remove(array);} catch {}
		else
			try {await insert({
				url: Services.io.newURI(url),
				title: (gBrowser.contentTitle || gBrowser.selectedTab.label || url),
				parentGuid: [() => toolbarGuid, () => menuGuid, () => unfiledGuid][Services.prefs.getIntPref("bookmarksparentguid",0)](),
				index: DEFAULT_INDEX
			});} catch {}
	});
}}
if (Ff.os == "macosx")
	Object.keys(Tag).forEach((k)=>{ //i счётчик, замена букв
		['◉','Ø'].forEach((c,i)=>{Tag[k] = Tag[k].replace(new RegExp(c,'g'),
		['⦿','◎'][i])})})
else if (glob.pref([Ff.p +'winbuttons',false]))
		css_USER('.titlebar-buttonbox {display: none !important}')
	else css_USER(Ff.c +"custom_styles/win_buttons-vitv.css");

})( //init-код
Ff = {p:'extensions.user_chrome_files.', c:'chrome://user_chrome_files/content/', i:'permissions.default.image',
	os: AppConstants.platform, ver: Services.appinfo.version.replace(/-.*/,''),
	Ctr(m = "⌘", w = "Ctrl+"){return this.os == "macosx" ? m : w},
	Exp(){return Number(Services.prefs.getBoolPref(this.p +'expert',false))}
},
(name,m = Ff.Exp(), t,z) => { //… {Общий︰Эксперт (m = 1)[︰…]}
	t = Tag[name]; z = t.match(/(\{)([\s\S]*?)(\})/gm);
	if (z) z.forEach((k,h) =>{ //текст зависит от режима
		h = k.split('︰'); if (h && h.length > m)
			t = t.replace(k,h[m].replace(/\{|\}/g,''));})
	return t;} //разделитель и нужная часть ↑
);