/* hookMouseKeys © Dumby, mod 3.0 Dobrov. Данные пользователя:
Keys нажатия клавиш Menu команды Mouse клики мыши Setup опции */

(async (Ff,init) =>{ Tag = {"downloads-button":`{`+ //подсказки кнопок
`◉ колёсико	⬇︎ папка [Загрузки]
◨ правый клик ➜ Сохранить сайт
◉ колёсико на Фото ➜ Сохранить︰`+ //нужен SingleHTML.jsm

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
Ø ролик ↑	⤾ Вернуть вкладку`,"viewHistorySidebar":
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
◉ ролик +Alt	UserChromeFiles`,"QuickToggle": //◨ + Alt посл.закладка меню

`левая кнопка ◧ мыши «Журнал»\n
◉ колёсико	меню «Действия»
◨ правая	Быстрые настройки
◨ держать	Пипетка цвета, линза\n
◧ лев. + Alt	Библиотека
◧ держать	Новая вкладка (${Ff.Ctr()}T){︰\n
Ø Ролик ±	масштаб Страницы
◧ + Shift		масштаб Текст / Всё}`,"ReaderView":

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

`◧ лев. клик	Атрибут-Инспектор
◉ колёсико	Инструменты браузера`,"@": //texts

`Очистить панель колёсиком мыши|Запрещённые сайты через АнтиЗапрет|☀ Яркость сайтов |💾 кэш, данные сайтов, куки занимают |Захват цвета в Буфер обмена. Курсор: сдвиг на 1 точку|⚡️ Запрещено сохранять логины и пароли|Опции ◨ правый клик: по-умолчанию, ⟳ Обновить ↯ Перезапуск|Долгий клик в строке меню: Править опцию │ Колёсико: Сервисы|Ошибка скрипта |↯ Не запоминать историю посещений|↯ Удалять историю посещений, закрывая браузер|период сохранения сессий меняется в меню кнопки «Журнал»|SingleFile (Alt+Ctrl+S)\nСохранить сайт в единый Html|Video DownloadHelper\nСкачивание проигрываемого видео|\n\n◨ пр. клик	настройки UCF\n◨ держать	Перезапустить, удалив кэш\nAlt + x		запустить скрипт User.js|\n◨ правый клик: Без запроса|zoompage-we_dw-dev-|_531906d3-e22f-4a6c-a102-8057b88a1a63_-|_b9db16a4-6edc-47ec-a1f4-b86292ed211d_-`}; init();

Menu = [{ //команды пользователя
		lab: "экспорт сайта в единый HTML",
		inf: "используя SingleHTML.jsm\nили расширение SingleFile",
		cmd(){ ucf.HTML()},
		img: "chrome://devtools/skin/images/globe.svg"
	},{
		lab: "папка Загрузки",
		cmd(){ Mouse[B[0]][1]()},
		img: "chrome://devtools/skin/images/folder.svg"
	},null,{
		lab: "Вернуть вкладку",
		cmd(event){
			event.target.ownerGlobal.undoCloseTab()},
		img: "chrome://devtools/skin/images/reload.svg"
	},{
		lab: "Обновить все вкладки",
		cmd(){
			with (gBrowser) selectAllTabs(),reloadMultiSelectedTabs(),clearMultiSelectedTabs()},
	},[{ //подменю
		lab: "about:config"
	},{
		lab: "Сведения о браузере",
		cmd(){
			switchTab('about:support')},
		img: "resource://gre-resources/password.svg"
	},{
		lab: "Настройки профайлера",
		cmd(){
			switchTab('about:profiling')},
		img: "chrome://devtools/skin/images/settings.svg"
	},{
		lab: "Настройки UCF",
		cmd(){
			openDial()},
	}],null,{
		lab: "Краткая справка",
		cmd(){Help()},
		img: "chrome://devtools/skin/images/help.svg"
}],
Keys = { //перехват-клавиш KeyA[_mod][_OS](e,t){код} и KeyB: "KeyA"
	KeyX_1(e,t) {userjs(e)}, // Alt+X запуск внешнего JS-кода
	KeyS_6() {saveSelToTxt()}, /* Ctrl+Shift+S */ KeyS_15: "KeyS_6",
	KeyS_1(e,t) {ucf.HTML()}, //Alt+S | e: Event, t: gBrowser.selectedTab
/*
	mod = e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey
	mod + I в конце: только в полях ввода, «i» кроме полей ввода
	1я буква строчная: передавать нажатия, запрет preventDefault
	отделять «_» от кода, если есть модификаторы и/или «iI»-флаг
	только в указанной OS: KeyA_1i_win(e,t){… Alt+A для винды */
},
Mouse = { //клики Meta*64 Ctrl*32 Шифт*16 Alt*8 (Wh ? 2 : But*128) long*1
	"urlbar-input": {
		2(trg, forward){trg.value = ""} //очистить
	},
	"tabbrowser-tabs": { //<> вкладки колёсиком
		8(){},16(){},64(){}, //выбор
		2(trg,forward){
			gBrowser.tabContainer.advanceSelectedTab(forward ? -1 : 1,true);
		},
		128(btn){ //СМ
			gBrowser.removeTab(TabAct(btn))}, // вкладка под мышью
		136(btn){TabsDel(1, TabAct(btn))}, // СМ + Alt закрыть вкладки справа
		144(btn){TabsDel(0, TabAct(btn))} // СМ + Shift … слева
	},
	"stop-button": {
		128(){ //С
			for (var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop() },
		257(){ucf.switchProxy()}
	},
	"star-button-box": {
		1(){translate()}, //держать
		8(){ //R + Alt
			window.PlacesCommandHook.showPlacesOrganizer("BookmarksToolbar") }, //библиотека
		128(){switchTab(FavItem()) },
		129(){ //дС
			switchTab(FavItem(false))	},
		256(){toFav()}
	},
	"appMenu-print-button2": { //меню Печать…
		1(){Help()}, 128(btn){Expert()},
		256(){Mouse[B[9]][256]()}
	},
	"pageAction-urlbar-_2495d258-41e7-4cd5-bc7d-ac15981f064e_": { //ReaderView
		2(trg,forward){bright(trg,forward,5)}, //яркость по wheel ±
		128(btn){
			btn.ownerDocument.getElementById("key_toggleReaderMode").doCommand() //штатный Режим чтения
		},
		256(btn){Mouse[B[8]][256](btn)}
	},
	[B[10]]: { //reload
		1(){ //д
			with (gBrowser) selectAllTabs(),reloadMultiSelectedTabs(),clearMultiSelectedTabs();
		},
		128(){for (var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop()}, //СМ
		256(){BrowserReloadSkipCache()}, //R
		257(){ucf.switchProxy()} //дR
	},
	[B[3]]: { //newtab
		8(){gBrowser.removeAllTabsBut(gBrowser.selectedTab)},
		256(btn){btn.ownerGlobal.undoCloseTab()}
	},
	[B[9]]: { //print
		1(){Help()}, //д
		128(){Expert()},
		256(){document.getElementById("menu_print").doCommand()} //R
	},
	[B[0]]: {mousedownTarget: true, //не передавать нажатия дальше
		1(){ //д
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)},
		8(){ //+Alt
			var p = "browser.download.improvements_to_download_panel", n = ucf.pref(p);
			ucf.pref(p, !n);
			ucf.toStatus(`Подтверждение загрузки ${n ? "√ разреш" : "✘ запрещ"}ено`,3e3);
		},
		16(){ //+Shift //ЮзерАгент по-умолчанию
			var n = ucf.pref(Ff.i) == 2; ucf.pref(Ff.i, n ? 1 : 2);
			ucf.mode_skin(); BrowserReload();
			ucf.toStatus(`Загрузка изображений ${n ? "√ разреш" : "✘ запрещ"}ено`,3e3);
		},
		128(){Ff.Exp() //режим Простой/Эксперт: разные действия
			? saveSelToTxt() : //сохранить|выделен. как .txt
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)
		},
		256(){ucf.HTML()} //web
	},
	[B[1]]: {mousedownTarget: true, //PanelUI
		1(btn){goQuitApplication(btn)}, //д
		16(){Help()}, //L+Shift
		8(){windowState != STATE_MAXIMIZED ? maximize() : restore()}, //L+Alt
		128(){windowState != STATE_MAXIMIZED ? maximize() : restore()},
		129(){BrowserFullScreen()}, //дС
		136(){this[129]()}, //С+Alt
		2(trg,forward){ // крутить +Закрыть вкладку -Восстановить
			forward ? trg.ownerGlobal.undoCloseTab() : trg.ownerGlobal.BrowserCloseTabOrWindow() },
		256(){minimize()},
		264(){switchTab('about:support')}, //R+Alt
		272(btn){btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("History")} //R+Shift
	},
	[B[8]]: { //➿
		2(trg,forward){bright(trg,forward,5)}, //яркость
		256(btn){ // MobileView
			btn.ownerDocument.getElementById("key_responsiveDesignMode").doCommand(); //пункт меню с HotKey
			if (gBrowser.selectedBrowser.browsingContext.inRDMPane) BrowserReload();}
	},
	[B[4]]: { //замок
		8(){		openProxyWin()}, //+Alt
		128(){	this[8]()},
		16(btn){ //+Shift
			BrowserPageInfo(btn,"mediaTab") //securityTab feed… perm…
		},
		2(trg,forward){bright(trg,forward,5)}, //яркость
		10(trg,forward){bright(trg,forward)},
		256(){gClipboard.write(gURLBar.value);
			ucf.flash(0,0,'rgba(240,176,0,0.5)',300,"в буфере: "+ gURLBar.value.slice(0,80));}
	},
	[B[11]]: { //щит
		1(){Mouse[B[6]][136]()}, //д Шрифты
		2(trg,forward){bright(trg,forward)},
		256(btn){ //R
			var logins = btn.ownerDocument.getElementById("ucf-logins-sitedata");
			logins ? logins.click() : switchTab('about:logins');
		},
		16(){switchTab()}, //+Shift
		128(){switchTab('about:performance')} //С
	},
	[B[5]]: { //favdirs CustomizableUI в скрипте
		0(btn){btn.ownerGlobal.SidebarUI.toggle("viewBookmarksSidebar")},
		256(btn){btn.ownerGlobal.SidebarUI.toggle(B[2])},
		8(){ucf.dirsvcget("Home")}, //+Alt
		128(btn){
			btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("Downloads") },
		136(){ //C+Alt
			ucf.dirsvcget("UChrm","user_chrome_files")},
		264(){ //R+Alt
			ucf.dirsvcget("GreD")}
	},
	"unified-extensions-button": {mousedownTarget: true,
		1(){Expert()}, //д
		256(){openDial()},
		257(){Mouse[B[14]][257]()}
	},
	[B[14]]: {mousedownTarget: true, //AttrView
		256(){openDial()}, //UCFprefs
		257(){ //дR Clean Cache
			var cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
			Services.obs.notifyObservers(cancelQuit,"quit-application-requested","restart");
			if (cancelQuit.data) return false;
			Services.appinfo.invalidateCachesOnRestart();
			var restart = Services.startup;
			restart.quit(restart.eAttemptQuit | restart.eRestart);
		},
		128(){ //C уд.отладка
			var chr = "devtools.chrome.enabled",rem = "devtools.debugger.remote-enabled";
			if (!ucf.pref(chr) || !ucf.pref(rem)) {
				ucf.pref(chr,true); ucf.pref(rem,true);
			}
			var {BrowserToolboxLauncher} = ChromeUtils.import("resource://devtools/client/framework/browser-toolbox/Launcher.jsm");
			BrowserToolboxLauncher.init();
		}
	},
	[B[13]]: { //title-close
		1(){Help()},
		128(btn){	btn.ownerGlobal.undoCloseTab()},
		256(){minimize()}
	},
	[B[6]]: {mousedownTarget: true,
		0(btn){ //L
			if (btn.id == B[6]) {
				var bar = document.getElementById("ucf-additional-vertical-bar");
				if (bar) window.setToolbarVisibility(bar,document.getElementById("sidebar-box").hidden);
				window.SidebarUI.toggle(B[2]);
			} else if (btn.className == "menu-iconic") {
				Node.hidePopup();
				ucf.about_config(btn.pref.pref); //go параметр about:config
			} else ucf.mode_skin();
		},
		2(trg,forward){zoom(forward)}, //wheel
		1(btn){ //д
			if (btn.id == B[6])
				switchTab("about:newtab");},
		8(){switchTab('chrome://browser/content/places/places.xhtml')}, //L+Alt
		264(){ //R+Alt
			switchTab(FavItem(false))},
		16(btn){if (btn.id == B[6]) zoom(0,1)}, //L+Shift
		128(btn, trg){ //C Menu-1
			if (btn.id == B[6] || trg)
				btn.menupopup.openPopup(trg ||= btn, "before_start");
		},
		129(btn){userjs(btn,"")}, //дC консоль
		256(btn){ //about Menu
			if (btn.id != B[6]) return;
			setTimeout(()=> {
				if (btn.config.state != "open")
				  btn.config.openPopup(btn, "before_start")
				else
				  btn.config.hidePopup();
			},50);
		},
		257(btn){ //дR
			if (btn.id != B[6]) return; //линза
			var url = `resource://devtools/shared/${parseInt(Ff.ver) > 95 ? "loader/" : ""}Loader.`;
			try {var exp = ChromeUtils.importESModule(url + "sys.mjs");} catch {exp = ChromeUtils.import(url + "jsm");}
			var obj = exp.require("devtools/client/menus").menuitems.find(menuitem => menuitem.id == "menu_eyedropper");
			(test = obj.oncommand.bind(null, {target:btn}))();
			ucf.flash(0,0,'rgba(100,0,225,0.1)',500, T[4]);
		},
		136(){ //С+Alt
			var n = "browser.display.use_document_fonts",f = ucf.pref(n) ? 0 : 1;
			ucf.pref(n,f); zoom(0,0,0,(f > 0) ? " + Web-шрифты" : ""); BrowserReload();}
	},
	[B[16]]: {2(trg,forward){zoom(forward)}}, //zoompage
	[B[17]]: {2(){Mouse[B[16]][2]()}},
}; var M = Object.keys(Mouse), Mus = {}; M.forEach((k) =>{Mus["#"+ k] = Mus["."+ k] = Mouse[k]});

Setup = [{ // быстрые настройки
	pref: ["dom.disable_open_during_load", "Всплывающие окна"], Def3el: 2, Yellow: true,
	keys: [[true, "Блокировать"], [false, "Разрешить"]],
},{ // pref,lab,key,hint,[val,str],code | keys:val,lab,dat,+hint,code | icon:значок
	pref: ["javascript.enabled", "Выполнять скрипты Java",,"Поддержка интерактивных сайтов, рекламы\nтакже разрешает действия горячих клавиш"], Def3el: true, refresh: true,
	keys: [[true, "Да"], [false, "Нет"]]
},{
	pref: ["browser.safebrowsing.downloads.remote.block_dangerous", "Опасные файлы, сайты",,"browser.safebrowsing.downloads.remote.block_dangerous_host"], Def3el: true, Yellow: false,
	keys: [[true, "Запрет",,,`ucf.pref('browser.safebrowsing.downloads.remote.block_dangerous_host',true)`], [false, "Открыть",,,`ucf.pref('browser.safebrowsing.downloads.remote.block_dangerous_host',false)`]]
},{
	pref: ["ucf.savedirs", "Загрузки",,'Пути сохранения Страниц и Графики\nСинтаксис «_Html/subdir|_Pics/subdir»\nsubdir: пусто | 0 заголовок | 1 домен',
		["", "всё в общей папке"]], Def3el: "_Сайты||_Фото|0", Blue: "_Web|1|_Images|0", Gray: "",
	keys: [ // сохранение Html/Pics. [Загрузки]/"_Html/subdir|_Pics/subdir" subdir: пусто | 0 заголовок | 1 домен
		["_Сайты||_Фото|0", "_Сайты|_Фото/имя…"],
		["_Web||_Photo|0", "_Web|_Photo/имя"],
		["_Web|1|_Pics|1", "_Web/сайт|_Pics/…"],
		["_Web|0|_Pics|", "_Web/имя|_Pics"],
		["_Web|1|_Images|0", "_Web/сайт, _Images/имя"], //открыть опцию about:config:
		["Сайт||Фото|", "ваши данные…",,"ключ в about:config",`ucf.about_config('ucf.savedirs')`]]
},null,{
	pref: [I[3], "Прокси (VPN)", "п", I[2] +"\n\nПереключение сетевых настроек"],
	Def3el: "localhost", Yellow: I[1], Gray: "", refresh: true,
	keys: [ //фон кнопки Меню: серый, голубой, красный, жёлтый, зелёный
		["localhost", "системный", "0",, "ucf.pref(I[2], 5)"],
		[I[1], "АнтиЗапрет", "2", "Надёжный доступ на заблокированные сайты\n«Режим прокси» меняется на 2",
			"ucf.pref(I[2], 2)"],
		["127.0.0.1", "Tor или Opera", "1", "Необходим сервис tor или opera-proxy",
			"ucf.pref(I[2], 1)"],
		[ucf.pref(["user.pacfile", "file:///etc/proxy.pac"]), "user .pac файл", "4", "about:config pacfile"]] //нужен диалог выбора pac-файла
},{
	pref: [I[2], "Режим прокси", "р"], Gray: 0, Def3el: 5, Blue: 4, Yellow: 2, refresh: true,
	keys: [[5, "системный", "5"],
		[2, "Автонастройка", "2", "about:config pacfile"],
		[1, "Ручная настройка", "1", "Используется "+ I[3]],
		[4, "Автоопределение", "4"],
		[0, "Без прокси", "0", I[5]]]
},{
	pref: ["network.trr.mode", "DNS поверх HttpS",, "Шифрование DNS-трафика для\nзащиты персональных данных"], Def3el: 0, Yellow: 2, Gray: 5, refresh: true,
	keys: [
		[0, I[5], "0"], [1, "автоматически", "1", "используется DNS или DoH, в зависимости от того, что быстрее"], [2, "DoH, затем DNS", "2"], [3, "только DoH", "3"], [4, "DNS и DoH", "4"], [5, "отключить DoH", "5"]]
},{
	pref: ["network.cookie.cookieBehavior", "Получать куки",,"Персональные настройки посещённых сайтов"], Def3el: 3, Yellow: 0, Gray: 4,
	keys: [[0, "со всех сайтов"], [3, "посещённые сайты"], [4, "кроме трекеров"], [1, "кроме сторонних"], [2, "никогда"]]
},null,{
	pref: ["browser.display.use_document_fonts", "Загружать шрифты страниц"], Def3el: 1, Gray: 0, refresh: true,
	keys: [[1, "Да"], [0, "Нет"]]
},{
	pref: ["font.name.sans-serif.x-cyrillic", "Шрифт без засечек ",,"Также влияет на всплывающие подсказки\nСистемный: загрузка шрифтов документа"], Def3el: "", Yellow: "Roboto", Gray: "Arial", keys: sans
},{
	pref: ["font.name.serif.x-cyrillic", "Шрифт с засечками"], Def3el: "", Yellow: "Arial", keys: serif
},{
	pref: ["gfx.webrender.force-disabled", "Ускорять отрисовку страниц", ,"gfx.webrender.compositor.force-enabled\ngfx.webrender.all\n\nАппаратная отрисовка страниц видеокартой.\nотключите при разных проблемах с графикой"],
	Def3el: false, Yellow: true, Gray: undefined, restart: true, keys: [
	[true, "Нет",,,`[['gfx.webrender.compositor.force-enabled', false], ['gfx.webrender.all', false]].map((a) =>{ucf.pref(...a)})`],
	[false, "Да",,,`[['gfx.webrender.compositor.force-enabled', true], ['gfx.webrender.all', true]].map((a) =>{ucf.pref(...a)})`]]
},null,{
	pref: ["media.autoplay.default", "Авто-play аудио/видео"], Def3el: 0, Yellow: 2, Gray: 5, refresh: true,
	keys: [
		[0, "Разрешить", "0"], [2, "Спрашивать", "2"], [1, "Запретить", "1"], [5, "Блокировать", "5"]]
},{
	pref: ["dom.storage.enabled", "Локальное хранилище",, "Сохранение персональных данных, по\nкоторым вас можно идентифицировать"],
	Def3el: false, Yellow: true,
	keys: [[true, "Разрешить"], [false, "Запретить"]]
},{
	pref: ["privacy.resistFingerprinting", "Изоляция Firstparty-Fingerprint", ,"privacy.firstparty.isolate\n\nЗащита данных пользователя также\nзапрещает запоминать размер окна"], Def3el: false,
	keys: [[true, "Да", , "Защита от слежки",`ucf.pref('privacy.firstparty.isolate', true)`], [false, "Нет", , "Защита от слежки",`ucf.pref('privacy.firstparty.isolate', false)`]]
},(()=>{
if (parseInt(Ff.ver) > 114) return { //новый FF
	pref: ["browser.translations.enable", "Встроенный перевод сайтов"], Def3el: true, Gray: false, refresh: true,
	keys: [[true, "Да"], [false, "Откл",,,`ucf.mode_skin('Перевод отключен для новых вкладок')`]]
	}; else return {
	pref: ["media.peerconnection.enabled", "WebRTC ваш реальный IP"], Def3el: false,
	keys: [[true, "Выдать"], [false, "Скрыть"]]
	}
})(),null,{
	pref: ["network.http.sendRefererHeader", "Referer: для чего"], Def3el: 2, Yellow: 1,
	keys: [[0, "Ни для чего", "0"], [1, "Только ссылки", "1"], [2, "Ссылки, графика", "2"]]
},{
	pref: ["browser.cache.disk.capacity", "Кэш браузера",,"\ncache.memory.max_entry_size:\nДиск и память: 5120\nтолько Память: -1"], Def3el: 1048576, Yellow: 0, Gray: 256e3,
	keys: [
	[256e3, I[5]],
	[1048576, "Диск и Память",,,`[[I[7], true], [I[8], true], ['browser.cache.memory.max_entry_size', 5120]].map((a) =>{ucf.pref(...a)})`],
	[0, "только Память",,,`[[I[7], true], [I[8], false], ['browser.cache.memory.max_entry_size', -1]].map((a) =>{ucf.pref(...a)})`],
	[2097152, "только Диск",,,`[[I[7], false], [I[8], true]].map((a) =>{ucf.pref(...a)})`]]
},{
	pref: ["browser.sessionstore.interval", "Резервирование сессий",,"Браузер резервирует сессии на\nслучай сбоя, снижая ресурс SSD"], Gray: 15e3, Def3el: 6e4, Blue: 3e5, Yellow: 9e5,
	keys: [
	[15e3, "15 сек"], [6e4, "1 мин"], [3e5, "5 мин"], [9e5, "15 мин"], [18e5, "30 мин"]]
},{
	pref: [I[4], "User Agent",,"Изменяет вид сайта", [ua,"встроенный"],`console.log("MENU"); console.log(trg.val)`], refresh: true, Def3el: ua,
	// Yellow: I[6] + I[6], Gray: I[6] + I[7],
	keys: [
	[ucf.uam(), "ваши данные…",,,`console.log("VASHI");`], //ucf.about_config(I[4])
	[I[6] + "Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36", "Chrome 118 Win10"],
	[I[6] +"Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", "MSIE 6.0 Windows"],
	["Opera/9.80 (Windows NT 6.2; Win64; x64) Presto/2.12 Version/12.16", "Opera12 W8"],
	[I[6] +"PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)", "Playstation 4"],
	[I[6] +"compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; GT-I8350)", "Windows Phone"],
	[I[6] +"Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.143 YaBrowser/22.5.0.1916 Yowser/2.5 Safari/537.36","Yandex MacOS"],
	[I[6] +"compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "GoogleBot"],
	[ua, I[5]]] //штатный ЮзерАгент
}]; I.push(Setup[Setup.length-1].keys);

Over = { //edit подсказки под мышью
get [B[1]](){ //PanelUI delete this[…];
	ucf.mode_skin(); if (ucf.pref("signon.rememberSignons"))
		Services.cache2.asyncGetDiskConsumption({onNetworkCacheDiskConsumption(bytes){
			ucf.toStatus(T[3] + ucf.formatBytes(bytes),3e3) //вывод объёма кэша
		}, QueryInterface: ChromeUtils.generateQI(["nsISupportsWeakReference","nsICacheStorageConsumptionObserver"])})
	else ucf.toStatus(T[5],2e3); //не хранить пароли
	return tExp(B[1]);
},
get [B[3]](){ //newtab
	return GetDynamicShortcutTooltipText(B[3]) + Tag[B[3]];
},
get [B[0]](){var dw = ucf.dirsvcget("");
	if (dw) ucf.mode_skin(`${ucf.pref(Ff.i) > 1 ? "\u{26A1} Графика отключена," : "💾 папка"} [Загрузки] `+ crop(dw, 96,''));
	return GetDynamicShortcutTooltipText(B[0]) +"\n"+ tExp(B[0]);
},
get "tabbrowser-tab"(){var trg = window.event?.target; //get исполняет код
	trg.tooltipText = trg.label + Tag[B[2]];
},
get [B[10]](){ucf.mode_skin('');
	return GetDynamicShortcutTooltipText(B[10]) +"\n\n"+ Tag[B[10]] +"\n"+ tExp(B[12]);
},
get [M[2]](){return GetDynamicShortcutTooltipText(M[2]) +"\n"+ tExp(B[12]); //stop
},
get [M[0]](){ucf.toStatus(T[0],2500)}, //tab
[B[9]]: Tag[B[9]], [M[4]]: Tag[B[9]], //print
"titlebar-button titlebar-close": Tag[B[13]],
get [M[3]](){ //⋆
	var txt = `${ucf.pref("dom.disable_open_during_load") ? "Запрет" : "↯ Разреш"}ить всплывающие окна`;
	if (!ucf.pref("places.history.enabled")) txt = T[9];
	if (ucf.pref("privacy.sanitize.sanitizeOnShutdown")) txt = T[10];
	ucf.toStatus(txt,3e3);
	var hint = document.getElementById(M[3]).tooltipText;
	return hint.indexOf(T[15]) == -1 ? hint + T[15] : hint;
},
get [B[14]](){return Tag[B[14]] + T[14];},
get "identity-icon-box"(){ //custom hint
	return tooltip_x(window.event.target, tExp(B[4]) + br_val());
},
get [B[4]](){ucf.toStatus(this.br_exp(),2500); //+mode
	return tooltip_x(window.event.target, tExp(B[4]) + br_val());
},
get [B[11]](){ucf.toStatus(this.br_exp(),2500); //щит
	var trg = window.event?.target; //custom hint 2
	return trg.id.endsWith("r") && trg.textContent +'\n'+ tExp(B[11]);
},
get [B[6]](){ //FavMenu
	var trg = window.event?.target;
	if (trg.id == B[6])
		zoom(0,0,0,`, ${ucf.pref("browser.tabs.loadInBackground") ? "Не выбирать" : "Переключаться в"} новые вкладки`)
	else if (trg.id)
			ucf.toStatus(T[6],9e3);
	try {trg.mstate = trg.config.state + trg.menupopup.state;} catch{} //QuickToggle
	if (!/open/.test(trg.mstate))
		return tExp(B[6])
	else trg.tooltipText = "";
},
get [B[8]](){ //reader
	return GetDynamicShortcutTooltipText(B[8]) +"\n"+ Tag[B[8]] + br_val();
},
get [M[5]](){ //ReaderView
	return Tag[B[7]] + Tag[B[8]] + br_val();
},
get "ucf_SessionManager"(){ucf.toStatus(T[11]);},
get "unified-extensions-button"(){return "Расширения"+ T[14]},
get [B[16]](){ //zoompage
	return tooltip_x(window.event.target,"⩉ Ролик ±	Изменить масштаб");
}, get [B[17]](){return Over[B[16]]},
[B[18]]: T[12], [B[19]]: T[12], //SingleFile
[B[20]]: T[13], [B[21]]: T[13], //VDH
br_exp(t = T[2] + br_val()){
	return t +` ${Ff.Exp() ? "Экспертный" : "Простой"} режим кнопок`}
};
((obj,del,re,reos) => { //парсинг блока клавиш ускоряет обработку нажатий
	var num = -Ff.os.length - 1;
	for(var p in Keys) reos.test(p) && del.add( p.endsWith(platform) ? p.slice(0,num) : p);
	for(var p in Keys) del.has(Keys[p]) && del.add(p);
	for(var d of del) delete Keys[d]; //есть Key_OS ? удалить имена-клоны
	for(var p in Keys) if (reos.test(p))
			Keys[p.replace(reos,'')] = Keys[p], delete Keys[p]; //убрать имя вашей ОС из свойства
	for(var p in Keys){var func = Keys[p]; //(){…}, bool,num
		if (typeof func == "string") func = Keys[func]; //ссылка на функцию
		var [key,mod] = p.split("_"); mod = mod || "";
		var upper = key[0].toUpperCase(); var prevent = key[0] == upper;
		var [, m,i] = mod.match(re); m = m || 0; //modifiers bitmap
		var arr = [func,prevent, i ? i == "I" ? 0 : 1 : -1]; //textfields flag Имя_i 1 кроме полей ввода
		var prop = prevent ? key : upper + key.slice(1); //имя без mod
		var o = obj[prop] || (obj[prop] = Object.create(null));
		o[m] ? o[m].push(arr) : o[m] = [arr]; //имя со строчной: Skip preventDefault
	}; Keys = obj; })(Object.create(null),new Set(),/(\d+)?(i)?/i,/_(?:win|linux|macosx)$/);

var Debug = (e,id = "sidebar-box") => {
	if (prefs.getBoolPref(Ff.p +'debug',false)) return true;
	return !document.getElementById(id).hidden;
},
keydown_win = e => { //перехват клавиш, учитывая поля ввода
	if (e.repeat) return; //выключить
	var KB = Keys[e.code]?.[e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey];
	if (KB) //есть HotKey
		for(var [func,p,i] of KB)
			if (i ^ docShell.isCommandEnabled("cmd_insertText"))
				p && e.preventDefault(), func(e, gBrowser.selectedTab); //запуск по сочетанию
	if (!Debug()) return; //показ клавиш
	console.log('■ key '+ e.code + ('_'+ (e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey)).replace('_0',''));
};
listener = { //действия мыши, перехват существующих
	handleEvent(e){
		if (this.skip || e.detail > 1) return;
		var trg = e.target, id = trg.id;
		if (id) Node = trg; //Parent || trg.tagName
		if (e.type == "mouseenter"){
			var hint = Over[id] || Over[(trg = trg.parentNode).id];
			if (hint) trg.tooltipText = hint; return; //обновить подсказку
		}
		var sels = this.selectors.filter(this.filter, trg); //#id
		var {length} = sels; if (!length) return;
		var wheel = e.type.startsWith("w");
		var num = e.metaKey*64 + e.ctrlKey*32 + e.shiftKey*16 + e.altKey*8 + (wheel ? 2 : e.button*128);
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
				this.mousedownTID = setTimeout(this.onLongPress, 333, trg,obj,num);
			if (e.button == 2)
				this.ctx = trg.getAttribute("context"), trg.setAttribute("context","");
			return;
		}
		obj.mousedownTarget || this.stop(e);	//click
		if (this.longPress) return this.longPress = false;
		this.mousedownTID &&= clearTimeout(this.mousedownTID);
		if (!obj[num]){
			if (e.button == 1) return;
			if (e.button){
				num = "context";
				for(var p in this.a) this.a[p] = e[p];
			} else
				num = "dispatch", this.mdt = obj.mousedownTarget;
			obj = this;
		}
		obj[num](trg); //click
	},
	find(sel){ //условия запуска ?
		return Mus[sel][this] || Mus[sel][this + 1];
	},
	filter(sel){return this.closest(sel);
	},
	get selectors(){
		this.onLongPress = (trg,obj,num) => {
			this.mousedownTID = null;
			this.longPress = true;
			obj[num](trg);
		}
		delete this.selectors;
		return this.selectors = Object.keys(Mus);
	},
	get mdEvent(){
		delete this.mdEvent;
		return this.mdEvent = new MouseEvent("mousedown", {bubbles: true});
	},
	context(trg){
		this.ctx ? trg.setAttribute("context",this.ctx) : trg.removeAttribute("context");
		trg.dispatchEvent(new MouseEvent("contextmenu",this.a));
	},
	dispatch(trg){
		this.skip = true;
		this.mdt ? trg.dispatchEvent(this.mdEvent) : trg.click();
		this.skip = false;
	},
	stop: e => {
		e.preventDefault(); e.stopImmediatePropagation();
	},
	a: {__proto__: null,bubbles: true,screenX: 0,screenY: 0}
},
id = "ucf_hookExpert",events = ["click","mousedown","mouseenter","wheel"],
els = document.querySelectorAll("#navigator-toolbox,#ucf-additional-vertical-bar,#appMenu-popup,#widget-overflow-mainView");
for(var el of els) for(var type of events) el.addEventListener(type,listener,true);
window.addEventListener("keydown",keydown_win,true);
ucf_custom_script_win.unloadlisteners.push(id);
ucf_custom_script_win[id] = {destructor(){
	window.removeEventListener("keydown",keydown_win);
	for(var el of els) for(var type of events) el.removeEventListener(type,listener,true);
}};
var addDestructor = nextDestructor => { //для saveSelToTxt
	var {destructor} = ucf_custom_script_win[id];
	ucf_custom_script_win[id].destructor = () => {
		try {destructor();} catch(ex){Cu.reportError(ex);}
		nextDestructor();
}};
with (document) getElementById(B[11]).removeAttribute("tooltip"),
	getElementById("nav-bar").tooltip = id; //флаг успешной загрузки

ucf.mode_skin(); //подсветка кнопок и подсказки отображают настройки браузера
[['ui.prefersReducedMotion',0],['browser.download.alwaysOpenPanel',false],['browser.download.autohideButton',false] //DownloadButton FIX
].forEach((p)=>ucf.pref(...p)); //lockPref опций
var tabr = Ff.p +"opacity",url = `resource://${tabr}/`, //bright tabs
getIntPref = (p) => prefs.getIntPref(p,100),
sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
css = `@-moz-document url(chrome://browser/content/browser.xhtml){
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

css_USER = (css) => { //локальные функции
	var style = FileExists(css) ? Services.io.newURI(css) : makeURI('data:text/css;charset=utf-8,'+ encodeURIComponent(css));
	var args = [style,sss.USER_SHEET]; //стиль: файл или CSS
	(this.css = !this.css) ? sss.loadAndRegisterSheet(...args) : sss.unregisterSheet(...args);
},
gClipboard = {write(str,ch = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)){
		(this.write = str => ch.copyStringToClipboard(str,Services.clipboard.kGlobalClipboard))(str);}
},
TabAct = (e) => {return e.closest(".tabbrowser-tab");
},
TabsDel = (right = 0,curr = gBrowser.selectedTab) => { //закрыть вкладки слева/справа от активной
	var tabs = gBrowser.visibleTabs.filter(tab => !tab.pinned), i = tabs.indexOf(curr);
	var a = (i != -1), b = (a ? i + right : !right * tabs.length);
	args = right ? [b, tabs.length] : [0,b];
	tabs.slice(...args).forEach((i) => {gBrowser.removeTab(i)});
},
saveSelToTxt = async () => { //в .txt Всё или Выбранное
	var {length} = saveURL, splice = length > 9, l11 = length == 11, msgName = id + ":Save:GetSelection"; //FIX FF103+
	var receiver = msg => {var txt = "data:text/plain,"+ encodeURIComponent(gBrowser.currentURI.spec +"\n\n"+ msg.data);
		var args = [txt, ucf.Title() +'.txt',null,false,true,null,window.document];
		splice && args.splice(5,0,null) && l11 && args.splice(1,0,null);
		saveURL(...args);
		ucf.toStatus(crop("√ текст сохранён: "+ ucf.Title(),96,''));
	}
	messageManager.addMessageListener(msgName,receiver);
	addDestructor(() => messageManager.removeMessageListener(msgName,receiver));
	var sfunc = fm => {
		var res,fed,win = {},fe = fm.getFocusedElementForWindow(content,true,win);
		var sel = (win = win.value).getSelection();
		if (sel.isCollapsed){
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
switchTab = (url = 'about:serviceworkers',go = false) => { //открыть вкладку | закрыть, если открыта | выбрать
	for(var tab of gBrowser.visibleTabs)
		if (tab.linkedBrowser.currentURI.spec == url)
			{go ? gBrowser.selectedTab = tab : gBrowser.removeTab(tab); return;}
	gBrowser.addTrustedTab(url);
	gBrowser.selectedTab = gBrowser.visibleTabs[gBrowser.visibleTabs.length -1];
},
openDial = (args = [Ff.c +"options/prefs_win.xhtml","user_chrome_prefs:window","centerscreen,resizable,dialog=no"]) => window.openDialog(...args), //или about:user-chrome-files
tooltip_x = (trg,text = "", ttt = "") => {
	if (!trg.id.endsWith("x")){ //box
		ttt = (trg.hasAttribute("tooltiptext")) ? trg.ttt = trg.tooltipText : trg.ttt;
		if (ttt && ttt.indexOf(text) == -1) ttt += "\n\n";
		trg.removeAttribute("tooltiptext");
	}
	return (ttt.indexOf(text) == -1) ? ttt + text : ttt;
},
bright = (trg,forward,step = 1,val) => { //wheel
	val ||= getIntPref(tabr) + (forward ? step : -step);
	val = val > 100 ? 100 : val < 15 ? 15 : val;
	ucf.pref(tabr,val); trg.toggleAttribute("rst"); ucf.toStatus(T[2] + val +"%",1e3);
},
br_val = () => ucf.pref([tabr,100]) +"%",
zoom = (forward,toggle = false, change = true,text = '') => {
	toggle ? ZoomManager.toggleZoom() : change ? forward ? FullZoom.enlarge() : FullZoom.reduce() : 0;
	ucf.toStatus("± Масштаб "+ Math.round(ZoomManager.zoom*100) +`%${ucf.pref("browser.zoom.full") ? "" : " (только текст)"}` + text,3e3);
},
Expert = (m = Boolean(Ff.Exp()),p = Ff.p +'expert') => {
	ucf.pref(p,!m); ucf.toStatus(Over.br_exp(""),3e3);
},
Help = (help = Ff.c +"help.html") => { //помощь
	(FileExists(help)) ? switchTab(help) : switchTab('victor-dobrov.narod.ru/help-FF.html');
},
userjs = (e,myjs = Ff.c +"custom_scripts/User.js") => {
	Debug() && document.getElementById("key_browserConsole").doCommand(); //фокус на консоль
	FileExists(myjs) ? eval(Cu.readUTF8URI(Services.io.newURI(myjs))) : t = myjs +" — скрипт не найден";
	console.log("✅\t"+ Math.random(),""); //ваш скрипт
},
translate = (brMM = gBrowser.selectedBrowser.messageManager) => { //перевод сайт | выдел. текст
	brMM.addMessageListener('getSelect',listener = (msg) =>{
		if (msg.data) //выделено
			switchTab("https://translate.google.com/#view=home&op=translate&sl=auto&tl=ru&text="+ msg.data,true)
		else
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
	if (first) for(var ind = 0; ind <= max; ind++){ //first
		var node = folder.getChild(ind);
		if (node.type == type){url = node.uri; break;}
	} else		for(var ind = max; 0 <= ind; ind--){ //last
		var node = folder.getChild(ind);
		if (node.type == type){url = node.uri; break;}
	}
	url ||= def_url; return url;
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
				parentGuid: [() => toolbarGuid, () => menuGuid, () => unfiledGuid][prefs.getIntPref("bookmarksparentguid",0)](),
				index: DEFAULT_INDEX
			});} catch {}
	});
}}

(async (id, ad) => { //3 кнопки
CustomizableUI.createWidget({label:`Панели, Папки`,id: id,tooltiptext: Tag[id],
	onCreated(btn){
		btn.style.setProperty("list-style-image","url(chrome://devtools/skin/images/folder.svg)");
	}});
CustomizableUI.createWidget({ label:ad.replace('-',' '), id:ad,
	defaultArea: CustomizableUI.AREA_NAVBAR, localized: false,
	onCreated(btn){
		btn.setAttribute("image","data:image/webp;base64,UklGRjwAAABXRUJQVlA4TC8AAAAvD8ADAAoGbSM5Ov6k774XCPFP/0/03/8JGPxzroIzuOW06Ih60Genn1S/gHe+BgA=");
		btn.onmouseenter = btn.onmouseleave = this.onmouse;
		btn.setAttribute("oncommand","handleCommand(this)"); btn.handleCommand = this.handleCommand;
	},
	onmouse: e => e.target.focusedWindow = e.type.endsWith("r") && Services.wm.getMostRecentWindow(null),
	get handleCommand(){delete this.handleCommand;
		return this.handleCommand = btn => {(btn.handleCommand = new btn.ownerGlobal.Function(this.code).bind(btn))();}
	},
	get code(){delete this.code; var s = Ff.c +"custom_scripts/"+ B[14] +".js";
		try {ad = 'this.focusedWindow && this.focusedWindow.focus();\n'+
			Cu.readUTF8URI(Services.io.newURI(s))} catch {ad = `console.error("No script: "+ ${s})`}
		return this.code = ad;
	}})
})(B[5],B[14]);

/* переключение опций about:config. Лев+Shift | колёсико блокирует авто-закрытие
	есть Yellow = font italic, цвет = ключ, пусто:Red
	refresh=false ⟳ tab, true load skip cache, restart=true with confirm, false ↯ */
CustomizableUI.createWidget({ defaultArea: CustomizableUI.AREA_NAVBAR,
	label: "Журнал, Меню опций", localized: false, id: B[6],
	onCreated(btn) {
		btn.setAttribute("image", "data:image/webp;base64,UklGRkYCAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSJcAAAANcGJr25S8mH4SNGxAgsguPCZ0BcMOiDSNRpvVaCTa3AI2qm2e2ofz7OuwgIiYgMzb4kVjGvegnQFAwXgFVnvcOmtnMJtutAa3Vo4mhRMDpWq8AjfU+yQoYf1/oTkTIdUrknKswNQ5yAdDzqgr4CYbsJWQfEyEU5QNEl2eKFM2AAIbjmSIMjwXPGyEdj6Bdn4mj9KO63sAAFZQOCCIAQAAdAgAnQEqGAAYAD6dRppKgoCqgAE4lsAKwgisgG27uzPePSvBIu/Pr0HJqW+AfoAIHl2DrAnRo/G3JBpTx8yE7L6LFQyD+yUNvuRYAAD+7mwmpaoBcsJ1hVKsMI2ucqid8qndm+WEvH4l4il6lA8FPscgnrRHrnSjjyNcfUV21+TkfqOWKou2UvVsZSl1z+jKs760Vij5XCWF9Uo6TZAhKfrJpeILyQYwq2Ee/g1uyEH/dJMI/91DsVpI6i2vV/Jqpd4/KniJtTm1woLvaotA2ikt3eeBaqlHf8WPe++lSWS7fETjgvzzbflp0Rj+v23kbb9e/VjUcPaD83shRuwzEo6CAO/AGxE+Zwbvv9NDsQT6T+S4CCDOFTuMRVv9/0E4P+uK+Vc3bMfQQD05gY/fes+ZX6ZHkvFdMn7zX8LMVvI59p7F806HPD2lBjs4lWWhQ5ckJDNflZL49370shr3/Q9uMJN9i/NVCu4OT7K3+4+/RkAMnjuY09u+3i4y4CldQG789iIAAAA=");
		var doc = btn.ownerDocument, m = nn => doc.createXULElement(nn);
		btn.domParent = null;
		btn.popups = new btn.ownerGlobal.Array();
		this.createPopup(doc, btn, "config", Setup);
		btn.linkedObject = this;
		for(var type of ["contextmenu", "command"])
			btn.setAttribute("on" + type, `linkedObject.${type}(event)`);
		this.addSheet(btn);
		var popup = m("menupopup"), menu = m("menuitem");
		menu.m = m;
		menu.fill = this.fill;
		menu.render = this.render;
		popup.append(menu);
		btn.prepend(popup);
	},
	render(){
		var popup = this.parentNode;
		this.remove();
		this.fill(Menu, popup);
	},
	fill(arr, popup){
		for(var o of arr) if (o) {
			var sub = Array.isArray(o); //подменю?
			var name = sub ? "menu" : "menuitem";
			var {lab, inf, cmd, img} = sub ? o.shift() : o;
			var item = this.m(name);
			item.setAttribute("label", lab);
			if (img)
				item.image = img, item.className = name +"-iconic";
			if (inf)
				item.tooltipText = inf;
			sub || cmd && item.setAttribute("oncommand", cmd.toString().replace(/cmd\(.*?\)/,''));
			popup.append(item);
			sub && o.length && this.fill(o, item.appendChild(this.m("menupopup")));
		}
			else popup.append(this.m("menuseparator"));
	},
	addSheet(btn) { //текст под курсором
		var cb = Array.isArray(btn._destructors);
		var id = cb ? btn.id : B[6];
		var css = `#${id} menu[_moz-menuactive] {
			color: ${I[0]} !important;
		}`;
		var args = [
			"data:text/css;charset=utf-8," + encodeURIComponent(css),
			Ci.nsIDOMWindowUtils.USER_SHEET
		];
		if (cb) var destructor = function() {
			this.removeSheetUsingURIString(...args);
		}
		var add = b => b.ownerGlobal.windowUtils.loadSheetUsingURIString(...args);
		(this.addSheet = !cb ? add : btn => {
			add(btn);
			btn._destructors.push({destructor, context: btn.ownerGlobal.windowUtils});
		})(btn);
	},
	createPopup(doc, btn, prop, data) {
		var popup = doc.createXULElement("menupopup");
		btn.popups.push(btn[prop] = popup);
		popup.id = this.id + "-" + prop;
		for (var type of ["popupshowing"])
			popup.setAttribute("on" + type, `parentNode.linkedObject.${type}(event)`);
		for(var obj of data) popup.append(this.createElement(doc, obj));
		btn.append(popup);
	},
	createElement(doc, obj) { //pref
		if (!obj) return doc.createXULElement("menuseparator");
		var pref = doc.ownerGlobal.Object.create(null), node, bool, img;
		for(var [key, val] of Object.entries(obj)) {
			if (key == "pref") {
				var [apref, lab, akey, hint, undef, code] = val; //строка меню
				pref.pref = apref; pref.lab = lab || apref;
				if (hint) {
					if (RegExp(/\p{L}/,'u').test(hint[0]) && (hint[0] === hint[0].toUpperCase()))
						hint = '\n'+ hint;
					pref.hint = hint;
				}
				if (undef) pref.undef = undef; //если не массив: undef || undef == ""
				if (code) pref.code = code;
			}
			else if (key == "icon") img = val, pref.img = true;
			else if (key != "keys") pref[key] = val;
			else pref.hasVals = true;
		}
		var t = prefs.getPrefType(pref.pref), m = {b: "Bool", n: "Int", s: "String"};
		var str = m[t == prefs.PREF_INVALID ? obj.keys ? (typeof obj.keys[0][0])[0] : "b" : t == prefs.PREF_BOOL ? "b" : t == prefs.PREF_INT ? "n" : "s"]; //String по-умолчанию
		pref.get = prefs[`get${str}Pref`];
		var map, set = prefs[`set${str}Pref`];
		if (pref.hasVals) {
			for(var [val,,,,code] of obj.keys)
				code && (map || (map = new Map())).set(val, code);
			if (map) pref.set = (key, val) => {
				set(key, val);
				map.has(val) && eval(map.get(val)); //код2 если pref изменён
			}
		}
		if (!map) pref.set = set;
		node = doc.createXULElement("menu");
		node.className = "menu-iconic";
		img && node.setAttribute("image", img);
		akey && node.setAttribute("accesskey", akey);
		(node.pref = pref).vals = doc.ownerGlobal.Object.create(null);
		this.createRadios(doc,
			str.startsWith("B") && !pref.hasVals ? [[true, "true"], [false, "false"]] : obj.keys,
			node.appendChild(doc.createXULElement("menupopup"))
		);
		if ("Def3el" in obj) pref.noAlt = !("Yellow" in obj);
		return node;
	},
	createRadios(doc, vals, popup) {
		for(var arr of vals) {
			var [val, lab, key, hint] = arr;
			var menuitem = doc.createXULElement("menuitem");
			with (menuitem)
				setAttribute("type","radio"), setAttribute("closemenu","none"), setAttribute("label", popup.parentNode.pref.vals[val] = lab), key && setAttribute("accesskey", key);
			var tip = menuitem.val = val === "" ? "[ пустая строка ]" : val;
			if (hint) tip += "\n" + hint;
			menuitem.tooltipText = `${tip != undefined ? tip + "\n\n" : ""}клик с Shift блокирует авто-закрытие`;
			popup.append(menuitem);
		}
	},
	regexpRefresh: /^(?:view-source:)?(?:https?|ftp)/,
	upd(node) {
		var {pref} = node, def = false, user = false, val; //если опция не найдена
		if (prefs.getPrefType(pref.pref) != prefs.PREF_INVALID) {
			try {
				val = pref.defVal = db[pref.get.name](pref.pref); def = true; //опция по-умолчанию получена
			} catch {def = false}
			user = prefs.prefHasUserValue(pref.pref);
			if (user) try {val = pref.get(pref.pref, undefined);} catch {}
		}
		if (val == pref.val && def == pref.def && user == pref.user) return;
		pref.val = val; pref.def = def; pref.user = user;
		var exists = def || user;
		if (!exists && pref.undef) //опции нет ? вернуть default
			val = pref.undef[0];
		var hint = hints.get(pref.pref);
		hint ||= val != undefined ? val : "Эта опция не указана";
		if (hint === "") hint = "[ пустая строка ]";
		hint += "\n" + pref.pref;
		if (pref.hint) hint += "\n" + pref.hint;
		node.tooltipText = hint; //+ текст
		var img = Icon("999"), alt = "Yellow" in pref && val == pref.Yellow, clr = "Gray" in pref && val == pref.Gray, blu = "Blue" in pref && val == pref.Blue;
		if (clr) img = Icon("999"); if (blu) img = Icon("a0f"); if (alt) img = Icon("f80");
		if ("Def3el" in pref)
			if (val == pref.Def3el)
				node.style.removeProperty("color"), img = Icon();
			else {
				node.style.setProperty("color", "#702020", "important");
				if (!alt && !clr && !blu) img = Icon("f26");
			}
		pref.img || node.setAttribute("image", img); //нет Def3el ? серый
		user
			? node.style.setProperty("font-style", "italic", "important")
			: node.style.removeProperty("font-style");
		var {lab} = pref;
		if (exists && pref.hasVals) {
			if (val in pref.vals) var sfx = pref.vals[val] || val;
			else var sfx = user ? "другое" : I[5];
			lab += ` ${"restart" in pref ? "↯-" : "refresh" in pref ? "-⟳" : "—"} ${sfx}`;
		}
		lab = exists ? lab : '['+ lab + `${"restart" in pref ? " ↯" : "refresh" in pref ? " ⟳" : ""}` +']'+ `${pref.undef ? " - "+ pref.undef[1] : ""}`;
		node.setAttribute("label", lab); //имя = [имя] если преф не существует
	},
	openPopup(popup) {
		var btn = popup.parentNode;
		if (btn.domParent != btn.parentNode) {
			btn.domParent = btn.parentNode;
			if (btn.matches(".widget-overflow-list > :scope"))
				var pos = "after_start";
			else var win = btn.ownerGlobal, {width, height, top, bottom, left, right} =
				btn.closest("toolbar").getBoundingClientRect(), pos = width > height
					? `${win.innerHeight - bottom > top ? "after" : "before"}_start`
					: `${win.innerWidth - right > left ? "end" : "start"}_before`;
			for(var p of btn.popups) p.setAttribute("position", pos);
		}
		popup.openPopup(btn);
	},
	maybeRestart(node, conf) {
		if (conf && !Services.prompt.confirm(null, this.label, "Перезапустить браузер?")) return;
		var cancel = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
		Services.obs.notifyObservers(cancel, "quit-application-requested", "restart");
		return cancel.data ? Services.prompt.alert(null, this.label, "Запрос на выход отменён.") : this.restart();
	},
	async restart() {
		var meth = Services.appinfo.inSafeMode ? "restartInSafeMode" : "quit";
		Services.startup[meth](Ci.nsIAppStartup.eAttemptQuit | Ci.nsIAppStartup.eRestart);
	},
	maybeRe(node, fe) {
		var {pref} = node;
		if ("restart" in pref) {
			if (this.maybeRestart(node, pref.restart)) return;
		}
		else this.popupshowing(fe, node.parentNode);
		if ("refresh" in pref) {
			var win = node.ownerGlobal;
			if (this.regexpRefresh.test(win.gBrowser.currentURI.spec)) pref.refresh
				? win.BrowserReloadSkipCache() : win.BrowserReload();}
	},
	maybeClosePopup(e, trg) {
		(e.shiftKey || e.button == 1) || trg.parentNode.hidePopup();
	},
	popupshowing(e, trg = e.target) {
		if (trg.state == "closed") return;
		if (trg.id) {
			for(var node of trg.children) {
				if (node.nodeName.endsWith("r")) continue;
				this.upd(node);
				!e && node.open && this.popupshowing(null, node.querySelector("menupopup"));
			} return;
		}
		var {pref} = trg.closest("menu"), findChecked = true;
		var findDef = "defVal" in pref;
		var checked = trg.querySelector("[checked]");
		if (checked) {
			if (checked.val == pref.val) {
				if (findDef) findChecked = false;
				else return;
			}
			else checked.removeAttribute("checked");
		}
		if (findDef) {
			var def = trg.querySelector("menuitem:not([style*=font-style]");
			if (def)
				if (def.val == pref.defVal) {
					if (findChecked) findDef = false;
					else return;
				}
				else def.style.setProperty("font-style", "italic", "important");
		}
		for(var node of trg.children) if ("val" in node) {
			if (!pref.val && pref.val != "" && pref.undef)
				pref.val = pref.undef[0]; //опции нет ? вернуть default
			if (findChecked && node.val == pref.val) {
				node.setAttribute("checked", true);
				if (findDef) findChecked = false;
				else break;
			}
			if (findDef && node.val == pref.defVal) {
				node.style.removeProperty("font-style");
				if (findChecked) findDef = false;
				else break;}
		}
	},
	command(e, trg = e.target) { //LMB
		if (trg.btn) return;
		var menu = trg.closest("menu"), newVal = trg.val;
		if (!menu || !menu.pref) return;
		this.maybeClosePopup(e, menu);
		menu.pref.code && eval(menu.pref.code); //run1
		if (newVal != menu.pref.val)
			menu.pref.set(menu.pref.pref, newVal), this.maybeRe(menu, true);
	},
	contextmenu(e, trg = e.target) {
		if (!("pref" in trg)) return;
		this.maybeClosePopup(e, trg);
		if (trg.pref.user)
			prefs.clearUserPref(trg.pref.pref), this.maybeRe(trg);
		trg.pref.code && eval(trg.pref.code); //run
	}
});

if (Ff.os == "macosx")
	Object.keys(Tag).forEach((k)=>{ //i счётчик, замена букв
		['◉','Ø'].forEach((c,i)=>{Tag[k] = Tag[k].replace(new RegExp(c,'g'),
		['⦿','◎'][i])})})
else if (ucf.pref([Ff.p +'winbuttons',false]))
		css_USER('.titlebar-buttonbox {display: none !important}')
	else css_USER(Ff.c +"custom_styles/win_buttons-vitv.css");

})(Ff = {p:'extensions.user_chrome_files.',c:'chrome://user_chrome_files/content/',i:'permissions.default.image',
	os: AppConstants.platform, ver: Services.appinfo.version.replace(/-.*/,''),
	Ctr(m = "⌘", w = "Ctrl+"){return this.os == "macosx" ? m : w},
	Exp(){return Number(Services.prefs.getBoolPref(this.p +'expert',false))}
},()=>{ //перенос кода в конец
B = Object.keys(Tag), T = Tag["@"].split('|');
for(let i=16;i<T.length;i++){B.push(T[i]+"BAP",T[i]+"browser-action")}; //расширения
FileExists = (file) => {try { //файл|папка есть?
	if (!file.startsWith("chrome://"))
		return FileUtils.File(String.raw`${file}`).exists()
	else return Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).convertChromeURL(Services.io.newURI(file)).QueryInterface(Ci.nsIFileURL).file.exists();
	} catch {}; return false;
},
crop = (s,cut = 33,ch = '…\n') => { //сократить/разбить строку
	return s.substring(0,cut) +`${s.length > cut - 1 ? `${ch}…${s.substring(s.length - cut + ch.length,s.length)}`: ''}`;
},
tExp = (name,m = Ff.Exp(), t,z)=>{ //… {Общий︰Эксперт (m = 1)[︰…]}
	t = Tag[name]; z = t.match(/(\{)([\s\S]*?)(\})/gm);
	if (z) z.forEach((k,h) =>{ //текст зависит от режима
		h = k.split('︰'); if (h && h.length > m)
			t = t.replace(k,h[m].replace(/\{|\}/g,''));})
	return t;
},
{prefs} = Services, db = prefs.getDefaultBranch(""),
Icon = (c = '0c0')=>"data:image/svg+xml;charset=utf-8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='a' x1='16' x2='16' y1='32' gradientUnits='userSpaceOnUse'><stop stop-color='%23"+ c +"'/><stop stop-color='%23fff' offset='.8'/></linearGradient><linearGradient id='b' x2='32' y1='16' gradientTransform='matrix(1 0 0 1 2 2)'><stop stop-opacity='.5'/></linearGradient></defs><circle cx='16' cy='16' r='15' fill='url(%23a)' stroke='url(%23b)' stroke-width='2'/></svg>",
I = [AppConstants.platform == "win" ? '#124' : '#e8e8e8', //текст под курсором, без Aero #fff
	"https://antizapret.prostovpn.org/proxy.pac", "network.proxy.type", "network.proxy.autoconfig_url", "general.useragent.override", "по-умолчанию", "Mozilla/5.0 (", "browser.cache.memory.enable", "browser.cache.disk.enable"],
window.ucf = { //all ChromeOnly-scripts
	pref(key,set){ //или key = [key,default]
		if (typeof key != "object") key = [key];
		var t = prefs.getPrefType(key[0]), m = {b:"Bool",n:"Int",s:"String"};
		t = m[t == 128 ? "b" : t == 64 ? "n" : t == 32 ? "s" : ""];
		if (set == "get") return t; //тип опции
		if (!t) t = m[set != undefined ? (typeof set)[0] : (typeof key[1])[0]];
		if (t) if (set != undefined)
			prefs[`set${t}Pref`](key[0],set)
		else
			set = prefs[`get${t}Pref`](...key);
		return set;
	},
	ua(real = false,ua_my = I[4]){ //текущий или вшитый ЮзерАгент
		ttt = this.pref(ua_my); prefs.clearUserPref(ua_my);
		ua = Cc["@mozilla.org/network/protocol;1?name=http"].getService(Ci.nsIHttpProtocolHandler).userAgent; //костыль
		ttt && this.pref(ua_my,ttt); ttt ||= ua; if (real) ttt = ua; return ttt;
	},
	dirsvcget(){ //константа пути + subdirs, если посл. опция = "" вернуть путь, иначе открыть
		var f, d = [...arguments], r = (d[d.length-1] == ""); (r) && d.pop();
		try {f = Services.dirsvc.get(d[0] || "DfltDwnld",Ci.nsIFile);} catch {f = prefs.getComplexValue("browser.download.dir",Ci.nsIFile)}
		d.slice(1, d.length).forEach((c)=>f.append(c));
		if (r) return f.path; f.exists() && f.launch();
	},
	formatBytes(b = 0,d = 1){ //объём байт…Тб
		let i = Math.log2(b)/10|0; return parseFloat((b/1024**(i=i<=0?0:i)).toFixed(d))+`${i>0?'KMGT'[i-1]:''}b`;
	},
	about_config(filter){ //на опцию
		if (gURLBar.value.startsWith("about:config")) switchTab(gURLBar.value);
		var setFilter = (e,input = (e?.target || window.content.document).getElementById("about-config-search")) => {	try {
			if (e || input.value != filter) input.setUserInput(filter);} catch{}
		},
		found = window.switchToTabHavingURI("about:config",true, {relatedToCurrent: true,
			triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
		if (found) setFilter(null,window);
		else gBrowser.selectedBrowser.addEventListener("pageshow",setFilter, {once: true});
	},
	toStatus(txt,time = 5e3,StatusPanel = window.StatusPanel){
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
	flash(id,style,color,ms,text,time = 5e3){ //статус, мигание
		id = document.getElementById(id || 'urlbar-input-container'); if (!id) return;
		if (style) id.style.filter = style; if (color) id.style.background = color;
		if (ms) setTimeout(() => {
			id.style.removeProperty('filter'),id.style.removeProperty('background-color');},ms);
		if (text) ucf.toStatus(text,time);
	},
	mode_skin(text,p,t,s = 'unset',o = '',z){with(this){setTimeout(()=>{ //подсветка кнопок и подсказки отображают настройки браузера
		if (pref("dom.security.https_only_mode"))
			flash(B[10],"drop-shadow(0px 0.5px 0px #F8F)"),o = ', только HTTPS'
		else flash(B[10],"none");
		if (ua() && (ua() != ua(true))) o = o +', чужой ЮзерАгент';
		z = pref("network.proxy.no_proxies_on") == "" ? "" : ", Есть сайты-исключения";
		p = p || pref(I[2]);
		if (p == 1) t = ['sepia(100%) saturate(150%) brightness(0.9)', 'Ручная настройка прокси'+ z];
		else if (p == 2) t = ['hue-rotate(120deg) saturate(70%)',T[1] + z],s = 'hue-rotate(270deg) brightness(95%)';
		else if (p == 4) t = ['hue-rotate(250deg) brightness(0.95) saturate(150%)','Сеть - автонастройка прокси'+ z];
		else if (p == 0) t = ['saturate(0%) brightness(0.95)','Настройки сети - системные'+ z];
		else t = [s,'Сеть работает без прокси']; //серый фон кнопки
		flash(B[0], pref(Ff.i) > 1 ? "hue-rotate(180deg) drop-shadow(0px 0.5px 0px #F68)" : "none");
		flash(B[6],s); flash(B[1],t[0]);
		z = typeof(text); if (z == 'string')
			toStatus(text ? text : "\u{26A1}"+ t[1] + o,5e3); //светофор
	},250)}},
	switchProxy(pac = I[1]){
		var t = I[2],u = I[3];
		if (this.pref(t) != 2) //выключить
			this.pref(t,2), this.pref(u,pac)
		else
			this.pref(t,5), this.pref(u,"localhost");
		this.mode_skin(); //разный фон замка для Прокси
		BrowserReload();
	},
	Title(n){try {return Cu.getGlobalForObject(Cu)[Symbol.for("TitlePath")](window,n)[3]
		} catch {return document.title || gBrowser.selectedTab.label}},
	HTML(){
		var inf = [crop("√ страница записана: "+ this.Title(),48,''),7e3], sfile = document.getElementById(B[18]); //расширение SingleFile
		try {Cu.getGlobalForObject(Cu)[Symbol.for("SingleHTML")](true,window); //SingleHTML.jsm
			gBrowser.selectedTab.textLabel.style.textDecoration = "overline"; //^отметка
		} catch {if (sfile) sfile.click(), inf = ''
			else inf = ['☹ Ошибка SingleHTML.jsm',1e4];
		}
		this.toStatus(...inf);
	}
}, ua = ucf.ua(true), //real ЮзерАгент
fonts = arr => arr.map(n => [(n == arr[arr.length-1] ? null : n), n]), //array с вложениями
serif = fonts("Arial|Cantarell|DejaVu Sans|Roboto|PT Serif|Segoe UI|Ubuntu|Cambria|Fira Sans|Georgia|Noto Sans|Calibri|Times".split('|')), sans = [["PT Sans","PT Sans"], ...serif],
hints = new Map([ //опция отсутствует ? вернуть строку
	["ucf.savedirs", crop(ucf.dirsvcget(''),34)], [I[4], ucf.ua()]]);
});