/* Быстрое переключение опций about:config для окна [ChromeOnly] http://forum.mozilla-russia.org/viewtopic.php?pid=789824#p789824
BUG мышь неподвижна: скрытое по Escape меню открывается на второй клик

30 скрытых настроек. Ctrl+Click или Правый: сброс опции по-умолчанию
клик по параметру с Shift блокирует авто-закрытие меню
⟳ Обновить страницу, ↯ Перезапуск браузера
строки с pYellow = шрифт italic, цвет = ключ, пусто:Red 
	refresh: false - reload current tab,	true - reload skip cache
	restart: false - restart browser,	true - restart with confirm */

(async (name, func) => { // mod by Dobrov нужен скрипт ucf_hookClicks.js
	return CustomizableUI.createWidget(func()); //only UCF
})(this.constructor.name, () => {

	var {prefs} = Services, db = prefs.getDefaultBranch(""), ua = glob.ua(true), //real ЮзерАгент
	I = [Services.appinfo.OS == "Darwin" ? '#e8e8e8' : '#124', //текст под курсором, без Aero '#fff'
	"https://antizapret.prostovpn.org/proxy.pac", "user.pacfile",
	glob.pref(['browser.sessionstore.interval', 15e3]),
	"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul","general.useragent.override",
	"Linux; Android 9; Pixel 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 Mobile Safari/537.36",
	"Macintosh; Intel Mac OS X 10.15; rv:115.0) Gecko/20100101 Firefox/115.0","Mozilla/5.0 ("],
	fonts = font => font.map(name => [(name == font.at(-1) ? null : name), name]), //array с вложениями
	serif = fonts("Arial|Cantarell|DejaVu Sans|Roboto|PT Serif|Segoe UI|Ubuntu|Cambria|Fira Sans|Georgia|Noto Sans|Calibri|Times|системный".split('|')), sans = [["PT Sans","PT Sans"], ...serif];

	var hints = new Map([ //опция отсутствует ? выполнить код и вернуть строку
		["ucf.savedirs", `glob.crop(glob.dirsvcget(""),34)`],
		[I[5], `glob.ua()`] // текущий ЮзерАгент
	]),
	secondary = [{ // menu: [apref, lab, akey, hint, [undef, str], code] radio: [val, lab, str-val, add-hint, code]
			pref: ["dom.disable_open_during_load", "Всплывающие окна"], pDefGreen: 2, pYellow: true, values: [[true, "Блокировать"], [false, "Разрешить"]]
	},{
			pref: ["javascript.enabled", "Выполнять скрипты Java",,"Поддержка интерактивных сайтов, рекламы\nтакже разрешает действия горячих клавиш"], pDefGreen: true, refresh: true,
			values: [[true, "Да"], [false, "Нет"]]
	},{
			pref: ["browser.safebrowsing.downloads.remote.block_dangerous", "Опасные файлы, сайты",,"browser.safebrowsing.downloads.remote.block_dangerous_host"], pDefGreen: true, pYellow: false,
			values: [[true, "Запрет",,,`glob.pref('browser.safebrowsing.downloads.remote.block_dangerous_host',true)`], [false, "Открыть",,,`glob.pref('browser.safebrowsing.downloads.remote.block_dangerous_host',false)`]]
	},{
			pref: ["ucf.savedirs", "Загрузки",,'Пути сохранения Страниц и Графики\nСинтаксис «_Html/subdir|_Pics/subdir»\nsubdir: пусто | 0 заголовок | 1 домен',
				["", "всё в общей папке"]], pDefGreen: "_Сайты||_Фото|0", pYellow: "_Web|1|_Images|0", pGray: "",
			values: [ // сохранение Html/Pics. [Загрузки]/"_Html/subdir|_Pics/subdir" subdir: пусто | 0 заголовок | 1 домен
				["", "всё в общую папку"],
				[`_Сайты||_Фото|0`, "_Сайты|_Фото/имя…"],
				[`_Web||_Photo|0`, "_Web|_Photo/имя"],
				[`_Web|1|_Pics|1`, "_Web/сайт|_Pics/…"],
				[`_Web|0|_Pics|`, "_Web/имя|_Pics"],
				[`_Web|1|_Images|0`, "_Web/сайт, _Images/имя"], //открыть опцию about:config:
				[`Сайт||Фото|`, "ввести свои пути",,"ключ в about:config",`glob.about_config("ucf.savedirs")`]]
	},null,{
			pref: ["network.proxy.autoconfig_url", "Прокси (VPN) URL", "п", "Переключение сетевых настроек",,`glob.mode_skin('')`],
			pDefGreen: "localhost", pYellow: I[1], pGray: "", refresh: true,
			values: [
				["localhost", "системный", "0",, `glob.pref('network.proxy.type', 0)`],
				["127.0.0.1", "Tor или Opera", "1", "Необходим сервис tor или opera-proxy",
					`glob.pref('network.proxy.type', 1)`],
				[I[1], "АнтиЗапрет", "2", "Надёжный доступ на заблокированные сайты\n«Режим прокси» меняется на 2",
					`glob.pref('network.proxy.type', 2)`],
				// ["https://git.io/ac-anticensority-pac", "ac-anticensority", "3"],
				[glob.pref([I[2], "file:///etc/proxy.pac"]), "user .pac файл", "4", "about:config "+ I[2]], // нужен диалог выбора pac-файла
				[null, "сброшен",""]]
	},{
			pref: ["network.proxy.type", "Режим прокси", "р",,,`glob.mode_skin('')`], pDefGreen: 5, pYellow: 2, pGray: 1, refresh: true, // mode_skin — отображать изменения любой опции
			values: [ //фон кнопки Меню: серый, голубой, красный, жёлтый, зелёный
				[0, "Без прокси", "0", "по-умолчанию"],
				[5, "Системный (из IE)", "5"],
				[2, "Автонастройка", "2", "about:config "+ I[2]],
				[1, "Ручная настройка", "1", "Используется network.proxy.autoconfig_url"],
				[4, "Автоопределение", "4"] ]
	},{
			pref: ["network.trr.mode", "DNS поверх HttpS",, "Шифрование DNS-трафика для\nзащиты персональных данных"], pDefGreen: 0, pYellow: 2, pGray: 5, refresh: true,
			values: [
				[0, "по-умолчанию", "0"], [1, "автоматически", "1", "используется DNS или DoH, в зависимости от того, что быстрее"], [2, "DoH, затем DNS", "2"], [3, "только DoH", "3"], [4, "DNS и DoH", "4"], [5, "отключить DoH", "5"] ]
	},{
			pref: ["network.cookie.cookieBehavior", "Получать куки",, "Персональные настройки посещённых сайтов"], pDefGreen: 3, pYellow: 0, pGray: 4, refresh: false,
			values: [[0, "со всех сайтов"], [3, "посещённые сайты"], [4, "кроме трекеров"], [1, "кроме сторонних"], [2, "никогда"]]
	},null,{
			pref: ["browser.display.use_document_fonts", "Загружать шрифты страниц"], pDefGreen: 1, pGray: 0, refresh: true,
			values: [[1, "Да"], [0, "Нет"]]
	},{
			pref: ["font.name.sans-serif.x-cyrillic", "Шрифт без засечек ",,"Также влияет на всплывающие подсказки\nСистемный: загрузка шрифтов документа"], pDefGreen: "", pYellow: "Roboto", pGray: "Arial", values: sans
	},{
			pref: ["font.name.serif.x-cyrillic", "Шрифт с засечками"], pDefGreen: "", pYellow: "Arial", values: serif
	},{
			pref: ["gfx.webrender.force-disabled", "Ускорять отрисовку страниц", ,"gfx.webrender.compositor.force-enabled\ngfx.webrender.all\n\nАппаратная отрисовка страниц видеокартой.\nотключите при разных проблемах с графикой"],
			pDefGreen: false, pYellow: true, pGray: undefined, restart: true, values: [
			[true, "Нет",,,`[["gfx.webrender.compositor.force-enabled", false], ["gfx.webrender.all", false]].map((a) =>{glob.pref(...a)})`],
			[false, "Да",,,`[["gfx.webrender.compositor.force-enabled", true], ["gfx.webrender.all", true]].map((a) =>{glob.pref(...a)})`]]
	},null,{
			pref: ["media.autoplay.default", "Авто-play аудио/видео"], pDefGreen: 0, pYellow: 2, pGray: 5, refresh: true,
			values: [
				[0, "Разрешить", "0"], [2, "Спрашивать", "2"], [1, "Запретить", "1"], [5, "Блокировать", "5"]]
	},{
			pref: ["dom.storage.enabled", "Локальное хранилище",, "Сохранение персональных данных, по\nкоторым вас можно идентифицировать"],
			pDefGreen: false, pYellow: true,
			values: [[true, "Разрешить"], [false, "Запретить"]]
	},{
			pref: ["privacy.resistFingerprinting", "Изоляция Firstparty-Fingerprint", ,"privacy.firstparty.isolate\n\nЗащита данных пользователя также\nзапрещает запоминать размер окна"], pDefGreen: false,
			values: [[true, "Да", , "Защита от слежки",`glob.pref('privacy.firstparty.isolate', true)`], [false, "Нет", , "Защита от слежки",`glob.pref('privacy.firstparty.isolate', false)`]]
	},{
			pref: ["media.peerconnection.enabled", "WebRTC ваш реальный IP"], pDefGreen: false,
			values: [[true, "Выдать"], [false, "Скрыть"]]
	},null,{
			pref: ["network.http.sendRefererHeader", "Referer: для чего"], pDefGreen: 2, pYellow: 1,
			values: [[0, "Ни для чего", "0"], [1, "Только ссылки", "1"], [2, "Ссылки, графика", "2"]]
	},{
			pref: ["browser.cache.disk.capacity", "Кэш браузера",,"\ncache.memory.max_entry_size:\nДиск и память: 5120\nтолько Память: -1"], pDefGreen: 1048576, pYellow: 0, pGray: 256e3,
			values: [
			[256e3, "По-умолчанию"],
			[1048576, "Диск и Память",,,`[["browser.cache.memory.enable", true], ["browser.cache.disk.enable", true], ["browser.cache.memory.max_entry_size", 5120]].map((a) =>{glob.pref(...a)})`],
			[0, "только Память",,,`[["browser.cache.memory.enable", true], ["browser.cache.disk.enable", false], ["browser.cache.memory.max_entry_size", -1]].map((a) =>{glob.pref(...a)})`],
			[2097152, "только Диск",,,`[["browser.cache.memory.enable", false], ["browser.cache.disk.enable", true]].map((a) =>{glob.pref(...a)})`]]
	},{
			pref: ["browser.sessionstore.interval", "Резервирование сессий",,"Браузер резервирует сессии на\nслучай сбоя, снижая ресурс SSD"], pDefGreen: 3e5, pYellow: I[3], pGray: 15e3,
			values: [
			[I[3], `${I[3]/60e3 + " мин"}`], [15e3, "15 сек"], [6e4, "1 мин"], [3e5, "5 мин"], [9e5, "15 мин"], [18e5, "30 мин"]]
	},{
			pref: [I[5], "User Agent",,"Тип гаджета меняет вид сайта", [ua, "встроенный"]],
			pDefGreen: ua, pYellow: I[7] + I[6], pGray: I[7] + I[7], refresh: true,
			values: [ [ua, "По-умолчанию"],
				[I[7] + I[6], "Chrome 99 Android 9"], [I[7], "Firefox 115 MacOS 12"],
				[I[7] + "Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.98 Safari/537.36", "Chrome61 Win10"],
				[I[7] + "Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", "MSIE 6.0 Windows"],
				[I[7] + "Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30", "Safari 6 MacOS"],
				["Opera/9.80 (Windows NT 6.2; Win64; x64) Presto/2.12 Version/12.16", "Opera12 W8"],
				[I[7] + "Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36", "Samsung Galaxy S6"],
				[I[7] + "PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)", "Playstation 4"],
				["Xbox (Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586", "Xbox One (mobile)"],
				[I[7] + "compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; GT-I8350)", "Windows Phone"],
				[I[7] + "Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.143 YaBrowser/22.5.0.1916 Yowser/2.5 Safari/537.36", "Yandex OSX"],
				[I[7] + "compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "GoogleBot"]]
		}];
	return {
		id: "ToggleButton", label: "Журнал, Меню опций", localized: false,
		icon: "data:image/webp;base64,UklGRkYCAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSJcAAAANcGJr25S8mH4SNGxAgsguPCZ0BcMOiDSNRpvVaCTa3AI2qm2e2ofz7OuwgIiYgMzb4kVjGvegnQFAwXgFVnvcOmtnMJtutAa3Vo4mhRMDpWq8AjfU+yQoYf1/oTkTIdUrknKswNQ5yAdDzqgr4CYbsJWQfEyEU5QNEl2eKFM2AAIbjmSIMjwXPGyEdj6Bdn4mj9KO63sAAFZQOCCIAQAAdAgAnQEqGAAYAD6dRppKgoCqgAE4lsAKwgisgG27uzPePSvBIu/Pr0HJqW+AfoAIHl2DrAnRo/G3JBpTx8yE7L6LFQyD+yUNvuRYAAD+7mwmpaoBcsJ1hVKsMI2ucqid8qndm+WEvH4l4il6lA8FPscgnrRHrnSjjyNcfUV21+TkfqOWKou2UvVsZSl1z+jKs760Vij5XCWF9Uo6TZAhKfrJpeILyQYwq2Ee/g1uyEH/dJMI/91DsVpI6i2vV/Jqpd4/KniJtTm1woLvaotA2ikt3eeBaqlHf8WPe++lSWS7fETjgvzzbflp0Rj+v23kbb9e/VjUcPaD83shRuwzEo6CAO/AGxE+Zwbvv9NDsQT6T+S4CCDOFTuMRVv9/0E4P+uK+Vc3bMfQQD05gY/fes+ZX6ZHkvFdMn7zX8LMVvI59p7F806HPD2lBjs4lWWhQ5ckJDNflZL49370shr3/Q9uMJN9i/NVCu4OT7K3+4+/RkAMnjuY09u+3i4y4CldQG789iIAAAA=",
		defGreen: "data:image/webp;base64,UklGRgoBAABXRUJQVlA4TP0AAAAvD8ADEI9hpG2kwpf60h8+nBQkbSSp/tW9hIMPFw5E0kaSKuP9q3kJDx8ePDjQSCQp2z8RkhhIHBVAEdD9J4JYEkEUJSiDD0EIEcFgBSIspCAcbdlyRzfeYpwnDotGYFHIfXe6pdToDwUE2bZNRzds24qTx9b8h+chHET0fwLiX3vNO6jyh5aWbwMaqX3Ttu/j0VDG+5ZB9nQ2nYwBUGepB8vqYH9v+qrpnsESzDcnh9i3DZ4oB3cfPD0+kmSTuyCucHH+8dXwLphnt5+6vgQlz3KwrB90f3drUFqXYE/zJz9KsufsQbatX741WnxtabN4hjds8X2veQdVxr8CAA==",
		Gray: "data:image/webp;base64,UklGRsgAAABXRUJQVlA4TLsAAAAvD8ADEFW4rbVtaVj67ViCCWhDSugiHSSVle7uMoJnhO973wgztW2IIZo4RvFEMdqu2rZtGJfNqWfYX0SisXgaGvkBFK5k4EEDTtS7Q31XN3ei94VeQuI61k6unuRaB86CMExsYWnFt+imhRgmCMMWJmYWliTRJgrYIAzfJfUMSCK7hDdji3VQkkTjE9hMrsCmNheZy9gzEqlhndwlMoJ5NSqr+KCIfPuDUm+Uoz7+FEmkmIjg/Pcf/6EBAA==",
		Red: "data:image/webp;base64,UklGRhwBAABXRUJQVlA4TBABAAAvD8ADEL+hNJKkaOTJkycJn7CQJ5GjeXIgE4ZY/5Qq+HyMRJJyEvkR6K+IQwQk8qSRSFJWfgwkMZD0b0IC1KZtwDhl9h1Afx+SIEmAIEmChO+PwVWRpOsj2EgllBRDKy1EiJmhs5ztdaTnOAkEFBjQIGAdDiPJNq37bdu2nX9uDOGevQcR/SeQtNn+Aovh/vL2eF1FYR/cz9tNJKgHvf+4jseiYn59JAC38yqV8N57SDibw3OXzaQlyWKE3dPhtSzkshkiAttSHa4VLRXzqkqhogJIvVEjLbNWScIVeC3araaGoOqxeDk89z3rdphZzMITuF3mA/SJCFA2B9xPs9FkbKTsP8JcDtMhB7nQ747/CA==",
		Yellow: "data:image/webp;base64,UklGRv4AAABXRUJQVlA4TPEAAAAvD8ADEFeBppGkTMdJQAKSkI0MSsoTgAhDkW1sG3VEF0EER06Mtm1jWBi4/68cNBJJykpiIHFUQNK/CQlIOO+Lr4fmLsUtio7rgkBiUAjszusVxAQkHiEB8xAnXoQwz5sOM4QYHEaSbVrnWf8/21b+GX6GsBvRfwJBCHHADPlLlGQhM0Qfif18v7HTj9/3mI7z4onp8Wrkj+t2ANg4+pEgdYZ5WTdwmQcnFWRF2w8zAPZtkQnCik3bAWhZMRRQAVDVrEoFCAWZoamkApKakQlSV4f2BnBTQRSYxgcGkQDx0zLfWM+PYwLPNml7iH//+A8AAA==",
		onCreated(btn) {
			btn.setAttribute("image", this.icon);
			var doc = btn.ownerDocument;
			btn.btn = true;
			btn.domParent = null;
			btn.popups = new btn.ownerGlobal.Array();
			this.createPopup(doc, btn, "secondary", secondary);
			if (glob.pref('network.proxy.type') == 2) btn.style.filter = "hue-rotate(270deg) brightness(95%)";
			btn.linkedObject = this;
			for(var type of ["contextmenu", "command"]) // "mousedown" "auxclick" события
				btn.setAttribute("on" + type, `linkedObject.${type}(event)`);
			this.addSheet(btn);
		},
		addSheet(btn) {
			var cb = Array.isArray(btn._destructors);
			var id = cb ? btn.id : "ToggleButton";
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
		createPopup(doc, btn, name, data) {
			var popup = doc.createElementNS(I[4], "menupopup");
			var prop = name + "Popup";
			btn.popups.push(btn[prop] = popup);
			popup.id = this.id + "-" + prop;
			for (var type of ["popupshowing", "click"])
				popup.setAttribute("on" + type, `parentNode.linkedObject.${type}(event)`);
			for(var obj of data) popup.append(this.createElement(doc, obj));
			btn.append(popup);
		},
		map: {b: "Bool", n: "Int", s: "String"},
		createElement(doc, obj) { // pref
			if (!obj) return doc.createElementNS(I[4], "menuseparator");
			var pref = doc.ownerGlobal.Object.create(null), node, img, bool;
			for(var [key, val] of Object.entries(obj)) {
				if (key == "pref") {
					var [apref, lab, akey, hint, undef, code] = val; // строка меню
					pref.pref = apref; pref.lab = lab || apref;
					if (hint) {
						if (RegExp(/\p{L}/,'u').test(hint[0]) && (hint[0] === hint[0].toUpperCase()))
							hint = '\n'+ hint;
						pref.hint = hint;
					}
					if (undef) pref.undef = undef; //если не массив: undef || undef == ""
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
			node = doc.createElementNS(I[4], "menu");
			node.className = "menu-iconic";
			img && node.setAttribute("image", img);
			akey && node.setAttribute("accesskey", akey);
			(node.pref = pref).vals = doc.ownerGlobal.Object.create(null);
			this.createRadios(doc,
				str.startsWith("B") && !pref.hasVals ? [[true, "true"], [false, "false"]] : obj.values,
				node.appendChild(doc.createElementNS(I[4], "menupopup"))
			);
			if ("pDefGreen" in obj) pref.noAlt = !("pYellow" in obj);
			return node;
		},
		regexpRefresh: /^(?:view-source:)?(?:https?|ftp)/,
		upd(node) {
			var {pref} = node, def = false, user = false, val; // если опция не найдена

			if (prefs.getPrefType(pref.pref) != prefs.PREF_INVALID) {
				try {
					val = pref.defVal = db[pref.get.name](pref.pref); def = true; // опция по-умолчанию получена
				} catch {def = false}
				user = prefs.prefHasUserValue(pref.pref);
				if (user) try {val = pref.get(pref.pref, undefined);} catch {}
			}
			if (val == pref.val && def == pref.def && user == pref.user) return;
			pref.val = val; pref.def = def; pref.user = user;
			var exists = def || user;
			if (!exists && pref.undef) // опция не найдена ? вернуть default-значение
				val = pref.undef[0];
			var hint = eval(hints.get(pref.pref));
			if (!hint) hint = val != undefined ? val : "Эта опция не указана";
			if (hint === "") hint = "[ пустая строка ]";
			hint += "\n" + pref.pref;
			if (pref.hint) hint += "\n" + pref.hint;
			node.tooltipText = hint; //+ текст
			var img, alt = "pYellow" in pref && val == pref.pYellow, pro = "pGray" in pref && val == pref.pGray;
			if (alt) img = this.Yellow;
			if (pro) img = this.Gray;
			if ("pDefGreen" in pref)
				if (val == pref.pDefGreen)
					node.style.removeProperty("color"), img = this.defGreen;
				else {
					node.style.setProperty("color", "#702020", "important");
					if (!alt && !pro) img = this.Red;
				}
			node.setAttribute("image", img || this.Gray); // серый значок, если нет pDefGreen
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
					popup.append(doc.createElementNS(I[4], "menuseparator"));
					continue;
				}
				var [val, lab, key, hint] = arr;
				var menuitem = doc.createElementNS(I[4], "menuitem");
				with (menuitem)
					setAttribute("type", "radio"), setAttribute("closemenu", "none"),
					style.setProperty("font-style", "italic", "important"),
					setAttribute("label", popup.parentNode.pref.vals[val] = lab);
				key && menuitem.setAttribute("accesskey", key);
				var tip = menuitem.val = val === "" ? "[ пустая строка ]" : val;
				if (hint) tip += "\n" + hint;
				menuitem.tooltipText = `${tip != undefined ? tip + "\n\n" : ""}клик с Shift блокирует авто-закрытие`;
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
					? win.BrowserReloadSkipCache() : win.BrowserReload();}
		},
		maybeClosePopup(e, trg) {
			!e.shiftKey && trg.parentNode.hidePopup();
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
					pref.val = pref.undef[0]; // опции нет ? вернуть по-умолчанию
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
		click(e) { //строки меню
			if (e.button) return;
			var trg = e.target, {pref} = trg;
			if (!pref) return;
		},
		command(e) { // LMB на кнопке
			var trg = e.target, win = e.view; trg.mstate = null;
			if (trg.btn) return; // LMB
			var menu = trg.closest("menu"), newVal = trg.val;
			this.maybeClosePopup(e, menu);
			if (newVal != menu.pref.val)
				menu.pref.set(menu.pref.pref, newVal), this.maybeRe(menu, true);
			menu.pref.code && eval(menu.pref.code); //run
		},
		contextmenu(e) { // RMB на кнопке
			var trg = e.target, win = e.view;
			if ((trg.btn) && !(e.ctrlKey || e.altKey || e.shiftKey))
				if (trg.mstate != "open") {
				trg.mstate = AppConstants.platform == "macosx" ? "open" : null;
				this.openPopup(trg.secondaryPopup);
			} else trg.mstate = null;
			if ("pref" in trg) {
				this.maybeClosePopup(e, trg);
				if (trg.pref.user)
					prefs.clearUserPref(trg.pref.pref), this.maybeRe(trg);
				var code = trg.pref.code; code && eval(code); //run
			}
			e.preventDefault();
		}
	};
});