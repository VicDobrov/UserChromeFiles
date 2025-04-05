/* hookMouseKeys 3.9 © Dobrov, идеи Dumby. Нужен ucb_SaveHTML.mjs
правьте Подсказки, клики Mouse, сочетания Keys, MyMenu, Setup… */

(async F=>{eval(F.toString().slice(4)); var Tag = {[F.D]: //Tooltips кнопок, меню: читай help.html
`{
◉ колёсико	↓ папка [Загрузки]
◨ правый клик ➜ Сохранить сайт
◉ колёсико на Фото ➜ Сохранить
	или перетащите фото вправо︰`+ //режимы {Простой︰Эксперт} разные действия|tooltips

`◧ лев. Держать  папка [Загрузки]\n
◨ правый клик (Alt+S) ➜ Сохранить\n    в единый Html всё / выделенное
◨ пр. + Shift	сайт в PDF
◉ колёсико, ${F.tc("Super","Ctrl+Shift")}+S как Текст\n
◧ дважды на Фото: найти Похожие
◧ лев. + Shift   Графика вкл/выкл}`,[F.P]: //PanelUI фон кнопки Blue Gray Red зел жёлт

`◧ лев. клик	меню Firefox ${F.ver}{\n︰
◧ + Shift	⤾ Вернуть вкладку\n}
◧ держать	✕ Закрыть браузер
◧ +Alt, ◉ ролик  Окно │ Развернуть

◨ прав. клик	⇲ Свернуть
± колёсико	Масштаб страницы {︰`/*эксперт*/+ `
◨ + Alt		Сведения о системе}`, [F.B]: //запуск команд: Menu.Dict.cmd()

`◉ + Shift		Закрыть вкладки слева
◉ ролик +Alt	…справа от активной`, [F.C]: //NewTab. SideBar открыт: код нажатий в консоль
`
◨ прав. клик	Вернуть вкладку
◉ колёсико	Оставить 1 текущую`, [F.I]: //identity-box

`◧ лев. держать	переключить сайт в Sidebar 
◨ правый клик	Копировать адрес в буфер {︰
◧ прав. + Alt		Настройки Proxy\n
◉ колёсико		Мобильный дизайн}
${F.l}`, [F.F]: //FavDir

`Левый клик	★ Закладки\n◧ лев. + Alt	Домашняя папка
Правый		⟳ История\n◨ + Alt		Папка установки\n
◉ колёсико	↓ Загрузки
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
Прав. клик		Адаптивный дизайн
Alt+R UserScript	Выбор части страницы
${F.l}`, "ReaderView": //disable tooltip: [F.C]: ``

`Клик мыши		Чтение в ReaderView
Прав. клик		Простой режим чтения\n`, [F.L]: //Print

`Распечатать страницу (${F.tc()}P)\n
правый клик	быстрая Печать
◉ ролик режим Простой | Эксперт
◧ держать	краткая Справка`, [F.N]: //Reload
`
◧ держать	Обновить всё
◨ прав. клик	Обновить без кэша`, [F.O]: //Щит

`клик мыши	Сведения о защите сайта\n
◨ правый клик	Куки и данные сайта{
◉ колёсико		открыть/закрыть в Sidebar︰
◉ колёсико		ServiceWorkers
◧ лев. + Shift	Медиа на странице\n
◧ лев. держать	⇆ Web-шрифты}
${F.l}`, "wheel-stop":
`\n
◉ Колёсико	Прервать обновления {︰
◨ п.держать	Антизапрет ⇆ Без прокси}`, [F[0]]: //☒ кроме Windows

`Закрыть Firefox ${F.ver}\n
◉ колёсико	вернуть вкладку
◧ держать	краткая Справка\n◨ пр. клик	⇲ Свернуть`, [F.R]:

`	Атрибут-Инспектор
◉ колёсико	Инструменты браузера\n\n◨ пр. клик`, [F.E]: //extensions

`Расширения ${F.vu}hMK ${F.hv}\n\n◨ прав. клик	меню «Действия»\n◧ лев. держать	Счётчик в кнопке\n\n◉ колёсико`}, //опции UCF

Menu = { //alt правый клик, mid колёсико, upd обновлять строку, имя курсивом: нет tooltip
	View: {
		lab: `Мобильный дизайн | для Чтения`, inf: `Автоизменяемые строки выделены\n`+ F.b +`\n◉ значок в адресе «Вид для Чтения»`,
		img: F.Z +"aboutdebugging-connect-icon.svg",
		alt(btn){ //вложенные Sub-меню запрещены
			doComm("key_toggleReaderMode", btn.ownerDocument)}, //штатный Режим чтения
		cmd(btn){
			doComm("key_responsiveDesignMode", btn.ownerDocument); //пункт меню с HotKey
			gBrowser.selectedBrowser.browsingContext.inRDMPane && BrowserEx("reload");},
		mid(){let p = "reader.parse-on-load.enabled"; Pref(p, !Pref(p)); BrowserEx("reload");}
	},
	Site: {lab: `сайт в единый HTML ${F.sb ? "| в SideBar" : ""}`, img: F.Z +"globe.svg",
			inf: `Колёсико: сохранить через SingleFile\nПравый клик: Сайт в боковую панель`,
		alt(trg, url){
			if(!F.sb) throw F.q +"ucf_SidebarTabs.js";
			if(F.sb._open) F.sb.toggle() //запомнить сайт
			else F.sb.setPanel(0, url || trg.url || "https://"+ F.J);},
		cmd(){HTML()}, mid(){HTML(true)},
		upd(){Status(this.url = URL())} //получить URL вкладки
	},
	Tab: {lab: `Вернуть вкладку | Обновить все`, inf: F.b, img: F.Z +"reload.svg",
		cmd(btn){btn.ownerGlobal.undoCloseTab()},
		alt(){
			with (gBrowser) selectAllTabs(),reloadMultiSelectedTabs(),clearMultiSelectedTabs()}
	},
	Fav: {lab: `Закладки 1-я строка ⇅ Последняя`,
		inf: `на Яндекс, если меню «Закладки» пустое\nправ. клик + Alt на кнопке Быстрых опций\nКолёсико: переключить авто-прокрутку страниц`,
		cmd(){
			toTab(FavItem())},
		alt(){toTab(FavItem(true))},
		mid(){let p = "general.autoScroll", d = !Pref(p);
			Pref(p, d); Status(p +" "+ d.toString().toUpperCase());}
	},
	Dict: { sep: 1, //сперва разделитель
		lab: `перевод Сайт | выделенный Текст`,
		cmd(){Translate()}
	},
	O: { men: 1, img: F.opt, //подменю, любая вложенность
		lab: `Опции ${F.o} | Страницы`, inf: `Правый клик: about-page`, alt(){toTab("about:about")},
		DwNew: {inf: `Авто-открытие списка`,
			cmd(){
				Mouse[F.D][1]()},
			upd(){
				this.label = `Загрузки | Поведение панели - ${Pref(F.v) ? "Улучшено" : "Обычное"}`;
			},
			alt(){ let n = Pref(F.v); Pref(F.v, !n);
				Status(`Подтверждение загрузки ${n ? "√ разреш" : "✘ запрещ"}ено`);}
		},
		"Выполнять скрипты Java": {inf: "Поддержка графики, рекламы\nдействия горячих клавиш",
			upd(){this.image = Pref("javascript.enabled") ? F.ok : F.no},
			cmd(){Pref("javascript.enabled", !Pref("javascript.enabled"))}
		},
		VPN: {sep: 1, lab: `Антизапрет | Настройки Proxy`, inf: "опция URL автонастройки прокси:\n"+ F.u +"vpn\n\nCensor Tracker только отключается",
			upd(){
				this.image = Pref(F.x) == 2 ? F.ok : F.no;
				Status("URL прокси: "+ F.vpn);
			},
			cmd(){switchProxy()},	alt(){CfgProxy()}
		},
		Remote: {inf: `Инструменты браузера`,
			cmd(chr = "devtools.chrome.enabled",rem = "devtools.debugger.remote-enabled"){
				if(!Pref(chr) || !Pref(rem))
					Pref(chr,true), Pref(rem,true);
				var {BrowserToolboxLauncher} = ChromeUtils.import("resource://devtools/client/framework/browser-toolbox/Launcher.jsm");
				BrowserToolboxLauncher.init();},
			upd(){this.label = `Удалённая отладка | Режим кнопок ${Exp() ? "Expert" : "Простой"}`},
			alt(){Expert()},
		},
		"Режим полной изоляции сайтов": {
			inf: `Сайт не «узнает» ваши действия в других вкладках`,
			cmd(){var p = "fission.autostart"; Pref(p, !Pref(p));},
			upd(){var i = F.sec;
				if(Pref("fission.autostart")) i = i.replace("-in","-");
				this.image = i;}
		},
		"Настройки профайлера": {sep: 1,
			cmd(){toTab('about:profiling')}
		},
		"Настройки UserChromeFiles": {img: F.opt, cmd(){UCF()}},
		DelCache: {lab: `Restart браузер, удалить кэш`, img: F.Z +"clear.svg",
			cmd(){
				if(!UcfAPI.maybeRestart(false, ()=>true)) return;
				Services.appinfo.invalidateCachesOnRestart();
				with(Services.startup) quit(eAttemptQuit | eRestart);}}
	},
	Pics: { alt(){ Pref(F.w, 3); BrowserEx("reload");}, inf: 1, //fix font
		upd(){
			var val = Pref(F.w), s = val == 1, i = 'chrome://browser/skin/canvas-blocked.svg';
			this.label = `Графика страниц – ${s ? "включена" : val == 3 ? "только сайт" : "запрещена"}`;
			this.image = s ? i.replace("-blocked","") : i || F.nul;
			this.tooltipText = `правый Клик: кроме сторонних\n${F.w} = ${val}`;
		},
		cmd(){ var n = Pref(F.w) != 1; Pref(F.w, n ? 1 : 2);
			mode_skin(); BrowserEx("reload");
			Status(`Загрузка изображений ${n ? "√ разреш" : "✘ запрещ"}ено`,3);}
	},
	Info: { inf: 1, //на кнопке
		async upd(){ var e, n = "", i = F.sec; a = await BBSarr();
			this.image = a[1] > 0 ? i.replace("-in","-") : i;
			this.tooltipText = "◨ правый клик: изменить вывод\n◉ колёсико: обновить счётчик ↯";
			this.label = a[5].split('\n')[0] || F.h[6];
		},
		alt(){ aboutCfg(F.u +"bbs");
			Status("{Дни[:sec] | Сайт | Имя | Меню %s} обновление ждать 5 мин",15);
			Menu.Info.mid(0,2e5);
		},
		mid(btn, t){ BBS(); setTimeout(()=> BBSupd(1), t || 1e3);
		},
		cmd(btn){try{var args = {filterString: gBrowser.currentURI.host};} catch{}
			LoginHelper.openPasswordManager(btn.ownerGlobal,args);}
	},
	EyeDrop: {lab: `Пипетка цвета | Диагностика`, img: F.eye, inf: F.b, sep: 1,
		cmd(btn){
			var url = `resource://devtools/shared/${parseInt(F.ver) > 95 ? "loader/" : ""}Loader.`;
			try{var exp = ChromeUtils.importESModule(url +"sys.mjs");} catch{exp = ChromeUtils.import(url +"jsm");}
			var obj = exp.require("devtools/client/menus").menuitems.find(menuitem => menuitem.id == "menu_eyedropper");
			(obj.oncommand.bind(null, {target: btn}))();
			UcfAPI.Flash(0,'rgba(100,0,225,0.1)',0, F.e);},
		alt(){toTab()}
	},
	"Краткая справка | Жесты, Кнопки": { inf: F.b, img: F.Z +"help.svg",
		alt(s = "ucf_mousedrag.js"){
			h = geId("nav-bar").ucf_mousedrag || F.q + s;
			h = `Перетащите фото вправо, чтобы сохранить\n\n`+ h +'\n\n'+ GetHelp();
			TabHtml(h.replace(/([\t| ].*\:)/g,"<strong>\$1</strong>"),"Справка – жесты, клики мыши");
		},
		cmd(){Help()}
	},
	App: { //и Run: правый клик правит код
		alt(){ Menu.Run.alt()},
		upd(){
			Menu.Run.upd(Menu.Run.exe(), this);
		},
		cmd(btn){eval(btn.run)}, img: F.Z +"tool-application.svg",
	},
	Run: {img: F.Z +"command-console.svg", //HotKey Alt+x
		exe(js = Pref([F.u +"menu", F.go])){
			js &&= js.split('║');
			if(Array.isArray(js) && js.length < 4)
				js = F.go.split('║'); //default
			Pref(F.u +"menu", js.join("║"));
			return F.js = js;
		},
		upd(js = F.js.slice(2,4), trg = this){
			trg.label = js[0].trim(); trg.tooltipText = F.a + crop(js[1], 70); trg.run = js[1];
		},
		alt(){aboutCfg(F.u +"menu")}, //изменить
		cmd(btn){
			eval(btn.run || Menu.Run.exe()[3])},
		mid(b = "viewHistorySidebar"){
			(window.SidebarController || window.SidebarUI).toggle(b)}
	}},

Keys = { //перехват-клавиш KeyA[_mod][_OS](e,t){код} и KeyB: "KeyA"
	KeyX_1(){ //Alt+X меню Действия старт посл. строки
		Menu.Run.cmd(geId().menupopup.lastChild)},
	KeyS_6(){saveSelToTxt()}, // Ctrl+Shift+S
	KeyS_15_macosx: "KeyS_6", // Super+S или Windows: KeyA_win
	KeyS_1(e,t){HTML()}, //Alt+S | e: Event, t: gBrowser.selectedTab
	KeyB_5(e){Menu.Site.alt(e, URL())}, //Ctrl+Alt+B
	F1(e){Menu.View.alt(e)}, //для чтения
/*
	mod = metaKey*8 + ctrlKey*4 + shiftKey*2 + altKey
	mod + I в конце: лишь в полях ввода, «i» кроме полей ввода
	1я буква строчная: передать нажатия, запрет preventDefault
	отделять «_» от кода при модификаторах и/или «iI»-флаг */
},
ps = Ci.nsIPrintSettings, pdf = { // опции экспорта в PDF
	paperWidth: 8.5, paperHeight: 11,
	paperSizeUnit: ps.kPaperSizeInches, //kPaperSizeMillimeters
	marginLeft: .2, marginRight: .2, marginTop: .2, marginBottom: .2,
	edgeLeft: .1, edgeRight: .1, edgeTop: 0, edgeBottom: 0,
	headerStrLeft: "&T", headerStrCenter: "", headerStrRight: "&U",
	footerStrLeft: "", footerStrCenter: "", footerStrRight: "",
	printerName: "", printSilent: true, printBGColors: true, printBGImages: false,
	// orientation: ps.kPortraitOrientation, // kLandscapeOrientation
	// scaling: 1, shrinkToFit: true, // overrides scaling
	// isInitializedFromPrefs: false, isInitializedFromPrinter: false,
	printToFile: true, outputDestination: ps.kOutputDestinationFile, //outputFormat: ps.kOutputFormatPDF, 
},
Mouse = { // Meta*64 Ctrl*32 Шифт*16 Alt*8 (Wh ? 2 : But*128) long*1
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
			for(var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop() },
		257(){switchProxy()}
	},
	[F.N]: { //reload
		1(){Menu.Tab.alt()}, //д
		128(){for(var i = 0; i < gBrowser.tabs.length; i++) gBrowser.getBrowserAtIndex(i).stop()}, //СМ
		256(){BrowserEx("reloadSkipCache")}, //R
		257(){switchProxy()} //дR
	},
	"appMenu-print-button2": { //меню Печать…
		1(){Help()}, 128(){Expert()},
		256(){doComm()}
	},
	[F.L]: { //print
		1(){Help()}, //д
		128(){Expert()},
		256(){doComm()} //R print
	},
	[F.T]: { //★
		1(){Translate()}, //держать
		8(){ //R+Alt
			window.PlacesCommandHook.showPlacesOrganizer("BookmarksToolbar") }, //библиотека
		128(){toTab(FavItem())},
		129(){ //дС
			toTab(FavItem(true))},
		256(){toFav()}
	},
	[F.D]: {mousedownTarget: true, //не передавать нажатия дальше
		1(){ Downloads.getPreferredDownloadsDirectory().then(
				path => FileUtils.File(path).launch(),Cu.reportError)}, //д
		16(){Menu.Pics.cmd()},//+Shift
		128(){Exp()
			? saveSelToTxt() : //сохранить|выделен. как .txt
			Downloads.getSystemDownloadsDirectory().then(path => FileUtils.File(path).launch(),Cu.reportError)},
		256(){HTML()}, //R web
		272(){PDF()} //R+Shift
	},
	[F.P]: {mousedownTarget: true, //PanelUI
		2(trg,forward){zoom(forward)}, //wheel
		1(btn){goQuitApplication(btn)}, //д
		16(btn){btn.ownerGlobal.undoCloseTab()}, //L+Shift
		8(){windowState != STATE_MAXIMIZED ? maximize() : restore()}, //L+Alt
		128(){windowState != STATE_MAXIMIZED ? maximize() : restore()},
		129(){BrowserEx("fullScreen")}, //дС
		136(){this[129]()}, //С+Alt
		144(){Mouse[F.Q][136]()}, //C+Shift
		// 256(){minimize()},
		264(){toTab()}, //R+Alt
		272(btn){btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("History")} //R+Shift
	},
	[F.I]: { //замок
		2(trg,forward){bright(trg,forward,5)}, //яркость
		10(trg,forward){bright(trg,forward)}, //Alt
		1(btn){Menu.Site.alt(btn, URL())},
		16(btn){Mouse[F.I][1](btn)}, //Shift
		8(){UCF()}, //+Alt
		128(btn){Menu.View.cmd(btn)},
		256(){gClipboard.write(URL());
			UcfAPI.Flash(0,'rgba(240,176,0,0.5)',0,"в буфере: "+ gURLBar.value.slice(0,80));},
		264(){CfgProxy()} //R+Alt
	},
	[F.O]: { //щит
		2(trg,forward){bright(trg,forward)},
		1(){Mouse[F.Q][136]()}, //д Шрифты
		16(btn){ //Shift
			BrowserEx("pageInfo", btn,"mediaTab") //securityTab feed… perm…
		},
		256(btn){Cookies()}, //R куки
		128(btn){Exp() ? toTab("about:serviceworkers") : Menu.Site.alt(btn, URL())} //С
	},
	[F.F]: { //favdirs кнопка
		0(btn){
			Menu.Run.mid("viewBookmarksSidebar")},
		256(btn){
			Menu.Run.mid()},
		8(){dirGet("Home")}, //Alt
		128(btn){
			btn.ownerGlobal.PlacesCommandHook.showPlacesOrganizer("Downloads")},
		136(){ //C+Alt
			dirGet("UChrm", "user_chrome_files")},
		264(){ //R+Alt
			dirGet("GreD")}
	},
	[F[0]]: { //title-close
		1(){Help()},
		128(btn){btn.ownerGlobal.undoCloseTab()},
		256(){minimize()}
	},
	[F.E]: {mousedownTarget: true,
		1(){Menu.Info.alt()}, //д
		129(){Menu.O.DelCache.cmd()}, //дС
		128(btn){btn.id && UCF()}, //UCFprefs
		256(btn, n){
			with(geId())
				config.menu_open_close(btn, menupopup);
		},
		257(){toTab('about:debugging#/runtime/this-firefox')} //дR
	},
	[F.Q]: {mousedownTarget: true,
		M(btn, n){
			btn.cmd[n] && btn.cmd[n](btn);
			try{btn.menupopup.hidePopup();} catch{}
		},
		0(btn, n){ //L
			if (btn.className == "menu-iconic"){
				aboutCfg(btn.pref.pref); //go параметр
				Last && Last.hidePopup();
				return;
			};
			var bar = geId("ucf-additional-vertical-bar");
			bar && window.setToolbarVisibility(bar,geId("sidebar-box").hidden);
			Menu.Run.mid();
			mode_skin();
		},
		2(trg,forward){zoom(forward)}, //wheel
		1(btn){ //д
			btn.id == F.Q && toTab("about:newtab");
		},
		8(){toTab(F.X +'places/places.xhtml')}, //L+Alt
		264(){ //R+Alt
			toTab(FavItem(true))},
		16(btn){if (btn.id == F.Q) zoom(0,1)}, //L+Shift
		24(btn){if (btn.id == F.Q) CfgProxy()}, //Shift+Alt
		128(btn, n, trg){ //C Menu-1
			btn.menupopup.openPopup(trg || btn, "after_start");
		},
		129(btn){
			if(btn.id) Userjs(btn);
		}, //дC консоль
		256(btn, n){ //SetupMenu
			btn.config.menu_open_close(btn, btn.config);
			try{btn.parentNode.hidePopup();} catch{}
		},
		257(btn){ //дR
			btn.id == F.Q && Menu.EyeDrop.cmd(btn); //линза
		},
		136(){ //С+Alt
			var f = Pref(F.n) ? 0 : 1;
			Pref(F.n,f); zoom(0,0,0,(f > 0) ? " + Web-шрифты" : ""); BrowserEx("reload");}
	},
	[F.R]: {mousedownTarget: true, //AttrView
		0(){Status("Ctrl+Shift+C - copy tooltip's contents")},
		128(){Menu.O.Remote.cmd()}, //C
		256(){UCF()},
		257(){Mouse[F.E][257]()}
	},
	[F.M]: { //➿
		2(trg,forward){bright(trg,forward,5)}, //яркость
		256(btn){Menu.View.cmd(btn)} //MobileView
	},
	[F.A + F.K]: { //ReaderView
		2(trg,forward){bright(trg,forward,5)}, //яркость по wheel ±
		128(btn){Mouse[F.M][256](btn)},
		256(btn){Menu.View.alt(btn)}
	},
	[F[2]]: {2(trg,forward){zoom(forward)}}, //zoompage
	[F[3]]: {2(){Mouse[F[2]][2]()}},
}; Mouse["add-ons-button"] = Mouse[F.E];
Object.keys(Mouse).forEach((k) =>{Mus["."+ k] = Mus["#"+ k] = Mouse[k]});

var Setup = [ //меню. refresh=true ⟳ Обновить без кэша. restart=false ↯ Без запроса, Изменено: курсив
((a)=>{return{ //pref,lab,key,hint,[val,str],code | keys:val,lab,dat,+hint,code,pref_my | icon:значок
	pref: ["dom.disable_open_during_load", "Всплывающие окна",,a +"\nЗапрос страниц о закрытии\n\nОпции "+ F.m +": Cерые"], Def3el: true, Yellow: false,
	keys: [[true, "Блокировать",,,`Pref('${a}',true)`], [false, "Разрешить",,,`Pref('${a}',false)`]]
}})("dom.disable_beforeunload"),
{ //серый значок: опция не задана|или Gray. Сирень: юзер, Жёлт: Yellow, Не равно Def3el: Красный, Обводка: не по-умолчанию
	pref: [F.t, "Опасные файлы, сайты",,F.t +"_host"], Def3el: true, Yellow: false,
	keys: [[true, "Запрет",,,`Pref(F.t +'_host',true)`], [false, "Открыть",,,`Pref(F.t +'_host',false)`]]
},{
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
	pref: ["network.cookie.cookieBehavior", "Получать куки",,"Персональные настройки посещённых сайтов"], 
		Def3el: 3, Yellow: 0, Blue: 4,
	keys: [[3, "посещённые сайты"], [4, "кроме трекеров"], [0, "со всех сайтов"], [1, "кроме сторонних"], [2, "никогда"]]
},{
	pref: ["network.http.sendRefererHeader", "Referer для чего"], Def3el: 2, Yellow: 1,
	keys: [[0, "Ни для чего", "0"], [1, "Только ссылки", "1"], [2, "Ссылки, графика", "2"]]
},{
	pref: [F.y, "Прокси (VPN)", "п", F.x +"\n\nПереключение сетевых настроек"],
		Def3el: "localhost", Yellow: F.vpn, Gray: "", refresh: true,
	keys: [
		["localhost", "системный", "0",,`Pref(F.x,5)`],
		[F.vpn, "АнтиЗапрет", "2", "Надёжный доступ на заблокированные сайты\n«Режим прокси» меняется на 2",
			`Pref(F.x,2)`],
		["127.0.0.1", "tor или opera-proxy", "1", "Включите одну из служб",
			`Pref(F.x,1)`],
		[Pref(["user.pacfile", "file:///etc/proxy.pac"]), "user .pac файл", "4", F.o +" pacfile"]] //нужен диалог выбора pac-файла
},{
	pref: ["network.trr.mode", "DNS через HttpS",,"Шифрование DNS-трафика для\nзащиты персональных данных"], Def3el: 2, Yellow: 3, Gray: 0, Blue: 1, refresh: true,
	keys: [
		[0, "автоматически", "0", "DNS/DoH, выбирается самый быстрый"], [2, "DoH плюс DNS", "2", "Повышенная защита"], [3, "только DoH", "3", "Максимум защиты"], [5, "отключить", "5"]]
},null,{
	pref: [F.n, "Загружать шрифты страниц"], Def3el: 1, Yellow: 0, refresh: true,
	keys: [[1, "Да"], [0, "Нет"]]
},{
	pref: ["font.name.sans-serif.x-cyrillic", "Шрифт без засечек ",,"Также влияет на всплывающие подсказки\nСистемный: загрузка шрифтов документа"], Def3el: "", Yellow: "Roboto", Gray: "Arial", keys: sans
},{
	pref: ["font.name.serif.x-cyrillic", "Шрифт с засечками"], Def3el: "", Yellow: "Arial", keys: serif
},((a,b)=>{return {
	pref: ["gfx.webrender.force-disabled", "Ускорять отрисовку страниц",,a +"\n"+ b +"\n\nАппаратная отрисовка видеокартой,\nотключите при проблемах с графикой"],
	Def3el: false, Yellow: true, Gray: undefined, restart: true, keys: [
		[false, "Да",,,`[['${a}', true], ['${b}', true]].map((l) =>{Pref(...l)})`],
		[true, "Нет",,,`[['${a}', false],['${b}', false]].map((l) =>{Pref(...l)})`]]
}})("gfx.webrender.compositor.force-enabled","gfx.webrender.all"),
null,{
	pref: ["media.peerconnection.enabled", "WebRTC ваш реальный IP",,"\nВидеосвязь через браузер"], Yellow: false,
	keys: [[true, "Выдать"], [false, "Скрыть"]]
},{
	pref: ["media.autoplay.default", "Авто-play аудио/видео"], Def3el: 0, Yellow: 2, Gray: 5, refresh: true,
	keys: [
		[0, "Разрешить", "0"], [2, "Спрашивать", "2"], [1, "Запретить", "1"], [5, "Блокировать", "5"]]
},{
	pref: ["dom.storage.enabled", "Локальное хранилище",,"Сохранение персональных данных, по\nкоторым вас можно идентифицировать"],
	Def3el: false, Yellow: true,
	keys: [[true, "Разрешить"], [false, "Запретить"]]
},
((a)=>{return {
	pref: ["privacy.resistFingerprinting", "Изоляция Firstparty-Fingerprint",,a +"\n\nЗащита данных пользователя также\nзапрещает запоминать размер окна"], Def3el: false,
	keys: [[true, "Да",,"Защита от слежки",`Pref('${a}',true)`], [false, "Нет",,,`Pref('${a}',false)`]]
}})("privacy.firstparty.isolate"),
null,{
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
	pref: [F.z, "User Agent",,"Вид страниц для устройств", [ua(1),"встроенный"]],
		refresh: true, Def3el: ua(1), Yellow: F.G + F.H,
	keys: [
	[ua(0, F.z +"_my"), F.g,,,,F.z +"_my"], //alt-ключ
	[F.G + F.H,"Yandex MacOS"],
	["Opera/9.80 (Windows NT 6.2; Win64; x64) Presto/2.12 Version/12.16", "Opera12 W8"],
	[F.G +"Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", "MSIE 6.0 Windows"],
	[F.G +"PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)", "Playstation 4"],
	[F.G +"compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; GT-I8350)", "Windows Phone"],
	[F.G +"compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "GoogleBot"],
	[ua(1), F.m,,,`prefs.clearUserPref(F.z)`]] //штатный ЮзерАгент
}],

Over = { //изменить подсказки под мышью
get [F.P](){ //PanelUI delete this[…];
	mode_skin(); if(Pref("signon.rememberSignons"))
		Services.cache2.asyncGetDiskConsumption({onNetworkCacheDiskConsumption(bytes){
			Status("Кэш, данные сайтов, куки занимают " + formatBytes(bytes),3) //вывод объёма кэша
		}, QueryInterface: ChromeUtils.generateQI(["nsISupportsWeakReference","nsICacheStorageConsumptionObserver"])})
	else Status(F.i,2); //не хранить пароли
	return Te(F.P);
},
Prev(o, trg = window.event?.target, p = "browser.tabs.hoverPreview.enabled"){
	o ||= trg.label; if(Pref(p)) o = ""; trg.tooltipText = o;
},
get [F.B](){this.Prev()},
get [F.B +"s"](){ //tab
	if(Tag[F.B]) this.Prev(Tag[F.B] +'\n± колёсико	перебор вкладок');
},
get [F.C](){ //newtab
	return GetDynamicShortcutTooltipText(F.C) + Te(F.C,'\n') + Te(F.B,'\n\n');
},
get "stop-button"(){
	return GetDynamicShortcutTooltipText("stop-button") + Te("wheel-stop");
},
get [F.N](){ mode_skin('');
	return GetDynamicShortcutTooltipText(F.N) + Te(F.N,'\n') + Te("wheel-stop");
},
get [F.D](){var dw = dirGet(0,1);
	if(dw) Status(`${Pref(F.w) > 1 ? "\u{26A1} Графика отключена," : "💾 папка"} Загрузки: `+ crop(dw, 196,'…'));
	return GetDynamicShortcutTooltipText(F.D) + Te(F.D,'\n');
},
get "urlbar-input"(){
	let trg = window.event?.target, clip = this.clipboard;
	if(trg)
		trg.title = this.title +"\n\nБуфер обмена текст:\n"+ crop(clip,50,'\n',0,14);
	Status("Ролик мыши: очистить панель, 📋 "+ crop(clip,128),3)
},
[F.L]: Te(F.L), "appMenu-print-button2": Te(F.L), //print
get [F[1]](){ //title-close
	Status("правый клик: Свернуть, колёсико: Восстановить вкладку",3); return Te(F[0]);
}, 
get [F.T](){ //⭑
	var t = `${Pref("dom.disable_open_during_load") ? "Запрет" : "↯ Разреш"}ить всплывающие окна`;
	if(!Pref("places.history.enabled")) t = F.j;
	if(Pref("privacy.sanitize.sanitizeOnShutdown")) t = F.k;
	Status(t,3); return tooltip();
},
get "identity-icon-box"(){ //custom hint
	return tooltip_x(window.event.target, Te(F.I) + br_val());
},
get SessionManager(){Status("Период сохранения сессий в меню «Быстрые опции»");},
get [F.I](){Status(this.BrExp(),3)},
get [F.O](){Over[F.I]; //щит
	return tooltip_x(window.event.target, Te(F.O) + br_val());
},
get [F.Q](){
	var trg = window.event?.target;
	if(trg.id == F.Q)
		zoom(0,0,0,`, ${Pref("browser.tabs.loadInBackground") ? "Не выбирать" : "Переключаться в"} новые вкладки`)
	else if (trg.id)
			Status(F.c,9);
	try{trg.state = trg.config.state;} catch{} //SetupMenu
	if(!/open/.test(trg.state))
		return Te(F.Q)
	else trg.tooltipText = "";
},
get [F.A + F.K](){ //ReaderView
	return Tag["ReaderView"] + Tag[F.M] + br_val();
},
get [F.M](){ //reader
	return GetDynamicShortcutTooltipText(F.M) +"\n"+ Tag[F.M] + br_val();
},
async ozu(){var info = await ChromeUtils.requestProcInfo(), bytes = info.memory;
		for(var child of info.children) bytes += child.memory;
		Status("Занято ОЗУ ~"+ formatBytes(bytes/1.2));
},
get [F.R](){return Tag[F.R] + F.p},
get "add-ons-button"(){var s = Tag[F.E];
	return tooltip(window.event.target, s.replace(s.split("\n",1),"") + F.p);
},
get [F.E](){(window.event?.target).state = geId()?.menupopup.state;
	this.ozu();
	return Tag[F.E] + F.p.replace(/\n.*$/,'') + (F.pl ? "\n\n↯ "+ F.pl : "");
},
get [F[2]](){ //zoompage
	return tooltip_x(window.event.target,"⩉ Ролик ±	Изменить масштаб");
}, get [F[3]](){return Over[F[2]]},
[F[4]]: "SingleFile (Alt+Ctrl+S)\nСохранить сайт в единый Html", [F[5]]: this[F[4]],
[F[6]]: "Video DownloadHelper\nСкачивание играемого видео", [F[7]]: this[F[6]],
BrExp(t = F.l.slice(12) + br_val()){
	return t +` ${Exp() ? "Экспертный" : "Простой"} режим кнопок`},
get clipboard(){
	return (UcfAPI.readFromClip() || "/не текст/").replace(/[\r?\n?]|\s+/g,' ').trim();}
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
	return !geId(id).hidden;
},
keydown_win = e => { //перехват клавиш, учитывая поля ввода
	if (e.repeat) return; //выключить
	let KB = Keys[e.code]?.[e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey];
	if(KB) //есть HotKey
		for(let [func,p,i] of Keys[e.code]?.[e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey])
			if(i ^ docShell.isCommandEnabled("cmd_insertText"))
				p && e.preventDefault(), func(e, gBrowser.selectedTab); //запуск по сочетанию
	Debug() && //показ клавиш
		console.log('■ key '+ e.code + ('_'+ (e.metaKey*8 + e.ctrlKey*4 + e.shiftKey*2 + e.altKey)).replace('_0',''));
},
listener = { //действия мыши, перехват существующих
	handleEvent(e){
		if(this.skip || e.detail > 1) return;
		var trg = e.target; //trg.tagName;
		if(trg.id) Last = trg;
		if(e.type == "mouseenter"){
			let hint = Over[trg.id || trg.className] || Over[trg.parentNode.id];
			if(hint && trg.tooltipText != hint)
				trg.tooltipText = hint;
			return;
		}
		var sels = this.selectors.filter(this.filter, trg); //#id
		var {length} = sels; if (!length) return;
		var wheel = e.type.startsWith("w");
		let ctl = e.ctrlKey*32 + e.shiftKey*16 + e.altKey*8;
		var num = (!trg.id && trg.cmd) ? "M" : e.metaKey*4 + ctl + (wheel ? 2 : e.button*128);
		var obj = Mus[
			length > 1 && sels.find(this.find,num) || sels[0]
		];
		Debug() && console.log('■ '+ (e.button + ctl) +' but «'+ trg.id +'» key '+ num); //wheel дважды
		if(wheel) return obj[num]?.(trg, e.deltaY < 0);
// mousedown
		if(e.type.startsWith("m")){
			obj.mousedownTarget && this.stop(e);
			this.longPress = false; //+задержка при обычном клике
			if(++num in obj)
				this.mousedownTID = setTimeout(this.onLongPress, 333, trg,obj,num,e.button + ctl);
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
		obj[num](trg, e.button + ctl); //Click
	},
	find(sel){ //условия запуска ?
		return Mus[sel][this] || Mus[sel][this + 1];
	},
	filter(sel){return this.closest(sel); //родитель
	},
	get selectors(){
		this.onLongPress = (trg,obj,num,but) => {
			this.mousedownTID = null;
			this.longPress = true;
			obj[num](trg, but); //держать
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
events = ["click","mousedown","mouseenter","wheel"], //события для id:
els = document.querySelectorAll("#navigator-toolbox,#ucf-additional-vertical-bar,#appMenu-popup,#widget-overflow-mainView");
for(var el of els) for(var type of events) el.addEventListener(type,listener,true);
window.addEventListener("keydown",keydown_win,true);
setUnloadMap(F.id, this.destructor, this);
ucf_custom_script_win[F.id] = {destructor(){
	window.removeEventListener("keydown",keydown_win);
	for(var el of els) for(var type of events) el.removeEventListener(type,listener,true);
}};
var addDestructor = nextDestructor => { //для saveSelToTxt
	var {destructor} = ucf_custom_script_win[F.id];
	ucf_custom_script_win[F.id].destructor =()=> {
		try{destructor();} catch{}
		nextDestructor();
}},
mode_skin = (txt,t,s = 'unset',o = '') => {setTimeout(()=>{ //опции FF меняют подсветку кнопок
	var p = Pref(F.x), z = s; UcfAPI.Flash(F.O,p == 2 ? "magenta" : s,0,-1);
	UcfAPI.Flash(F.D,0, Pref(F.w) > 1 ? 'hue-rotate(180deg) drop-shadow(0px 0.5px 0px #F68)' : 'none',-1);
	if(Pref("dom.security.https_only_mode")) o = ', только HTTPS';
	let d = Pref("network.trr.mode"); if(d == 2 || d == 3) z = 'drop-shadow(0px 0.5px 0px #F8F)';
	UcfAPI.Flash(F.N,0,z,-1); t = [s,'Настройки сети - системные'];
	if(p == 0) t = ['saturate(0%) brightness(0.93)','Сеть работает без прокси'];
	else if(p == 1) t = ['sepia(100%) saturate(300%) brightness(0.9)', 'Ручная настройка прокси'];
	else if(p == 2) t = ['hue-rotate(120deg)',F.d], s = 'hue-rotate(270deg) brightness(95%)'; //фон PanelUI
	else if(p == 4) t = ['hue-rotate(250deg) saturate(150%)','Сеть - автонастройка прокси'];
	UcfAPI.Flash(F.P,0,t[0],-1), UcfAPI.Flash(F.Q,0,s,-1);
	z = ua(); if(z && (z != ua(1))) o = o +', чужой ЮзерАгент';
	z = Pref("network.proxy.no_proxies_on") ? ' + сайты-исключения' : '';
	typeof txt == "string" && Status(txt || "\u{26A1}"+ t[1] + z + o);},250)
}
mode_skin(); [['ui.prefersReducedMotion',0],['browser.download.alwaysOpenPanel',false], //animation Fix
['browser.download.autohideButton',false]].forEach((p)=>Pref(...p)); //lockPref опций
getIntPref = p => prefs.getIntPref(p,100),
tabr = F.u +"opacity",url = `resource://${tabr}/`, //bright tabs
sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
css = `@-moz-document url(${F.X}browser.xhtml){
	:is(${F.id})[rst] {filter: grayscale(1%) !important}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabbox {background-color: black !important}
	:root:not([chromehidden*=toolbar]) #tabbrowser-tabpanels {opacity:${getIntPref(tabr)/100} !important}}`;
io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler)
	.setSubstitution(tabr,io.newURI("data:text/css,"+ encodeURIComponent(css)));
sss.loadAndRegisterSheet(io.newURI(url),sss.USER_SHEET);
var st = InspectorUtils.getAllStyleSheets(document).find(s => s.href == url).cssRules[0].cssRules[2].style;
var observer =()=> st.setProperty("opacity", getIntPref(tabr)/100,"important");
prefs.addObserver(tabr,observer);
this.removePrefObs =()=> prefs.removeObserver(tabr,observer); //end bright

function BrowserEx(){
	let args = [...arguments], b = args.shift();
	eval(`${parseInt(Services.appinfo.version) < 126
		? "Browser"+ b[0].toUpperCase() + b.slice(1)
		: "BrowserCommands."+ b}(...args)`);
}
var css_USER = css => { //локальные функции
	var style = FileOk(css) ? io.newURI(css) : makeURI('data:text/css;charset=utf-8,'+ encodeURIComponent(css));
	var args = [style,sss.USER_SHEET]; //стиль: файл или CSS
	(this.css = !this.css) ? sss.loadAndRegisterSheet(...args) : sss.unregisterSheet(...args);
},
gClipboard = {write(str,ch = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)){
		(this.write = str => ch.copyStringToClipboard(str,Services.clipboard.kGlobalClipboard))(str);}
},
crop = (z = "",cut = 30,ch = '…\n',one = 1, lines) => { //обрезать/разбить текст
	z = z.match(new RegExp('.{1,'+ cut +'}','g')); cut = z[z.length-1];
	if(lines) z = z.slice(0,lines), z[z.length-1] != cut && z.push("… "+ cut);
	return one ? z[0] == cut ? z[0] : z[0] + ch +'…'+ cut : z.join(ch);
},
hints = new Map([ //опция Setup отсутствует ? вернуть строку
	[F.u +"savedirs", crop(dirGet(0,1),33,'…\n',0,3)], [F.z, ua(1)]]),
geId = i => document.getElementById(i || F.Q),
TabAct = e => e.closest(".tabbrowser-tab"),
toTab = (url = 'about:support', go) =>{ //открыть вкладку | закрыть её | выбрать
	for(var tab of gBrowser.visibleTabs)
		if(tab.linkedBrowser.currentURI.spec == url)
			{go ? gBrowser.selectedTab = tab : gBrowser.removeTab(tab); return;}
		gBrowser.addTrustedTab(url);
		gBrowser.selectedTab = gBrowser.visibleTabs[gBrowser.selectedTab._tPos +1];
},
Title = n => {try{return UcfAPI.TitlePath(n)[3];}
	catch {return document.title || gBrowser.contentTitle || gBrowser.selectedTab.label}
},
aboutCfg = (filter, win = window) => { //на опцию
	var setFilter = (e, wnd, input = (e?.target || wnd.content.document).getElementById("about-config-search")) => {try{
		if(e || input.value != filter) input.setUserInput(filter);} catch{}},
	found = win.switchToTabHavingURI(F.o, true, {relatedToCurrent: true,
		triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
	if (found) setFilter(null, win);
	else gBrowser.selectedBrowser.addEventListener("pageshow", setFilter, {once: true});
},
doComm = (key = "menu_print", root = document) => root.getElementById(key)?.doCommand(),
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
	(saveSelToTxt =()=> gBrowser.selectedBrowser.messageManager.loadFrameScript(url,false))();
},
HTML = (ext = false, sfile = geId(F[4])) => { //addon SingleFile
	try{if(!ext) {UcfAPI.SingleHTML(true,window); return};} catch{}
	if(!sfile) throw "нет расширения SingleFile"; sfile.click();
},
PDF =()=> { //сохранить страницу как PDF
	var ps = Cc["@mozilla.org/gfx/printsettings-service;1"].getService(Ci.nsIPrintSettingsService).createNewPrintSettings();
	for(var key in pdf) if (key in ps) ps[key] = pdf[key];
	(PDF = async() => {
		lab = Title(), path = UcfAPI.dirGet(0,lab,1) +".pdf";
		ps.toFileName = path;
		await gBrowser.selectedBrowser.browsingContext.print(ps); //сразу печать
		UcfAPI.Succes(path, 1, '√ PDF записан: '+ lab);
	})()
},
tooltip = (id = geId(F.T), s = "\n◨ правый клик: Без запроса") => {
	if(s && id && id.tooltipText.indexOf(s) == -1)
		return id.tooltipText + s;
},
tooltip_x = (trg,text = "", ttt = "") => {
	if(!trg.id.endsWith("x")){ //box
		ttt = (trg.hasAttribute("tooltiptext")) ? trg.ttt = trg.tooltipText : trg.ttt || "";
		if(ttt && ttt.indexOf(text) == -1) ttt += "\n\n";
		trg.removeAttribute("tooltiptext");
	}
	return ttt.indexOf(text) == -1 ? ttt + text : ttt;
},
bright = (trg,forward,step = 1,val) => { //wheel
	val ||= getIntPref(tabr) + (forward ? step : -step);
	val = val > 100 ? 100 : val < 15 ? 15 : val;
	Pref(tabr,val); trg.toggleAttribute("rst"); Status(F.l.slice(12) + val +"%",1);
},
br_val =()=> Pref([tabr,100]) +"%",
zoom = (forward,toggle = false, change = true,text = '') => {
	toggle ? ZoomManager.toggleZoom() : change ? forward ? FullZoom.enlarge() : FullZoom.reduce() : 0;
	Status("± Масштаб "+ Math.round(ZoomManager.zoom*100) +`%${Pref("browser.zoom.full") ? "" : " (только текст)"}` + text,3);
},
formatBytes = (b = 0,d = 1) => { //объём байт…Тб
	let i = Math.log2(b)/10|0; return parseFloat((b/1024**(i=i<=0?0:i)).toFixed(d))+`${i>0?'KMGT'[i-1]:''}b`;
},
Expert = (m = Boolean(Exp()), p = F.u +'expert') => {
	Pref(p,!m); Status(Over.BrExp(""),3);
},
GetHelp = (help = "") =>{ //события и подсказки кнопок
	Object.keys(Mouse).forEach((k,i) =>{
	if (k.match(new RegExp('add-ons|-button2|'+ F[3]))) return; let o, s = name = "";
	for(let id of Object.keys(Mouse[k])){
		let but = Math.round(id/128); if(isNaN(id - but)) continue;
		let m = ""; if(o != i)
			name = '\t'+ k.replace(/-icon-container|-_2.*/,'') +':\n', o = i, t = Te(k);
		if((id & (1<<0)) != 0) m += "Long "; if((id & (1<<1)) != 0) m += "Wheel ";
		if((id & (1<<3)) != 0) m += "Alt "; if((id & (1<<4)) != 0) m += "Shift ";
		if((id & (1<<5)) != 0) m += "Ctrl "; if((id & (1<<6)) != 0) m += "Meta ";
		s += 'Mouse '+ but + (m ? " + "+ m : "") +'\n';
	}; t &&= t.trim().replace(/\n\n/g,'\n') +'\n';
	help += name + t + s +'\n';
	}); return help;
},
TabHtml = (text, title = "Help") =>{
	toTab(`data:text/html;charset=utf-8,<!DOCTYPE html>
	<html><head>
	<center><big><strong>${title}</strong></big> (держать кнопку <strong>Печать: описание</strong>)</center>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<style type="text/css">
		body {background-color: #e5ebfa; color: #555;}
		.textcols { column-width: 32%; column-count: 3; column-gap: 2%;}
	</style>
	<center><h3>${title}</h3></center>
	<div class="textcols">
	${text.replace(/\t/g,'    ').replace(/[\r?\n?]/g,'<br>\n')}</div>
	</head><body><pre id="pre"></pre></body></html>
`.trim().replace(/\n/g,"%0A").replace(/\t/g,"%09").replace(/#/g,"%23"));
},
Userjs = (e, js = F.cs +"User.js") => {
	var s = FileOk(js, 1); if(!s) throw F.q + js; eval(s);
	Debug() && doComm("key_browserConsole"); //фокус на консоль
},
Help = (help = F.s +"help.html") => { //помощь
	(FileOk(help)) ? toTab(help) : toTab(F.J);
},
Icon = (c = '0c0')=>"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='a' x1='16' x2='16' y1='32' gradientUnits='userSpaceOnUse'><stop stop-color='%23"+ c +"'/><stop stop-color='%23fff' offset='.8'/></linearGradient><linearGradient id='b' x2='32' y1='16' gradientTransform='matrix(1 0 0 1 2 2)'><stop stop-opacity='.5'/></linearGradient></defs><circle cx='16' cy='16' r='15' fill='url(%23a)' stroke='url(%23b)' stroke-width='2'/></svg>",
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
	try{win.focus();} catch{
		win = window.openDialog(F.X + url, w, "chrome,dialog=no,centerscreen,resizable");
		win.addEventListener("DOMContentLoaded",() =>{win.document.documentElement.setAttribute("windowtype",w)},{once: true});
		await new Promise(resolve => win.windowRoot.addEventListener("DOMContentLoaded", resolve, {once: true}));
	}; return win;
},
CfgProxy = async() =>{var win = await Dialog(); win.opener = window; win.opener.gSubDialog = {_dialogs: []};
},
UCF = (p = "user_chrome") => {if (!FileOk(F.s + p +"/prefs.xhtml")) p = "options";
	window.switchToTabHavingURI(F.s + p +"/prefs.xhtml",true,{relatedToCurrent: true,triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
},
Cookies = async() =>{
	var tld = URL(0,1).match(/\w+\.\w+$/)[0] || gBrowser.selectedBrowser.currentURI.host;
	var sb = (await Dialog("preferences/dialogs/siteDataSettings.xhtml", "Browser:SiteDataSettings")).document.querySelector("#searchBox");
	sb.inputField.setUserInput(tld);
	await window.SiteDataManager.updateSites();
	setTimeout(() => sb.editor.selection.collapseToEnd(), 50);
},
switchProxy = (pac = F.vpn, n = 2, t = F.x, u = F.y) => {
	if(Pref(t) == 2) n = 5, pac = "localhost";
	Pref(t,n), Pref(u,pac);
	mode_skin(); //разный фон замка
	BrowserEx("reload");
},
FavItem = (end = false,def_url = 'ya.ru', s = 0,m = 1)=>{ //first|last url Меню закладок
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
toFav =(url = URL())=> {with (PlacesUtils.bookmarks){ //без диалога
	search({url}).then(async array => {
		if(array.length)
			try{await remove(array);} catch{}
		else
			try{await insert({
				url: io.newURI(url),
				title: (gBrowser.contentTitle || gBrowser.selectedTab.label || url),
				parentGuid: [() => toolbarGuid, () => menuGuid, () => unfiledGuid][prefs.getIntPref("bookmarksparentguid",0)](),
				index: DEFAULT_INDEX
			});} catch{}});
}},
Noun = (n = 3, w = ["день","дня ","дней"]) =>{ n = Math.abs(n);
	if (Number.isInteger(n)) { let opt = [2, 0, 1, 1, 1, 2];
		return w[(n % 100 > 4 && n % 100 < 20) ? 2 : opt[(n % 10 < 5) ? n % 10 : 5]];
	};return w[1];
},
Lang = (s, d = 0, u = F.ya) =>{ try{
	return s.replace("%s",d || "0").replace("%d",Noun(d)).replace("%u",u || F.yd || "")} catch{return s}
},
PassDays = async(url, you = "") =>{ //only url: нет имени пользователя
	let logins = await Services.logins.getAllLogins();
	try {var old = logins.filter(pas =>{
			if(pas.origin == url && pas.username == you) return pas;
		})[0].timePasswordChanged;
	} catch {return null} //no pass
	return Math.floor((Date.now() -old)/864e5); //прошло
},
BBSarr = async(url, you, max = 0, i = {P:1, B:2, S:3}, m = 0) => {
	var c = "indigo|blue|royalblue|dimgray|green|crimson|1".split('|'), d,n,t,
		a = Pref([F.u +"bbs","S|https://passport.yandex.ru|"+ F.yd]).split('|').map(s => s.trim());
	a = [a[1],a[2] || "",a[3],...a.shift().split(':')];
	if(url) a = [url, you, a[3], max]; //дни[:sec:id]/сайт/юзер/текст %s
	n = a[3] || max; t = a[1]; //опция | $USER
	a[1] &&= Lang(t.split(':')[0]); t &&= t.split(':')[1];
	F.ya = t || F.ya || F.yd; F.pu = a[4]; F.pb = a[5]; //upd-sec id
	d = await PassDays(...a);	//F.pl text F.pc Цвет F.pt TimeID F.pu Update
	a[1] ||= F.r; you = (d != null) ? "\n"+ URL(a[0],1) +", "+ a[1].replace(/@.*/,'') : "";
	m = isNaN(n) ? i[n[0].toUpperCase()] : 0; //режим BBS
	if(d != null) { if(!isNaN(n)) //n=число
			i = n - d, m = i > 0 ? 4 : 5;
		if(m == 3) i = d;
	} else if(m == 3) m = 0;
	if(!m) { i = ua(); //Alien | № addons
		if(i && (i != ua(1))) i = "aG!", m = 6; else {
			i = t = 0; for(var n of await AddonManager.getAddonsByTypes(["extension"]))
			if(!n.isBuiltin) if (n.isActive) i++; else t++;
			you = t ? ", откл "+ t : "";}
	}
	if(m == 1) i = (await Services.logins.getAllLogins()).length;
	if(m == 2) {
		n = PlacesUtils.history.DBConnection.createStatement("SELECT count(fk) FROM moz_bookmarks");
		n.executeStep(); i = n.getInt32(0); n.finalize();
	}
	a[2] = F.pl = Lang(a[2] || F.h[m], i) + you; //menu, hint
	return [d, i, c[m], ...a]; //дни count bg url you menu max upd id
},
BBS = (inf, bg, id) =>{try { //инфа в but
	var btn = geId(id || F.pb || F.E);
	if (/toolbarbut/.test(btn.className)) with(btn){
		if(inf == null) { clearTimeout(F.pt || BBSupd);
			removeAttribute("badge");
			return;}
		if(bg && bg != F.pc) {
			F.pc = bg || 1; // BBS(0, btn);
			setAttribute("badged", true);
			setAttribute("badgeStyle","color:white; background-color: "+ bg); //число: red
			textContent = ""; render();
		}
		bg && setAttribute("badge", inf.toString().replace(/^\W+/,'').substr(-3) || "");
	}; return btn;} catch {}
},
BBShow = async n =>{ //показ инфы
	let a = await BBSarr();
	n &&= a[1]; BBS(n, a[2]);
},
BBSupd = async i =>{ //таймер кнопки
	await BBShow(1);
	F.pt = setTimeout(BBSupd, (Number(F.pu) || 1800) *1e3); //30 мин
}

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
var s = geId(F.E); s?.setAttribute("removable", true); //unlock unified-extensions-button
s && geId("nav-bar-customization-target").append(s);

F.yd = dirGet("Home",1).replace(/.*[\\|\/]/,""); //$USER
await BBSupd(1); //F.pc

if(FileOk(F.as)) CustomizableUI.getWidget(F.R)?.label || CustomizableUI.createWidget({
	label:F.R.replace('-',' '), id:F.R, defaultArea: CustomizableUI.AREA_NAVBAR, localized: false,
	onCreated(btn){with(btn){
		setAttribute("image", "data:image/webp;base64,UklGRjwAAABXRUJQVlA4TC8AAAAvD8ADAAoGbSM5Ov6k774XCPFP/0/03/8JGPxzroIzuOW06Ih60Genn1S/gHe+BgA=");
		onmouseenter = onmouseleave = this.onmouse;
		setAttribute("oncommand","handleCommand(this)"); handleCommand = this.handleCommand;
	}},
	onmouse: e => e.target.focusedWindow = e.type.endsWith("r") && Services.wm.getMostRecentWindow(null),
	get handleCommand(){delete this.handleCommand;
		return this.handleCommand = b => {(b.handleCommand = new b.ownerGlobal.Function(this.code).bind(b))();}
	},
	get code(){delete this.code;
		try{var c = 'this.focusedWindow && this.focusedWindow.focus();\n'+ FileOk(F.as, 1)
		} catch{c = `console.error(F.q + ${F.as})`}
		return this.code = c;}
});

CustomizableUI.getWidget(F.F)?.label || CustomizableUI.createWidget({label:`Панели, Папки`,id: F.F,tooltiptext: Tag[F.F],
	onCreated(btn){btn.style.setProperty("list-style-image",`url(${F.dir})`)}
});

(async id => {
	geId(F.O).removeAttribute("tooltip"); geId("nav-bar").tooltip = F.id; //script OK

CustomizableUI.getWidget(id)?.label || (self => CustomizableUI.createWidget(self = {id,
	id: id, label: "Быстрые опции", localized: false, defaultArea: CustomizableUI.AREA_NAVBAR,
	onCreated(btn){
		btn.setAttribute("image", F.qt); btn.domParent = null;
		var doc = btn.ownerDocument;
		this.createPopup(doc, btn, "config", Setup);
		btn.linkedObject = this;
		for(var type of ["contextmenu", "command"])
			btn.setAttribute("on" + type, `linkedObject.${type}(event)`);
		var m = nn => doc.createXULElement(nn);
		var popup = m("menupopup"), menu = m("menuitem"); //UserMenu
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
	fill(o, popup){
		for(key in o){
			var val = o[key];
			if(typeof val != "object") continue;
			var {lab, inf, img, cmd, alt, sep, men, upd, mid} = val;
			sep && popup.append(this.m("menuseparator"));
			var name = men ? "menu" : "menuitem";
			var item = this.m(name); item.className = name;
			item.setAttribute("label", lab || key);
			if (inf) item.tooltipText = inf;
			else item.style.setProperty("font-style", "italic", "important");
			if(img || /this\.image.*=/.test(upd))
				item.className = name + "-iconic", item.setAttribute("image", img || F.io +"blocked.svg");
			item.alt = alt; item.cmd = []; item.cmd[0] = cmd; item.cmd[1] = mid; item.cmd[2] = alt;
			popup.append(item); //клики Mouse = {…
			if(upd){ //обновляемый пункт меню
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
		for(var type of ["popupshowing"])
			popup.setAttribute("on"+ type, `parentNode.linkedObject.${type}(event)`);
		for(var obj of data) popup.append(this.createElement(doc, obj));
		popup.menu_open_close = (btn, menu)=> { if(!btn.id) return;
			try{ setTimeout(()=> btn.state = menu.state, 200);} catch{}
			if(!/open/.test(btn.state)) menu.openPopup(btn,"after_start");}
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
				menuitem.alt ? "Клик вышестоящей строки откроет правку опции" : F.f);
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
	regexpRefresh: /^(?:view-source:)?(?:https?|ftp)/,
	maybeRe(node, fe){ var {pref} = node, win = node.ownerGlobal;
		if("restart" in pref){
			if(UcfAPI.maybeRestart(pref.restart)) return;
		}
		else this.popupshowing(fe, node.parentNode);
		if("refresh" in pref){
			if(this.regexpRefresh.test(win.gBrowser.currentURI.spec))
				pref.refresh ? BrowserEx("reloadSkipCache") : BrowserEx("reload");}
	},
	maybeClosePopup(e, trg){
		(e.shiftKey || e.button == 1) || trg.parentNode.hidePopup();
	},
	upd(node){ //перед открытием
		var {pref} = node, def = false, user = false, val; //если опция не найдена
		if(prefs.getPrefType(pref.pref) != prefs.PREF_INVALID){
			try{ val = pref.defVal = prefs.getDefaultBranch("")[pref.get.name](pref.pref); def = true; //OK по-умолчанию
			} catch {def = false}
			user = prefs.prefHasUserValue(pref.pref); //Boolean
			if(user) try{
				val = pref.get(pref.pref, undefined);
			} catch{}
		}
		if(val == pref.val && def == pref.def && user == pref.user) return;
		pref.val = val; pref.def = def; pref.user = user;
		var exists = def || user;
		if(!exists && pref.undef) //опции нет ? вернуть default
			val = pref.undef[0];
		var hint = val != undefined ? val === "" ? (hints.get(pref.pref) || F.r) : val : "Эта опция не указана";
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
var io = "chrome://devtools/skin/images/", F = {Z: io, id: "ucf_hookExpert",
	os: AppConstants.platform, ver: Services.appinfo.version.replace(/-.*/,''),
	tc(m = "⌘",w = "Ctrl+"){return this.os == "macosx" ? m : w}, reos: /_(?:win|linux|macosx)$/,
	eye: io +"command-eyedropper.svg",
	dir: io +"folder.svg", opt: io +"settings.svg", nul: io +"blocked.svg", //"tool-dom.svg"
	ok: io +"check.svg", no: io +"close.svg", sec: io +"security-state-insecure.svg",
	qt: "data:image/webp;base64,UklGRkYCAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSJcAAAANcGJr25S8mH4SNGxAgsguPCZ0BcMOiDSNRpvVaCTa3AI2qm2e2ofz7OuwgIiYgMzb4kVjGvegnQFAwXgFVnvcOmtnMJtutAa3Vo4mhRMDpWq8AjfU+yQoYf1/oTkTIdUrknKswNQ5yAdDzqgr4CYbsJWQfEyEU5QNEl2eKFM2AAIbjmSIMjwXPGyEdj6Bdn4mj9KO63sAAFZQOCCIAQAAdAgAnQEqGAAYAD6dRppKgoCqgAE4lsAKwgisgG27uzPePSvBIu/Pr0HJqW+AfoAIHl2DrAnRo/G3JBpTx8yE7L6LFQyD+yUNvuRYAAD+7mwmpaoBcsJ1hVKsMI2ucqid8qndm+WEvH4l4il6lA8FPscgnrRHrnSjjyNcfUV21+TkfqOWKou2UvVsZSl1z+jKs760Vij5XCWF9Uo6TZAhKfrJpeILyQYwq2Ee/g1uyEH/dJMI/91DsVpI6i2vV/Jqpd4/KniJtTm1woLvaotA2ikt3eeBaqlHf8WPe++lSWS7fETjgvzzbflp0Rj+v23kbb9e/VjUcPaD83shRuwzEo6CAO/AGxE+Zwbvv9NDsQT6T+S4CCDOFTuMRVv9/0E4P+uK+Vc3bMfQQD05gY/fes+ZX6ZHkvFdMn7zX8LMVvI59p7F806HPD2lBjs4lWWhQ5ckJDNflZL49370shr3/Q9uMJN9i/NVCu4OT7K3+4+/RkAMnjuY09u+3i4y4CldQG789iIAAAA="
}, Last, Mus = {};
['titlebar-button.titlebar-close',,'zoompage-we_dw-dev-',,'_531906d3-e22f-4a6c-a102-8057b88a1a63_-',,'_b9db16a4-6edc-47ec-a1f4-b86292ed211d_-'].forEach((c,i)=>{ //addons
	if(c) F[i] = i == 0 ? c : c +"BAP", F[i+1] = i == 0 ? c.replace("."," ") : c +"browser-action";});
`Правый клик: правка команд меню "Имя ║ Java-код"\n|◨ правый клик мыши: вторая команда|◨ правый клик: Сброс ◧ Открыть опцию ⟳ Обновить ↯ Перезапуск|Запрещённые сайты через VPN|Захват цвета в Буфер обмена. Курсор смещает на пиксель|◧ + Shift, Колёсико: не закрывать|ваши данные…|расширений активно %s^всего паролей хранится: %s^всего закладок браузера %s^%s %d обновлён пароль^%s %d до смены пароля^%s %d назад истёк пароль!^Пароли и даты аккаунтов|✘ Запрещено сохранять логины и пароли|↯ Не запоминать историю посещений|↯ Удалять историю посещений, закрывая браузер|Ø крутить ±		Яркость страниц |по-умолчанию|browser.display.use_document_fonts|about:config|\tопции UserChromeFiles\n◨ держать\tОтладка дополнений\nAlt + x\t\tпосл. меню Действия|Ошибка файла — |[ пустая строка ]|chrome://user_chrome_files/content/|browser.safebrowsing.downloads.remote.block_dangerous|extensions.user_chrome_files.|browser.download.improvements_to_download_panel|permissions.default.image|network.proxy.type|network.proxy.autoconfig_url|general.useragent.override|pageAction-urlbar-|tabbrowser-tab|tabs-newtab-button|downloads-button|unified-extensions-button|favdirs-button|Mozilla/5.0 (|Macintosh; Intel Mac OS X 10.15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0 YaBrowser/22.5.0.1916 Yowser/2.5 Safari/537.36|identity-box|victor-dobrov.narod.ru/help-FF.html|_2495d258-41e7-4cd5-bc7d-ac15981f064e_|print-button|reader-mode-button|reload-button|tracking-protection-icon-container|PanelUI-menu-button|QuickToggle|Attributes-Inspector|dom.event.clipboardevents.enabled|star-button-box|browser.cache.memory.enable|browser.cache.disk.enable|browser.cache.disk.smart_size.enabled|chrome://browser/content/|browser.cache.memory.max_entry_size`.split('|').forEach((c,i)=>{k = i == 0 ? 97 : i == 26 ? 39 : k; F[String.fromCharCode(i+k)] = c;}); F.h = F.h.split('^');
F.cs = F.s +"custom_scripts/"; F.as = F.cs + F.R +".js"; F.sb = ucf_custom_script_win.ucf_sidebar_tabs;
var UcfAPI = Cu.getGlobalForObject(Cu)[Symbol.for("UcfAPI")], //из ucb_SaveHTML
{prefs,io} = Services, {Pref,dirGet,Status,FileOk,URL} = UcfAPI, ua = `"/usr/bin/osmo"`; //linux
F.vpn = Pref([F.u +"vpn","https://p.thenewone.lol:8443/proxy.pac"]);
var i = "ucf_hookClicks.js"; F.hv = (UcfAPI.FileOk(F.cs + i,1) || '').split('\n')[0].split(' ')[2] || '?';
i = FileOk(F.s +"version.txt",1); F.vu = i ? "UCF "+ i.split('\n')[0].split(' ').pop() +", " : "";
if(F.os == "win") ua = `"C:\\Windows\\system32\\StikyNot.exe"` //ваши команды
else if(F.os == "macosx") ua = `"/usr/bin/open","-b","com.apple.Stickies"`;
F.go = `приложение «Записки» ║UcfAPI.RunwA(${ua}) ║запуск скрипта User.js (Alt+x) ║Userjs(btn)`;
var Exp =()=>
	Number(prefs.getBoolPref(F.u +'expert',false)),
Te = (name,b = '',e = '', t,z,m = Exp())=>{ //текст {Простой︰Эксперт (m = 1)[︰…]}
	t = Tag[name] || ""; z = t.match(/(\{)([\s\S]*?)(\})/gm);
	if(z) z.forEach((k,h) =>{
		h = k.split('︰'); if(h && h.length > m)
			t = t.replace(k,h[m].replace(/\{|\}/g,''));})
	t &&= b + t + e; return t;
},
ua = (real = false,u = F.z) => { //текущий, вшитый, ваш ЮзерАгент
	let t = Pref(u);
	if (u != F.z) return t || F.G +"compatible; YandexBot/3.0; +http://yandex.com/bots)";
	prefs.clearUserPref(u); //костыль: сброс
	u = Cc["@mozilla.org/network/protocol;1?name=http"].getService(Ci.nsIHttpProtocolHandler).userAgent;
	t && Pref(F.z,t); t ||= u;
	if(real) t = u; return t;
},
fonts = a => a.map(n => [(n == a[a.length-1] ? null : n), n]), //array с вложениями
serif = fonts("Arial|Roboto|Cantarell|DejaVu Sans|PT Serif|Segoe UI|Ubuntu|Cambria|Fira Sans|Georgia|Noto Sans|Calibri|Times".split('|')), sans = [["PT Sans","PT Sans"], ...serif];
});