/* hookMouseKeys основной код Dumby, mod 3.7 Dobrov !нужен скрипт ucb_SaveHTML
меняйте здесь Подсказки, Keys нажатия клавиш, Mouse клики мыши, Menu команд и Setup
Правый клик: изменить 2 нижние команды Меню и строки "ваши данные…" в меню Setup */

(async F=>{eval(F.toString().slice(4)); var Tag = {[F.D]: //tooltips кнопок, меню: справка в help.html
`{
◉ колёсико	⬇︎ папка [Загрузки]
◨ правый клик ➜ Сохранить сайт
◉ колёсико на Фото ➜ Сохранить
	или перетащите фото вправо︰`+ //режимы {Простой︰Эксперт} разные действия|подсказки

`◧ лев. Держать  папка [Загрузки]\n
◨ правый клик (Alt+S) ➜ Сохранить\n    в единый Html всё / выделенное
◉ колёсико, ${F.tc("Super","Ctrl+Shift")}+S как Текст\n
◧ дважды на Фото: найти Похожие
◧ лев + Shift   Графика вкл/выкл}`,[F.P]: //PanelUI фон кнопки Blue Gray Red зел жёлт

`◧ лев. клик	меню Firefox ${F.ver}{\n︰
◧ + Shift	⤾ Вернуть вкладку\n}
◧ держать	✕ Закрыть браузер
◧ +Alt, ◉ ролик  Окно │ Развернуть

◨ прав. клик	⇲ Свернуть
± колёсико	Масштаб страницы {︰`/*эксперт*/+ `
◨ + Alt		Сведения о системе}`, [F.B]: //запуск команд: Menu.Dict.cmd()

`◉ + Shift		Закрыть вкладки слева
◉ ролик +Alt	…справа от активной`, [F.C]: //NewTab. SideBar открыт: код нажатий в консоль
`\n
◨ прав. клик	Вернуть вкладку
◉ колёсико	Оставить 1 текущую`, [F.I]: //identity-box

`правый клик	 Копировать адрес в буфер
◧ лев + Shift	 Медиа на странице {︰\n
◉ колёсико	 Мобильный дизайн}
Ø крутить ±	 Яркость страниц `, [F.F]: //FavDir

`Левый клик	★ Закладки\n◧ лев + Alt		Домашняя папка
Правый		⟳ История\n◨ + Alt		Папка установки\n
◉ колёсико	⬇︎ Загрузки
◉ ролик +Alt	UserChromeFiles`, [F.Q]: //SetupMenu ◨ + Alt посл.закладка меню

`  левый клик ◧ мыши «Журнал»\n
◉ колёсико	меню «Действия»
◨ пр. клик	Быстрые настройки
◨ держать	Пипетка цвета, линза\n
◧ лев. + Alt	Библиотека
◧ держать	Новая вкладка (${F.tc()}T){︰\n
Ø Ролик ±	масштаб Страницы
◧ + Shift	масштаб Текст / Всё}`, [F.M]: //reader-mode
`
Прав. клик	Адаптивный дизайн
Alt + R		Выбор части страницы
Крутить ±	Яркость страниц `, "ReaderView":

`Клик мыши	Чтение в ReaderView
Колёсико	Простой режим чтения\n`, [F.L]: //Print

`Распечатать страницу (${F.tc()}P)\n
правый клик	быстрая Печать
◉ ролик режим Простой | Эксперт
◧ держать	краткая Справка`, [F.N]: //Reload

`прав. клик	Обновить без кэша
◧ держать	Обновить всё`, [F.O]: //Щит

`клик мыши	Сведения о защите сайта\n
◨ правый клик	Куки и данные сайта
◧ лев. держать	⇆ Web-шрифты
◉ колёсико		ServiceWorkers`, "wheel-stop":

`◉ Колёсико	Прервать обновления {︰
◨ п.держать	Антизапрет ⇆ Без прокси}`, [F[0]]: //☒ кроме Windows

`Закрыть Firefox ${F.ver}\n
◉ колёсико	вернуть вкладку
◧ держать	краткая Справка\n◨ пр. клик	⇲ Свернуть`, [F.R]:

`	Атрибут-Инспектор
◉ колёсико	Инструменты браузера\n\n◨ пр. клик`, [F.E]: //extensions

`	Расширения\n◨ прав. клик	меню «Действия»\n\n◉ колёсико`},

Menu = { //команды юзера: alt правый клик, mid колёсико, upd обновлять строку
	View: { //имя курсивом без подсказки, обводка: изменяемые строки
		lab: `Мобильный дизайн | для Чтения`, inf: F.b, //подсказка
		img: F.Z +"aboutdebugging-connect-icon.svg",
		alt(btn){ // вложенные Sub-меню не допускаются
			btn.ownerDocument.getElementById("key_toggleReaderMode").doCommand()}, //штатный Режим чтения
		cmd(btn){
			btn.ownerDocument.getElementById("key_responsiveDesignMode").doCommand(); //пункт меню с HotKey
			gBrowser.selectedBrowser.browsingContext.inRDMPane && BrowserEx("reload");},
	},
	HTML: {lab: `Экспорт сайта в единый HTML`, img: F.Z +"globe.svg",
		inf: `используя скрипт SaveHTML\nили расширение SingleFile`,
		cmd(){ HTML()}
	},
	Tab: {lab: `Вернуть вкладку | Обновить все`, inf: F.b, img: F.Z +"reload.svg",
		cmd(btn){btn.ownerGlobal.undoCloseTab()},
		alt(){
			with (gBrowser) selectAllTabs(),reloadMultiSelectedTabs(),clearMultiSelectedTabs()}
	},
	Fav: {lab: `Закладки 1-ая ссылка ⇅ Последняя`,
		inf: `на Яндекс, если меню «Закладки» пустое\nправ. клик + Alt на кнопке Быстрых опций`,
		cmd(){
			toTab(FavItem())},
		alt(){toTab(FavItem(true))}
	},
	Dict: { sep: 1, //сперва разделитель
		lab: `Гугл-перевод Сайт/выделенный Текст`,
		cmd(){Translate()}
	},
	O: { men: 1, img: F.opt, //подменю, любая вложенность
		lab: `Опции about:config | Страницы`, inf: `Правый клик: about-page`, alt(){toTab("about:about")},
		js: {lab: "Выполнять скрипты Java", inf: "Поддержка графики, рекламы\nдействия горячих клавиш",
			upd(){this.image = Pref("javascript.enabled") ? F.ok : F.no;
			},
			cmd(){Pref("javascript.enabled", !Pref("javascript.enabled"))}
		},
		DwDir: {lab: `папка Загрузки | chrome:`, inf: F.b, img: F.dir,
			cmd(){
				Downloads.getPreferredDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)},
			alt(){UcfGlob.dirGet("UChrm")}
		},
		"Режим полной изоляции сайтов": {
			inf: `Сайт не «узнает» ваши действия в других вкладках`,
			cmd(){
				var p = "fission.autostart"; Pref(p, !Pref(p));
			},
			upd(){ var i = F.sec;
				if(Pref("fission.autostart"))
					i = i.replace("-in","-");
				this.image = i;}
		},
		"Сведения о браузере": { sep: 1,
			cmd(){toTab()}, img: "resource://gre-resources/password.svg"
		},
		"Настройки профайлера": {
			cmd(){toTab('about:profiling')}
		},
		Remote: {lab: `Удалённая отладка`,
			cmd(chr = "devtools.chrome.enabled",rem = "devtools.debugger.remote-enabled"){
				if(!Pref(chr) || !Pref(rem)){
					Pref(chr,true); Pref(rem,true);
				}
				var {BrowserToolboxLauncher} = ChromeUtils.import("resource://devtools/client/framework/browser-toolbox/Launcher.jsm");
				BrowserToolboxLauncher.init();}
		},
		"Настройки UserChromeFiles": {sep: 1, img: F.opt, cmd(){UCF()} //UCFprefs
		},
		DelCache: {lab: `Restart браузер, удалить кэш`, img: F.Z +"clear.svg",
			cmd(){
				if(!UcfGlob.maybeRestart(false, ()=>true)) return;
				Services.appinfo.invalidateCachesOnRestart();
				with(Services.startup) quit(eAttemptQuit | eRestart);}}
	},
	VPN: {lab: `VPN Антизапрет | Настройки Proxy`, inf: F.w +"\nCensor Tracker только отключается",
		upd(){
			this.image = Pref(F.x) == 2 ? F.ok : F.no;},
		cmd(){switchProxy()},
		alt(){CfgProxy()}
	},
	Pics: { alt(){ Pref(F.v, 3); BrowserEx("reload");}, inf: 1,
		upd(){ var val = Pref(F.v), s = val == 1, i = F.X;
			this.label = `Графика страниц – ${s ? "включена" : val == 3 ? "только сайт" : "запрещена"}`;
			this.image = s ? i.replace("-blocked","") : i || F.nul;
			this.tooltipText = `правый Клик: кроме сторонних\n${F.v} = ${val}`;
		},
		cmd(){
			var n = Pref(F.v) != 1; Pref(F.v, n ? 1 : 2);
			mode_skin(); BrowserEx("reload");
			Status(`Загрузка изображений ${n ? "√ разреш" : "✘ запрещ"}ено`,3e3);}
	},
	EyeDrop: {lab: `Пипетка цвета, Линза`, img: F.eye, sep: 1,
		cmd(btn){
			var url = `resource://devtools/shared/${parseInt(F.ver) > 95 ? "loader/" : ""}Loader.`;
			try {var exp = ChromeUtils.importESModule(url + "sys.mjs");} catch {exp = ChromeUtils.import(url + "jsm");}
			var obj = exp.require("devtools/client/menus").menuitems.find(menuitem => menuitem.id == "menu_eyedropper");
			(obj.oncommand.bind(null, {target: btn}))();
			UcfGlob.Flash(0,'rgba(100,0,225,0.1)',0, F.e);}
	},
	"Краткая справка | Жесты мыши": { inf: F.b, img: F.Z +"help.svg",
		alt(s = "ucf_mousedrag.js"){
			var h = document.getElementById("nav-bar").ucf_mousedrag;
			h ||= F.q + s;
			Services.prompt.alert(null,"Справка по жестам мыши",`Перетащите фото вправо, чтобы сохранить\n\n`+ h);},
		cmd(){Help()}
	},
	Run: { //код пользователя (Alt+x)
		upd(js = Pref([F.u +"my_run", F.run])){
			js &&= js.split('║'); if(Array.isArray(js) && js.length < 4)
				js = F.run.split('║'); 
			Pref(F.u +"my_run",js.join("║")); F.js = js;
			this.label = js[0] +" (Alt+x)",this.tooltipText = F.a + js[1]; this.run = js[1];
		},
		alt(){aboutCfg(F.u +"my_run")}, //править js-код
		cmd(btn){eval(btn.run)}
	},
	Run2: { img: F.Z +"tool-application.svg",
		upd(js = F.js.slice(2,4)){
			this.label = js[0], this.tooltipText = F.a + js[1]; this.run = js[1];
		},
		alt(){aboutCfg(F.u +"my_run")},
		cmd(btn){eval(btn.run)}
	}},

Keys = { //перехват-клавиш KeyA[_mod][_OS](e,t){код} и KeyB: "KeyA"
	KeyX_1(e,t){userjs(e)}, // Alt+X запуск внешнего JS-кода
	KeyS_6(){saveSelToTxt()}, // Ctrl+Shift+S
	KeyS_15_macosx: "KeyS_6", // Super+S
	KeyS_1(e,t){HTML()}, //Alt+S | e: Event, t: gBrowser.selectedTab
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
		257(){switchProxy()}
	},
	[F.A + F.K]: { //ReaderView
		2(trg,forward){bright(trg,forward,5)}, //яркость по wheel ±
		128(btn){Menu.View.alt(btn)},
		256(btn){Mouse[F.M][256](btn)}
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
		256(){BrowserEx("reloadSkipCache")}, //R
		257(){switchProxy()} //дR
	},
	[F.D]: {mousedownTarget: true, //не передавать нажатия дальше
		1(){ Menu.O.DwDir.cmd()}, //д
		16(){Menu.Pics.cmd()},//+Shift
		128(){Exp()
			? saveSelToTxt() : //сохранить|выделен. как .txt
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)},
		256(){HTML()} //web
	},
	[F.P]: {mousedownTarget: true, //PanelUI
		1(btn){goQuitApplication(btn)}, //д
		2(trg,forward){zoom(forward)}, //wheel
		16(btn){btn.ownerGlobal.undoCloseTab()}, //L+Shift
		8(){windowState != STATE_MAXIMIZED ? maximize() : restore()}, //L+Alt
		128(){windowState != STATE_MAXIMIZED ? maximize() : restore()},
		129(){BrowserEx("fullScreen")}, //дС
		136(){this[129]()}, //С+Alt
		144(){Mouse[F.Q][136]()}, //C+Shift
		256(){minimize()},
		264(){toTab()}, //R+Alt
		272(btn){btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("History")} //R+Shift
	},
	[F.I]: { //замок
		8(){UCF()}, //+Alt
		128(btn){Menu.View.cmd(btn)},
		16(btn){ //+Shift
			BrowserEx("pageInfo", btn,"mediaTab") //securityTab feed… perm…
		},
		2(trg,forward){bright(trg,forward,5)}, //яркость
		10(trg,forward){bright(trg,forward)},
		256(){gClipboard.write(gURLBar.value);
			UcfGlob.Flash(0,'rgba(240,176,0,0.5)',0,"в буфере: "+ gURLBar.value.slice(0,80));}
	},
	[F.F]: { //favdirs кнопка
		0(btn){btn.ownerGlobal.SidebarUI.toggle("viewBookmarksSidebar")},
		256(btn){btn.ownerGlobal.SidebarUI.toggle("viewHistorySidebar")},
		8(){UcfGlob.dirGet("Home")}, //+Alt
		128(btn){
			btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("Downloads")},
		136(){ //C+Alt
			UcfGlob.dirGet("UChrm", "user_chrome_files")},
		264(){ //R+Alt
			UcfGlob.dirGet("GreD")}
	},
	[F.O]: { //щит
		1(){Mouse[F.Q][136]()}, //д Шрифты
		2(trg,forward){bright(trg,forward)},
		256(btn){Cookies()},//R куки
		128(){toTab("about:serviceworkers")} //С
	},
	[F[2]]: {2(trg,forward){zoom(forward)}}, //zoompage
	[F[3]]: {2(){Mouse[F[2]][2]()}},
	[F[0]]: { //title-close
		1(){Help()},
		128(btn){btn.ownerGlobal.undoCloseTab()},
		256(){minimize()}
	},
	[F.R]: {mousedownTarget: true, //AttrView
		0(){Status("Ctrl+Shift+C - copy tooltip's contents")},
		128(){Menu.O.Remote.cmd()}, //C
		256(){UCF()},
		257(){toTab('about:debugging#/runtime/this-firefox')} //дR
	},
	[F.E]: {mousedownTarget: true,
		1(){
			Menu.O.DelCache.cmd();
		}, //д
		128(btn){btn.id && UCF()}, //UCFprefs
		129(){ //дС
			toTab('about:addons')},
		256(btn){
			btn.id && F.menu.openPopup(btn, "after_start");
		},
		257(){Mouse[F.R][257]()}
	},
	[F.Q]: {mousedownTarget: true,
		0(btn, n){ //L
			if(btn.id == F.Q){
				var bar = document.getElementById("ucf-additional-vertical-bar");
				bar && window.setToolbarVisibility(bar,document.getElementById("sidebar-box").hidden);
				window.SidebarUI.toggle("viewHistorySidebar"); return;
			}
			if (btn.cmd){ //UserMenu
				btn.cmd[n] && btn.cmd[n](btn);
			} else if (btn.className == "menu-iconic"){
				aboutCfg(btn.pref.pref); //go параметр
				Last && Last.hidePopup();
			}; mode_skin();
		},
		2(trg,forward){zoom(forward)}, //wheel
		1(btn){ //д
			btn.id == F.Q && toTab("about:newtab");
		},
		8(){toTab('chrome://browser/content/places/places.xhtml')}, //L+Alt
		264(){ //R+Alt
			toTab(FavItem(true))},
		16(btn){if (btn.id == F.Q) zoom(0,1)}, //L+Shift
		128(btn, n, trg){ //C Menu-1
			if(btn.id)
				btn.menupopup.openPopup(trg || btn, "after_start");
			if (btn.cmd) //UserMenu
				btn.cmd[n] && btn.cmd[n](btn);
			mode_skin();
		},
		129(btn){if(btn.id) userjs(btn,"");}, //дC консоль
		256(btn, n){ //config Menu
			if(btn.id == F.Q) setTimeout(()=> {
				with(btn.config)
					eval(`${state != "open" ? "open" : "hide"}Popup(btn,"after_start")`);
			}, 50);
			if (btn.cmd){ //UserMenu
				F.menu.hidePopup();
				btn.cmd[n] && btn.cmd[n](btn);
			} else
				try{btn.parentNode.hidePopup();} catch{}
		},
		257(btn){ //дR
			btn.id == F.Q && Menu.EyeDrop.cmd(btn); //линза
		},
		136(){ //С+Alt
			var n = "browser.display.use_document_fonts",f = Pref(n) ? 0 : 1;
			Pref(n,f); zoom(0,0,0,(f > 0) ? " + Web-шрифты" : ""); BrowserEx("reload");}
	}
}; Mouse["add-ons-button"] = Mouse[F.E];
Object.keys(Mouse).forEach((k) =>{Mus["."+ k] = Mus["#"+ k] = Mouse[k]});

