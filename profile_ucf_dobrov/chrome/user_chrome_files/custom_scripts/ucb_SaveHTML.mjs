/* SingleHtml Ff103+ © Лекс, правка Dumby, mod Dobrov +глобальные функции
вызов: Cu.getGlobalForObject(Cu)[Symbol.for("UcfAPI")].SingleHTML(1) если 0: выбор пути */

var self, name = "SingleHTML", EXPORTED_SYMBOLS = [`${name}Child`], {io, focus, obs, prefs, dirsvc} = Services;
export class SingleHTMLChild extends JSWindowActorChild { //класс = name + Child
	receiveMessage() {return htmlAndName(this.contentWindow);}
}
ChromeUtils.domProcessChild.childID || ({
	init(topic) {
		ChromeUtils.registerWindowActor(name, {
			allFrames: true,
			child: {esModuleURI: Components.stack.filename},
			messageManagerGroups: ["browsers"]
		});
		obs.addObserver(self = this, topic);
		obs.addObserver(function quit(s, t) {
			obs.removeObserver(quit, t); obs.removeObserver(self, topic);
		}, "quit-application-granted");
		this.handleEvent = e => this[e.type](e);
		globalThis[Symbol.for('UcfAPI')] = this.UcfAPI; //общие функции
	},
	observe(win) {
		win.document.getElementById("appMenu-popup").addEventListener("popupshowing", this);
		win.addEventListener("unload", this);
	},
	popupshowing(e) {
		this.unload(e);
		var popup = e.target;
		var b = popup.ownerDocument.createXULElement("toolbarbutton");
		b.id = "appMenu-ucf-save-html-button";
		b.setAttribute("label", "Всё или выбранное в единый HTML");
		var before = "appMenu-save-file-button2";
		b.className = "subviewbutton";
		b.setAttribute("oncommand", "SingleHTML();");
		b.SingleHTML = this.UcfAPI.SingleHTML;
		popup.querySelector('toolbarbutton[id^="'+ before +'"]').before(b);
	},
	unload(e) {
		var win = e.target.ownerGlobal;
		win.removeEventListener("unload", this);
		win.document.getElementById("appMenu-popup").removeEventListener("popupshowing", this);
	},
	get win(){
		return this.ownerGlobal || Services.wm.getMostRecentWindow("navigator:browser");
	},
	async save(data, fname, protocol, to, win = self.win) {
		var path = self.UcfAPI.TitlePath(to, fname); //путь в зависимости от опций
		var dir = path[0], t = path[2].slice(0,48), path = path[1];
		try {dir.exists() && dir.isDirectory() || dir.create(dir.DIRECTORY_TYPE, 0o777);}
			catch(ex){
				self.UcfAPI.Succes(dir.path, 0); return;}
		if (!to){ //диалог выбора папки
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
		try {await IOUtils.writeUTF8(path, data +'<a href='+ (protocol != 'data:' ? self.UcfAPI.URL() : 'data:uri') +'><small><blockquote>источник: '+ new Date().toLocaleString("ru") +'</blockquote></small></a>');} catch {to = 0}
		await self.UcfAPI.Succes(path, to, '√ сайт записан: '+ t);
	},
	w1251(txt, win1251 = new TextDecoder("windows-1251")){
		return txt.replace(/(?:%[0-9A-F]{2})+/g, txt => win1251.decode(new Uint8Array(txt.replace(/%/g,",0x").slice(1).split(","))));
	},
UcfAPI: {
	async restart(){
		var meth = Services.appinfo.inSafeMode ? "restartInSafeMode" : "quit";
		Services.startup[meth](Ci.nsIAppStartup.eAttemptQuit | Ci.nsIAppStartup.eRestart);
	},
	maybeRestart(conf, exe = this.restart, lab = Services.appinfo.vendor){
		if (conf && !Services.prompt.confirm(null, lab, "Перезапустить браузер?")) return;
		let cancel = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
		Services.obs.notifyObservers(cancel, "quit-application-requested", "restart");
		return cancel.data ? Services.prompt.alert(null, lab, "Запрос на выход отменён") : exe();
	},
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
	readFromClip({clipboard} = Services, data = {}, win = self.win){
		try {let trans = Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable),
			flavor = `text/${parseInt(Services.appinfo.platformVersion) >= 111 ? "plain" : "unicode"}`;
			trans.init(win.docShell.QueryInterface(Ci.nsILoadContext));
			trans.addDataFlavor(flavor);
			clipboard.getData(trans, clipboard.kGlobalClipboard);
			trans.getTransferData(flavor, data);
			if (data.value)
				return data.value.QueryInterface(Ci.nsISupportsString).data;
		} catch {return ""}
	},
	dirGet(){ //dir [, subdirs] last > 1 ret object
		var l,c = Ci.nsIFile, a = [...arguments], d = a.at(-1); //FF90+
		if(d === +d) l = a.pop();
		try {d = prefs.getComplexValue("browser.download.dir",c);} catch {d = dirsvc.get("DfltDwnld",c)}
		if (a[0])
			try {d = dirsvc.get(a[0],c);} catch{}
		a.slice(1, a.length).forEach((c) => d.append(c));
		if(l == 1) d = d.path;
		if(l) return d; else
			d.exists() && d.launch();
	},
	async Status(str, sec,win = self.win){
		var StatusPanel = win.StatusPanel;
		if(StatusPanel.update.tid)
			win.clearTimeout(StatusPanel.update.tid)
		else {
			var {update} = StatusPanel;
			StatusPanel.update = () => {};
			StatusPanel.update.ret = () => {
				StatusPanel.update = update,StatusPanel.update();
		}}
		StatusPanel.update.tid = win.setTimeout(StatusPanel.update.ret,sec * 1e3 || 5e3);
		StatusPanel._label = str;
	},
	Flash(id,rgb = 'rgba(0,200,0,0.3)',css,txt,sec,ms = 350,win = self.win){
		id = win.document.getElementById(id || 'urlbar-background');
		id &&= id.style; if(isNaN(Number(txt)))
			this.Status(txt,sec); //мигание, статус
		if(css && id) id.filter = css;
		if(rgb && id) if(txt < 0)
			id.fill = rgb; else id.background = rgb;
		if(!(txt < 0) && ms && id) win.setTimeout(
			()=> ["filter","background","fill"].forEach((c)=> id.removeProperty(c)), ms);
	},
	async Succes(path, w = 1, str, win = self.win, s,i){
		this.Flash(0, w ? undefined : 'rgba(250,0,0,0.2)',0, w ? str : 0);
		if(!w) return; s = `${w == 1 ? "und" : "ov"}erline`;
		i = win.gBrowser.selectedTab.textLabel.style;
		if(!i.textDecoration.includes(s)) i.textDecoration = i.textDecoration +" "+ s;
		if(w != 1) return; //ClickPicSave, иначе FakeDownload
		w = await win.Downloads.createDownload({source: "about:blank",target: win.FileUtils.File(path)});
		(await win.Downloads.getList(win.Downloads.ALL)).add(w);
		await w.refresh(w.succeeded = true);
	},
	async SingleHTML(to = false){
		var br = self.win.gBrowser.selectedBrowser, bc = focus.focusedContentBrowsingContext;
		if (bc?.top.embedderElement != br) bc = br.browsingContext;
		var actor = bc?.currentWindowGlobal?.getActor(name);
		actor && self.save(...await actor.sendQuery(""), to); //htmlAndName
	},
	URL(url, host, win = self.win){
		url = decodeURIComponent(self.w1251(url || win.gBrowser.selectedBrowser.currentURI.displaySpec).replace(/.+url=http/,'http'));
		if(host) url = /^file:\/\//.test(url) ? 'file' : url.replace(/^.*u=|https?:\/\/|www\.|\/.*/g,'').replace(/^(moz-extension|ru\.|m\.)/,'').replace(/\/.*/,'');
		return url;
	},
	DateHour(u,m,t = 1){let d = u ? new Date(u) : new Date();
		return d.getDate() + (m ? m[d.getMonth()] : '.'+ (d.getMonth()+1) +'.') + d.getFullYear().toString().slice(-2) + (t ? '-'+ d.toLocaleTimeString().replace(/:/g,'։') : '');
	},
	TitlePath(to, d, h, win = self.win, n = 0, u = 99){ //0 web|2 pic|-№ cut, name, url
		if(parseInt(to) > 0) [n,to] = [to,n];
		if(parseInt(to) < 0) u = Math.abs(to);
		if(typeof(to) != 'string' || !/.*\|/.test(to))
			to = prefs.getStringPref("extensions.user_chrome_files.savedirs","|||0");
		to = to.split('|').slice(0 + n, 2 + n); //Dir/Sub|[empty|0 title|1 url]
		d = /^blank/.test(d || "blank") ? win.gBrowser.selectedTab.label : d;
		d = d.replace(/\s+/g,' ').replace(/:/g,'։').replace(/[|<>]+/g,'_').replace(/([\\\/?*\"'`]+| ։։ .*)/g,'').slice(0,u).trim();
		n = this.URL(); u = h || n; h = this.URL(0, 1); n = d;
		to[1] = (to[1] == "0") ? d : (to[1] == "1") ? h : "";
		d += "_"+ this.DateHour(); //дата
		let dir = this.dirGet(0,2);
		let map = s => win.DownloadPaths.sanitize(s); //FIX имён
		to.map(map).forEach(dir.append);
		to = dir.clone(); to.append(d +'.html');
		return [dir,to.path,n,d,u,h]; //… имя, +дата, url, домен
	},
	FileOk(path = "", read, win = self.win){ //файл|папка есть?
		let chr = path; if(path.startsWith("chrome://"))
			path = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).convertChromeURL(io.newURI(path)).spec;
		path = path.replace(/.+?:\/\//,"").replace(/%20/g," ");
		if (win.AppConstants.platform == "win"){
			path = path.replace(/^\/?/,"").replace(/\//g,"\\\\");}
		try { //read only chrome://…
			return read ? Cu.readUTF8URI(io.newURI(chr)) : win.FileUtils.File(path).exists();
		} catch {}; return false;
	},
	RunwA(){let args = [...arguments], path = args.shift(), file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile), proc = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
		file.initWithPath(path);
		try{proc.init(file);} catch{throw "Ошибка "+ path}
		proc.runwAsync(args, args.length);}
}
}).init("browser-delayed-startup-finished");

var htmlAndName = async mainWin =>{ //meteo7.ru не сохраняет SVG
	var resolveURL = (url, base) =>{
		try {return io.newURI(url, null, io.newURI(base)).spec;} catch {}
	},
	getSelWin = w =>{
		if (w.getSelection().toString()) return w;
		for (var i = 0, f, r; f = w.frames[i]; i++) {
			try {if (r = getSelWin(f)) return r;} catch {}
		}
	},
	encodeImg = (src, obj, canvas, img) =>{
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
			} catch {}
			if (img != obj) img.src = 'about:blank';
		};
		return src;
	},
	toSrc = obj =>{
		var strToSrc = str =>{
			var chr, ret = '', i = 0, meta = {'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','\x22':'\\\x22','\\':'\\\\'};
			while (chr = str.charAt(i++)) {
				ret += meta[chr] || chr;
			};
			return '\x22'+ ret +'\x22';
		},
		arrToSrc = arr =>{
			var ret = [];
			for (var i = 0; i < arr.length; i++) {
				ret[i] = toSrc(arr[i]) || 'null';
			};
			return '['+ ret.join(',') +']';
		},
		objToSrc = obj =>{
			var val, ret = [];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop) && (val = toSrc(obj[prop]))) ret.push(strToSrc(prop) +': '+ val);
			};
			return '{'+ ret.join(',') +'}';
		};
		switch (Object.prototype.toString.call(obj).slice(8, -1)){
			case 'Array': return arrToSrc(obj);
			case 'Boolean':
			case 'Function':
			case 'RegExp': return obj.toString();
			case 'Date': return 'new Date('+ obj.getTime() +')';
			case 'Math': return 'Math';
			case 'Number': return isFinite(obj) ? String(obj) : 'null';
			case 'Object': return objToSrc(obj);
			case 'String': return strToSrc(obj);
			default: return obj ? (obj.nodeType == 1 && obj.id ? 'document.getElementById('+ strToSrc(obj.id) +')' : '{}') : 'null';}
	},
	selWin = getSelWin(mainWin), win = selWin || mainWin, doc = win.document, loc = win.location,
	ele, pEle, clone, reUrl = /(url\(\x22)(.+?)(\x22\))/g;

	if (selWin){
		var rng = win.getSelection().getRangeAt(0);
		pEle = rng.commonAncestorContainer;
		ele = rng.cloneContents();
	} else {
		pEle = doc.documentElement;
		ele = (doc.body || doc.getElementsByTagName('body')[0]).cloneNode(true);
	};
	while (pEle) {
		if (pEle.nodeType == 1){
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
			try {str = toSrc(unsafeWin[name]);
				if (!/\{\s*\[native code\]\s*\}/.test(str)) {
					script.appendChild(doc.createTextNode('var '+ name +' = '+ str.replace(/<\/(script>)/ig, '<\\/$1') +';\n'));
				}
			} catch {}
		};
		f.parentNode.removeChild(f);
		if (script.childNodes.length) this.nextSibling.appendChild(script);
	};
	head.copyScript(win.wrappedJSObject || win);
	head.copyStyle = function(s){
		if (!s) return;
		var style = doc.createElement('style');
		style.type = 'text/css';
		if (s.media && s.media.mediaText) style.media = s.media.mediaText;
		try {for (var i = 0, rule; rule = s.cssRules[i]; i++) {
				if (rule.type != 3) {
					if((!rule.selectorText || rule.selectorText.indexOf(':') != -1) || (!sel.querySelector || sel.querySelector(rule.selectorText))) {
						var css = !rule.cssText ? '' : rule.cssText.replace(reUrl, (a, prev, url, next) =>{
							if (!/^[a-z]+:/.test(url)) url = resolveURL(url, s.href || loc.href);
							if(rule.type == 1 && rule.style && rule.style.backgroundImage) url = encodeImg(url);
							return prev + url + next;
						});
						style.appendChild(doc.createTextNode(css + '\n'));
					}
				} else {this.copyStyle(rule.styleSheet);}
			}
		} catch {if (s.ownerNode) style = s.ownerNode.cloneNode(false);}
		this.appendChild(style);
	};
	for (var j = 0; j < sheets.length; j++) head.copyStyle(sheets[j]);
	head.appendChild(doc.createTextNode('\n'));
	var doctype = '', dt = doc.doctype;
	if (dt && dt.name) {
		doctype += '<!DOCTYPE '+ dt.name;
		if (dt.publicId) doctype += ' PUBLIC \x22'+ dt.publicId +'\x22';
		if (dt.systemId) doctype += ' \x22'+ dt.systemId +'\x22';
		doctype += '>\n';
	};
	var onlyName = selWin ? win.getSelection().toString() : (title && title.text ? title.text : loc.pathname.split('/').pop());
	return [doctype + sel.innerHTML, onlyName, loc.protocol];
}