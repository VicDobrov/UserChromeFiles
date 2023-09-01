(this.contextmenuopenwith = {
	_eventlisteners: [],
	menupage: {},
	menulink: {},
	init(that) {
		var attrimage = true; // true или false Добавить иконки (атрибут "image") или нет
		var submenu = false; // true или false Добавить подменю для пунктов или нет
		var prelabpage = false; // Добавить вначале "Открыть страницу в ";
		var prelablink = false; // Добавить вначале "Открыть ссылку в ";
		// [true или false Показывать пункт на странице или нет, true или false Показывать пункт на ссылках или нет, 'ID пункта', 'имя приложения', 'путь к приложению', 'аргументы через пробел (то что в двойных кавычках считается за один аргумент)', 'иконка (для Windows необязательно)'],
		var arrayWindows = [
//			[true, true, 'edge', 'Microsoft Edge', 'C:\\Windows\\explorer.exe', '"microsoft-edge:%OpenURI "', 'moz-icon://file://C:\\ndows\\SystemApps\\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\\MicrosoftEdge.exe?size=16'],
			[true, true, 'videodownloader', '4K Downloader', 'C:\\Program Files (x86)\\4KDownload\\4kvideodownloader\\4kvideodownloader.exe', '%OpenURI'],
//			[true, true, 'potplayer', 'DAUM PotPlayer', 'C:\\Program Files\\PotPlayer\\PotPlayerMini64.exe', '%OpenURI'],
//			[true, true, 'vlc', 'VLC', 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe', '%OpenURI'],
		];
		var arrayLinux = [ // для Linux
			// [true, true, 'vlc', 'VLC', '/usr/bin/vlc', '%OpenURI', 'moz-icon://stock/vlc?size=menu'],
			// [false, true, 'thunderbird', 'Thunderbird', '/usr/bin/thunderbird', '-compose "to=%OpenURI"', 'moz-icon://stock/thunderbird?size=menu'],
			[true, true, 'yt-dlp', 'Скачать видео в yt-dlp', '/usr/bin/xterm', '-e "yt-dlp \'%OpenURI\'; beep; sleep 3"', 'moz-icon://stock/go-down?size=menu'], // терминал вашей Рабочей среды, в ~/.config/yt-dlp.conf указан каталог загрузки
			[false, true, 'mpv', 'Смотреть в MPV плеер', '/usr/bin/mpv', '--ytdl-format=bestvideo[height<=?720][fps<=?30]+bestaudio/best[height<=?720][fps<=?30] "%OpenURI"', 'moz-icon://stock/mpv?size=menu'],
		];
		var arrayMacos = [ // для MacOS
			// [true, true, 'downie', 'Скачать видео в Downie 4', '/usr/bin/open', '-b com.charliemonroe.Downie-4 %OpenURI', 'moz-icon://file:///Applications/Downie 4.app?size=16'],
			[true, true, 'yt-dlp', 'Найти/скачать видео: yt-dlp', '/usr/bin/osascript', `-e "tell app %quotTerminal%quot to activate do script %quotyt-dlp '%OpenURI' && say 'download complete'; exit%quot"`, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACNJREFUCNdjYH/AgBX9/89Q/4/B/g+D/A8G/g8gEeYDDIwNAIB7EDCcKCcMAAAAAElFTkSuQmCC'], // 'moz-icon://file:///System/Library/Image Capture/Support/Application/AutoImporter.app?size=16'
			[true, true, 'movist', 'Смотреть видео в Movist', '/usr/bin/open', '-b com.movist.MovistPro %OpenURI', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEElEQVR4Xn3NMUiUfxzH8ffn9zynd56lhqXGQYhLCWVL6aAWbdViBg3NNrhFELQk1H/4Q7Q1BglqQRGCUQ0ZFjpdurhUYlINmQbi2Wk+d+fzfGu4OJSzF3yHz/DlLYqWu4/vxTiBqKIodNi1qznyMUTJJjAzev5DBsABLHW3nTHsPeI18GzHje3Y42b28cLzw2cB/D/lWoMRQRPSF9AoYh0AJ3PycEIAkVnSzHokWoCh3hdHWn2gQ9Bk0ic8v6szf2xJhTXNp58aABNsc+ll2/9bVpgEawW6nEESQOhh48T00uJ82luYGRvzYvEOynhybnZFaKg4k44ixBqARRFRFJ4KC8GUc979WLw6xQ6S1ihyYOzCj6Kwr5DbmHVe7HpiT30VZTgQ/2S2LwoLdzazK9OeX9HT2NymbZX+k8MGRBIRb4+yO2sws5Zg46d3b/m7sNBA8hcTKSE5CVFewTl/0KtI3C4E2W+ZH59pCJ1kkUD4/IOc98bzYze28sG7KMhSjk9JgiLJLTjPv1t7oPnxyuJcyE5YnCKHCACI6Om6lYlX1eyPknUHO8Ot/KNyz+FgdaXgIgAiUPvAar2hOcE+mU3iNIyRBYgpx6tUs1epzWKYpIzLyE4DWeRaBdB+c7UX6QFQQwkxcoynDllcgdhuHdSvKzbiA6T/qxttH8ikgW6MJEUIQ3JIouQXaEp90VeA3w+JzXxJuxSaAAAAAElFTkSuQmCC'],
			// [false, true, 'mpv', 'Смотреть в MPV плеер', '/usr/bin/open', '-n -a mpv --args --ytdl-format=bestvideo[height<=?720][fps<=?30]+bestaudio/best[height<=?720][fps<=?30] %OpenURI', 'moz-icon://file:///Applications/mpv.app?size=16'],
		];

		var arrayOS, platform = AppConstants.platform, length;
		if (platform == "win")
			arrayOS = arrayWindows;
		else if (platform == "linux")
			arrayOS = arrayLinux;
		else if (platform == "macosx")
			arrayOS = arrayMacos;
		else
			return;
		if (!(length = arrayOS.length))
			return;
		var addEventListener = this.addEventListener.bind(this);
		var popup = document.querySelector("#contentAreaContextMenu");
		var create = evt => {
			if (evt.target != popup || gContextMenu.webExtBrowserType === "popup") return;
			popup.removeEventListener("popupshowing", create);
			var seppage = popup.querySelector("#context-sep-selectall") || popup.querySelector("#frame-sep") || popup.lastElementChild;
			var seplink = popup.querySelector("#context-sep-copylink") || popup.querySelector("#context-sep-open") || popup.firstElementChild;
			var fragpage = document.createDocumentFragment(), fraglink = document.createDocumentFragment(), _prelabpage = "", _prelablink = "";
			if (length == 1) submenu = false;
			if (!submenu)
				_prelabpage = prelabpage ? "Открыть страницу в " : "", _prelablink = prelablink ? "Открыть ссылку в " : "";
			arrayOS.forEach(item => {
				var id = item[2], name = item[3], path = item[4], arg = !item[5] ? "" : item[5];
				if (!id || !name || !path) return;
				var iconpath = !item[6] ? (`moz-icon://file://${path}?size=16`) : item[6];
				if (item[0]) {
					let menuitem_0 = document.createXULElement("menuitem");
					menuitem_0.id = `open-current-page-with-${id}`;
					menuitem_0.className = "menuitem-iconic open-current-page-with-application";
					menuitem_0.setAttribute("label", `${_prelabpage}${name}`);
					menuitem_0.applicationpath = path;
					menuitem_0.applicationarg = arg;
					if (attrimage)
						menuitem_0.setAttribute("image", iconpath);
					fragpage.append(menuitem_0);
					addEventListener(menuitem_0, "command", function page(event) {
						try {
							var target = event.currentTarget, arg = target.applicationarg, file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
							file.initWithPath(target.applicationpath);
							if (!file.exists() || !file.isExecutable()) return;
							arg = (arg !== "") ? arg.split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g).map(sp => {
								if (/%OpenURI/g.test(sp)) {
									let uri = gBrowser.selectedBrowser.currentURI.displaySpec;
									try {
										let _uri = ReaderMode.getOriginalUrl(uri);
										if (_uri)
											uri = Services.io.newURI(_uri).displaySpec;
									} catch(e) {}
									try {
										uri = decodeURIComponent(uri);
									} catch(e) {}
									return sp.replace(/^"|"$/g, "").replace(/%quot/g, '"').replace(/%OpenURI/g, uri);
								}
								return sp.replace(/^"|"$/g, "").replace(/%quot/g, '"');
							}) : [];
							var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
							process.init(file);
							process.runwAsync(arg, arg.length);
						} catch(e) {}
					});
				}
				if (item[1]) {
					let menuitem_1 = document.createXULElement("menuitem");
					menuitem_1.id = `open-link-with-${id}`;
					menuitem_1.className = "menuitem-iconic open-link-with-application";
					menuitem_1.setAttribute("label", `${_prelablink}${name}`);
					menuitem_1.applicationpath = path;
					menuitem_1.applicationarg = arg;
					if (attrimage)
						menuitem_1.setAttribute("image", iconpath);
					fraglink.append(menuitem_1);
					addEventListener(menuitem_1, "command", function link(event) {
						try {
							var target = event.currentTarget, arg = target.applicationarg, file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
							file.initWithPath(target.applicationpath);
							if (!file.exists() || !file.isExecutable() || !window.gContextMenu?.linkURI?.displaySpec) return;
							arg = (arg !== "") ? arg.split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g).map(sp => {
								if (/%OpenURI/g.test(sp)) {
									let uri = gContextMenu.linkURI.displaySpec;
									try {
										let _uri = ReaderMode.getOriginalUrl(uri);
										if (_uri)
											uri = Services.io.newURI(_uri).displaySpec;
									} catch(e) {}
									try {
										uri = decodeURIComponent(uri);
									} catch(e) {}
									return sp.replace(/^"|"$/g, "").replace(/%quot/g, '"').replace(/%OpenURI/g, uri);
								}
								return sp.replace(/^"|"$/g, "").replace(/%quot/g, '"');
							}) : [];
							var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
							process.init(file);
							process.runwAsync(arg, arg.length);
						} catch(e) {}
					});
				}
			});
			that.unloadlisteners.push("contextmenuopenwith");
			var funcpopupshowing, funcpopuphiding;
			if (!submenu) {
				seppage.after(fragpage);
				seplink.before(fraglink);
				funcpopupshowing = () => {
					var link = gContextMenu.onLink || gContextMenu.onMailtoLink;
					for(let arr of this._eventlisteners) {
						if (arr[2].name === "page")
							arr[0].hidden = link;
						else if (arr[2].name === "link")
							arr[0].hidden = !link;
					}
				};
				funcpopuphiding = () => {
					for(let arr of this._eventlisteners) {
						if (arr[1] === "command")
							arr[0].hidden = true;
					}
				};
			} else {
				if (fragpage.children.length) {
					let menu = this.menupage = document.createXULElement("menu");
					menu.id = "open-current-page-with-submenu";
					menu.className = "menu-iconic open-current-page-with-application";
					menu.setAttribute("label", "Открыть страницу в...");
					let menupopup = document.createXULElement("menupopup");
					menupopup.append(fragpage);
					menu.append(menupopup);
					seppage.after(menu);
				}
				if (fraglink.children.length) {
					let menu = this.menulink = document.createXULElement("menu");
					menu.id = "open-link-with-submenu";
					menu.className = "menu-iconic open-link-with-application";
					menu.setAttribute("label", "Открыть ссылку в...");
					let menupopup = document.createXULElement("menupopup");
					menupopup.append(fraglink);
					menu.append(menupopup);
					seplink.before(menu);
				}
				funcpopupshowing = () => {
					var link = gContextMenu.onLink || gContextMenu.onMailtoLink;
					this.menupage.hidden = link;
					this.menulink.hidden = !link;
				};
				funcpopuphiding = () => {
					this.menupage.hidden = true;
					this.menulink.hidden = true;
				};
			}
			funcpopupshowing();
			addEventListener(popup, "popupshowing", e => {
				if (e.target != popup || gContextMenu.webExtBrowserType === "popup") return;
				funcpopupshowing();
			});
			addEventListener(popup, "popuphiding", e => {
				if (e.target != popup) return;
				funcpopuphiding();
			});
		};
		popup.addEventListener("popupshowing", create);
	},
	addEventListener(...arr) {
		var elm = arr[0];
		if (!elm)
			return;
		elm.addEventListener(...arr.slice(1));
		this._eventlisteners.push(arr);
	},
	destructor() {
		for(let arr of this._eventlisteners)
			arr.shift().removeEventListener(...arr);
		delete this._eventlisteners;
	}
}).init(this);
