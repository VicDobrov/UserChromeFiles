/* hookMouseKeys © Dumby, mod 3.1 Dobrov !нужен скрипт SingleHTML
меняйте «под себя» Подсказки, Keys нажатия клавиш, Menu команды, Mouse клики мыши, Setup меню опций */

(async init =>{init(); Tag = {[F.D]:`{`+ //подсказки кнопок вкладок меню: справка в help.html
`
◉ колёсико	⬇︎ папка [Загрузки]
◨ правый клик ➜ Сохранить сайт
◉ колёсико на Фото ➜ Сохранить
	или перетащите фото вправо︰`+ //режимы Простой|Эксперт: разные действия|подсказки

`◧ лев. Держать  папка [Загрузки]\n
◨ правый клик (Alt+S) ➜ Сохранить\n    в единый Html всё / выделенное
◉ колёсико, ${F.tc("Super","Ctrl+Shift")}+S как Текст\n
◧ дважды на Фото: найти Похожие
◧ лев + Shift   Графика вкл/выкл}`,[F.P]: //PanelUI фон кнопки Blue Gray Red Green Yellow

`◧ лев. клик	меню Firefox ${F.ver}{\n︰
◧ + Shift	⤾ Вернуть вкладку\n}
◧ держать	✕ Закрыть браузер
◧ +Alt, ◉ ролик  Окно │ Развернуть

◨ прав. клик	⇲ Свернуть
◉ колёсико	Масштаб страницы {︰`/*эксперт*/+ `
◨ + Alt		Сведения о системе}`, [F.B]: //запуск команд: Menu.Dict.cmd()

`◉ + Shift		Закрыть вкладки слева
◉ ролик +Alt	…справа от активной`, [F.C]: //NewTab. SideBar открыт: код нажатий в консоль
`\n
◨ прав. клик	Вернуть вкладку
◉ колёсико	Оставить 1 текущую`, [F.I]: //identity-box

`Правый клик	 Копировать адрес в буфер
◧ лев + Shift	 Медиа на странице {︰\n
◉ колёсико	 Настройки прокси}
Ø крутить ±	 Яркость страниц `, [F.F]: //FavDir

`Левый клик	★ Закладки\n◧ + Alt		Домашняя папка
Правый		⟳ История\n◨ + Alt		Папка установки\n
◉ колёсико	⬇︎ Загрузки
◉ ролик +Alt	UserChromeFiles`, [F.Q]: //QuickToggle ◨ + Alt посл.закладка меню

`левая кнопка ◧ мыши «Журнал»\n
◉ колёсико	меню «Действия»
◨ правая	Быстрые настройки
◨ держать	Пипетка цвета, линза\n
◧ лев. + Alt	Библиотека
◧ держать	Новая вкладка (${F.tc()}T){︰\n
Ø Ролик ±	масштаб Страницы
◧ + Shift	масштаб Текст / Всё}`, [F.R]: //ReaderView

`Клик мыши	Чтение в ReaderView
Колёсико	Простой режим чтения\n`, [F.M]: //reader-mode
`
Прав. клик	Адаптивный дизайн
Alt + R		Выбор части страницы
Крутить ±	Яркость страниц `, [F.L]: //Print

`Распечатать страницу (${F.tc()}P)\n
Правый клик	быстрая Печать
◉ ролик режим Простой | Эксперт
◧ держать	краткая Справка`, [F.N]: //Reload

`Прав. клик	Обновить без кэша
◧ держать	Обновить всё`, [F.O]: //Щит

`нажатие мыши	Сведения о защите сайта\n
◨ правый клик	Куки и данные сайта
◧ лев. держать	⇆ Web-шрифты
◉ колёсико		ServiceWorkers`, [F.S]: //Stop

`◉ Колёсико	Прервать обновления {︰
◨ п.держать	Антизапрет ⇆ Без прокси}`, [F[0]]: //Close кроме Windows

`Закрыть Firefox ${F.ver}\n
◉ колёсико	вернуть вкладку
◧ держать	краткая Справка\n◨ пр. клик	⇲ Свернуть`, [F.A]:

`◧ лев. клик	Атрибут-Инспектор
◉ колёсико	Инструменты браузера\n\n◨ пр. клик`, [F.E]: //unified-extensions

`◧ лев. клик	Расширения\n◨ прав. клик	меню «Действия»\n\n◉ колёсико`}; 

// Setup: меню настроек. Default-опция Gray, изменено: курсив. Не равно Def3el: Red или ваш цвет

Menu = { //массив команд пользователя, alt() клик правой кнопкой, upd() изменять строку меню
	View: {
		lab: `Мобильный дизайн | для Чтения`, inf: F.b, img: F.ico +"aboutdebugging-connect-icon.svg",
		cmd(trg){ //пункт меню с HotKey
			trg.ownerDocument.getElementById("key_responsiveDesignMode").doCommand();
			if(gBrowser.selectedBrowser.browsingContext.inRDMPane) BrowserReload();},
		alt(btn){
			btn.ownerDocument.getElementById("key_toggleReaderMode").doCommand()} //штатный Режим чтения
	},
	HTML: {lab: `Экспорт сайта в единый HTML`, img: F.ie,
		inf: `используя SingleHTML.jsm\nили расширение SingleFile`,
		cmd(){ ucf.HTML()}
	},
	Tab: {lab: `Вернуть вкладку | Обновить все`, inf: F.b, img: F.upd,
		cmd(trg){trg.ownerGlobal.undoCloseTab()},
		alt(){
			with (gBrowser) selectAllTabs(),reloadMultiSelectedTabs(),clearMultiSelectedTabs()}
	},
	Fav: {lab: `Закладки первая ссылка ⇅ Последняя`,
		inf: `на Яндекс, если меню «Закладки» пустое\nправ. клик + Alt на кнопке Быстрых опций`,
		cmd(){
			switchTab(FavItem())},
		alt(){switchTab(FavItem(true))}
	},
	Dict: { sep: 1, //сперва разделитель
		lab: `Гугл-перевод Сайт/выделенный Текст`,
		cmd(){Translate()}
	},
	O: { men: 1, //подменю
		lab: `Опции about:config`, inf: `Быстрые настройки`, img: F.opt,
		DwDir: {lab: `папка Загрузки | chrome:`, inf: F.b, img: F.dir,
			cmd(){
				Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)},
			alt(){ucf.dirsvcget("UChrm")}
		},
		"Режим полной изоляции сайтов": {
			inf: "Сайт не «узнает» ваши действия в других вкладках",
			cmd(){
				var p = "fission.autostart"; ucf.pref(p, !ucf.pref(p));
			},
			upd(){
				var i = F.sec;
				if(ucf.pref("fission.autostart"))
					i = i.replace("-in","-");
				this.image = i;
			},
		},
		"Сведения о браузере": { sep: 1,
			cmd(){switchTab('about:support')}, img: "resource://gre-resources/password.svg"
		},
		"Настройки профайлера": {
			cmd(){switchTab('about:profiling')}
		},
		Remote: {lab: `Удалённая отладка`,
			cmd(chr = "devtools.chrome.enabled",rem = "devtools.debugger.remote-enabled"){
				if(!ucf.pref(chr) || !ucf.pref(rem)){
					ucf.pref(chr,true); ucf.pref(rem,true);
				}
				var {BrowserToolboxLauncher} = ChromeUtils.import("resource://devtools/client/framework/browser-toolbox/Launcher.jsm");
				BrowserToolboxLauncher.init();}
		},
		"Настройки UserChromeFiles": {sep: 1, img: F.opt, cmd(){UCF()} //UCFprefs
		},
		DelCache: {lab: `Restart браузер, удалить кэш`, img: F.del,
			cmd(){
				var cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
				Services.obs.notifyObservers(cancelQuit,"quit-application-requested","restart");
				if(cancelQuit.data) return false;
				Services.appinfo.invalidateCachesOnRestart();
				var restart = Services.startup;
				restart.quit(restart.eAttemptQuit | restart.eRestart);}
		}
	},
	VPN: {lab: "VPN Антизапрет ⇆ Без прокси", inf: "Censor Tracker только отключается",
		upd(){ //обновлять строку перед показом меню
			this.image = ucf.pref(F.x) == 2 ? F.ok : F.no;
		},
		cmd(){ucf.switchProxy()}
	},
	Pics: {
		upd(){ //обновлять строку меню
			var val = ucf.pref(F.v), s = val == 1, i = F.pdi; s ? i = i.replace("-blocked","") : 0;
			this.label = `Графика страниц – ${s ? "включена" : val == 3 ? "только сайт" : "запрещена"}`;
			this.image = i || F.nul;
			this.tooltipText = `правый Клик: кроме сторонних\n${F.v} = ${val}`;
		},
		cmd(){
			var n = ucf.pref(F.v) != 1; ucf.pref(F.v, n ? 1 : 2);
			ucf.mode_skin(); BrowserReload();
			Status(`Загрузка изображений ${n ? "√ разреш" : "✘ запрещ"}ено`,3e3);
		},
		alt(){
			ucf.pref(F.v, 3); BrowserReload();
		},
	},
	EyeDrop: {lab: `Пипетка цвета, Линза`, img: F.eye, sep: 1,
		cmd(trg){
			var url = `resource://devtools/shared/${parseInt(F.ver) > 95 ? "loader/" : ""}Loader.`;
			try {var exp = ChromeUtils.importESModule(url + "sys.mjs");} catch {exp = ChromeUtils.import(url + "jsm");}
			var obj = exp.require("devtools/client/menus").menuitems.find(menuitem => menuitem.id == "menu_eyedropper");
			(test = obj.oncommand.bind(null, {target:trg}))();
			UcfGlob.Flash(0,'rgba(100,0,225,0.1)',0, F.e);}
	},
	Notes: {lab: `приложение «Записки»`, img: F.ico +"tool-application.svg",
		cmd(){
			if(F.os == "win") shell_RunwA("C:\\Windows\\system32\\StikyNot.exe","");
			if(F.os == "macosx") shell_RunwA("/usr/bin/open", ["-n","-b","com.apple.Stickies"]);
		}
	},
	"запуск скрипта user.js (Alt+x)": {
		cmd(trg){userjs(trg)}
	},
	"Краткая справка | Жесты мыши": { inf: F.b, img: F.hlp,
		alt(s = "ucf_mousedrag.js"){
			var h = document.getElementById("nav-bar").ucf_mousedrag;
			h ||= F.q + s;
			Services.prompt.alert(null,"Справка по жестам мыши",`Перетащите фото вправо, чтобы сохранить\n\n`+ h);},
		cmd(){Help()}
}}

Keys = { //перехват-клавиш KeyA[_mod][_OS](e,t){код} и KeyB: "KeyA"
	KeyX_1(e,t){userjs(e)}, // Alt+X запуск внешнего JS-кода
	KeyS_6(){saveSelToTxt()}, // Ctrl+Shift+S
	KeyS_15_macosx: "KeyS_6", // Super+S
	KeyS_1(e,t){ucf.HTML()}, //Alt+S | e: Event, t: gBrowser.selectedTab
/*
	mod = e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey
	mod + I в конце: только в полях ввода, «i» кроме полей ввода
	1я буква строчная: передавать нажатия, запрет preventDefault
	отделять «_» от кода, если есть модификаторы и/или «iI»-флаг
	только в указанной OS: KeyA_1i_win(e,t){… Alt+A для винды */
},

Mouse = { //клики Meta*64 Ctrl*32 Шифт*16 Alt*8 (Wh ? 2 : But*128) long*1
	"urlbar-input": {
		2(trg, forward){trg.value = ""} //очистить колёсиком
	},
	[F.B +"s"]: { //<> вкладки колёсиком
		2(trg,forward){
			gBrowser.tabContainer.advanceSelectedTab(forward ? -1 : 1,true)},
		128(btn){ //СМ
			if(btn.id == F.C)
				gBrowser.removeAllTabsBut(gBrowser.selectedTab)
			else
				gBrowser.removeTab(TabAct(btn));}, //вкладка под мышью
		136(){
				gBrowser.removeTabsToTheEndFrom(gBrowser.selectedTab, {animate: true});
			}, //C+Alt закрыть вкладки справа
		144(){ //C+Shift … слева
			gBrowser.removeTabsToTheStartFrom(gBrowser.selectedTab, {animate: true});
			},
		8(){},16(){},64(){} //выбор
	},
	[F.C]: { //newTab
		256(btn){btn.ownerGlobal.undoCloseTab()}
	},
	"stop-button": {
		128(){ //С
			for (var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop() },
		257(){ucf.switchProxy()}
	},
	[F.K]: { //ReaderView
		2(trg,forward){bright(trg,forward,5)}, //яркость по wheel ±
		128(btn){Menu.View.alt(btn)},
		256(btn){Mouse[F.M][256](btn)}
	},
	[F.T]: {
		1(){Translate()}, //держать
		8(){ //R + Alt
			window.PlacesCommandHook.showPlacesOrganizer("BookmarksToolbar") }, //библиотека
		128(){switchTab(FavItem())},
		129(){ //дС
			switchTab(FavItem(true))},
		256(){toFav()}
	},
	"appMenu-print-button2": { //меню Печать…
		1(){Help()}, 128(){Expert()},
		256(){Mouse[F.L][256]()}
	},
	[F.L]: { //print
		1(){Help()}, //д
		128(){Expert()},
		256(){document.getElementById("menu_print").doCommand()} //R
	},
	[F.M]: { //➿
		2(trg,forward){bright(trg,forward,5)}, //яркость
		256(btn){Menu.View.cmd(btn)} //MobileView
	},
	[F.N]: { //reload
		1(){Menu.Tab.alt()}, //д
		128(){for (var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop()}, //СМ
		256(){BrowserReloadSkipCache()}, //R
		257(){ucf.switchProxy()} //дR
	},
	[F.D]: {mousedownTarget: true, //не передавать нажатия дальше
		1(){ Menu.O.DwDir.cmd()}, //д
		16(){Menu.Pics.cmd()},//+Shift
		128(){Exp()
			? saveSelToTxt() : //сохранить|выделен. как .txt
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)},
		256(){ucf.HTML()} //web
	},
	[F.P]: {mousedownTarget: true, //PanelUI
		1(btn){goQuitApplication(btn)}, //д
		2(trg,forward){zoom(forward)}, //wheel
		16(btn){btn.ownerGlobal.undoCloseTab()}, //L+Shift
		8(){windowState != STATE_MAXIMIZED ? maximize() : restore()}, //L+Alt
		128(){windowState != STATE_MAXIMIZED ? maximize() : restore()},
		129(){BrowserFullScreen()}, //дС
		136(){this[129]()}, //С+Alt
		144(){Mouse[F.Q][136]()}, //C+Shift
		256(){minimize()},
		264(){switchTab('about:support')}, //R+Alt
		272(btn){btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("History")} //R+Shift
	},
	[F.I]: { //замок
		8(){UCF()}, //+Alt
		128(){CfgProxy()},
		16(btn){ //+Shift
			BrowserPageInfo(btn,"mediaTab") //securityTab feed… perm…
		},
		2(trg,forward){bright(trg,forward,5)}, //яркость
		10(trg,forward){bright(trg,forward)},
		256(){gClipboard.write(gURLBar.value);
			UcfGlob.Flash(0,'rgba(240,176,0,0.5)',0,"в буфере: "+ gURLBar.value.slice(0,80));}
	},
	[F.F]: { //favdirs кнопка
		0(btn){btn.ownerGlobal.SidebarUI.toggle("viewBookmarksSidebar")},
		256(btn){btn.ownerGlobal.SidebarUI.toggle("viewHistorySidebar")},
		8(){ucf.dirsvcget("Home")}, //+Alt
		128(btn){
			btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("Downloads")},
		136(){ //C+Alt
			ucf.dirsvcget("UChrm", "user_chrome_files")},
		264(){ //R+Alt
			ucf.dirsvcget("GreD")}
	},
	[F.O]: { //щит
		1(){Mouse[F.Q][136]()}, //д Шрифты
		2(trg,forward){bright(trg,forward)},
		256(btn){Cookies()},//R куки
		128(){switchTab()} //С
	},
	[F[2]]: {2(trg,forward){zoom(forward)}}, //zoompage
	[F[3]]: {2(){Mouse[F[2]][2]()}},
	[F[0]]: { //title-close
		1(){Help()},
		128(btn){btn.ownerGlobal.undoCloseTab()},
		256(){minimize()}
	},
	[F.A]: {mousedownTarget: true, //AttrView
		128(){Menu.O.Remote.cmd()}, //C
		256(){UCF()},
		257(){switchTab('about:debugging#/runtime/this-firefox')} //дR
	},
	[F.E]: {mousedownTarget: true,
		1(){
			Menu.O.DelCache.cmd()}, //д
		128(){UCF()}, //UCFprefs
		129(){ //дС
			switchTab('about:addons')},
		256(btn){
			document.getElementById(F.Q).menupopup.openPopup(btn, "after_start");
		},
		257(){Mouse[F.A][257]()}
	},
	[F.Q]: {mousedownTarget: true,
		0(btn){ //L
			if(btn.id == F.Q){
				var bar = document.getElementById("ucf-additional-vertical-bar");
				if(bar) window.setToolbarVisibility(bar,document.getElementById("sidebar-box").hidden);
				window.SidebarUI.toggle("viewHistorySidebar");
			} else if (btn.className == "menu-iconic"){
				Node.hidePopup();
				ucf.about_config(btn.pref.pref); //go параметр
			} else ucf.mode_skin();
		},
		2(trg,forward){zoom(forward)}, //wheel
		1(btn){ //д
			if(btn.id == F.Q)
				switchTab("about:newtab");},
		8(){switchTab('chrome://browser/content/places/places.xhtml')}, //L+Alt
		264(){ //R+Alt
			switchTab(FavItem(true))},
		16(btn){if (btn.id == F.Q) zoom(0,1)}, //L+Shift
		128(btn, trg){ //C Menu-1
			if(btn.id == F.Q || trg)
				btn.menupopup.openPopup(trg ||= btn, "after_start")
			else ucf.mode_skin();
		},
		129(btn){userjs(btn,"")}, //дC консоль
		256(btn){ //about Menu
			if(btn.id == F.Q) setTimeout(()=> {
				if(btn.config.state != "open")
				  btn.config.openPopup(btn, "after_start")
				else
				  btn.config.hidePopup();
			}, 50);
			else if (btn.alt)
				btn.parentNode.hidePopup(), btn.alt(btn);
		},
		257(btn){ //дR
			if(btn.id == F.Q) //линза
				Menu.EyeDrop.cmd(btn);
		},
		136(){ //С+Alt
			var n = "browser.display.use_document_fonts",f = ucf.pref(n) ? 0 : 1;
			ucf.pref(n,f); zoom(0,0,0,(f > 0) ? " + Web-шрифты" : ""); BrowserReload();}
	}
}; Mouse["add-ons-button"] = Mouse[F.E];
Mus = {}; Object.keys(Mouse).forEach((k) =>{Mus["."+ k] = Mus["#"+ k] = Mouse[k]});

Setup = [{ //about:config меню. refresh=true ⟳ Обновить без кэша, restart=false ↯ Без запроса
	pref: ["dom.disable_open_during_load", "Всплывающие окна",,"dom.disable_beforeunload\nЗапрос страниц о закрытии\n\nОпции "+ F.m +": Cерые"], Def3el: true, Yellow: false,
	keys: [[true, "Блокировать",,,`ucf.pref('dom.disable_beforeunload',true)`], [false, "Разрешить",,,`ucf.pref('dom.disable_beforeunload',false)`]],
},{ //pref,lab,key,hint,[val,str],code | keys:val,lab,dat,+hint,code | icon:значок
	pref: ["javascript.enabled", "Выполнять скрипты Java",,"Поддержка интерактивных сайтов, рекламы\nтакже разрешает действия горячих клавиш"], Def3el: true, refresh: true,
	keys: [[true, "Да"], [false, "Нет"]]
},{
	pref: ["browser.safebrowsing.downloads.remote.block_dangerous", "Опасные файлы, сайты",,"browser.safebrowsing.downloads.remote.block_dangerous_host"], Def3el: true, Yellow: false,
	keys: [[true, "Запрет",,,`ucf.pref('browser.safebrowsing.downloads.remote.block_dangerous_host',true)`], [false, "Открыть",,,`ucf.pref('browser.safebrowsing.downloads.remote.block_dangerous_host',false)`]]
},{
	pref: [F.u +"savedirs", "Загрузки",,'Пути сохранения Страниц и Графики\nСинтаксис «_Html/subdir|_Pics/subdir»\nsubdir: пусто | 0 заголовок | 1 домен',
		["", "всё в общей папке"]], Blue: "_Web|1|_Images|0", Gray: "",
	keys: [ // сохранение Html/Pics. [Загрузки]/"_Html/subdir|_Pics/subdir" subdir: пусто | 0 заголовок | 1 домен
		["_Сайты||_Фото|0", "_Сайты|_Фото/имя…"],
		["_Web||_Photo|0", "_Web|_Photo/имя"],
		["_Web|1|_Pics|1", "_Web/сайт|_Pics/…"],
		["_Web|0|_Pics|", "_Web/имя|_Pics"],
		["_Web|1|_Images|0", "_Web/сайт|_Images/имя"],
		["Сайт||Фото|", F.t,,"ключ в about:config",`ucf.about_config(F.u +'savedirs')`]]
},null,{
	pref: [F.y, "Прокси (VPN)", "п", F.x +"\n\nПереключение сетевых настроек"],
		Def3el: "localhost", Yellow: F.w, Gray: "", refresh: true,
	keys: [
		["localhost", "системный", "0",,`ucf.pref(F.x,5)`],
		[F.w, "АнтиЗапрет", "2", "Надёжный доступ на заблокированные сайты\n«Режим прокси» меняется на 2",
			`ucf.pref(F.x,2)`],
		["127.0.0.1", "tor или opera-proxy", "1", "Включите одну из служб",
			`ucf.pref(F.x,1)`],
		[ucf.pref(["user.pacfile", "file:///etc/proxy.pac"]), "user .pac файл", "4", "about:config pacfile"]] //нужен диалог выбора pac-файла
},{
	pref: [F.x, "Режим прокси", "р"], Gray: 0, Def3el: 5, Blue: 4, Yellow: 2, refresh: true,
	keys: [[5, "системный", "5"],
		[2, "Автонастройка", "2", "about:config pacfile"],
		[1, "Ручная настройка", "1", "Используется "+ F.y],
		[4, "Автоопределение", "4"],
		[0, "Без прокси", "0", F.m]]
},{
	pref: ["network.trr.mode", "DNS поверх HttpS",, "Шифрование DNS-трафика для\nзащиты персональных данных"], Def3el: 2, Yellow: 3, Gray: 5, Blue: 1, refresh: true,
	keys: [
		[0, F.m, "0"], [1, "автоматически", "1", "используется DNS или DoH, в зависимости от того, что быстрее"], [2, "DoH, затем DNS", "2"], [3, "только DoH", "3"], [4, "DNS и DoH", "4"], [5, "отключить DoH", "5"]]
},{
	pref: ["network.cookie.cookieBehavior", "Получать куки",,"Персональные настройки посещённых сайтов"], 
		Def3el: 3, Yellow: 0, Blue: 4,
	keys: [[3, "посещённые сайты"], [4, "кроме трекеров"], [0, "со всех сайтов"], [1, "кроме сторонних"], [2, "никогда"]]
},null,{
	pref: ["browser.display.use_document_fonts", "Загружать шрифты страниц"], Def3el: 1, Yellow: 0, refresh: true,
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
	keys: [[true, "Да",,"Защита от слежки",`ucf.pref('privacy.firstparty.isolate', true)`], [false, "Нет",,,`ucf.pref('privacy.firstparty.isolate',false)`]]
},(()=>{
if(parseInt(F.ver) > 114) return { //новый FF
	pref: ["browser.translations.enable", "Встроенный перевод сайтов"], Def3el: true, Gray: false, refresh: true,
	keys: [[true, "Да"], [false, "Откл",,,`ucf.mode_skin('Перевод отключен для новых вкладок')`]]
}; else return {
	pref: ["media.peerconnection.enabled", "WebRTC ваш реальный IP"], Def3el: false,
	keys: [[true, "Выдать"], [false, "Скрыть"]]
}})(),null,{
	pref: ["network.http.sendRefererHeader", "Referer: для чего"], Def3el: 2, Yellow: 1,
	keys: [[0, "Ни для чего", "0"], [1, "Только ссылки", "1"], [2, "Ссылки, графика", "2"]]
},{
	pref: ["browser.cache.disk.capacity", "Кэш браузера",,`\n${F.X}:\nДиск и память: 5120\nтолько Память: -1`,,`[[F.U,true],[F.V,true],[F.W,true]].map((a)=>{ucf.pref(...a)})`],
	Def3el: 1048576, Yellow: 0, Gray: 5e5, Blue: 25e4, restart: true,
	keys: [[5e5, F.m,,"500 Мб авторазмер"],
	[1048576, "Диск и Память",,,`ucf.pref(F.X, 5120)`],
	[0, "только Память",,,`[[F.V,false], [F.X,-1]].map((a)=>{ucf.pref(...a)})`],
	[2097152, "только Диск",,,`ucf.pref(F.U,false)`],
	[25e4, "250 Мб на диске",,"Ограничить размер кэша",`ucf.pref(F.W,false)`],
	[1000000, "1 Гб максимум",,,`ucf.pref(F.W,false)`]]
},{
	pref: ["browser.sessionstore.interval", "Резервирование сессий",,"Браузер резервирует сессии на\nслучай сбоя, снижая ресурс SSD"], Gray: 15e3, Def3el: 6e4, Blue: 3e5, Yellow: 9e5,
	keys: [[15e3, "15 сек"], [6e4, "1 мин"], [3e5, "5 мин"], [9e5, "15 мин"], [18e5, "30 мин"]]
},{
	pref: [F.z, "User Agent",,"Изменяет вид сайтов", [uar,"встроенный"],`console.log("MENU")`],
		refresh: true, Def3el: uar, // Yellow: F.G, Gray: F.G + F.U,
	keys: [
	["Windows", F.t], //,,,`SetDef(pref, "ваши данные…")`
	[F.G +"Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36", "Chrome 118 Win10"],
	[F.G +"Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", "MSIE 6.0 Windows"],
	["Opera/9.80 (Windows NT 6.2; Win64; x64) Presto/2.12 Version/12.16", "Opera12 W8"],
	[F.G +"PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)", "Playstation 4"],
	[F.G +"compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; GT-I8350)", "Windows Phone"],
	[F.G +"Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.143 YaBrowser/22.5.0.1916 Yowser/2.5 Safari/537.36","Yandex MacOS"],
	[F.G +"compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "GoogleBot"],
	[uar, F.m]] //штатный ЮзерАгент
}];

Over = { //edit подсказки под мышью
get [F.P](){ //PanelUI delete this[…];
	ucf.mode_skin(); if(ucf.pref("signon.rememberSignons"))
		Services.cache2.asyncGetDiskConsumption({onNetworkCacheDiskConsumption(bytes){
			Status(F.h + ucf.formatBytes(bytes),3e3) //вывод объёма кэша
		}, QueryInterface: ChromeUtils.generateQI(["nsISupportsWeakReference","nsICacheStorageConsumptionObserver"])})
	else Status(F.i,2e3); //не хранить пароли
	return tExp(F.P);
},
get [F.B](){
	var trg = window.event?.target; //get исполняет код
	trg.tooltipText = trg.label;
},
get [F.B +"s"](){
	var trg = window.event?.target;
	trg.tooltipText = Tag[F.B];
},
get [F.C](){ //newtab
	return GetDynamicShortcutTooltipText(F.C) + Tag[F.C] +'\n'+ Tag[F.B];
},
get [F.D](){var dw = ucf.dirsvcget("");
	if(dw) ucf.mode_skin(`${ucf.pref(F.v) > 1 ? "\u{26A1} Графика отключена," : "💾 папка"} [Загрузки] `+ crop(dw, 96,''));
	return GetDynamicShortcutTooltipText(F.D) +"\n"+ tExp(F.D);
},
get [F.N](){ucf.mode_skin('');
	return GetDynamicShortcutTooltipText(F.N) +"\n\n"+ Tag[F.N] +"\n"+ tExp(F.S);
},
get "stop-button"(){return GetDynamicShortcutTooltipText("stop-button") +"\n"+ tExp(F.S); //stop
},
get "urlbar-input"(){Status(F.a,2500)}, //tab
[F.L]: Tag[F.L], "appMenu-print-button2": Tag[F.L], //print
[F[1]]: Tag[F[0]], //title-close
get [F.T](){
	var t = `${ucf.pref("dom.disable_open_during_load") ? "Запрет" : "↯ Разреш"}ить всплывающие окна`;
	if(!ucf.pref("places.history.enabled")) t = F.j;
	if(ucf.pref("privacy.sanitize.sanitizeOnShutdown")) t = F.k;
	Status(t,3e3); return tooltip();
},
get [F.A](){return Tag[F.A] + F.p;},
get "identity-icon-box"(){ //custom hint
	return tooltip_x(window.event.target, tExp(F.I) + br_val());
},
get [F.I](){Status(this.BrExp(),2500); //+mode
	return tooltip_x(window.event.target, tExp(F.I) + br_val());
},
get [F.O](){Status(this.BrExp(),2500); //щит
	var trg = window.event?.target; //custom hint 2
	return trg.id.endsWith("r") && trg.textContent +'\n'+ tExp(F.O);
},
get [F.Q](){
	var trg = window.event?.target;
	if(trg.id == F.Q)
		zoom(0,0,0,`, ${ucf.pref("browser.tabs.loadInBackground") ? "Не выбирать" : "Переключаться в"} новые вкладки`)
	else if (trg.id)
			Status(F.c,9e3);
	try {trg.mstate = trg.config.state + trg.menupopup.state;} catch{} //QuickToggle
	if(!/open/.test(trg.mstate))
		return tExp(F.Q)
	else trg.tooltipText = "";
},
get [F.M](){ //reader
	return GetDynamicShortcutTooltipText(F.M) +"\n"+ Tag[F.M] + br_val();
},
get [F.K](){ //ReaderView
	return Tag[F.R] + Tag[F.M] + br_val();
},
get "ucf_SessionManager"(){Status(F.g);},
get [F.E](){
	Status(F.g); return Tag[F.E] + F.p;
},
get "add-ons-button"(){
	Status(F.g); var s = Tag[F.E];
	return tooltip(window.event.target, s.replace(s.split("\n", 1),"") + F.p);
},
get [F[2]](){ //zoompage
	return tooltip_x(window.event.target,"⩉ Ролик ±	Изменить масштаб");
}, get [F[3]](){return Over[F[2]]},
[F[4]]: F.n, [F[5]]: F.n, //SingleFile
[F[6]]: F.o, [F[7]]: F.o, //VDH
BrExp(t = F.l + br_val()){
	return t +` ${Exp() ? "Экспертный" : "Простой"} режим кнопок`}
};

((obj,del,re,reos) => { //парсинг блока клавиш ускоряет обработку нажатий
	for(var p in Keys)
		reos.test(p) && del.add(p.endsWith(F.os) ? p.slice(0, -F.os.length -1) : p);
	for(var p in Keys) del.has(Keys[p]) && del.add(p);
	for(var d of del) delete Keys[d]; //есть Key_OS ? удалить имена-клоны
	for(var p in Keys) if (reos.test(p)) //убрать имя вашей ОС из свойства
		Keys[p.replace(reos,'')] = Keys[p], delete Keys[p];
	for(var p in Keys){var func = Keys[p]; //(){…}, bool,num
		if(typeof func == "string") func = Keys[func]; //ссылка на функцию
		var [key,mod] = p.split("_"); mod ||= "";
		var upper = key[0].toUpperCase(); var prevent = key[0] == upper;
		var [, m,i] = mod.match(re); m ||= 0; //modifiers bitmap
		var arr = [func,prevent, i ? i == "I" ? 0 : 1 : -1]; //textfields flag Имя_i 1 кроме полей ввода
		var prop = prevent ? key : upper + key.slice(1); //имя без mod
		var o = obj[prop] || (obj[prop] = Object.create(null));
		o[m] ? o[m].push(arr) : o[m] = [arr]; //имя со строчной: Skip preventDefault
	}; Keys = obj;})(Object.create(null),new Set(),/(\d+)?(i)?/i,/_(?:win|linux|macosx)$/);

keydown_win = e => { //перехват клавиш, учитывая поля ввода
	if (e.repeat) return; //выключить
	var KB = Keys[e.code]?.[e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey];
	if(KB) //есть HotKey
		for(var [func,p,i] of KB)
			if(i ^ docShell.isCommandEnabled("cmd_insertText"))
				p && e.preventDefault(), func(e, gBrowser.selectedTab); //запуск по сочетанию
	if(!Debug()) return; //показ клавиш
	console.log('■ key '+ e.code + ('_'+ (e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey)).replace('_0',''));
};
listener = { //действия мыши, перехват существующих
	handleEvent(e){
		if(this.skip || e.detail > 1) return;
		var trg = e.target, id = trg.id || trg.className; //trg.tagName;
		if(trg.id) Node = trg;
		if(e.type == "mouseenter"){
			var hint = Over[id] || Over[(trg = trg.parentNode).id];
			if(hint) trg.tooltipText = hint; return; //update
		}
		var sels = this.selectors.filter(this.filter, trg); //#id
		var {length} = sels; if (!length) return;
		var wheel = e.type.startsWith("w");
		var num = e.metaKey*64 + e.ctrlKey*32 + e.shiftKey*16 + e.altKey*8 + (wheel ? 2 : e.button*128);
		var obj = Mus[
			length > 1 && sels.find(this.find,num) || sels[0]
		];
		Debug() && console.log('■ but «'+ id +'» key '+ num); //wheel дважды
		if(wheel) return obj[num]?.(trg, e.deltaY < 0);
// mousedown
		if(e.type.startsWith("m")){
			obj.mousedownTarget && this.stop(e);
			this.longPress = false; //+задержка при обычном клике
			if(++num in obj)
				this.mousedownTID = setTimeout(this.onLongPress, 333, trg,obj,num);
			if(e.button == 2)
				this.ctx = trg.getAttribute("context"), trg.setAttribute("context","");
			return;
		}
		obj.mousedownTarget || this.stop(e);	//click
		if(this.longPress) return this.longPress = false;
		this.mousedownTID &&= clearTimeout(this.mousedownTID);
		if(!obj[num]){
			if(e.button == 1) return;
			if(e.button){
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
events = ["click","mousedown","mouseenter","wheel"],
els = document.querySelectorAll("#navigator-toolbox,#ucf-additional-vertical-bar,#appMenu-popup,#widget-overflow-mainView");
for(var el of els) for(var type of events) el.addEventListener(type,listener,true);
window.addEventListener("keydown",keydown_win,true);
ucf_custom_script_win.unloadlisteners.push(F.id);
ucf_custom_script_win[F.id] = {destructor(){
	window.removeEventListener("keydown",keydown_win);
	for(var el of els) for(var type of events) el.removeEventListener(type,listener,true);
}};
var addDestructor = nextDestructor => { //для saveSelToTxt
	var {destructor} = ucf_custom_script_win[F.id];
	ucf_custom_script_win[F.id].destructor = () => {
		try {destructor();} catch(ex){Cu.reportError(ex)}
		nextDestructor();
}};
with (document) getElementById(F.O).removeAttribute("tooltip"),
	getElementById("nav-bar").tooltip = F.id; //флаг успешной загрузки

ucf.mode_skin(); //подсветка кнопок и подсказки отображают настройки браузера
[['ui.prefersReducedMotion',0],['browser.download.alwaysOpenPanel',false], //animation Fix
['browser.download.autohideButton',false]].forEach((p)=>ucf.pref(...p)); //lockPref опций
var tabr = F.u +"opacity",url = `resource://${tabr}/`, //bright tabs
getIntPref = (p) => prefs.getIntPref(p,100),
sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
css = `@-moz-document url(chrome://browser/content/browser.xhtml){
	:is(${F.id})[rst] {filter: grayscale(1%) !important}
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
saveSelToTxt = async () => { //в .txt Всё или Выбранное
	var {length} = saveURL, splice = length > 9, l11 = length == 11, msgName = F.id + ":Save:GetSelection"; //FIX FF103+
	var receiver = msg => {var txt = "data:text/plain,"+ encodeURIComponent(gBrowser.currentURI.spec +"\n\n"+ msg.data);
		var args = [txt, ucf.Title() +'.txt',null,false,true,null,window.document];
		splice && args.splice(5,0,null) && l11 && args.splice(1,0,null);
		saveURL(...args);
		Status(crop("√ текст сохранён: "+ ucf.Title(),96,''));
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
		if(sel.isCollapsed)
			fed && fed.blur(),docShell.doCommand("cmd_selectAll"),
			res = win.getSelection().toString(),docShell.doCommand("cmd_selectNone"),
			fed && fed.focus();
		res = res || sel.toString();
		/\S/.test(res) && sendAsyncMessage("saveSelToTxt",res);
	}
	var url = "data:;charset=utf-8,"+ encodeURIComponent(`(${sfunc})`.replace("saveSelToTxt",msgName)) +'(Cc["@mozilla.org/focus-manager;1"].getService(Ci.nsIFocusManager));';
	(saveSelToTxt = () => gBrowser.selectedBrowser.messageManager.loadFrameScript(url,false))();
},
switchTab = (url = 'about:serviceworkers', go) => { //открыть вкладку | закрыть её | выбрать
	for(var tab of gBrowser.visibleTabs)
		if(tab.linkedBrowser.currentURI.spec == url)
			{go ? gBrowser.selectedTab = tab : gBrowser.removeTab(tab); return;}
	gBrowser.addTrustedTab(url);
	gBrowser.selectedTab = gBrowser.visibleTabs[gBrowser.visibleTabs.length -1];
},
UCF = (p = "user_chrome") => {if (!FileExists(F.s + p +"/prefs.xhtml")) p = "options";
	window.switchToTabHavingURI(F.s + p +"/prefs.xhtml",true,{relatedToCurrent: true,triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
},
tooltip = (id = document.getElementById(F.T), s = "\n◨ правый клик: Без запроса") => {
	if(id && id.tooltipText.indexOf(s) == -1)
		return id.tooltipText + s;
},
tooltip_x = (trg,text = "", ttt = "") => {
	if(!trg.id.endsWith("x")){ //box
		ttt = (trg.hasAttribute("tooltiptext")) ? trg.ttt = trg.tooltipText : trg.ttt;
		if(ttt && ttt.indexOf(text) == -1) ttt += "\n\n";
		trg.removeAttribute("tooltiptext");
	}
	return (ttt.indexOf(text) == -1) ? ttt + text : ttt;
},
bright = (trg,forward,step = 1,val) => { //wheel
	val ||= getIntPref(tabr) + (forward ? step : -step);
	val = val > 100 ? 100 : val < 15 ? 15 : val;
	ucf.pref(tabr,val); trg.toggleAttribute("rst"); Status(F.l + val +"%",1e3);
},
br_val = () => ucf.pref([tabr,100]) +"%",
zoom = (forward,toggle = false, change = true,text = '') => {
	toggle ? ZoomManager.toggleZoom() : change ? forward ? FullZoom.enlarge() : FullZoom.reduce() : 0;
	Status("± Масштаб "+ Math.round(ZoomManager.zoom*100) +`%${ucf.pref("browser.zoom.full") ? "" : " (только текст)"}` + text,3e3);
},
Expert = (m = Boolean(Exp()),p = F.u +'expert') => {
	ucf.pref(p,!m); Status(Over.BrExp(""),3e3);
},
Help = (help = F.s +"help.html") => { //помощь
	(FileExists(help)) ? switchTab(help) : switchTab(F.J);
},
userjs = (e,myjs = F.s +"custom_scripts/User.js") => {
	Debug() && document.getElementById("key_browserConsole").doCommand(); //фокус на консоль
	FileExists(myjs) ? eval(Cu.readUTF8URI(Services.io.newURI(myjs))) : console.error(F.q + myjs); //ваш скрипт
},
Translate = (brMM = gBrowser.selectedBrowser.messageManager) => { //перевод сайт | выдел. текст
	brMM.addMessageListener('getSelect',listener = (msg) =>{
		if(msg.data) //выделено
			switchTab("https://translate.google.com/#view=home&op=translate&sl=auto&tl=ru&text="+ msg.data,true)
		else
			switchTab("https://translate.yandex.com/translate?url="+ gURLBar.value +"&dir=&ui=ru&lang=auto-ru",true);
	brMM.removeMessageListener('getSelect',listener,true);
	});
	brMM.loadFrameScript('data:,sendAsyncMessage("getSelect",content.document.getSelection().toString())',false);
},
Dialog = async(url = "preferences/dialogs/connection.xhtml", w = "_blank") =>{
	var win = Services.wm.getMostRecentWindow(w);
	try {win.focus();} catch {
		win = window.openDialog("chrome://browser/content/"+ url, w, "chrome,dialog=no,centerscreen,resizable");
		win.addEventListener("DOMContentLoaded",() =>{win.document.documentElement.setAttribute("windowtype",w)},{once: true});
		await new Promise(resolve => win.windowRoot.addEventListener("DOMContentLoaded", resolve, {once: true}));
	}; return win;
},
CfgProxy = async() =>{var win = await Dialog(); win.opener = window; win.opener.gSubDialog = {_dialogs: []};
},
Cookies = async() =>{var uri = window.gBrowser.selectedBrowser.currentURI;
	try {var tld = Services.eTLD.getBaseDomain(uri);} catch {var tld = uri.asciiHost}
	var sb = (await Dialog("preferences/dialogs/siteDataSettings.xhtml", "Browser:SiteDataSettings")).document.querySelector("#searchBox");
	sb.inputField.setUserInput(tld);
	await window.SiteDataManager.updateSites();
	setTimeout(() => sb.editor.selection.collapseToEnd(), 50);
},
FavItem = (end = false,def_url = 'ua.ru', s = 0,m = 1)=>{ //first|last url Меню закладок
	var query = {}, options = {}, guid = PlacesUtils.bookmarks.menuGuid;
	PlacesUtils.history.queryStringToQuery(`place:parent=${guid}&excludeQueries=1`,query,options);
	var folder = PlacesUtils.history.executeQuery(query.value, options.value).root;
	folder.containerOpen = true;
	var max = folder.childCount -1, type = Ci.nsINavHistoryResultNode.RESULT_TYPE_URI;
	if(end) s = max, m = -1;
	for(var ind = s; end ? 0 <= ind : ind <= max; ind = ind + m){
		var node = folder.getChild(ind);
		if(node.type == type) return node.uri;
	}; return def_url;
},
toFav = () => {with (PlacesUtils.bookmarks){ //без диалога
	var url = gBrowser.selectedBrowser.currentURI.spec;
	search({url}).then(async array => {
		if(array.length)
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

if(F.os == "macosx") Object.keys(Tag).forEach((k)=>{ //i счётчик, замена букв
	['◉','Ø'].forEach((c,i)=>{Tag[k] = Tag[k].replace(new RegExp(c,'g'),
	['⦿','◎'][i])})})
else if (ucf.pref([F.u +'mystyle',false]))
	css_USER(F.s +"custom_styles/win_buttons-vitv.css")
else
	css_USER('.titlebar-buttonbox {display: none !important}');

//+ кнопки
CustomizableUI.createWidget({label:`Панели, Папки`,id: F.F,tooltiptext: Tag[F.F],
	onCreated(btn){btn.style.setProperty("list-style-image",`url(${F.dir})`)}});
if(FileExists(F.as))
CustomizableUI.createWidget({ label:F.A.replace('-',' '), id:F.A,
	defaultArea: CustomizableUI.AREA_NAVBAR, localized: false,
	onCreated(btn){btn.setAttribute("image", F.ai);
		btn.onmouseenter = btn.onmouseleave = this.onmouse;
		btn.setAttribute("oncommand","handleCommand(this)"); btn.handleCommand = this.handleCommand;
	},
	onmouse: e => e.target.focusedWindow = e.type.endsWith("r") && Services.wm.getMostRecentWindow(null),
	get handleCommand(){delete this.handleCommand;
		return this.handleCommand = btn => {(btn.handleCommand = new btn.ownerGlobal.Function(this.code).bind(btn))();}
	},
	get code(){delete this.code;
		try {var c = 'this.focusedWindow && this.focusedWindow.focus();\n'+
			Cu.readUTF8URI(Services.io.newURI(F.as))} catch {c = `console.error(F.q + ${F.as})`}
		return this.code = c;
	}})

try {if(!Services.prefs.getStringPref("browser.uiCustomization.state").includes(`"${F.E}"`))
	await delayedStartupPromise;
var s = document.getElementById(F.E);
s.setAttribute("removable", true);
document.getElementById("nav-bar-customization-target").append(s);
} catch {}


(async id => {CustomizableUI.getWidget(id)?.label || (self => CustomizableUI.createWidget(self = {id,
	id: id, label: "Быстрые опции", localized: false, defaultArea: CustomizableUI.AREA_NAVBAR,
	onCreated(btn){
		btn.setAttribute("image", F.qt); btn.domParent = null;
		var doc = btn.ownerDocument, m = nn => doc.createXULElement(nn);
		this.createPopup(doc, btn, "config", Setup);
		btn.linkedObject = this;
		for(var type of ["contextmenu", "command"])
			btn.setAttribute("on" + type, `linkedObject.${type}(event)`);
		var popup = m("menupopup"), menu = m("menuitem"); //UserMenu
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
	fill(o, popup){
		for (key in o){
			var val = o[key];
			if(typeof val != "object") continue;
			var {lab, inf, img, cmd, alt, sep, men, upd} = val;
			sep && popup.append(this.m("menuseparator"));
			var name = men ? "menu" : "menuitem";
			var item = this.m(name);
			item.setAttribute("label", lab || key);
			item.alt = alt; //RClick в ucf_hookClicks.js {Mouse…
			if(inf)
				item.tooltipText = inf;
			if(img || /this\.image.*=/.test(upd))
				item.className = name + "-iconic", item.setAttribute("image", img || F.nul);
			men || cmd && item.setAttribute("oncommand", cmd.toString().replace(
				/cmd\(.*?\){/, "{var trg = event.target || event;"
			));
			if(upd){ //обновляемая строка
				item.style.filter = "drop-shadow(0.1px 1px 0.1px #c99)";
				item.style.setProperty("font-style", "italic", "important");
				if(item.renderedOnce) (item.render = upd).call(item);
				else item.upd = upd, item.render = self.renderSub;
			}
			popup.append(item);
			men && this.fill(val, item.appendChild(this.m("menupopup")));
		}
	},
	renderSub(){
		delete this.render;
		this.render();
		this.render = self.updSub;
		this.upd();
	},
	updSub(){
		this.parentNode.state.startsWith("c") || this.upd();
	},
	createPopup(doc, btn, prop, data){
		var popup = doc.createXULElement("menupopup");
		btn[prop] = popup;
		popup.id = this.id +"-"+ prop;
		for (var type of ["popupshowing"])
			popup.setAttribute("on"+ type, `parentNode.linkedObject.${type}(event)`);
		for(var obj of data) popup.append(this.createElement(doc, obj));
		btn.append(popup);
	},
	createElement(doc, obj){ //pref
		if(!obj) return doc.createXULElement("menuseparator");
		var pref = doc.ownerGlobal.Object.create(null), node, bool, img;
		for(var [key, val] of Object.entries(obj)){
			if(key == "pref"){
				var [apref, lab, akey, hint, undef, code] = val; //строка меню
				pref.pref = apref; pref.lab = lab || apref;
				if(hint){
					if(RegExp(/\p{L}/,'u').test(hint[0]) && (hint[0] === hint[0].toUpperCase()))
						hint = '\n'+ hint;
					pref.hint = hint;
				}
				if(undef) pref.undef = undef; //если не массив: undef || undef == ""
				if (code) pref.code = code;
			}
			else if(key == "icon") img = val, pref.img = true;
			else if(key != "keys") pref[key] = val;
			else pref.hasVals = true;
		}
		var t = prefs.getPrefType(pref.pref), m = {b: "Bool", n: "Int", s: "String"};
		var str = m[t == prefs.PREF_INVALID ? obj.keys ? (typeof obj.keys[0][0])[0] : "b" : t == prefs.PREF_BOOL ? "b" : t == prefs.PREF_INT ? "n" : "s"]; //String по-умолчанию
		pref.get = prefs[`get${str}Pref`];
		var map, set = prefs[`set${str}Pref`];
		if(pref.hasVals){
			for(var [val,,,,code] of obj.keys)
				code && (map || (map = new Map())).set(val, code);
			if(map) pref.set = (key, val) => {
				set(key, val);
				map.has(val) && eval(map.get(val)); //код2 если pref изменён
			}
		}
		if(!map) pref.set = set;
		node = doc.createXULElement("menu");
		node.className = "menu-iconic";
		img && node.setAttribute("image", img);
		akey && node.setAttribute("accesskey", akey);
		(node.pref = pref).vals = doc.ownerGlobal.Object.create(null);
		this.createRadios(doc,
			str.startsWith("B") && !pref.hasVals ? [[true, "true"], [false, "false"]] : obj.keys,
			node.appendChild(doc.createXULElement("menupopup"))
		);
		if("Def3el" in obj) pref.noAlt = !("Yellow" in obj);
		return node;
	},
	createRadios(doc, vals, popup){
		for(var arr of vals){
			var [val, lab, key, hint] = arr;
			var menuitem = doc.createXULElement("menuitem");
			with (menuitem)
				setAttribute("type","radio"), setAttribute("closemenu","none"), setAttribute("label", popup.parentNode.pref.vals[val] = lab), key && setAttribute("accesskey", key);
			var tip = menuitem.val = val === "" ? F.r : val;
			if(hint) tip += "\n" + hint;
			menuitem.tooltipText = `${tip != undefined ? tip + "\n\n" : ""}`+ F.f;
			popup.append(menuitem);
		}
	},
	regexpRefresh: /^(?:view-source:)?(?:https?|ftp)/,
	upd(node){
		var {pref} = node, def = false, user = false, val; //если опция не найдена
		if(prefs.getPrefType(pref.pref) != prefs.PREF_INVALID){
			try {
				val = pref.defVal = db[pref.get.name](pref.pref); def = true; //опция по-умолчанию получена
			} catch {def = false}
			user = prefs.prefHasUserValue(pref.pref);
			if(user) try {val = pref.get(pref.pref, undefined);} catch {}
		}
		if(val == pref.val && def == pref.def && user == pref.user) return;
		pref.val = val; pref.def = def; pref.user = user;
		var exists = def || user;
		if(!exists && pref.undef) //опции нет ? вернуть default
			val = pref.undef[0];
		var hint = hints.get(pref.pref);
		hint ||= val != undefined ? val : "Эта опция не указана";
		if(hint === "") hint = F.r;
		hint += "\n" + pref.pref;
		if(pref.hint) hint += "\n"+ pref.hint;
		node.tooltipText = hint; //+ текст
		var img = Icon("999"), alt = "Yellow" in pref && val == pref.Yellow, clr = "Gray" in pref && val == pref.Gray, blu = "Blue" in pref && val == pref.Blue;
		if(blu) img = Icon("a0f");
		if(alt) img = Icon("f80");
		if("Def3el" in pref)
			if(val == pref.Def3el)
				img = Icon(), node.style.removeProperty('filter');
			else if (val != pref.defVal){
				if(!alt && !clr && !blu)
					img = Icon("f26"); // Red
				node.style.filter = "drop-shadow(0.1px 1px 0.1px #c99)";
			}
		pref.img || node.setAttribute("image", img); //нет Def3el ? серый
		user
			? node.style.setProperty("font-style", "italic", "important")
			: node.style.removeProperty("font-style");
		var {lab} = pref;
		if(exists && pref.hasVals){
			if(val in pref.vals)
				var sfx = pref.vals[val] || val;
			else
				var sfx = user ? "Иное" : F.m;
			lab += ` ${"restart" in pref ? "↯-" : "refresh" in pref ? "-⟳" : "—"} ${sfx}`;
		}
		lab = exists ? lab : '['+ lab + `${"restart" in pref ? " ↯" : "refresh" in pref ? " ⟳" : ""}` +']'+ `${pref.undef ? " - "+ pref.undef[1] : ""}`;
		node.setAttribute("label", lab); //имя = [имя] если преф не существует
	},
	openPopup(popup){
		var btn = popup.parentNode;
		if(btn.domParent != btn.parentNode){
			btn.domParent = btn.parentNode;
			if(btn.matches(".widget-overflow-list > :scope"))
				var pos = "after_start";
			else var win = btn.ownerGlobal, {width, height, top, bottom, left, right} =
				btn.closest("toolbar").getBoundingClientRect(), pos = width > height
					? `${win.innerHeight - bottom > top ? "after" : "before"}_start`
					: `${win.innerWidth - right > left ? "end" : "start"}_before`;
				btn.config.setAttribute("position", pos);
		}
		popup.openPopup(btn);
	},
	maybeRestart(node, conf){
		if(conf && !Services.prompt.confirm(null, this.label, "Перезапустить браузер?")) return;
		var cancel = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
		Services.obs.notifyObservers(cancel, "quit-application-requested", "restart");
		return cancel.data ? Services.prompt.alert(null, this.label, "Запрос на выход отменён.") : this.restart();
	},
	async restart(){
		var meth = Services.appinfo.inSafeMode ? "restartInSafeMode" : "quit";
		Services.startup[meth](Ci.nsIAppStartup.eAttemptQuit | Ci.nsIAppStartup.eRestart);
	},
	maybeRe(node, fe){
		var {pref} = node;
		if("restart" in pref){
			if(this.maybeRestart(node, pref.restart)) return;
		}
		else this.popupshowing(fe, node.parentNode);
		if("refresh" in pref){
			var win = node.ownerGlobal;
			if(this.regexpRefresh.test(win.gBrowser.currentURI.spec)) pref.refresh
				? win.BrowserReloadSkipCache() : win.BrowserReload();}
	},
	maybeClosePopup(e, trg){
		(e.shiftKey || e.button == 1) || trg.parentNode.hidePopup();
	},
	popupshowing(e, trg = e.target, checkstate = true){
		if(checkstate && trg.state == "closed") return;
		if(trg.id){
			for(var node of trg.children){
				if(node.nodeName.endsWith("r")) continue;
				this.upd(node);
				!e && node.open && this.popupshowing(null, node.querySelector("menupopup"));
			} return;
		}
		var {pref} = trg.closest("menu"), findChecked = true;
		var findDef = "defVal" in pref;
		var checked = trg.querySelector("[checked]");
		if (checked){
			if(checked.val == pref.val){
				if(findDef) findChecked = false;
				else return;
			}
			else checked.removeAttribute("checked");
		}
		if(findDef){
			var def = trg.querySelector("menuitem:not([style*=font-style]");
			if(def)
				if(def.val == pref.defVal){
					if(findChecked) findDef = false;
					else return;
				}
				else def.style.setProperty("font-style","italic","important");
		}
		for(var node of trg.children) if ("val" in node){
			if(!pref.val && pref.val != "" && pref.undef)
				pref.val = pref.undef[0]; //опции нет ? вернуть default
			if(findChecked && node.val == pref.val){
				node.setAttribute("checked", true);
				if(findDef) findChecked = false;
				else break;
			}
			if(findDef && node.val == pref.defVal){
				node.style.removeProperty("font-style");
				if (findChecked) findDef = false;
				else break;}
		}
	},
	command(e, trg = e.target){ //LMB
		if(trg.btn) return;
		var menu = trg.closest("menu"), newVal = trg.val;
		if(!menu || !menu.pref) return;
		this.maybeClosePopup(e, menu);
		menu.pref.code && eval(menu.pref.code); //run1
		if(newVal != menu.pref.val)
			menu.pref.set(menu.pref.pref, newVal), this.maybeRe(menu, true);
},
	contextmenu(e){
		var trg = e.target;
		if(!("pref" in trg)) return;
		this.maybeClosePopup(e, trg);
		if(trg.pref.user)
			prefs.clearUserPref(trg.pref.pref), this.maybeRe(trg);
		trg.pref.code && eval(trg.pref.code); //run
	}
}))()})(F.Q);


})(()=>{ //перенос кода init() в конец
db = `Очистить панель колёсиком мыши|◨ правый клик мыши: вторая команда|◨ правый клик: Сброс ◧ Открыть опцию ⟳ Обновить ↯ Перезапуск|Запрещённые сайты через VPN|Захват цвета в Буфер обмена. Курсор: сдвиг на 1 точку|◧ + Shift, Колёсико: не закрывать|период сохранения сессий меняйте в меню кнопки «Быстрые опции»|💾 кэш, данные сайтов, куки занимают |⚡️ Запрещено сохранять логины и пароли|↯ Не запоминать историю посещений|↯ Удалять историю посещений, закрывая браузер|☀ Яркость сайтов |по-умолчанию|SingleFile (Alt+Ctrl+S)\nСохранить сайт в единый Html|Video DownloadHelper\nСкачивание проигрываемого видео|\tопции UserChromeFiles\n◨ держать\tОтладка дополнений\nAlt + x\t\tзапуск скрипта User.js|ошибка скрипта — |[ пустая строка ]|chrome://user_chrome_files/content/|ваши данные…|extensions.user_chrome_files.|permissions.default.image|https://antizapret.prostovpn.org/proxy.pac|network.proxy.type|network.proxy.autoconfig_url|general.useragent.override|Attributes-Inspector|tabbrowser-tab|tabs-newtab-button|downloads-button|unified-extensions-button|favdirs-button|Mozilla/5.0 (|Android 9; Mobile; rv:109) Gecko/97 Firefox/97|identity-box|victor-dobrov.narod.ru/help-FF.html|pageAction-urlbar-_2495d258-41e7-4cd5-bc7d-ac15981f064e_|print-button|reader-mode-button|reload-button|tracking-protection-icon-container|PanelUI-menu-button|QuickToggle|ReaderView|wheel-stop|star-button-box|browser.cache.memory.enable|browser.cache.disk.enable|browser.cache.disk.smart_size.enabled|browser.cache.memory.max_entry_size`.split('|');
uar = "chrome://devtools/skin/images/"; F = {
	id: "ucf_hookExpert", os: AppConstants.platform, ver: Services.appinfo.version.replace(/-.*/,''),
	tc(m = "⌘",w = "Ctrl+"){return this.os == "macosx" ? m : w},
	pdi: "chrome://browser/skin/canvas-blocked.svg", eye: uar +"command-eyedropper.svg",
	upd: uar +"reload.svg", dir: uar +"folder.svg", opt: uar +"settings.svg", //"tool-dom.svg"
	sec: uar +"security-state-insecure.svg", ok: uar +"check.svg", no: uar +"close.svg",
	hlp: uar +"help.svg", ie: uar +"globe.svg", nul: uar +"blocked.svg", del: uar +"clear.svg",
	ai: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4TC8AAAAvD8ADAAoGbSM5Ov6k774XCPFP/0/03/8JGPxzroIzuOW06Ih60Genn1S/gHe+BgA=",
	qt: "data:image/webp;base64,UklGRkYCAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSJcAAAANcGJr25S8mH4SNGxAgsguPCZ0BcMOiDSNRpvVaCTa3AI2qm2e2ofz7OuwgIiYgMzb4kVjGvegnQFAwXgFVnvcOmtnMJtutAa3Vo4mhRMDpWq8AjfU+yQoYf1/oTkTIdUrknKswNQ5yAdDzqgr4CYbsJWQfEyEU5QNEl2eKFM2AAIbjmSIMjwXPGyEdj6Bdn4mj9KO63sAAFZQOCCIAQAAdAgAnQEqGAAYAD6dRppKgoCqgAE4lsAKwgisgG27uzPePSvBIu/Pr0HJqW+AfoAIHl2DrAnRo/G3JBpTx8yE7L6LFQyD+yUNvuRYAAD+7mwmpaoBcsJ1hVKsMI2ucqid8qndm+WEvH4l4il6lA8FPscgnrRHrnSjjyNcfUV21+TkfqOWKou2UvVsZSl1z+jKs760Vij5XCWF9Uo6TZAhKfrJpeILyQYwq2Ee/g1uyEH/dJMI/91DsVpI6i2vV/Jqpd4/KniJtTm1woLvaotA2ikt3eeBaqlHf8WPe++lSWS7fETjgvzzbflp0Rj+v23kbb9e/VjUcPaD83shRuwzEo6CAO/AGxE+Zwbvv9NDsQT6T+S4CCDOFTuMRVv9/0E4P+uK+Vc3bMfQQD05gY/fes+ZX6ZHkvFdMn7zX8LMVvI59p7F806HPD2lBjs4lWWhQ5ckJDNflZL49370shr3/Q9uMJN9i/NVCu4OT7K3+4+/RkAMnjuY09u+3i4y4CldQG789iIAAAA="
}; F.ico = uar;
[`titlebar-button.titlebar-close`,,`zoompage-we_dw-dev-`,,`_531906d3-e22f-4a6c-a102-8057b88a1a63_-`,,`_b9db16a4-6edc-47ec-a1f4-b86292ed211d_-`].forEach((c,i)=>{ //расширения
if(c){F[i] = i == 0 ? c : c +"BAP"; F[i+1] = i == 0 ? c.replace("."," ") : c +"browser-action";}});
db.forEach((c,i)=>{
	if(i == 0) k = 97; if(i == 26) k = 39; F[String.fromCharCode(i+k)] = c;
}); F.as = F.s +"custom_scripts/"+ F.A +".js";
Debug = (e,id = "sidebar-box") => {
	if(prefs.getBoolPref(F.u +'info',false)) return true;
	return !document.getElementById(id).hidden;
},
InArr = (arr, val) => { //вложенный массив
	for (a of arr) if(a.find(e => e === val)) return a;
},
FileExists = (file) => {try { //файл|папка есть?
	if(!file.startsWith("chrome://"))
		return FileUtils.File(String.raw`${file}`).exists()
	else return Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).convertChromeURL(Services.io.newURI(file)).QueryInterface(Ci.nsIFileURL).file.exists();
	} catch {}; return false;
},
shell_RunwA = (path, args, file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile), proc = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess)) => {
		if (!FileExists(path)) return 1;
    file.initWithPath(path); proc.init(file);
    proc.runwAsync(args, args.length);
},
crop = (s = "",cut = 33,ch = '…\n') => { //обрезать/разбить текст
	return s.substring(0,cut) +`${s.length > cut - 1 ? `${ch}…${s.substring(s.length - cut + ch.length,s.length)}`: ''}`;
},
Exp = ()=>{
	return Number(Services.prefs.getBoolPref(F.u +'expert',false))
},
tExp = (name,m = Exp(), t,z)=>{ //… {Общий︰Эксперт (m = 1)[︰…]}
	t = Tag[name]; z = t.match(/(\{)([\s\S]*?)(\})/gm);
	if(z) z.forEach((k,h) =>{ //текст зависит от режима
		h = k.split('︰'); if(h && h.length > m)
			t = t.replace(k,h[m].replace(/\{|\}/g,''));})
	return t;
},
{prefs} = Services, db = prefs.getDefaultBranch(""),
UcfGlob = Cu.getGlobalForObject(Cu)[Symbol.for("UcfGlob")], Status = UcfGlob.Status, //из SingleHTML.mjs
Icon = (c = '0c0')=>"data:image/svg+xml;charset=utf-8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='a' x1='16' x2='16' y1='32' gradientUnits='userSpaceOnUse'><stop stop-color='%23"+ c +"'/><stop stop-color='%23fff' offset='.8'/></linearGradient><linearGradient id='b' x2='32' y1='16' gradientTransform='matrix(1 0 0 1 2 2)'><stop stop-opacity='.5'/></linearGradient></defs><circle cx='16' cy='16' r='15' fill='url(%23a)' stroke='url(%23b)' stroke-width='2'/></svg>",
ucf = { //all ChromeOnly-scripts
	pref(key,set){ //или key = [key,default]
		if(!Array.isArray(key)) key = [key];
		var t = prefs.getPrefType(key[0]), m = {b:"Bool",n:"Int",s:"String"};
		t = m[t == 128 ? "b" : t == 64 ? "n" : t == 32 ? "s" : ""];
		if(set == "get") return t; //тип опции
		if(!t) t = m[set != undefined ? (typeof set)[0] : (typeof key[1])[0]];
		if(t) if(set != undefined)
			prefs[`set${t}Pref`](key[0],set)
		else
			set = prefs[`get${t}Pref`](...key);
		return set;
	},
	ua(real = false,ua_my = F.z){ //текущий или вшитый ЮзерАгент
		ttt = this.pref(ua_my); prefs.clearUserPref(ua_my);
		u = Cc["@mozilla.org/network/protocol;1?name=http"].getService(Ci.nsIHttpProtocolHandler).userAgent; //костыль
		ttt && this.pref(ua_my,ttt); ttt ||= u; if(real) ttt = u; return ttt;
	},
	dirsvcget(){ //константа пути + subdirs, если посл. опция = "" вернуть путь, иначе открыть
		var f, d = [...arguments], r = (d[d.length-1] == ""); (r) && d.pop();
		try {var b = prefs.getComplexValue("browser.download.dir",Ci.nsIFile);} catch {b = Services.dirsvc.get("DfltDwnld",Ci.nsIFile)}
		try {f = Services.dirsvc.get(d[0], Ci.nsIFile);} catch {f = b}
		d.slice(1, d.length).forEach((c) => f.append(c));
		if(r) return f.path;
		f.exists() && f.launch();
	},
	formatBytes(b = 0,d = 1){ //объём байт…Тб
		let i = Math.log2(b)/10|0; return parseFloat((b/1024**(i=i<=0?0:i)).toFixed(d))+`${i>0?'KMGT'[i-1]:''}b`;
	},
	about_config(filter){ //на опцию
		if(gURLBar.value.startsWith("about:config")) switchTab(gURLBar.value);
		var setFilter = (e,input = (e?.target || window.content.document).getElementById("about-config-search")) => {	try {
			if(e || input.value != filter) input.setUserInput(filter);} catch{}
		},
		found = window.switchToTabHavingURI("about:config",true, {relatedToCurrent: true,
			triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
		if(found) setFilter(null,window);
		else gBrowser.selectedBrowser.addEventListener("pageshow",setFilter, {once: true});
	},
	mode_skin(text,p,t,s = 'unset',o = '',z,f = [0,0,0]){ //настройки FF меняют подсветку кнопок и подсказки
		with(this){setTimeout(()=>{if(pref("dom.security.https_only_mode"))
			UcfGlob.Flash(F.N,0,"drop-shadow(0px 0.5px 0px #F8F)",...f),o = ', только HTTPS'
		else UcfGlob.Flash(F.N,0,"none",...f);
		if(ua() && (ua() != ua(true))) o = o +', чужой ЮзерАгент';
		z = pref("network.proxy.no_proxies_on") == "" ? "" : ', Есть сайты-исключения';
		p = p || pref(F.x);
		if(p == 1) t = ['sepia(100%) saturate(300%) brightness(0.9)', 'Ручная настройка прокси'+ z];
		else if(p == 2) t = ['hue-rotate(120deg)',F.d + z],s = 'hue-rotate(270deg) brightness(95%)';
		else if(p == 4) t = ['hue-rotate(250deg) saturate(150%)','Сеть - автонастройка прокси'+ z];
		else if(p == 0) t = ['saturate(0%) brightness(0.93)','Настройки сети - системные'+ z];
		else t = [s,'Сеть работает без прокси']; //серый фон кнопки
		UcfGlob.Flash(F.D,0, pref(F.v) > 1 ? "hue-rotate(180deg) drop-shadow(0px 0.5px 0px #F68)" : "none",...f);
		UcfGlob.Flash(F.Q,0,s,...f); UcfGlob.Flash(F.P,0,t[0],...f);
		z = typeof(text); if (z == 'string')
			Status(text ? text : "\u{26A1}"+ t[1] + o,5e3); //светофор
	},250)}},
	switchProxy(pac = F.w){
		var t = F.x,u = F.y;
		if(this.pref(t) != 2) //выключить
			this.pref(t,2), this.pref(u,pac)
		else
			this.pref(t,5), this.pref(u,"localhost");
		this.mode_skin(); //разный фон замка для Прокси
		BrowserReload();
	},
	Title(n){try {return UcfGlob.TitlePath(n)[3];}
		catch {return document.title || gBrowser.selectedTab.label}
	},
	HTML(){var i = '√ страница записана: ', t = crop(this.Title(),48,''), w = 1,
		sfile = document.getElementById(F[4]); //addon SingleFile
		try {UcfGlob.SingleHTML(true,window);
		} catch {w = 0; if (sfile) sfile.click();}
	}
},
uar = ucf.ua(true), //real ЮзерАгент
fonts = arr => arr.map(n => [(n == arr[arr.length-1] ? null : n), n]), //array с вложениями
serif = fonts("Arial|Roboto|Cantarell|DejaVu Sans|PT Serif|Segoe UI|Ubuntu|Cambria|Fira Sans|Georgia|Noto Sans|Calibri|Times".split('|')), sans = [["PT Sans","PT Sans"], ...serif],
hints = new Map([ //опция отсутствует ? вернуть строку
	[F.u +"savedirs", crop(ucf.dirsvcget(''),34)], [F.z, ucf.ua()]]
);
});