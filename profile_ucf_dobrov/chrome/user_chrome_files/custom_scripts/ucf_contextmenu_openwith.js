(this.contextmenuopenwith = {
	_eventListeners: [],
	init(that) {
		var Hint = "Открыть выделенный текст или ссылку\nПравый клик | Shift - ссылка из буфера",
		selector = "#context-sep-selectall", // вставить пункты меню перед этим селектором
		attricon = true, // false: без иконок атрибут "image"
		submenu = false, /* подменю программ для ссылок

	name: 'Prefix или пусто|Имя', path: 'путь', Необязательно: iconpath: 'иконка',
	args: `опции через пробел "в двойных кавычках считаются одной"`,
	roll: аналог args, выполняется средним кликом (+Shift: адрес из буфера)
	hint: подсказка в строке меню для roll
	%OpenURI выделенный текст или URL страницы/ссылки */

		linux = [
			{ name: 'Ссылку в |плеер VLC', path: '/usr/bin/vlc',
				iconpath: 'moz-icon://stock/vlc?size=menu'
			},
			{ name: 'Скачать в |Yt-dlp', path: '/usr/bin/konsole', //предпочтительно .mp4 hevc|h265|avc|h264 <=1080
				args: `--hold --workdir ~/Загрузки -e "yt-dlp -f %quotbv[height<=1080][ext=mp4][vcodec~='^(hevc|h265|avc|h264)']+ba[ext~='(aac|m4a)']/best[height<=1080][ext=mp4]/best[height<=1080]/best%quot %OpenURI"`,
				hint: 'скачать в FFmpeg',
				roll: `--hold --workdir ~/Загрузки -e "ffmpeg -i %OpenURI -c copy -f mp4 video.mp4"`,
				iconpath: 'moz-icon://stock/youtube-dl?size=menu'}
		],
		win = [
			{	name: 'Ссылку в |плеер VLC', path: 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
				args: `"%OpenURI"`
			},
			{ name: 'Ссылку в |плеер PotPlayer', path: 'C:\\Program Files\\PotPlayer\\PotPlayerMini64.exe',
				args: `"%OpenURI"`
			},
			{ name: 'Открыть в |Microsoft Edge', path: 'C:\\Windows\\explorer.exe', args: `"microsoft-edge:%OpenURI "`}
		],
		macosx = [
			{	name: 'Загрузчик видео yt-dlp', path: '/usr/bin/osascript',
				args: `-e "tell app %quotTerminal%quot to activate do script %quotyt-dlp '%OpenURI' && say 'Download complete'; exit%quot"`,
				hint: 'опции --downloader ffmpeg…',
				roll: `-e "tell app %quotTerminal%quot to activate do script %quotyt-dlp --downloader ffmpeg --hls-use-mpegts '%OpenURI' && say 'Download complete'; exit%quot"`,
				iconpath: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4TC0AAAAvD8ADEA8QEfMfQlFt29T7MhRBFNGIJsqLYPhnqEJE/8P8772bd+qxBfOVCwIA'
			},
			{	name: 'Ссылку в |плеер MPV', path: '/usr/bin/osascript', //FIX only mpv
				args: `-e "tell app %quotTerminal%quot to do script %quotopen -b io.mpv '%OpenURI' --args '--ytdl-format=bestvideo[height<=?720][fps<=?30]+bestaudio/best[height<=?720][fps<=?30]'; exit%quot" -e "tell app %quotSystem Events%quot to set visible of process %quotTerminal%quot to false"`,
				hint: 'скачать книгу в Elib2Ebook',
				roll: `-e "tell app %quotTerminal%quot to do script %quotcd $HOME/Downloads; Elib2Ebook -f epub -u '%OpenURI' && say 'Download complete'; exit%quot"`,
				iconpath: 'moz-icon://file:///System/Applications/Automator.app?size=16'
			},
			{	name: 'Открыть в браузере |Safari', path: '/usr/bin/open',
				args: `-b com.apple.Safari -u "%OpenURI"`,
				iconpath: 'chrome://branding/content/icon32.png'
			},
		];
		try {var arrOS = eval(AppConstants.platform);} catch {return}
		if (!arrOS.length) return;
		var addListener = (...arr) => {
			var elm = arr[0];
			if (!elm) return;
			elm.addEventListener(...arr.slice(1));
			this._eventListeners.push(arr);
		};
		var readFromClipboard = (url = "") => {
			try {
				let trans = Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable);
				trans.init(docShell.QueryInterface(Ci.nsILoadContext));
				trans.addDataFlavor("text/plain");
				let {clipboard} = Services, data = {};
				clipboard.getData(trans, clipboard.kGlobalClipboard);
				trans.getTransferData("text/plain", data);
				if (data.value)
					url = data.value.QueryInterface(Ci.nsISupportsString).data;
			} catch (ex) {}
			return url;
		};
		var getCurrentURL = () => {
			var url = gBrowser.selectedBrowser.currentURI.displaySpec;
			try {
				let _url = ReaderMode.getOriginalUrl(url);
				if (_url)
					url = Services.io.newURI(_url).displaySpec;
			} catch(e) {}
			return url;
		};
		var getURL = key => {
			return !key
			? gContextMenu?.linkURI?.displaySpec || getCurrentURL()
			: readFromClipboard();
		};
		var popup = document.querySelector("#contentAreaContextMenu");
		var create = e => {
			if (e.target != popup || gContextMenu.webExtBrowserType === "popup") return;
			popup.removeEventListener("popupshowing", create);
			this._eventListeners.shift();
			var contextsep = popup.querySelector(`:scope > ${selector}`) || popup.querySelector(":scope > menuseparator:last-of-type");
			var fragment = document.createDocumentFragment();
			if (length == 1) submenu = false;
			var itemId = 0;
			arrOS.forEach(item => {
				let name = item.name.split('|'), {path, args, roll, hint} = item;
				if (!name || !path) return;
				if (submenu) name.shift();
				name = name.join('');
				if (hint) hint = '\nКолёсико: '+ hint;
				var iconpath = item.iconpath || `moz-icon://file://${path}?size=16`;
				let mitem = document.createXULElement("menuitem");
				mitem.id = `ucf-menu-open-with-${++itemId}`;
				mitem.className = "menuitem-iconic ucf-menu-open-with";
				mitem.setAttribute("label", `${name}`);
				mitem.apppath = path; mitem.roll = roll;
				mitem.tooltipText = Hint + (hint || "");
				mitem.appargs = args || "";
				if (attricon)
					mitem.setAttribute("image", iconpath);
				fragment.append(mitem);
				addListener(mitem, "command", function command(e) {
					try {
						let trg = e.currentTarget, file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
						let args = trg.appargs;
						if (trg.roll && e.button == 1)
							args = trg.roll;
						file.initWithPath(trg.apppath);
						if (!file.exists()) return;
						if (file.isExecutable()) {
							let process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
							process.init(file);
							if (args) {
								let openuri = false;
								args = args.split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(sp => {
									if (/%OpenURI/.test(sp)) {
										openuri = true;
										return sp.replace(/^["']+|["']+$/g, "").replace(/%quot/g, '"').replace("%OpenURI", getURL(e.shiftKey || e.button == 2));
									}
//сперва Clipboard: if (/%OpenClipboardURI/.test(……replace("%OpenClipboardURI", getURL(……; с Shift ссылка сайта или выдел. текст
									return sp.replace(/^["']+|["']+$/g, "").replace(/%quot/g, '"');
								});
								if (!openuri)
									args.push(getURL(e.shiftKey || e.button == 2));
							} else
								args = [getURL(e.shiftKey || e.button == 2)];
console.log(args);
							process.runwAsync(args, args.length);
						} else
							file.launch();
					} catch(e) {}
				});
			});
			var funcpopupshowing, funcpopuphiding;
			if (submenu) {
				let rootmenu = {};
				if (fragment.children.length) {
					rootmenu = document.createXULElement("menu");
					rootmenu.id = "ucf-menu-open-with-submenu";
					rootmenu.className = "menu-iconic ucf-menu-open-with";
					rootmenu.setAttribute("label", "Открыть ссылку в…");
					let mpopup = document.createXULElement("menupopup");
					mpopup.append(fragment);
					rootmenu.append(mpopup);
					contextsep.before(rootmenu);
				}
				funcpopupshowing = () => {
					rootmenu.hidden = false;
				};
				funcpopuphiding = () => {
					rootmenu.hidden = true;
				};
			} else {
				contextsep.before(fragment);
				funcpopupshowing = () => {
					for(let arr of this._eventListeners) {
						if (arr[2].name === "command")
							arr[0].hidden = false;
					}
				};
				funcpopuphiding = () => {
					for(let arr of this._eventListeners) {
						if (arr[2].name === "command")
							arr[0].hidden = true;
					}
				};
			}
			addListener(popup, "popupshowing", function popupshowing(e) {
				if (e.target != popup || gContextMenu.webExtBrowserType === "popup") return;
				funcpopupshowing();
			});
			addListener(popup, "popuphiding", function popuphiding(e) {
				if (e.target != popup) return;
				funcpopuphiding();
			});
		};
		addListener(popup, "popupshowing", create);
		that.unloadlisteners.push("contextmenuopenwith");
	},
	destructor() {
		for(let arr of this._eventListeners)
			arr.shift().removeEventListener(...arr);
	}
}).init(this);