var Setup = [{ //about:config меню. refresh=true ⟳ Обновить без кэша. restart=false ↯ Без запроса, Изменено: курсив
	pref: ["dom.disable_open_during_load", "Всплывающие окна",,"dom.disable_beforeunload\nЗапрос страниц о закрытии\n\nОпции "+ F.m +": Cерые"], Def3el: true, Yellow: false,
	keys: [[true, "Блокировать",,,`Pref('dom.disable_beforeunload',true)`], [false, "Разрешить",,,`Pref('dom.disable_beforeunload',false)`]],
},{ //серый значок: опция не задана|или Gray. Сирень: юзер, Жёлт: Yellow, Не равно Def3el: Красный, Обводка: не по-умолчанию
	pref: [F.t, "Опасные файлы, сайты",,F.t +"_host"], Def3el: true, Yellow: false,
	keys: [[true, "Запрет",,,`Pref(F.t +'_host',true)`], [false, "Открыть",,,`Pref(F.t +'_host',false)`]]
},{ //pref,lab,key,hint,[val,str],code | keys:val,lab,dat,+hint,code,pref_my | icon:значок
	pref: [F.S, "Сайт",,"Некоторым сайтам нужен доступ к Clipboard"], Def3el: false, Yellow: true,
	keys: [[true, "управлять буфером обмена"], [false, "не изменять буфер обмена"]]
},{
	pref: [F.u +"savedirs", "Загрузки",,'Пути сохранения Сайтов и Графики\nСинтаксис «Html/subdir|Pics/subdir»\nsubdir: пусто | 0 заголовок | 1 домен',
		["", "всё в общей папке"]], Gray: "", Blue: "-Web|1|-Images|0", Def3el: "Сайт||Фото|0", Yellow: "Site||Photo|0",
	keys: [ //сохранение Html/Pics. [Загрузки]/"_Html/subdir|_Pics/subdir" subdir: пусто | 0 заголовок | 1 домен
		[Pref([F.u +"savedirs_my", "Сайт||Фото|"]), F.g,,"значение можно изменить «под себя»",,F.u +"savedirs_my"],
		["Сайт||Фото|0", "Сайт|Фото/имя…"],
		["Site||Photo|0", "Site|Pics/имя"],
		["-Web|1|-Images|0", "-Web/сайт|-Images/имя"],
		["_Web|1|_Photo|1", "_Web/сайт|_Photo/…"],
		["_Web|0|_Pics|", "_Web/имя|_Pics"]]
},null,{
	pref: [F.y, "Прокси (VPN)", "п", F.x +"\n\nПереключение сетевых настроек"],
		Def3el: "localhost", Yellow: F.w, Gray: "", refresh: true,
	keys: [
		["localhost", "системный", "0",,`Pref(F.x,5)`],
		[F.w, "АнтиЗапрет", "2", "Надёжный доступ на заблокированные сайты\n«Режим прокси» меняется на 2",
			`Pref(F.x,2)`],
		["127.0.0.1", "tor или opera-proxy", "1", "Включите одну из служб",
			`Pref(F.x,1)`],
		[Pref(["user.pacfile", "file:///etc/proxy.pac"]), "user .pac файл", "4", "about:config pacfile"]] //нужен диалог выбора pac-файла
},{
	pref: [F.x, "Режим прокси", "р"], Gray: 0, Def3el: 5, Blue: 4, Yellow: 2, refresh: true,
	keys: [[5, "системный", "5"],
		[2, "Автоконфиг PAC", "2", "about:config PAC файл"],
		[1, "Ручная настройка", "1", "Используется "+ F.y],
		[4, "Автоопределение", "4"],
		[0, "Без прокси", "0", F.m]]
},{
	pref: ["network.trr.mode", "DNS поверх HttpS",,"Шифрование DNS-трафика для\nзащиты персональных данных"], Def3el: 2, Yellow: 3, Gray: 5, Blue: 1, refresh: true,
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
	pref: ["gfx.webrender.force-disabled", "Ускорять отрисовку страниц",,"gfx.webrender.compositor.force-enabled\ngfx.webrender.all\n\nАппаратная отрисовка видеокартой,\nотключите при проблемах с графикой"],
	Def3el: false, Yellow: true, Gray: undefined, restart: true, keys: [
		[false, "Да",,,`[['gfx.webrender.compositor.force-enabled', true], ['gfx.webrender.all', true]].map((a) =>{Pref(...a)})`],
		[true, "Нет",,,`[['gfx.webrender.compositor.force-enabled', false],['gfx.webrender.all', false]].map((a) =>{Pref(...a)})`]]
},null,{
	pref: ["media.autoplay.default", "Авто-play аудио/видео"], Def3el: 0, Yellow: 2, Gray: 5, refresh: true,
	keys: [
		[0, "Разрешить", "0"], [2, "Спрашивать", "2"], [1, "Запретить", "1"], [5, "Блокировать", "5"]]
},{
	pref: ["dom.storage.enabled", "Локальное хранилище",,"Сохранение персональных данных, по\nкоторым вас можно идентифицировать"],
	Def3el: false, Yellow: true,
	keys: [[true, "Разрешить"], [false, "Запретить"]]
},{
	pref: ["privacy.resistFingerprinting", "Изоляция Firstparty-Fingerprint",,"privacy.firstparty.isolate\n\nЗащита данных пользователя также\nзапрещает запоминать размер окна"], Def3el: false,
	keys: [[true, "Да",,"Защита от слежки",`Pref('privacy.firstparty.isolate', true)`], [false, "Нет",,,`Pref('privacy.firstparty.isolate',false)`]]
},(()=>{
if(parseInt(F.ver) > 114) return { //новый FF
	pref: ["browser.translations.enable", "Встроенный перевод сайтов"], Def3el: true, Gray: false, refresh: true,
	keys: [[true, "Да"], [false, "Откл",,,`Status('Перевод отключен для новых вкладок')`]]
}; else return {
	pref: ["media.peerconnection.enabled", "WebRTC ваш реальный IP"], Def3el: false,
	keys: [[true, "Выдать"], [false, "Скрыть"]]
}})(),null,{
	pref: ["network.http.sendRefererHeader", "Referer: для чего"], Def3el: 2, Yellow: 1,
	keys: [[0, "Ни для чего", "0"], [1, "Только ссылки", "1"], [2, "Ссылки, графика", "2"]]
},{
	pref: ["browser.cache.disk.capacity", "Кэш браузера",,`\n${F.Y}:\nДиск и память: 5120\nтолько Память: -1`,,`[[F.U,true],[F.V,true],[F.W,true]].map((a)=>{Pref(...a)})`],
	Def3el: 1048576, Yellow: 0, Gray: 5e5, Blue: 25e4, restart: true,
	keys: [[5e5, F.m,,"500 Мб авторазмер"],
	[1048576, "Диск и Память",,,`Pref(F.Y, 5120)`],
	[0, "только Память",,,`[[F.V,false], [F.Y,-1]].map((a)=>{Pref(...a)})`],
	[2097152, "только Диск",,,`Pref(F.U,false)`],
	[25e4, "250 Мб на диске",,"Ограничить размер кэша",`Pref(F.W,false)`],
	[1000000, "1 Гб максимум",,,`Pref(F.W,false)`]]
},{
	pref: ["browser.sessionstore.interval", "Резервирование сессий",,"Браузер резервирует сессии на\nслучай сбоя, снижая ресурс SSD"], Gray: 15e3, Def3el: 6e4, Blue: 3e5, Yellow: 9e5,
	keys: [[15e3, "15 сек"], [6e4, "1 мин"], [3e5, "5 мин"], [9e5, "15 мин"], [18e5, "30 мин"]]
},{
	pref: [F.z, "User Agent",,"Изменяет вид сайтов", [ua(true),"встроенный"]],
		refresh: true, Def3el: ua(true), Yellow: F.G + F.H,
	keys: [
	[ua(0, F.z +"_my"), F.g,,,,F.z +"_my"], //alt-ключ
	[F.G + F.H,"Yandex MacOS"],
	["Opera/9.80 (Windows NT 6.2; Win64; x64) Presto/2.12 Version/12.16", "Opera12 W8"],
	[F.G +"Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", "MSIE 6.0 Windows"],
	[F.G +"PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)", "Playstation 4"],
	[F.G +"compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; GT-I8350)", "Windows Phone"],
	[F.G +"compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "GoogleBot"],
	[ua(true), F.m]] //штатный ЮзерАгент
}],

Over = { //изменить подсказки под мышью
get [F.P](){ //PanelUI delete this[…];
	mode_skin(); if(Pref("signon.rememberSignons"))
		Services.cache2.asyncGetDiskConsumption({onNetworkCacheDiskConsumption(bytes){
			Status(F.h + formatBytes(bytes),3e3) //вывод объёма кэша
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
	trg.tooltipText = Tag[F.B] +'\n± колёсико	перебор вкладок';
},
get [F.C](){ //newtab
	return GetDynamicShortcutTooltipText(F.C) + Tag[F.C] +'\n\n'+ Tag[F.B];
},
get [F.D](){var dw = UcfGlob.dirGet("DfltDwnld", 1);
	if(dw) Status(`${Pref(F.v) > 1 ? "\u{26A1} Графика отключена," : "💾 папка"} Загрузки: `+ crop(dw, 96,''));
	return GetDynamicShortcutTooltipText(F.D) +"\n"+ tExp(F.D);
},
get [F.N](){ mode_skin('');
	return GetDynamicShortcutTooltipText(F.N) +"\n\n"+ Tag[F.N] +"\n"+ tExp("wheel-stop");
},
get "stop-button"(){return GetDynamicShortcutTooltipText("stop-button") +"\n"+ tExp("wheel-stop");
},
get "urlbar-input"(){Status("Очистить панель колёсиком мыши",2500)}, //tab
[F.L]: Tag[F.L], "appMenu-print-button2": Tag[F.L], //print
get [F[1]](){ //title-close
	Status("правый клик: Свернуть, колёсико: Восстановить вкладку",3e3); Tag[F[0]];
}, 
get [F.T](){
	var t = `${Pref("dom.disable_open_during_load") ? "Запрет" : "↯ Разреш"}ить всплывающие окна`;
	if(!Pref("places.history.enabled")) t = F.j;
	if(Pref("privacy.sanitize.sanitizeOnShutdown")) t = F.k;
	Status(t,3e3); return tooltip();
},
get "identity-icon-box"(){ //custom hint
	return tooltip_x(window.event.target, tExp(F.I) + br_val());
},
get [F.I](){Status(this.BrExp(),2500)},
get [F.O](){Status(this.BrExp(),2500); //щит
	return tooltip_x(window.event.target, tExp(F.O) + br_val());
},
get [F.Q](){
	var trg = window.event?.target;
	if(trg.id == F.Q)
		zoom(0,0,0,`, ${Pref("browser.tabs.loadInBackground") ? "Не выбирать" : "Переключаться в"} новые вкладки`)
	else if (trg.id)
			Status(F.c,9e3);
	try {trg.mstate = trg.config.state + trg.menupopup.state;} catch{} //SetupMenu
	if(!/open/.test(trg.mstate))
		return tExp(F.Q)
	else trg.tooltipText = "";
},
get [F.M](){ //reader
	return GetDynamicShortcutTooltipText(F.M) +"\n"+ Tag[F.M] + br_val();
},
get [F.A + F.K](){ //ReaderView
	return Tag["ReaderView"] + Tag[F.M] + br_val();
},
get SessionManager(){Status("Период сохранения сессий в меню «Быстрые опции»");},
get [F.E](){
	this.clipboard; return Tag[F.E] + F.p;
},
get "add-ons-button"(){this.clipboard; var s = Tag[F.E];
	return tooltip(window.event.target, s.replace(s.split("\n", 1),"") + F.p);
},
get [F.R](){return Tag[F.R] + F.p;
},
get [F[2]](){ //zoompage
	return tooltip_x(window.event.target,"⩉ Ролик ±	Изменить масштаб");
}, get [F[3]](){return Over[F[2]]},
[F[4]]: F.n, [F[5]]: F.n, //SingleFile
[F[6]]: F.o, [F[7]]: F.o, //VDH
BrExp(t = F.l + br_val()){
	return t +` ${Exp() ? "Экспертный" : "Простой"} режим кнопок`},
get clipboard(){
	Status("📋 "+ readFromClip().replace(/[\r?\n?]|\s+/g,' ').trim(),3e3);}
};

((obj,del,re) => { //парсинг блока клавиш ускоряет обработку нажатий
	for(var p in Keys)
		F.reos.test(p) && del.add(p.endsWith(F.os) ? p.slice(0, -F.os.length -1) : p);
	for(var p in Keys) del.has(Keys[p]) && del.add(p);
	for(var d of del) delete Keys[d]; //есть Key_OS ? удалить имена-клоны
	for(var p in Keys) if (F.reos.test(p)) //убрать имя вашей ОС из свойства
		Keys[p.replace(F.reos,'')] = Keys[p], delete Keys[p];
	for(var p in Keys){var func = Keys[p]; //(){…}, bool,num
		if(typeof func == "string") func = Keys[func]; //ссылка на функцию
		var [key,mod] = p.split("_"); mod ||= "";
		var upper = key[0].toUpperCase(); var prevent = key[0] == upper;
		var [, m,i] = mod.match(re); m ||= 0; //modifiers bitmap
		var arr = [func,prevent, i ? i == "I" ? 0 : 1 : -1]; //textfields flag Имя_i 1 кроме полей ввода
		var prop = prevent ? key : upper + key.slice(1); //имя без mod
		var o = obj[prop] || (obj[prop] = Object.create(null));
		o[m] ? o[m].push(arr) : o[m] = [arr]; //имя со строчной: Skip preventDefault
	}; Keys = obj;})(Object.create(null),new Set(),/(\d+)?(i)?/i);

var Debug = (e,id = "sidebar-box") => {
	if(prefs.getBoolPref(F.u +'info',false)) return true;
	return !document.getElementById(id).hidden;
},
keydown_win = e => { //перехват клавиш, учитывая поля ввода
	if (e.repeat) return; //выключить
	var KB = Keys[e.code]?.[e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey];
	if(KB) //есть HotKey
		for(var [func,p,i] of KB)
			if(i ^ docShell.isCommandEnabled("cmd_insertText"))
				p && e.preventDefault(), func(e, gBrowser.selectedTab); //запуск по сочетанию
	Debug() && //показ клавиш
		console.log('■ key '+ e.code + ('_'+ (e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey)).replace('_0',''));
},
listener = { //действия мыши, перехват существующих
	handleEvent(e){
		if(this.skip || e.detail > 1) return;
		var trg = e.target, id = trg.id || trg.className; //trg.tagName;
		if(trg.id) Last = trg;
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
		obj[num](trg, num); //Click
	},
	find(sel){ //условия запуска ?
		return Mus[sel][this] || Mus[sel][this + 1];
	},
	filter(sel){return this.closest(sel); //родитель
	},
	get selectors(){
		this.onLongPress = (trg,obj,num) => {
			this.mousedownTID = null;
			this.longPress = true;
			obj[num](trg, num); //LongClick
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
events = ["click","mousedown","mouseenter","wheel"], //перехват событий для id:
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
}},
mode_skin = (txt,t,s = 'unset',o = '') => {setTimeout(()=>{ //опции FF меняют подсветку кнопок
	var p = Pref(F.x), z = s; UcfGlob.Flash(F.O,p == 2 ? "magenta" : s,0,-1);
	UcfGlob.Flash(F.D,0, Pref(F.v) > 1 ? 'hue-rotate(180deg) drop-shadow(0px 0.5px 0px #F68)' : 'none',-1);
	if(Pref("dom.security.https_only_mode")) z = 'drop-shadow(0px 0.5px 0px #F8F)', o = ', только HTTPS'
	UcfGlob.Flash(F.N,0,z,-1); t = [s,'Настройки сети - системные'];
	if(p == 0) t = ['saturate(0%) brightness(0.93)','Сеть работает без прокси'];
	else if(p == 1) t = ['sepia(100%) saturate(300%) brightness(0.9)', 'Ручная настройка прокси'];
	else if(p == 2) t = ['hue-rotate(120deg)',F.d], s = 'hue-rotate(270deg) brightness(95%)'; //фон PanelUI
	else if(p == 4) t = ['hue-rotate(250deg) saturate(150%)','Сеть - автонастройка прокси'];
	UcfGlob.Flash(F.P,0,t[0],-1), UcfGlob.Flash(F.Q,0,s,-1); 
	if(ua() && (ua() != ua(true))) o = o +', чужой ЮзерАгент';
	z = Pref("network.proxy.no_proxies_on") ? ' + сайты-исключения' : '';
	typeof txt == "string" && Status(txt || "\u{26A1}"+ t[1] + z + o,5e3);},250)
}
mode_skin(); [['ui.prefersReducedMotion',0],['browser.download.alwaysOpenPanel',false], //animation Fix
['browser.download.autohideButton',false]].forEach((p)=>Pref(...p)); //lockPref опций
getIntPref = (p) => prefs.getIntPref(p,100),
tabr = F.u +"opacity",url = `resource://${tabr}/`, //bright tabs
sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
css = `@-moz-document url(chrome://browser/content/browser.xhtml){
	:is(${F.id})[rst] {filter: grayscale(1%) !important}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabbox {background-color: black !important}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabpanels {opacity:${getIntPref(tabr)/100} !important}}`;
io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler)
	.setSubstitution(tabr,io.newURI("data:text/css,"+ encodeURIComponent(css)));
sss.loadAndRegisterSheet(io.newURI(url),sss.USER_SHEET);
var st = InspectorUtils.getAllStyleSheets(document).find(s => s.href == url).cssRules[0].cssRules[2].style;
var observer = () => st.setProperty("opacity", getIntPref(tabr)/100,"important");
prefs.addObserver(tabr,observer);
this.removePrefObs = () => prefs.removeObserver(tabr,observer); //end bright

function BrowserEx(){
	let args = [...arguments], b = args.shift();
	eval(`${parseInt(Services.appinfo.version) < 126
		? "Browser"+ b[0].toUpperCase() + b.slice(1)
		: "BrowserCommands."+ b}(...args)`);
}
var css_USER = css => { //локальные функции
	var style = UcfGlob.FileOk(css) ? io.newURI(css) : makeURI('data:text/css;charset=utf-8,'+ encodeURIComponent(css));
	var args = [style,sss.USER_SHEET]; //стиль: файл или CSS
	(this.css = !this.css) ? sss.loadAndRegisterSheet(...args) : sss.unregisterSheet(...args);
},
gClipboard = {write(str,ch = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)){
		(this.write = str => ch.copyStringToClipboard(str,Services.clipboard.kGlobalClipboard))(str);}
},
readFromClip = ({clipboard} = Services, data = {}) => {
	try {let trans = Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable),
		flavor = `text/${parseInt(Services.appinfo.platformVersion) >= 111 ? "plain" : "unicode"}`;
		trans.init(docShell.QueryInterface(Ci.nsILoadContext));
		trans.addDataFlavor(flavor);
		clipboard.getData(trans, clipboard.kGlobalClipboard);
		trans.getTransferData(flavor, data);
		if (data.value)
			return data.value.QueryInterface(Ci.nsISupportsString).data;
	} catch {return ""}
},
crop = (z = "",cut = 30,ch = '…\n') => { //обрезать/разбить текст
	var e = z.substring(cut).slice(-cut);
	return z.substring(0,cut) + (e ? ch +"…"+ e : "");
},
hints = new Map([ //опция Setup отсутствует ? вернуть строку
	[F.u +"savedirs", crop(UcfGlob.dirGet("DfltDwnld", 1),33)], [F.z, ua(true)]]),
TabAct = e => {return e.closest(".tabbrowser-tab");
},
toTab = (url = 'about:support', go) =>{ //открыть вкладку | закрыть её | выбрать
	for(var tab of gBrowser.visibleTabs)
		if(tab.linkedBrowser.currentURI.spec == url)
			{go ? gBrowser.selectedTab = tab : gBrowser.removeTab(tab); return;}
		gBrowser.addTrustedTab(url);
		gBrowser.selectedTab = gBrowser.visibleTabs[gBrowser.selectedTab._tPos +1];
},
Title = n => {try {return UcfGlob.TitlePath(n)[3];}
	catch {return document.title || gBrowser.selectedTab.label}
},
aboutCfg = (filter, win = window) => { //на опцию
	var setFilter = (e, wnd, input = (e?.target || wnd.content.document).getElementById("about-config-search")) => {try {
		if(e || input.value != filter) input.setUserInput(filter);} catch{}},
	found = win.switchToTabHavingURI("about:config", true, {relatedToCurrent: true,
		triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
	if (found) setFilter(null, win);
	else gBrowser.selectedBrowser.addEventListener("pageshow", setFilter, {once: true});
},
saveSelToTxt = async () => { //в .txt Всё или Выбранное
	var {length} = saveURL, splice = length > 9, l11 = length == 11, msgName = F.id + ":Save:GetSelection"; //FIX FF103+
	var receiver = msg => {var txt = "data:text/plain,"+ encodeURIComponent(gBrowser.currentURI.spec +"\n\n"+ msg.data);
		var args = [txt, Title() +'.txt',null,false,true,null,window.document];
		splice && args.splice(5,0,null) && l11 && args.splice(1,0,null);
		saveURL(...args);
		Status(crop("√ текст сохранён: "+ Title(),48,''));
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
HTML = (sfile = document.getElementById(F[4])) => { //addon SingleFile
	try {UcfGlob.SingleHTML(true,window);
	} catch {sfile && sfile.click();}
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
	Pref(tabr,val); trg.toggleAttribute("rst"); Status(F.l + val +"%",1e3);
},
br_val = () => Pref([tabr,100]) +"%",
zoom = (forward,toggle = false, change = true,text = '') => {
	toggle ? ZoomManager.toggleZoom() : change ? forward ? FullZoom.enlarge() : FullZoom.reduce() : 0;
	Status("± Масштаб "+ Math.round(ZoomManager.zoom*100) +`%${Pref("browser.zoom.full") ? "" : " (только текст)"}` + text,3e3);
},
formatBytes = (b = 0,d = 1) => { //объём байт…Тб
	let i = Math.log2(b)/10|0; return parseFloat((b/1024**(i=i<=0?0:i)).toFixed(d))+`${i>0?'KMGT'[i-1]:''}b`;
},
Expert = (m = Boolean(Exp()), p = F.u +'expert') => {
	Pref(p,!m); Status(Over.BrExp(""),3e3);
},
Help = (help = F.s +"help.html") => { //помощь
	(UcfGlob.FileOk(help)) ? toTab(help) : toTab(F.J);
},
userjs = (e,myjs = F.s +"custom_scripts/User.js") => {
	Debug() && document.getElementById("key_browserConsole").doCommand(); //фокус на консоль
	UcfGlob.FileOk(myjs) ? eval(Cu.readUTF8URI(io.newURI(myjs))) : console.error(F.q + myjs); //ваш скрипт
},
Icon = (c = '0c0')=>"data:image/svg+xml;charset=utf-8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='a' x1='16' x2='16' y1='32' gradientUnits='userSpaceOnUse'><stop stop-color='%23"+ c +"'/><stop stop-color='%23fff' offset='.8'/></linearGradient><linearGradient id='b' x2='32' y1='16' gradientTransform='matrix(1 0 0 1 2 2)'><stop stop-opacity='.5'/></linearGradient></defs><circle cx='16' cy='16' r='15' fill='url(%23a)' stroke='url(%23b)' stroke-width='2'/></svg>",
Translate = (brMM = gBrowser.selectedBrowser.messageManager) => { //перевод сайт | выдел. текст
	brMM.addMessageListener('getSelect',listener = (msg) =>{
		if(msg.data) //выделено
			toTab("https://translate.google.com/#view=home&op=translate&sl=auto&tl=ru&text="+ msg.data,true)
		else
			toTab("https://translate.yandex.com/translate?url="+ gURLBar.value +"&dir=&ui=ru&lang=auto-ru",true);
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
UCF = (p = "user_chrome") => {if (!UcfGlob.FileOk(F.s + p +"/prefs.xhtml")) p = "options";
	window.switchToTabHavingURI(F.s + p +"/prefs.xhtml",true,{relatedToCurrent: true,triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
},
Cookies = async() =>{var uri = window.gBrowser.selectedBrowser.currentURI;
	try {var tld = Services.eTLD.getBaseDomain(uri);} catch {var tld = uri.asciiHost}
	var sb = (await Dialog("preferences/dialogs/siteDataSettings.xhtml", "Browser:SiteDataSettings")).document.querySelector("#searchBox");
	sb.inputField.setUserInput(tld);
	await window.SiteDataManager.updateSites();
	setTimeout(() => sb.editor.selection.collapseToEnd(), 50);
},
switchProxy = (pac = F.w) => {
	var t = F.x,u = F.y;
	if(Pref(t) != 2) //выключить
		Pref(t,2), Pref(u,pac)
	else
		Pref(t,5), Pref(u,"localhost");
	mode_skin(); //разный фон замка для Прокси
	BrowserEx("reload");
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
				url: io.newURI(url),
				title: (gBrowser.contentTitle || gBrowser.selectedTab.label || url),
				parentGuid: [() => toolbarGuid, () => menuGuid, () => unfiledGuid][prefs.getIntPref("bookmarksparentguid",0)](),
				index: DEFAULT_INDEX
			});} catch {}
	});
}}

if(F.os == "macosx") Object.keys(Tag).forEach((k)=>{ //i счётчик, замена букв
	['◉','Ø'].forEach((c,i)=>{Tag[k] = Tag[k].replace(new RegExp(c,'g'),
	['⦿','◎'][i])})})
else if (Pref([F.u +'mystyle',false]))
	css_USER(F.s +"custom_styles/win_buttons-vitv.css")
else
	css_USER('.titlebar-buttonbox {display: none !important}');

//+ кнопки
if(!prefs.getStringPref("browser.uiCustomization.state").includes(`"${F.E}"`))
	await delayedStartupPromise;
var s = document.getElementById(F.E); s?.setAttribute("removable", true); //unlock unified-extensions-button
s && document.getElementById("nav-bar-customization-target").append(s);

CustomizableUI.getWidget(F.F)?.label || CustomizableUI.createWidget({label:`Панели, Папки`,id: F.F,tooltiptext: Tag[F.F],
	onCreated(btn){btn.style.setProperty("list-style-image",`url(${F.dir})`)}
})

if(UcfGlob.FileOk(F.as)) CustomizableUI.getWidget(F.R)?.label || CustomizableUI.createWidget({
	label:F.R.replace('-',' '), id:F.R, defaultArea: CustomizableUI.AREA_NAVBAR, localized: false,
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
			Cu.readUTF8URI(io.newURI(F.as))} catch {c = `console.error(F.q + ${F.as})`}
		return this.code = c;}
});

(async id => {with (document)
	getElementById(F.O).removeAttribute("tooltip"), getElementById("nav-bar").tooltip = F.id; //script OK

CustomizableUI.getWidget(id)?.label || (self => CustomizableUI.createWidget(self = {id,
	id: id, label: "Быстрые опции", localized: false, defaultArea: CustomizableUI.AREA_NAVBAR,
	onCreated(btn){
		btn.setAttribute("image", F.qt); btn.domParent = null;
		var doc = btn.ownerDocument, m = nn => doc.createXULElement(nn);
		this.createPopup(doc, btn, "config", Setup);
		btn.linkedObject = this;
		for(var type of ["contextmenu", "command"])
			btn.setAttribute("on" + type, `linkedObject.${type}(event)`);
		var popup = F.menu = m("menupopup"), menu = m("menuitem"); //UserMenu
		menu.m = m; menu.fill = this.fill; menu.render = this.render;
		popup.append(menu); btn.prepend(popup);
	},
	render(){
		var popup = this.parentNode;
		this.remove();
		this.fill(Menu, popup);
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
	fill(o, popup) {
		for (key in o){
			var val = o[key];
			if(typeof val != "object") continue;
			var {lab, inf, img, cmd, alt, sep, men, upd, mid} = val;
			sep && popup.append(this.m("menuseparator"));
			var name = men ? "menu" : "menuitem";
			var item = this.m(name); item.className = name;
			item.setAttribute("label", lab || key);
			item.alt = alt; //RClick в ucf_hookClicks.js {Mouse…
			if (inf) item.tooltipText = inf;
			else item.style.setProperty("font-style", "italic", "important");
			if(img || /this\.image.*=/.test(upd))
				item.className = name + "-iconic", item.setAttribute("image", img || F.io +"blocked.svg");
			item.cmd = []; item.cmd[0] = cmd; item.cmd[128] = mid; item.cmd[256] = alt; //клики {Mouse…
			popup.append(item);
			if(upd){ //выделить обновляемый пункт меню
				item.style.filter = "drop-shadow(0.1px 1px 0.1px #c99)";
				if(item.renderedOnce) (item.render = upd).call(item);
				else item.upd = upd, item.render = self.renderSub;
			}
			men && this.fill(val, item.appendChild(this.m("menupopup")));
		}
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
	createElement(doc, obj){ //click item
		if(!obj) return doc.createXULElement("menuseparator");
		var pref = doc.ownerGlobal.Object.create(null), node, bool, img;
		for(var [key, val] of Object.entries(obj)){
			if(key == "pref"){
				var [opt, lab, hot, hint, undef, code] = val; //строка меню
				pref.pref = opt; pref.lab = lab || opt;
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
		var t = prefs.getPrefType(pref.pref), m = {b: "Bool", n: "Int", s: "String"}, map, myp;
		var str = m[t == prefs.PREF_INVALID ? obj.keys ? (typeof obj.keys[0][0])[0] : "b" : t == prefs.PREF_BOOL ? "b" : t == prefs.PREF_INT ? "n" : "s"]; //String по-умолчанию
		pref.get = prefs[`get${str}Pref`], pref.set = prefs[`set${str}Pref`];
		if(pref.hasVals){
			for(var [val,,,,code] of obj.keys)
				code && (map || (map = new Map())).set(val, code);
			if(map) pref.set = (key, val) => {
				prefs[`set${str}Pref`](key, val);
				map.has(val) && eval(map.get(val)); //код2 если pref изменён
			}
		}
		node = doc.createXULElement("menu");
		node.className = "menu-iconic";
		img && node.setAttribute("image", img);
		hot && node.setAttribute("accesskey", hot);
		(node.pref = pref).vals = doc.ownerGlobal.Object.create(null);
		this.createRadios(doc,
			str.startsWith("B") && !pref.hasVals ? [[true, "true"], [false, "false"]] : obj.keys,
			node.appendChild(doc.createXULElement("menupopup")), pref
		);
		return node;
	},
	createRadios(doc, vals, popup, pref){ for(var arr of vals){
		var [val, lab, key, hint,,alt] = arr;
		var menuitem = doc.createXULElement("menuitem");
		with (menuitem)
			setAttribute("type","radio"), setAttribute("closemenu","none"), setAttribute("label", popup.parentNode.pref.vals[val] = lab), key && setAttribute("accesskey", key); menuitem.alt = false;
		var info = (trg, vl, inf) => {
			var tip = trg.val = vl === "" ? F.r : vl;
			if(inf) tip += "\n" + inf;
			trg.tooltipText = `${tip != undefined ? tip +"\n\n" : ""}`+ (
				menuitem.alt ? "Клик в главной строке откроет правку опции" : F.f);
		}
		if(alt)
			menuitem.opt = alt,
			menuitem.alt = (trg) => {
				delete pref.vals[trg.val];
				try{var k = trg.val = pref.get(trg.opt);} catch{k = trg.val}
				pref.set(trg.opt, k), pref.vals[trg.val] = F.g;
				info(trg, k, trg.hint);	return k;
			}
		menuitem.hint = hint, info(menuitem, val, hint);
		popup.append(menuitem);
	}},
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
	regexpRefresh: /^(?:view-source:)?(?:https?|ftp)/,
	maybeRe(node, fe){ var {pref} = node, win = node.ownerGlobal;
		if("restart" in pref){
			if(UcfGlob.maybeRestart(pref.restart)) return;
		}
		else this.popupshowing(fe, node.parentNode);
		if("refresh" in pref){
			if(this.regexpRefresh.test(win.gBrowser.currentURI.spec))
				pref.refresh ? BrowserEx("reloadSkipCache") : BrowserEx("reload");
		}
	},
	maybeClosePopup(e, trg){
		(e.shiftKey || e.button == 1) || trg.parentNode.hidePopup();
	},
	upd(node){ //перед открытием
		var {pref} = node, def = false, user = false, val; //если опция не найдена
		if(prefs.getPrefType(pref.pref) != prefs.PREF_INVALID){
			try {
				val = pref.defVal = prefs.getDefaultBranch("")[pref.get.name](pref.pref); def = true; //опция по-умолчанию получена
			} catch {def = false}
			user = prefs.prefHasUserValue(pref.pref); //Boolean
			if(user) try {
				val = pref.get(pref.pref, undefined);
			} catch {}
		}
		if(val == pref.val && def == pref.def && user == pref.user) return;
		pref.val = val; pref.def = def; pref.user = user;
		var exists = def || user;
		if(!exists && pref.undef) //опции нет ? вернуть default
			val = pref.undef[0];
		var hint = val != undefined ? val === "" ? F.r : val : "Эта опция не указана";
		hint += "\n" + pref.pref; //если пусто: hints.get(pref.pref);
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
		var menu = trg.closest("menu");
		if(!menu || !menu.pref) return;
		var newVal = trg.val;
		if(trg.alt) newVal = trg.alt(trg);
		this.maybeClosePopup(e, menu);
		menu.pref.code && eval(menu.pref.code); //run1
		if(newVal != menu.pref.val){
			menu.pref.set(menu.pref.pref, newVal);
			this.maybeRe(menu, true);
		}
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

})
(()=>{ //перенос кода в конец
var ua = 'Правый клик: ввод строки вида "Заголовок ║ Java-код"\n\n|◨ правый клик мыши: вторая команда|◨ правый клик: Сброс ◧ Открыть опцию ⟳ Обновить ↯ Перезапуск|Запрещённые сайты через VPN|Захват цвета в Буфер обмена. Курсор: сдвиг на 1 точку|◧ + Shift, Колёсико: не закрывать|ваши данные…|💾 кэш, данные сайтов, куки занимают |⚡️ Запрещено сохранять логины и пароли|↯ Не запоминать историю посещений|↯ Удалять историю посещений, закрывая браузер|☀ Яркость сайтов |по-умолчанию|SingleFile (Alt+Ctrl+S)\nСохранить сайт в единый Html|Video DownloadHelper\nСкачивание проигрываемого видео|\tопции UserChromeFiles\n◨ держать\tОтладка дополнений\nAlt + x\t\tзапуск скрипта User.js|Ошибка файла — |[ пустая строка ]|chrome://user_chrome_files/content/|browser.safebrowsing.downloads.remote.block_dangerous|extensions.user_chrome_files.|permissions.default.image|https://p.thenewone.lol:8443/proxy.pac|network.proxy.type|network.proxy.autoconfig_url|general.useragent.override|pageAction-urlbar-|tabbrowser-tab|tabs-newtab-button|downloads-button|unified-extensions-button|favdirs-button|Mozilla/5.0 (|Macintosh; Intel Mac OS X 10.15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0 YaBrowser/22.5.0.1916 Yowser/2.5 Safari/537.36|identity-box|victor-dobrov.narod.ru/help-FF.html|_2495d258-41e7-4cd5-bc7d-ac15981f064e_|print-button|reader-mode-button|reload-button|tracking-protection-icon-container|PanelUI-menu-button|QuickToggle|Attributes-Inspector|dom.event.clipboardevents.enabled|star-button-box|browser.cache.memory.enable|browser.cache.disk.enable|browser.cache.disk.smart_size.enabled|chrome://browser/skin/canvas-blocked.svg|browser.cache.memory.max_entry_size'.split('|'),
io = "chrome://devtools/skin/images/", F = {Z: io, id: "ucf_hookExpert",
	os: AppConstants.platform, ver: Services.appinfo.version.replace(/-.*/,''),
	tc(m = "⌘",w = "Ctrl+"){return this.os == "macosx" ? m : w}, reos: /_(?:win|linux|macosx)$/,
	eye: io +"command-eyedropper.svg",
	dir: io +"folder.svg", opt: io +"settings.svg", nul: io +"blocked.svg", //"tool-dom.svg"
	ok: io +"check.svg", no: io +"close.svg", sec: io +"security-state-insecure.svg",
	ai: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4TC8AAAAvD8ADAAoGbSM5Ov6k774XCPFP/0/03/8JGPxzroIzuOW06Ih60Genn1S/gHe+BgA=",
	qt: "data:image/webp;base64,UklGRkYCAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSJcAAAANcGJr25S8mH4SNGxAgsguPCZ0BcMOiDSNRpvVaCTa3AI2qm2e2ofz7OuwgIiYgMzb4kVjGvegnQFAwXgFVnvcOmtnMJtutAa3Vo4mhRMDpWq8AjfU+yQoYf1/oTkTIdUrknKswNQ5yAdDzqgr4CYbsJWQfEyEU5QNEl2eKFM2AAIbjmSIMjwXPGyEdj6Bdn4mj9KO63sAAFZQOCCIAQAAdAgAnQEqGAAYAD6dRppKgoCqgAE4lsAKwgisgG27uzPePSvBIu/Pr0HJqW+AfoAIHl2DrAnRo/G3JBpTx8yE7L6LFQyD+yUNvuRYAAD+7mwmpaoBcsJ1hVKsMI2ucqid8qndm+WEvH4l4il6lA8FPscgnrRHrnSjjyNcfUV21+TkfqOWKou2UvVsZSl1z+jKs760Vij5XCWF9Uo6TZAhKfrJpeILyQYwq2Ee/g1uyEH/dJMI/91DsVpI6i2vV/Jqpd4/KniJtTm1woLvaotA2ikt3eeBaqlHf8WPe++lSWS7fETjgvzzbflp0Rj+v23kbb9e/VjUcPaD83shRuwzEo6CAO/AGxE+Zwbvv9NDsQT6T+S4CCDOFTuMRVv9/0E4P+uK+Vc3bMfQQD05gY/fes+ZX6ZHkvFdMn7zX8LMVvI59p7F806HPD2lBjs4lWWhQ5ckJDNflZL49370shr3/Q9uMJN9i/NVCu4OT7K3+4+/RkAMnjuY09u+3i4y4CldQG789iIAAAA="
}, Last, Mus = {};
['titlebar-button.titlebar-close',,'zoompage-we_dw-dev-',,'_531906d3-e22f-4a6c-a102-8057b88a1a63_-',,'_b9db16a4-6edc-47ec-a1f4-b86292ed211d_-'].forEach((c,i)=>{ //addons
if(c){F[i] = i == 0 ? c : c +"BAP"; F[i+1] = i == 0 ? c.replace("."," ") : c +"browser-action";}});
ua.forEach((c,i)=>{
	if(i == 0) k = 97; if(i == 26) k = 39; F[String.fromCharCode(i+k)] = c;
}); F.as = F.s +"custom_scripts/"+ F.R +".js";
var UcfGlob = Cu.getGlobalForObject(Cu)[Symbol.for("UcfGlob")], //из ucb_SaveHTML
{prefs, io} = Services, {Status, Pref} = UcfGlob, ua = `"/usr/bin/osmo"`; //linux
if(F.os == "win") ua = `"C:\\Windows\\system32\\StikyNot.exe"` //ваши команды
else if(F.os == "macosx") ua = `"/usr/bin/open","-b","com.apple.Stickies"`;
F.run = `запуск скрипта User.js ║userjs(btn) ║приложение «Записки» ║UcfGlob.RunwA(${ua})`;
var Exp =()=>{
	return Number(prefs.getBoolPref(F.u +'expert',false))
},
tExp = (name,m = Exp(), t,z)=>{ //… {Общий︰Эксперт (m = 1)[︰…]}
	t = Tag[name]; z = t.match(/(\{)([\s\S]*?)(\})/gm);
	if(z) z.forEach((k,h) =>{ //текст зависит от режима
		h = k.split('︰'); if(h && h.length > m)
			t = t.replace(k,h[m].replace(/\{|\}/g,''));})
	return t;
},
ua = (real = false,uaa = F.z) => { //текущий, вшитый или ваш ЮзерАгент
	ttt = Pref(uaa); if (uaa != F.z) return ttt || F.G +"compatible; YandexBot/3.0; +http://yandex.com/bots)";
	prefs.clearUserPref(uaa); //костыль: сброс ЮзерАгент
	u = Cc["@mozilla.org/network/protocol;1?name=http"].getService(Ci.nsIHttpProtocolHandler).userAgent;
	ttt && Pref(uaa,ttt); ttt ||= u; if(real) ttt = u; return ttt;
},
fonts = arr => arr.map(n => [(n == arr[arr.length-1] ? null : n), n]), //array с вложениями
serif = fonts("Arial|Roboto|Cantarell|DejaVu Sans|PT Serif|Segoe UI|Ubuntu|Cambria|Fira Sans|Georgia|Noto Sans|Calibri|Times".split('|')), sans = [["PT Sans","PT Sans"], ...serif];
});