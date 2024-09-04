(this.contextmenuopenwith = { //на основе forum.mozilla-russia.org/viewtopic.php?pid=809407#p809407
	_eventListeners: [],
	init(that) { var Hint = "Открыть выделенный текст или ссылку\nПравый клик | Shift - ссылка из буфера",
		selector = "#context-sep-selectall", // вставить пункты меню перед этим селектором
		attricon = true, // false: без иконок атрибут "image"
		submenu = false, /* подменю программ для ссылок

	name: 'Prefix или пусто|Имя', path: 'путь', Необязательно: icon: 'иконка',
	args: `опции через пробел "в двойных кавычках считаются одной"`,
	roll: аналог args, выполняется средним кликом (+Shift: адрес из буфера)
	hint: подсказка в строке меню для roll
	%OpenURI выделенный текст или URL страницы/ссылки */

		OS_linux = [
			{ name: 'Ссылку в |плеер VLC', path: '/usr/bin/vlc',
				icon: 'moz-icon://stock/vlc?size=menu'
			},
			{ name: 'Скачать в |Yt-dlp', path: '/usr/bin/konsole', //предпочтительно .mp4 hevc|h265|avc|h264 <=1080
				args: `--hold --workdir ~/Загрузки -e "yt-dlp -f %quotbv[height<=1080][ext=mp4][vcodec~='^(hevc|h265|avc|h264)']+ba[ext~='(aac|m4a)']/best[height<=1080][ext=mp4]/best[height<=1080]/best%quot %OpenURI"`,
				hint: 'скачать в FFmpeg',
				roll: `--hold --workdir ~/Загрузки -e "ffmpeg -i %OpenURI -c copy -f mp4 video.mp4"`,
				icon: 'moz-icon://stock/youtube-dl?size=menu'}
		],
		OS_win = [
			{	name: 'Ссылку в |плеер VLC', path: 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
				args: `"%OpenURI"`
			},
			{ name: 'Ссылку в |плеер PotPlayer', path: 'C:\\Program Files\\PotPlayer\\PotPlayerMini64.exe',
				args: `"%OpenURI"`
			},
			{ name: 'Открыть в |Microsoft Edge', path: 'C:\\Windows\\explorer.exe', args: `"microsoft-edge:%OpenURI "`}
		],
		OS_macosx = [
			{	name: '|Видео загрузчик yt-dlp', path: '/usr/bin/osascript',
				args: `-e "tell app %quotTerminal%quot to activate do script %quotrun ytdlp '%OpenURI' || { yt-dlp '%OpenURI' && say сделано;}; exit%quot"`,
				hint: 'опции --downloader ffmpeg…',
				roll: `-e "tell app %quotTerminal%quot to activate do script %quotyt-dlp --downloader ffmpeg --hls-use-mpegts '%OpenURI' && say сделано; exit%quot"`,
				icon: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4TC0AAAAvD8ADEA8QEfMfQlFt29T7MhRBFNGIJsqLYPhnqEJE/8P8772bd+qxBfOVCwIA'
			},
			{	name: 'Ссылку в |плеер MPV', path: '/usr/bin/osascript', //FIX only mpv
				args: `-e "tell app %quotTerminal%quot to do script %quotopen -b io.mpv '%OpenURI' --args '--ytdl-format=bestvideo[height<=?720][fps<=?30]+bestaudio/best[height<=?720][fps<=?30]'; exit%quot" -e "tell app %quotSystem Events%quot to set visible of process %quotTerminal%quot to false"`,
				hint: 'скачать книгу в Elib2Ebook',
				roll: `-e "tell app %quotTerminal%quot to do script %quotcd ${Downloadir()}; Elib2Ebook -f epub -u '%OpenURI' && say сделано; exit%quot"`,
				icon: 'moz-icon://file:///System/Applications/Automator.app?size=16'
			},
			{	name: 'Открыть в браузере |Safari', path: '/usr/bin/open',
				args: `-b com.apple.Safari -u "%OpenURI"`,
				icon: 'chrome://devtools/skin/images/browsers/safari.svg'},
		];
		try {var arrOS = eval('OS_'+ AppConstants.platform);} catch {return};
		if (!arrOS || !arrOS.length) return;
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
			} catch {}
			return url;
		};
		var getCurrentURL = (url = gBrowser.selectedBrowser.currentURI.displaySpec) => {
			try {
				let _url = ReaderMode.getOriginalUrl(url);
				if (_url)
					url = Services.io.newURI(_url).displaySpec;
			} catch {}
			return url;
		};
		var getURL = key => {
			return !key
			? gContextMenu?.linkURI?.displaySpec || getCurrentURL()
			: readFromClipboard();
		};
		var popup = document.querySelector("#contentAreaContextMenu");
		var create = e => {
			if (e.target != popup || gContextMenu.webExtBrowserType === "popup" ||
				(gContextMenu.isContentSelected || gContextMenu.onTextInput) && !gContextMenu.linkURL) return;
			popup.removeEventListener("popupshowing", create);
			this._eventListeners.shift();
			var contextsel = popup.querySelector(`:scope > ${selector}`) || popup.querySelector(":scope > menuseparator:last-of-type");
			var fragment = document.createDocumentFragment();
			if (arrOS.length == 1) submenu = false;
			var itemId = 0;
			arrOS.forEach(item => {
				let name = item.name.split('|'), {path, args, roll, hint} = item;
				if (!name || !path) return;
				if (submenu) name.shift();
				name = name.join('');
				if (hint) hint = '\nКолёсико: '+ hint;
				var icon = item.icon || `moz-icon://file://${path}?size=16`;
				let mitem = document.createXULElement("menuitem");
				mitem.id = `ucf-menu-open-with-${++itemId}`;
				mitem.className = "menuitem-iconic ucf-menu-open-with";
				mitem.setAttribute("label", `${name}`);
				mitem.apppath = path; mitem.roll = roll;
				mitem.tooltipText = Hint + (hint || "");
				mitem.appargs = args;
				if (attricon)
					mitem.setAttribute("image", icon);
				fragment.append(mitem);
				addListener(mitem, "command", function command(e) {
					try {
						let trg = e.currentTarget, args = trg.appargs, file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
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
										return sp.replace(/^["']+|["']+$/g, "").replace(/%quot/g, '"').replace(/%OpenURI/g, getURL(e.shiftKey || e.button == 2));
									}
									return sp.replace(/^["']+|["']+$/g, "").replace(/%quot/g, '"');
								});
								if (!openuri)
									args.push(getURL(e.shiftKey || e.button == 2));
							} else
								args = [getURL(e.shiftKey || e.button == 2)];
							process.runwAsync(args, args.length);
						} else
							file.launch();
					} catch {}
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
					contextsel.before(rootmenu);
				}
				funcpopupshowing = () => {
					rootmenu.hidden = false;
				};
				funcpopuphiding = () => {
					rootmenu.hidden = true;
				};
			} else {
				contextsel.before(fragment);
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
				if (e.target != popup || gContextMenu.webExtBrowserType === "popup" ||
					(gContextMenu.isContentSelected || gContextMenu.onTextInput) && !gContextMenu.linkURL) return;
				funcpopupshowing();
			});
			addListener(popup, "popuphiding", function popuphiding(e) {
				if (e.target != popup) return;
				funcpopuphiding();
			});
		};
		addListener(popup, "popupshowing", create);
		that.unloadlisteners.push("contextmenuopenwith");
		function Downloadir(c = Ci.nsIFile){
			var d = Services.dirsvc.get("DfltDwnld",c);
			try {var d = Services.prefs.getComplexValue("browser.download.dir",c);} catch {}
			return d.path;
		}
	},
	destructor() {
		for(let arr of this._eventListeners)
			arr.shift().removeEventListener(...arr);
	}
}).init(this);