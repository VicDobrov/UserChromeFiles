// Quick Toggle Быстрое переключение параметров about:config для окна [ChromeOnly]
// базовый код - https://forum.mozilla-russia.org/viewtopic.php?pid=789824#p789824

(async (name, id, func) => { // mod by Dobrov требует скрипт ucf_hookClicks.js
	return CustomizableUI.createWidget(func()); // only UCF
})(this.constructor.name, "ToggleButton", () => { var help = hmap.get("ToggleButton"),

/* 30 скрытых настроек. Ctrl+Click или Правый: сброс опции по-умолчанию
клик по параметру с Shift блокирует авто-закрытие меню
строки с userAlt имеют шрифт italic
	refresh: false - reload current tab,	true - reload current tab skip cache
	restart: false - restart browser,		true - restart browser with confirm
Разделитель: Имя меню "—,⟳,↯" Опция, ⟳ обновить страницу, ↯ перезапуск браузера
иконки равны ключам: userChoice:зелёный, userAlt:жёлтый, userPro:серый, нет userChoice:серый, ни один:красный */

	{prefs, dirsvc} = Services, db = prefs.getDefaultBranch(""), my_vpn = "https://antizapret.prostovpn.org/proxy.pac", menuactive = (AppConstants.platform == "macosx") ? '#e8e8e8' : '#124', // текст, подсвеченный курсором, без Aero '#fff'
	xul_ns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
	font_pref = (font) => { return font.map(function(name) { // массив с вложениями
		return (name == font[font.length -1]) ? ["", name] : [name, name];});
	},
	fontserif = font_pref(["Arial","Cantarell","DejaVu Sans","Roboto","PT Serif","Segoe UI","Ubuntu","Cambria","Fira Sans","Georgia","Noto Sans","Calibri","Times","системный"]),
	fontsans = [["PT Sans","PT Sans"], ...fontserif],

	uaAlt = "Mozilla/5.0 (Android 9; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0",
	uaPro = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0",
	pn_ua = "general.useragent.override", ttt = prefs.getStringPref(pn_ua, null); prefs.clearUserPref(pn_ua);
	var sstore = prefs.getIntPref('browser.sessionstore.interval',15e3),
	ua = Cc["@mozilla.org/network/protocol;1?name=http"].getService(Ci.nsIHttpProtocolHandler).userAgent; // костыль - реальный ЮзерАгент
	ttt && prefs.setStringPref(pn_ua, ttt);

	var hints = new Map([ // опция отсутствует ? выполнить код и вернуть строку
		["ucf.savedirs", `glob.str_cut(glob.dirsvcget("DfltDwnld").path, 34)`],
		[pn_ua, `Cc["@mozilla.org/network/protocol;1?name=http"].getService(Ci.nsIHttpProtocolHandler).userAgent`], // текущий ЮзерАгент
		["ucf.ToggleButton.closeMenus", `"Не закрывать после выбора"`]
	]),
	secondary = [{ // menu: [apref, lab, akey, hint, [undef, str], code] radio: [val, lab, str-val, add-hint, code]
			pref: ["dom.disable_open_during_load", "Всплывающие окна"], userChoice: 2, userAlt: true, values: [[true, "Блокировать"], [false, "Разрешить"]]
	},{
			pref: ["javascript.enabled", "Выполнять скрипты Java",,"Поддержка интерактивных сайтов (и рекламы)"], userChoice: true, userAlt: false, refresh: true,
			values: [[true, "Да"], [false, "Нет"]]
	},{
			pref: ["browser.safebrowsing.downloads.remote.block_dangerous", "Опасные файлы, сайты",,"browser.safebrowsing.downloads.remote.block_dangerous_host"], userChoice: true, userAlt: false,
			values: [[true, "Запрет",,,`prefs.setBoolPref('browser.safebrowsing.downloads.remote.block_dangerous_host',true)`], [false, "Открыть",,,`prefs.setBoolPref('browser.safebrowsing.downloads.remote.block_dangerous_host',false)`]]
	// },{
	// 		pref: ["permissions.default.image", "Загрузка графики",,,,`glob.mode_skin()`], userChoice: 1, userAlt: 3, refresh: true, values: [[1, "Разрешена"], [3, "Только с сайта"], [2, "Отключить"]]
	},{
			pref: ["ucf.savedirs", "Загрузки",,hmap.get("savedirs"), ["", "всё в общей папке"]], userChoice: "_Сайты||_Фото|1", userAlt: "_Web|1|_Images|1", userPro: "",
			values: [ // сохранение Html/Pics. [Загрузки]/"_Html/subdir|_Pics/subdir" subdir: пусто | 0 заголовок | 1 домен
				["", "всё в общую папку"],
				[`_Сайты||_Фото|1`, "_Сайты|_Фото/имя…"],
				[`_Сайты||_Рисунки|1`, "_Сайты|_Рисунки/…"],
				[`_Web||_Images|`, "_Web|_Images"],
				[`_Web||_Images|1`, "_Web|_Images/имя"],
				[`_Web||_Photo|1`, "_Web|_Photo/имя"],
				[`_Web|1|_Pics|0`, "_Web/сайт|_Pics/…"],
				[`_Web|1|_Pics|`, "_Web/сайт|_Pics"],
				[`_Web|1|_Images|1`, "_Web/🌐, _Images/🌐"], // открыть указанную опцию about:config —
				[`_Web|1|_Images|0`, "ввести свои пути",,"ключ в about:config",`glob.about_config("ucf.savedirs")`]]
	},null,{
			pref: ["network.proxy.autoconfig_url", "Прокси (VPN) URL", "п", "Переключение сетевых настроек",,`glob.mode_skin('')`],
			userChoice: "localhost", userAlt: my_vpn, userPro: "", refresh: true,
			values: [ // mode_skin — отображать изменения любой опции
				["localhost", "системный", "0",, `prefs.setIntPref('network.proxy.type', 0)`],
				["127.0.0.1", "Tor или Opera", "1", "Необходим сервис tor или opera-proxy",
					`prefs.setIntPref('network.proxy.type', 1)`],
				[my_vpn, "АнтиЗапрет", "2", "Надёжный доступ на заблокированные сайты\n«Режим прокси» меняется на 2",
					`prefs.setIntPref('network.proxy.type', 2)`],
				// ["https://git.io/ac-anticensority-pac", "ac-anticensority", "3"],
				[prefs.getStringPref("user.pacfile", "file:///etc/proxy.pac"), "user .pac файл", "4"], // нужен диалог выбора pac-файла
				["", "сброшен",""]]
	},{
			pref: ["network.proxy.type", "Режим прокси", "р",,,`glob.mode_skin('')`], userChoice: 5, userAlt: 2, userPro: 1, refresh: true, //
			values: [
				[0, "Без прокси", "0", "по-умолчанию"],
				[5, "Системный (из IE)", "5"],
				[2, "Автонастройка", "2", "about:config - user.pacfile"],
				[1, "Ручная настройка", "1", "Используется network.proxy.autoconfig_url"],
				[4, "Автоопределение", "4"] ]
	},{
	// 		pref: ["network.proxy.share_proxy_settings", "Все протоколы через прокси"], userAlt: true, refresh: true,
	// 		values: [[true, "Да", "", "Прокси для всех протоколов при ручной настройке"], [false, "Нет"]]
	// },{
			pref: ["network.trr.mode", "DNS поверх HttpS",, "Шифрование DNS-трафика для\nзащиты персональных данных"], userChoice: 0, userAlt: 2, userPro: 5, refresh: true,
			values: [
				[0, "по-умолчанию", "0"], [1, "автоматически", "1", "используется DNS или DoH, в зависимости от того, что быстрее"], [2, "DoH, затем DNS", "2"], [3, "только DoH", "3"], [4, "DNS и DoH", "4"], [5, "отключить DoH", "5"] ]
	},{
			pref: ["network.cookie.cookieBehavior", "Получать куки",, "Персональные настройки посещённых сайтов"], userChoice: 3, userAlt: 0, userPro: 4, refresh: false,
			values: [[0, "со всех сайтов"], [3, "кроме не посещённых"], [4, "кроме трекеров"], [1, "кроме сторонних"], [2, "никогда"]]
	},null,{
			pref: ["browser.zoom.full", "Масштабировать"], userChoice: true, userAlt: false,
			values: [[true, "всю страницу"], [false, "только текст"]]
	},{
			pref: ["font.name.sans-serif.x-cyrillic", "Шрифт без засечек ",,"Также влияет на всплывающие подсказки\nСистемный: загрузка шрифтов документа"], userChoice: "", userAlt: "Roboto", values: fontsans
	},{
			pref: ["font.name.serif.x-cyrillic", "Шрифт с засечками"], userChoice: "", userAlt: "Arial", values: fontserif
	},{
			pref: ["browser.display.use_document_fonts", "Загружать шрифты страниц"], userChoice: 1, userAlt: 0, refresh: true,
			values: [[1, "Да"], [0, "Нет"]]
	// },{
	// 		pref: ["image.animation_mode", "Анимация изображений"], userChoice: "normal", userAlt: "none", refresh: true,
	// 		values: [["none", "Выключена"], ["normal", "По циклу"], ["once", "Единожды"]]
	},null,{
			pref: ["media.autoplay.default", "Авто-play аудио/видео"], userChoice: 0, userAlt: 2, userPro: 5, refresh: true,
			values: [
				[0, "Разрешить", "0"], [2, "Спрашивать", "2"], [1, "Запретить", "1"], [5, "Блокировать", "5"]]
	},{
			pref: ["media.autoplay.blocking_policy", "Авто-play: политика"], userChoice: 1, userAlt: 2, refresh: true,
			values: [[1, "Временная", "1"], [2, "По действию", "2"], [0, "Постоянная", "0"]]
	},{
			pref: ["gfx.webrender.all", "Ускорять графику аппаратно"], userChoice: true, refresh: true,
			values: [[true, "Да"], [false, "Нет"]]
	},{
			pref: ["gfx.webrender.force-disabled", "Ускорять отрисовку страниц", , "gfx.webrender.compositor.force-enabled\n\nАппаратная отрисовка страниц видеокартой.\nотключите при разных проблемах с графикой"],
			userChoice: false, userAlt: true, userPro: undefined, restart: true, values: [
			[true, "Нет",,,`prefs.setBoolPref("gfx.webrender.compositor.force-enabled", false)`],
			[false, "Да",,,`prefs.setBoolPref("gfx.webrender.compositor.force-enabled", true)`]]
	},null,{
			pref: ["network.http.sendRefererHeader", "Referer: для чего"], userChoice: 2, userAlt: 1,
			values: [[0, "Ни для чего", "0"], [1, "Только ссылки", "1"], [2, "Ссылки, графика", "2"]]
	},{
			pref: ["dom.storage.enabled", "Локальное хранилище",, "Сохранение персональных данных, по\nкоторым вас можно идентифицировать"],
			userChoice: false, userAlt: true,
			values: [[true, "Разрешить"], [false, "Запретить"]]
	},{
			pref: ["privacy.resistFingerprinting", "Изоляция Firstparty-Fingerprint", ,"privacy.firstparty.isolate\n\nЗащита данных пользователя также\nзапрещает запоминать размер окна"], userChoice: false,
			values: [[true, "Да", , "Защита от слежки",`prefs.setBoolPref('privacy.firstparty.isolate', true);`], [false, "Нет", , "Защита от слежки",`prefs.setBoolPref('privacy.firstparty.isolate', false);`]]
	},{
			pref: ["media.peerconnection.enabled", "WebRTC ваш реальный IP"], userChoice: false,
			values: [[true, "Выдать"], [false, "Скрыть"]]
	},null,{
	// 		pref: ["browser.tabs.remote.force-enable", "Многопоточный режим",,"Вкладки работают независимо", [true, "Да"]], userChoice: true, userAlt: false,
	// 		values: [[true, "Да"], [false, "✕ ",,"Все вкладки в одном потоке\nСбой вкладки нарушит работу других"]]
	// },{
			pref: ["browser.cache.disk.capacity", "Кэш браузера",,"\ncache.memory.max_entry_size:\nДиск и память: 5120\nтолько Память: -1"], userChoice: 1048576, userAlt: 0, userPro: 256000,
			values: [
			[256000, "По-умолчанию"],
			[1048576, "Диск и Память",,,`prefs.setBoolPref("browser.cache.memory.enable", true); prefs.setBoolPref("browser.cache.disk.enable", true); prefs.setIntPref('browser.cache.memory.max_entry_size', 5120)`],
			[0, "только Память",,,`prefs.setBoolPref("browser.cache.memory.enable", true); prefs.setBoolPref("browser.cache.disk.enable", false); prefs.setIntPref('browser.cache.memory.max_entry_size', -1)`],
			[2097152, "только Диск",,,`prefs.setBoolPref("browser.cache.memory.enable", false); prefs.setBoolPref("browser.cache.disk.enable", true)`]]
	},{
	// 		pref: ["dom.enable_performance", "Статус загрузки страницы",,"Передача данных разрешит определять\nфакт использования прокси-сервера"], userAlt: true
	// },{
			pref: ["browser.sessionstore.interval", "Резервирование сессий",,"Браузер резервирует сессии на\nслучай сбоя, снижая ресурс SSD"], userChoice: 300000, userAlt: sstore,  userPro: 15000,
			values: [
			[sstore, `${sstore/60e3 + " мин"}`], [15000, "15 сек"], [60000, "1 мин"], [300000, "5 мин"], [900000, "15 мин"], [1800000, "30 мин"]]
	},{
			pref: ["devtools.debugger.remote-enabled", "Удалённая отладка",,"Также включить инструменты разработчика для chrome"], userAlt: true,
			values: [
			[true, "Да + chrome",,,`prefs.setBoolPref("devtools.chrome.enabled", true)`],
			[false, "Отключена",,, `prefs.setBoolPref("devtools.chrome.enabled", false)`]]
	},{
			pref: [pn_ua, "User Agent",,"от user-агент зависит вид сайтов", [ua, "встроенный"]],
			userChoice: ua, userAlt: uaAlt, userPro: uaPro, refresh: true,
			values: [ [ua, "По-умолчанию"],
				[uaAlt, "Firefox 68 Android"], [uaPro, "Firefox 88 MacOS"],
				["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.98 Safari/537.36", "Chrome61 Win10"],
				// ["Mozilla/5.0 (Windows NT 6.1; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0", "Firefox 56"],
				["Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0", "Firefox 56 Linux"],
				["Mozilla/5.0 (Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", "MSIE 6.0 Windows"],
				["Mozilla/5.0 (Linux; Android 7.0; PLUS Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.98 Mobile Safari/537.36", "Chrome61 Android7"],
				["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30", "Safari 6 MacOS"],
				["Opera/9.80 (Windows NT 6.2; Win64; x64) Presto/2.12 Version/12.16", "Opera12 W8"],
				["Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36", "Samsung Galaxy S6"],
				["Mozilla/5.0 (PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)", "Playstation 4"],
				["Xbox (Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586", "Xbox One (mobile)"],
				["Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586", "Microsoft Lumia 950"],
				["Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; GT-I8350)", "Windows Phone"],
				["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "GoogleBot"]]
	// },{
	// 		pref: ["browser.sessionstore.restore_on_demand", "Неактивные вкладки",, "При запуске загружаются все вкладки,\nэто может замедлить работу браузера"],
	// 		userChoice: false, userPro: true, values: [
	// 		[true, "Загружать",,, `prefs.setBoolPref("browser.tabs.unloadOnLowMemory", false)`],
	// 		[false, "Не грузить",,,`prefs.setBoolPref("browser.tabs.unloadOnLowMemory", true)`]]
	}];
	return {
		label: "Журнал, Меню опций",
		id: "ToggleButton",
		tooltiptext: help, localized: false,
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADhUlEQVR4AaWUIYzsNhCG91WVelKfqoWrpwMLFxQYGhoGBgYGBgYGGhoGBhoGGhoaBhoaGhqcdIFhf+dGt2n09rpq1ZE+2bHl+eyxd0993yVjNIwxq9F6/WjtaNd5nBnq85g2PMeMo8EwDEUI0Z7+jm/EY2it87ZtuAf1EUqAzZZZcuCxnyOlBFoLkuhnkgdBjBG36YqzP+EaTqgmSckyjrGuK8paWGythVLKfv/9t/O/OkEIC6pZoskCfanQuQYLSTm2/ZQkjSil8Pc8z6iqyp/P58tn2l92wWjGnEuG9gO6uUVtaygnMOQaU+nR+hotjfeugwmaHNv9pJzYOYcQAp+kbVv3cBJrbA45QIQLVLyizRI6t5R8gC0aY+nQZYWK5lT4E3nNn2XaiJX5PAmLXl9fuweBz54X97mCoYR21SwYc8+yjsbrKKGCvAu4TDnne3IO7z2oTP1RwCVKJXGJ+rlHaxu0ocZQahLWaO4lmjtov5eI7yDZFnFqWXQUPL1kFzwaV3GpmqQo+cMlc1li9MBCyacbUnC74MePy3NBiAukFRDLBTd/QWUVUk44BJclx5lMPVYvEJ3e7+CZYN+dSw5TmpiQA1/oPTYip4SV5gANRIloa5Ku/LKeCqhljrHmhLzMSIFYPGLw3N/KCMAAuUYeBUkXLDE9vCIW0K45MbXYoW/aFZdiyxYoM9Y0oiwGaxyBjcAElAHFCETTw40T6tvVXP749eUfBe/v78xdlJaAvNwTGmo1YYiRIME6YosGxWnEaUDQbXFt5adazKO6DEcBX97b29tRAq4tl0XzpZKAkzJFEx31iY1bYuANIBtkW6engl1CRD6JAYrh5Mg90QBRAYsgbkAkksS2VJvT0jXqUj0R7HzOrViCQ1kGILZAUAQl9AxLVl/BDTI24tyK1+/8n/SVYOexVDMlaQAvAHdjOHmQLPS6grxe9ZeviDgKuM/jzIZM38kbbE4ekguGBV7CDwLXy1k/vKJtPf4ODmAPFhbf74mLa5DmFltQwCKJCskIiPNpprTi42+bRcaYTIv3Z/oVhcgpUrIOm1NYbIvZWtjJIliSLgpIFdZZohMvgQRqFyilRimFF0I4+QXik7ZR3vRqqSsRpJSO1jEf/bFXGUsNhAq2uWS63eb0X+NjN/uuforb9UXYXjqEBkkLyMupP85/I/53fDzLsZV6am8zCdR9/C+4MZTbZ2zc/gAAAABJRU5ErkJggg==",
		UserImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAe1BMVEUAAAB1dXV1dXV1dXV1dXV1dXV1dXV1dXV8fHyRkZGfn5+oqKipqamqqqqysrKzs7O6urq8vLy9vb3ExMTFxcXHx8fNzc3Ozs7Pz8/Q0NDY2NjZ2dna2tre3t7g4ODi4uLj4+Pk5OTl5eXn5+fs7Ozv7+/w8PDx8fHy8vLK4aRZAAAACHRSTlMAGFiAiNDw+LBTincAAACRSURBVBgZBcFBTsMADAAwJ20pqjgM+P8TgQua2Nok2AAAAiIzdfcgkOv2/ub357yaIF8+jwgz969nS7He9pnumf22hrSse1d1V/W+LlIc3d1V3d1HCPsHkWjj+5FUTVdVTdcQtmMNkXrMdT/Dur0KYYy/8wqx7QugHucE+bIFmPPZArkuS+qqqwmIzNTdAwAA/zI6Uy+Vzu5KAAAAAElFTkSuQmCC", // серый
		UserChoiceImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGElEQVR4AWKgPgAQSmbgEsNQFB53GHz43GGcioPF4mCxGCwWi8FiMBgMBoPFYOzOPWf2/cv3Z/3P7Wo2W2VQolIJ59zb/grvlfLnO1lWJ7lmwDn2cEbnY3jciF0XSTUqSfKZRCLP4NB9c9tlyrOE4iXUwMAd2OMZHLiPj2O0uUZcWcQXp3jKsQTAuSeODlxm7grEIRmxZZal2EuhOxjEGR24yNwXqHOe5MQsdtVCq72He+DiIfNQYMxGwJRHhdIzPLs4zwViGw4ypF5MGsiYIBLML/t04D49gja7kz4eyEB6yiQCnhG4zDx/xsa30sUL3RMtgXP5jO9+JApt2L+DZ3C+/o2sbv9l5xsNtYBz7B0HS8qUZSZqAwCSaKMMRS9J3wAAAABJRU5ErkJggg==", // зелёный
		notUserChoiceImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDElEQVR4Aa2TK3CEQBBEt6JwdxKJRJ48GRkZiURGxqt4dV5FnkQikSdXIpHIweE6+8KKyf+7Va92qqe770v493MOoUw8JGJizcSslV+Fm3NRWLxrZUMnzaOAGY0dng/DXVnK+kdpGhKXFI4CZjR2ePC+edu0W3eSYieNPQEPGjvhwUuG7FXuuK+b691uX4Sw2obBmkHbwIOXjC+4qY61D+d5Bq89g5eML6hpxvQd8JLxBXk5uxsM3p05vmBcJhfmnrkzbmaHl4wv6KfL5IKuZHbFecZLxhecxiEuiwVX4nBhPHjJvP0j7QtZe5TaWmqqdG8wo7HD8+m/MWHxUMluDym0wYzGDs/fHqb/Pk9WVkDcHStz1AAAAABJRU5ErkJggg==", // красный
		UserAltImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAklEQVR4Aa2TKVDEQBREx3sRiUQi8Wpl5MqVSCQyMhIZGYlciVy5cmQkEhk5runHNQf3kapX9ev36w97hX9/xk3ozGCiScDMjuyr8va6D+syd9LdIOkgYGZHhvNhed4FyxdSmswsaQ/M7MiEg9uWO65r6aV1MCOFCnZkOLh0ygPjMgXpvjc7i5f50HORHRkOLp3yQNSR131uYZMPFbAjw8GlUx5IWk5kLJwiGeQMOzIcoFMfiEEFz+IZMHsHOW8PRO0dHMyxIEK9w8FtX8IYBwe3gPQeOcel0377Vt1w/XNwcOm8/SJtLcxI70OG8+m3kevxKihNucjMjgznbz+m/34eAEg4sZItNtjUAAAAAElFTkSuQmCC", // жёлтый
		onCreated(btn) {
			btn.setAttribute("image", this.image);
			var doc = btn.ownerDocument;

			btn.btn = true;
			btn.domParent = null;
			btn.popups = new btn.ownerGlobal.Array();
			this.createPopup(doc, btn, "secondary", secondary);
			this.createCloseMenusOption(doc, btn);
			if (prefs.getIntPref('network.proxy.type') == 2) btn.style.filter = "hue-rotate(270deg) brightness(95%)";

			btn.linkedObject = this;
			for(var type of ["contextmenu", "command"]) // "mousedown" "auxclick" события
				btn.setAttribute("on" + type, `linkedObject.${type}(event)`);
			this.addSheet(btn);
		},
		addSheet(btn) {
			var cb = Array.isArray(btn._destructors);
			var id = cb ? btn.id : "ToggleButton";
			var css = `#${id} menu[_moz-menuactive] {
				color: ${menuactive} !important;
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
		createPopup(doc, btn, name, data) {
			var popup = doc.createElementNS(xul_ns, "menupopup");
			var prop = name + "Popup";
			btn.popups.push(btn[prop] = popup);
			popup.id = this.id + "-" + prop;
			for (var type of ["popupshowing", "click"])
				popup.setAttribute("on" + type, `parentNode.linkedObject.${type}(event)`);
			for(var obj of data) popup.append(this.createElement(doc, obj));
			btn.append(popup);
		},
		map: {b: "Bool", n: "Int", s: "String"},
		createElement(doc, obj) {  // pref
			if (!obj) return doc.createElementNS(xul_ns, "menuseparator");
			var pref = doc.ownerGlobal.Object.create(null), node, img, bool;
			for(var [key, val] of Object.entries(obj)) {
				if (key == "pref") {
					var [apref, lab, akey, hint, undef, code] = val;  // строка меню
					pref.pref = apref; pref.lab = lab || apref;
					if (hint) pref.hint = hint;
					if (undef) pref.undef = undef; // если не массив: undef || undef == ""
					if (code) pref.code = code;
				}
				else if (key == "image") img = val, pref.img = true;
				else if (key != "values") pref[key] = val;
				else pref.hasVals = true;
			}
			var type = prefs.getPrefType(pref.pref);
			var str = this.map[type == prefs.PREF_INVALID
				? obj.values ? (typeof obj.values[0][0])[0] : "b"
				: type == prefs.PREF_BOOL ? "b" : type == prefs.PREF_INT ? "n" : "s"
			];
			pref.get = prefs[`get${str}Pref`];
			var map, set = prefs[`set${str}Pref`];
			if (pref.hasVals) {
				for(var [val, , , , code] of obj.values)
					code && (map || (map = new Map())).set(val, code);
				if (map) pref.set = (key, val) => {
					set(key, val);
					map.has(val) && eval(map.get(val)); // выполнить код
				}
			}
			if (!map) pref.set = set;

			node = doc.createElementNS(xul_ns, "menu");
			node.className = "menu-iconic";
			node.setAttribute("closemenu", "none");
			img && node.setAttribute("image", img);
			akey && node.setAttribute("accesskey", akey);
			(node.pref = pref).vals = doc.ownerGlobal.Object.create(null);
			this.createRadios(doc,
				str.startsWith("B") && !pref.hasVals ? [[true, "true"], [false, "false"]] : obj.values,
				node.appendChild(doc.createElementNS(xul_ns, "menupopup"))
			);
			if ("userChoice" in obj) pref.noAlt = !("userAlt" in obj);
			return node;
		},
		createCloseMenusOption(doc, btn) {
			var pn = this.closePref = "ucf.ToggleButton.closeMenus";
			var data = [null, {
				pref: [pn, "Закрывать меню этой кнопки"], values: [[true, "Да"], [false, "Нет"]]
			}];
			var setCloseMenus = (e, trg = e.target) => {
				e.stopPropagation();
				var {pref, val} = trg, updPopup = true, clear;
				switch(e.type) {
					case "command": pref = (trg = trg.closest("menu")).pref; updPopup = false; break;
					case "click": if (e.button) return; break;
					case "contextmenu": e.preventDefault(); clear = pref;
				}
				if (!pref) return;
				if (clear) prefs.clearUserPref(pn);
				else if (!updPopup && val === pref.val) return;
				else pref.set(pn, val !== undefined ? val : !pref.val);
				this.upd(trg);
				updPopup && this.popupshowing(null, trg.querySelector("menupopup"));
			}
			(this.createCloseMenusOption = (doc, btn) => {
				for(var obj of data)
					btn.secondaryPopup.append(this.createElement(doc, obj));
				var m = btn.secondaryPopup.lastChild;
				m.style.cssText = "fill: dimgray !important; list-style-image: url(chrome://browser/skin/menu.svg) !important;";
				m.setAttribute("oncommand", "setCloseMenus(event)");
				m.onclick = m.oncontextmenu = m.setCloseMenus = setCloseMenus;
			})(doc, btn);
		},
		regexpRefresh: /^(?:view-source:)?(?:https?|ftp)/,
		upd(node) {
			var {pref} = node, def = false, user = false, val; // если опция не найдена

			if (prefs.getPrefType(pref.pref) != prefs.PREF_INVALID) {
				try {
					val = pref.defVal = db[pref.get.name](pref.pref); def = true; // опция по-умолчанию получена
				} catch {def = false;}
				var user = prefs.prefHasUserValue(pref.pref);
				if (user) try {val = pref.get(pref.pref, undefined);} catch {}
			}
			if (val == pref.val && def == pref.def && user == pref.user) return;
			pref.val = val; pref.def = def; pref.user = user;
			var exists = def || user;
			if (!exists && pref.undef) // опция не найдена ? вернуть default-значение
				val = pref.undef[0];

			var ttt = eval(hints.get(pref.pref)); if (!ttt) ttt = "Эта опция не указана";
			var hint = exists ? val : ttt; if (hint === "") hint = "[ пустая строка ]";
			hint += "\n" + pref.pref;
			if (pref.hint) hint += "\n" + pref.hint;
			node.tooltipText = hint +'\n\n'+ hmap.get("ToggleMenu");

			var img, alt = "userAlt" in pref && val == pref.userAlt, pro = "userPro" in pref && val == pref.userPro;
			if (alt) img = this.UserAltImg;
			if (pro) img = this.UserImg;
			if ("userChoice" in pref)
				if (val == pref.userChoice)
					node.style.removeProperty("color"), img = this.UserChoiceImg;
				else {
					node.style.setProperty("color", "#702020", "important");
					if (!alt && !pro) img = this.notUserChoiceImg;
				}
			node.nextSibling && node.setAttribute("image", img || this.UserImg); // серый значок, если нет userChoice
			user
				? node.style.setProperty("font-style", "italic", "important")
				: node.style.removeProperty("font-style");

			var {lab} = pref;
			if (exists && pref.hasVals) {
				if (val in pref.vals) var sfx = pref.vals[val] || val;
				else var sfx = user ? "другое" : "стандарт";
				lab += ` ${"restart" in pref ? "↯-" : "refresh" in pref ? "-⟳" : "—"} ${sfx}`;
			}
			lab = exists ? lab : '['+ lab + `${"restart" in pref ? " ↯" : "refresh" in pref ? " ⟳" : ""}` +']'+ `${pref.undef ? " - "+ pref.undef[1] : ""}`;
			node.setAttribute("label", lab); // имя = [имя] если преф не существует
		},
		createRadios(doc, vals, popup) {
			for(var arr of vals) {
				if (!arr) {
					popup.append(doc.createElementNS(xul_ns, "menuseparator"));
					continue;
				}
				var [val, lab, key, hint] = arr;
				var menuitem = doc.createElementNS(xul_ns, "menuitem");
				menuitem.setAttribute("type", "radio");
				menuitem.setAttribute("closemenu", "none");
				menuitem.style.setProperty("font-style", "italic", "important"),
				menuitem.setAttribute("label", popup.parentNode.pref.vals[val] = lab);
				key && menuitem.setAttribute("accesskey", key);
				var tip = menuitem.val = val;
				if (hint) tip += "\n" + hint;
				menuitem.tooltipText = tip;
				popup.append(menuitem);
			}
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
					? win.BrowserReloadSkipCache() : win.BrowserReload();
			}
		},
		maybeClosePopup(e, trg) {
			!e.shiftKey && prefs.getBoolPref(this.closePref, undefined)
				&& trg.parentNode.hidePopup();
		},
		popupshowing(e, trg = e.target) {
			if (trg.state == "closed") return;
			if (trg.id) {
				for(var node of trg.children) {
					if (node.nodeName.endsWith("r")) continue;
					this.upd(node);
					!e && node.open && this.popupshowing(null, node.querySelector("menupopup"));
				}
				return;
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
					pref.val = pref.undef[0]; // опции нет ? вернуть по-умолчанию
				if (findChecked && node.val == pref.val) {
					node.setAttribute("checked", true);
					if (findDef) findChecked = false;
					else break;
				}
				if (findDef && node.val == pref.defVal) {
					node.style.removeProperty("font-style");
					if (findChecked) findDef = false;
					else break;
				}
			}
		},
		click(e) {
			if (e.button) return;
			var trg = e.target, {pref} = trg;
			if (!pref) return;
		},
		command(e) { // нажатия левой кнопки мыши
			var trg = e.target, win = e.view; trg.menustate = null;
			if (trg.btn) return; // LMB
			var menu = trg.closest("menu"), newVal = trg.val;
			this.maybeClosePopup(e, menu);
			if (newVal != menu.pref.val)
				menu.pref.set(menu.pref.pref, newVal), this.maybeRe(menu, true);
			menu.pref.code && eval(menu.pref.code); // выполнить
		},
		contextmenu(e) { // RMB
			var trg = e.target, win = e.view;
			if ((trg.btn) && (!e.ctrlKey && !e.altKey && !e.shiftKey))
				if (trg.menustate != "open") {
					trg.menustate = AppConstants.platform == "macosx" ? "open" : null;
					this.openPopup(trg.secondaryPopup);
					toStatus('Долгий клик в строке меню: Править опцию | Колёсико: Сервисы', 7e3);
				} else trg.menustate = null;
			else if ("pref" in trg) {
				this.maybeClosePopup(e, trg);
				if (trg.pref.user)
					prefs.clearUserPref(trg.pref.pref), this.maybeRe(trg);
				var code = trg.pref.code; code && eval(code); // выполнить код
			}
			e.preventDefault();
		},
	};
}); // END ToggleButton