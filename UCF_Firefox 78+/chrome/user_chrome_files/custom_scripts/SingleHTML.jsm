/* SingleHtml © Лекс, правка Dumby, mod Dobrov +глобальные функции
вызов: Cu.getGlobalForObject(Cu)[Symbol.for("UcfGlob")].SingleHTML(1) если 0: выбор пути */

var self, name = "SingleHTML", EXPORTED_SYMBOLS = [`${name}Child`],
Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services,
{io, focus, obs, prefs, dirsvc} = Services;
class SingleHTMLChild extends JSWindowActorChild { //класс = name + Child
	receiveMessage() {return htmlAndName(this.contentWindow);}
}
ChromeUtils.domProcessChild.childID || ({
	init(topic) {
		ChromeUtils.registerWindowActor(name, {
			allFrames: true,
			child: {moduleURI: __URI__},
			messageManagerGroups: ["browsers"]
		});
		obs.addObserver(self = this, topic);
		obs.addObserver(function quit(s, t) {
			obs.removeObserver(quit, t);
			obs.removeObserver(self, topic);
		}, "quit-application-granted");
		this.handleEvent = e => this[e.type](e);
		globalThis[Symbol.for('UcfGlob')] = this.UcfGlob; //общие функции
	},
	observe(win) {
		win.document.getElementById("appMenu-popup").addEventListener("popupshowing", this);
		win.addEventListener("unload", this);
	},
	popupshowing(e) {
		this.unload(e);
		var popup = e.target;
		var btn = popup.ownerDocument.createXULElement("toolbarbutton");
		btn.id = "appMenu-ucf-save-html-button";
		btn.setAttribute("label", "Всё или выбранное в единый HTML");
		var before = "appMenu-save-file-button2", subviewbutton = "subviewbutton";
		btn.className = subviewbutton;
		btn.setAttribute("oncommand", "SingleHTML();");
		btn.SingleHTML = this.UcfGlob.SingleHTML;
		popup.querySelector('toolbarbutton[id^="'+ before +'"]').before(btn);
	},
	unload(e) {
		var win = e.target.ownerGlobal;
		win.removeEventListener("unload", this);
		win.document.getElementById("appMenu-popup").removeEventListener("popupshowing", this);
	},
	get win(){
		return this.ownerGlobal || Services.wm.getMostRecentWindow("navigator:browser");
	},
	async save(win, data, fname, host, to) {
		var path = self.UcfGlob.TitlePath(to, fname, host, win); //путь в зависимости от опций
		var dir = path[0], t = path[2].slice(0,48), path = path[1];
		try {dir.exists() && dir.isDirectory() || dir.create(dir.DIRECTORY_TYPE, 0o777);}
			catch(ex) {
				self.UcfGlob.Succes(dir.path, 0); return;}
		if (!to) { // диалог выбора папки
			var fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
			fp.init(parseInt(Services.appinfo.platformVersion) < 125 ? win : win.browsingContext,"", fp.modeSave);
			fp.defaultString = path.split(/.*[\/|\\]/)[1];
			fp.displayDirectory = dir;
			fp.appendFilters(fp.filterHTML); fp.appendFilters(fp.filterAll);
			var res = await new Promise(fp.open);
			if (res == fp.returnOK || res == fp.returnReplace)
				path = fp.file.path
			else return;
		}; to = 1;
		try {await IOUtils.writeUTF8(path, data);} catch {to = 0}
		await self.UcfGlob.Succes(path, to, '√ страница записана: '+ t);
	},
UcfGlob: {
	Pref(key,set){ //или key = [key,default]
		if(!Array.isArray(key)) key = [key];
		var t = prefs.getPrefType(key[0]), m = {b:"Bool",n:"Int",s:"String"};
		t = m[t == 128 ? "b" : t == 64 ? "n" : t == 32 ? "s" : ""];
		if(set == "get") return t; //тип опции
		if(!t) t = m[set != undefined ? (typeof set)[0] : (typeof key[1])[0]];
		if(t) if(set != undefined)
			prefs[`set${t}Pref`](key[0],set)
		else set = prefs[`get${t}Pref`](...key);
		return set;
	},
	toTab(url = 'about:serviceworkers', go, win = self.win){ //открыть вкладку | закрыть её | выбрать
		for(var tab of win.gBrowser.visibleTabs)
			if(tab.linkedBrowser.currentURI.spec == url)
				{go ? win.gBrowser.selectedTab = tab : win.gBrowser.removeTab(tab); return;}
		win.gBrowser.addTrustedTab(url);
		win.gBrowser.selectedTab = win.gBrowser.visibleTabs[win.gBrowser.visibleTabs.length -1];
	},
	aboutCfg(filter, win = self.win){ //на опцию
		win.gURLBar.value.startsWith("about:config") && this.toTab(win.gURLBar.value);
		var setFilter = (e,input = (e?.target || win.content.document).getElementById("about-config-search")) => {try {
			if(e || input.value != filter) input.setUserInput(filter);} catch{}
		},
		found = win.switchToTabHavingURI("about:config",true, {relatedToCurrent: true,
			triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
		if(found) setFilter(null,win);
		else win.gBrowser.selectedBrowser.addEventListener("pageshow",setFilter, {once: true});
	},
	dirGet(){ //dir [, subdirs]. last arg ? 1 ret path : open
		var f, d = [...arguments], c = Ci.nsIFile, e = "DfltDwnld", r = (d[d.length-1] == 1);
		try {var b = prefs.getComplexValue("browser.download.dir",c);} catch {b = dirsvc.get(e,c)}
		(r) && d.pop(); if (d[0] == e) f = b;
		else try {f = dirsvc.get(d[0], c);} catch{f = b}
		d.slice(1, d.length).forEach((c) => f.append(c));
		if(r) return f.path; f.exists() && f.launch();
	},
	Flash(id,color = 'rgba(0,200,0,0.3)',style,text,time,ms = 350,win = self.win){
		id = win.document.getElementById(id || 'urlbar-input-container');
		id &&= id.style; if(text) this.Status(text,time); //мигание, статус
		if(style && id) id.filter = style;
		if(color && id) id.background = color;
		if(ms && id) win.setTimeout(() => {
			id.removeProperty('filter'), id.removeProperty('background-color');}, ms);
	},
	async Succes(path, w = 1, text, win = self.win, s,i){
		this.Flash(0, w ? 'rgba(0,200,0,0.3)' : 'rgba(250,0,0,0.2)',0, w ? text : 0);
		if(!w) return; s = `${w == 1 ? "und" : "ov"}erline`;
		i = win.gBrowser.selectedTab.textLabel.style;
		if(!i.textDecoration.includes(s)) i.textDecoration = i.textDecoration +" "+ s;
		if(w != 1) return; //ClickPicSave, иначе FakeDownload
		w = await win.Downloads.createDownload({source: "about:blank",target: win.FileUtils.File(path)});
		(await win.Downloads.getList(win.Downloads.ALL)).add(w);
		await w.refresh(w.succeeded = true);
	},
	async SingleHTML(to = false, win = self.win) {
		var br = win.gBrowser.selectedBrowser, bc = focus.focusedContentBrowsingContext;
		if (bc?.top.embedderElement != br) bc = br.browsingContext;
		var actor = bc?.currentWindowGlobal?.getActor(name);
		actor && self.save(win, ...await actor.sendQuery(""), to); //htmlAndName
	},
	async Status(text,time, win = self.win){
		var StatusPanel = win.StatusPanel;
		if(StatusPanel.update.tid)
			win.clearTimeout(StatusPanel.update.tid)
		else {
			var {update} = StatusPanel;
			StatusPanel.update = () => {};
			StatusPanel.update.ret = () => {
				StatusPanel.update = update,StatusPanel.update();
		}}
		StatusPanel.update.tid = win.setTimeout(StatusPanel.update.ret,time || 5e3);
		StatusPanel._label = text;
	},
	TitlePath(to, d, h, win = self.win, n = 0, u = 99){ //0 web|2 pic|-№ cut, name, url
		if(parseInt(to) > 0) [n,to] = [to,n]; if(parseInt(to) < 0) u = Math.abs(to);
		if(typeof(to) != 'string' || !/.*\|/.test(to))
			to = prefs.getStringPref("extensions.user_chrome_files.savedirs","|||0");
		to = to.split('|').slice(0 + n, 2 + n); //Dir/Sub|[empty|0 title|1 url]
		d = /^blank/.test(d || "blank") ? win.gBrowser.selectedTab.label : d;
		d = d.replace(/\s+/g,' ').replace(/:/g,'։').replace(/[|<>]+/g,'_').replace(/([\\\/?*\"'`]+| ։։ .*)/g,'').slice(0,u).trim();
		h ||= decodeURIComponent(win.gURLBar.value); n = d, u = h;
		h = /^file:\/\//.test(h) ? 'file' : h.replace(/^.*u=|https?:\/\/|www\.|\/.*/g,'').replace(/^(moz-extension|ru\.|m\.)/,'').replace(/\/.*/,'');
		to[1] = (to[1] == "0") ? d : (to[1] == "1") ? h : "";
		d += "_"+ new Date().toLocaleDateString('ru', {day: 'numeric',month: 'numeric',year: '2-digit'}) +'-'+ new Date().toLocaleTimeString('en-GB').replace(/:/g,"։"); //дата-часы
		try {var dir = prefs.getComplexValue("browser.download.dir",Ci.nsIFile);} catch {dir = dirsvc.get("DfltDwnld",Ci.nsIFile)}
		var map = s => win.DownloadPaths.sanitize(s); //FIX имён
		to.map(map).forEach(dir.append);
		to = dir.clone(); to.append(d +'.html');
		return [dir, to.path, n, d, u, h]; //… имя, +дата, URL, домен
	},
	FileOk(path, win = self.win){ //файл|папка есть?
		if(path.startsWith("chrome://"))
			path = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).convertChromeURL(io.newURI(path)).spec;
		path = path.replace(/.+?:\/\//,"").replace(/%20/g," ");
		if (win.AppConstants.platform == "win") {
			path = path.replace(/^\/?/,"").replace(/\//g,"\\\\");}
		try {return win.FileUtils.File(String.raw`${path}`).exists();
		} catch {}; return false;
	},
	RunwA(){var args = [...arguments], path = args.shift(), file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile), proc = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
		file.initWithPath(path);
    try{proc.init(file);} catch{console.error(F.q + path); return 1;}
    proc.runwAsync(args, args.length);
  }
}

}).init("browser-delayed-startup-finished");

var htmlAndName = async mainWin => { //meteo7.ru не сохраняет SVG

	var resolveURL = function (url, base) {
		try { return io.newURI(url, null, io.newURI(base)).spec;} catch {}
	},
	getSelWin = function (w) {
		if (w.getSelection().toString()) return w;
		for (var i = 0, f, r; f = w.frames[i]; i++) {
			try { if (r = getSelWin(f)) return r;} catch(e) {}
		}
	},
	encodeImg = function (src, obj, canvas, img) {
		if (/^https?:\/\//.test(src)) {
			canvas = doc.createElement('canvas');
			if (!obj || obj.nodeName.toLowerCase() != 'img') {
				img = doc.createElement('img');
				img.src = src;
			} else
				img = obj;
			if (img.complete) try {
				canvas.width = img.naturalWidth || img.width || 128;
				canvas.height = img.naturalHeight || img.height || 128;
				canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
				src = canvas.toDataURL(/\.jpe?g/i.test(src) ? 'image/jpeg' : 'image/png'); //\.svg/i.test(src) ? 'image/svg+xml'
			} catch (e) {};
			if (img != obj) img.src = 'about:blank';
		};
		return src;
	},
	toSrc = function (obj) {
		var strToSrc = function (str) {
			var chr, ret = '', i = 0, meta = {'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','\x22':'\\\x22','\\':'\\\\'};
			while (chr = str.charAt(i++)) {
				ret += meta[chr] || chr;
			};
			return '\x22' + ret + '\x22';
		},
		arrToSrc = function (arr) {
			var ret = [];
			for (var i = 0; i < arr.length; i++) {
				ret[i] = toSrc(arr[i]) || 'null';
			};
			return '[' + ret.join(',') + ']';
		},
		objToSrc = function (obj) {
			var val, ret = [];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop) && (val = toSrc(obj[prop]))) ret.push(strToSrc(prop) + ': ' + val);
			};
			return '{' + ret.join(',') + '}';
		};
		switch (Object.prototype.toString.call(obj).slice(8, -1)) {
			case 'Array': return arrToSrc(obj);
			case 'Boolean':
			case 'Function':
			case 'RegExp': return obj.toString();
			case 'Date': return 'new Date(' + obj.getTime() + ')';
			case 'Math': return 'Math';
			case 'Number': return isFinite(obj) ? String(obj) : 'null';
			case 'Object': return objToSrc(obj);
			case 'String': return strToSrc(obj);
			default: return obj ? (obj.nodeType == 1 && obj.id ? 'document.getElementById(' + strToSrc(obj.id) + ')' : '{}') : 'null';
		}
	},
	selWin = getSelWin(mainWin), win = selWin || mainWin, doc = win.document, loc = win.location,
	ele, pEle, clone, reUrl = /(url\(\x22)(.+?)(\x22\))/g;

	if (selWin) {
		var rng = win.getSelection().getRangeAt(0);
		pEle = rng.commonAncestorContainer;
		ele = rng.cloneContents();
	} else {
		pEle = doc.documentElement;
		ele = (doc.body || doc.getElementsByTagName('body')[0]).cloneNode(true);
	};
	while (pEle) {
		if (pEle.nodeType == 1) {
			clone = pEle.cloneNode(false);
			clone.appendChild(ele);
			ele = clone;
		};
		pEle = pEle.parentNode
	};
	var sel = doc.createElement('div');
	sel.appendChild(ele);

	for (var el, all = sel.getElementsByTagName('*'), i = all.length; i--;) {
		el = all[i];
		if (el.style && el.style.backgroundImage) el.style.backgroundImage = el.style.backgroundImage.replace(reUrl, function (a, prev, url, next) {
			if (!/^[a-z]+:/.test(url)) url = resolveURL(url, loc.href);
			return prev + encodeImg(url) + next;
		});
		switch (el.nodeName.toLowerCase()) {
			case 'link':
			case 'style':
			case 'script': el.parentNode.removeChild(el); break;
			case 'a':
			case 'area': if (el.hasAttribute('href') && el.getAttribute('href').charAt(0) != '#') el.href = el.href; break;
			case 'img':
			case 'input': if (el.hasAttribute('src')) el.src = encodeImg(el.src, el); break;
			case 'audio':
			case 'video':
			case 'embed':
			case 'frame':
			case 'iframe': if (el.hasAttribute('src')) el.src = el.src; break;
			case 'object': if (el.hasAttribute('data')) el.data = el.data; break;
			case 'form': if (el.hasAttribute('action')) el.action = el.action; break;
		}
	};
	var head = ele.insertBefore(doc.createElement('head'), ele.firstChild), meta = doc.createElement('meta'), sheets = doc.styleSheets;
	meta.httpEquiv = 'content-type';
	meta.content = 'text/html; charset=utf-8';
	head.appendChild(meta);
	var title = doc.getElementsByTagName('title')[0];
	title && head.appendChild(title.cloneNode(true));

	head.copyScript = function (unsafeWin) {
		if ('$' in unsafeWin) return;
		var f = doc.createElement('iframe');
		f.src = 'about:blank';
		f.setAttribute('style', 'position:fixed;left:0;top:0;visibility:hidden;width:0;height:0;');
		doc.documentElement.appendChild(f);
		var str, script = doc.createElement('script');
		script.type = 'text/javascript';
		for (var name in unsafeWin) {
			if (name in f.contentWindow || !/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name)) continue;
			try {
				str = toSrc(unsafeWin[name]);
				if (!/\{\s*\[native code\]\s*\}/.test(str)) {
					script.appendChild(doc.createTextNode('var ' + name + ' = ' + str.replace(/<\/(script>)/ig, '<\\/$1') + ';\n'));
				}
			} catch (e) {};
		};
		f.parentNode.removeChild(f);
		if (script.childNodes.length) this.nextSibling.appendChild(script);
	};
	head.copyScript(win.wrappedJSObject || win);

	head.copyStyle = function (s) {
		if (!s) return;
		var style = doc.createElement('style');
		style.type = 'text/css';
		if (s.media && s.media.mediaText) style.media = s.media.mediaText;
		try {
			for (var i = 0, rule; rule = s.cssRules[i]; i++) {
				if (rule.type != 3) {
					if((!rule.selectorText || rule.selectorText.indexOf(':') != -1) || (!sel.querySelector || sel.querySelector(rule.selectorText))) {
						var css = !rule.cssText ? '' : rule.cssText.replace(reUrl, function (a, prev, url, next) {
							if (!/^[a-z]+:/.test(url)) url = resolveURL(url, s.href || loc.href);
							if(rule.type == 1 && rule.style && rule.style.backgroundImage) url = encodeImg(url);
							return prev + url + next;
						});
						style.appendChild(doc.createTextNode(css + '\n'));
					}
				} else { this.copyStyle(rule.styleSheet);}
			}
		} catch(e) {
			if (s.ownerNode) style = s.ownerNode.cloneNode(false);
		};
		this.appendChild(style);
	};
	for (var j = 0; j < sheets.length; j++) head.copyStyle(sheets[j]);
	head.appendChild(doc.createTextNode('\n'));

	var doctype = '', dt = doc.doctype;
	if (dt && dt.name) {
		doctype += '<!DOCTYPE ' + dt.name;
		if (dt.publicId) doctype += ' PUBLIC \x22' + dt.publicId + '\x22';
		if (dt.systemId) doctype += ' \x22' + dt.systemId + '\x22';
		doctype += '>\n';
	};
	var onlyName = selWin ? win.getSelection().toString() : (title && title.text ? title.text : loc.pathname.split('/').pop());
	return [doctype + sel.innerHTML +'\n<a href='+ (loc.protocol != 'data:' ? loc.href : 'data:uri') +'><small><blockquote>источник: '+ new Date().toLocaleString("ru") +'</blockquote></small></a>', onlyName, loc.hostname];
}