// в custom_script.js (async url => ChromeUtils.import(url))( "chrome://user_chrome_files/content/custom_scripts/AppMenuTbbSaveHTMLChild.jsm");

var self, name = "AppMenuTbbSaveHTML", EXPORTED_SYMBOLS = [name + "Child"];
var {io, focus, obs} = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services;

class AppMenuTbbSaveHTMLChild extends JSWindowActorChild {
	receiveMessage() {
		return htmlAndName(this.contentWindow);
	}
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
	},
	observe(win) {
		win.document.getElementById("appMenu-popup")
			.addEventListener("popupshowing", this);
		win.addEventListener("unload", this);
	},
	popupshowing(e) {
		this.unload(e);
		var popup = e.target;
		var btn = popup.ownerDocument.createXULElement("toolbarbutton");
		btn.id = "appMenu-ucf-save-html-button";
		btn.setAttribute("label", "Страница | выбранное в единый HTML");
		var before = "appMenu-save-file-button2", subviewbutton = "subviewbutton";
		if ( parseInt(popup.ownerGlobal.Services.appinfo.version) < 89 ) {
			subviewbutton = "subviewbutton subviewbutton-iconic", before = "appMenu-print-button";
			btn.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACNJREFUCNdjYH/AgBX9/89Q/4/B/g+D/A8G/g8gEeYDDIwNAIB7EDCcKCcMAAAAAElFTkSuQmCC");
		}
		btn.className = subviewbutton;
		btn.setAttribute("oncommand", "saveHTML();");
		btn.saveHTML = this.saveHTML;
		popup.querySelector('toolbarbutton[id^="'+ before +'"]').before(btn);
	},
	unload(e) {
		var win = e.target.ownerGlobal;
		win.removeEventListener("unload", this);
		win.document.getElementById("appMenu-popup").removeEventListener("popupshowing", this);
	},
	async saveHTML() {
		var win = this.ownerGlobal;
		var br = win.gBrowser.selectedBrowser;
		var bc = focus.focusedContentBrowsingContext;
		if (bc?.top.embedderElement != br) bc = br.browsingContext;

		var actor = bc?.currentWindowGlobal?.getActor(name);
		actor && self.save(win, ...await actor.sendQuery(""));
	},
	async save(win, fileContent, fileName) {
		var fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
		fp.init(win, "", fp.modeSave);
		fp.defaultString = fileName;
		fp.appendFilters(fp.filterHTML);
		fp.appendFilters(fp.filterAll);
		var res = await new Promise(fp.open);
		if (res == fp.returnOK || res == fp.returnReplace)
			this.write(fp.file.path, fileContent);
	},
	write(path, html) {
		if (typeof IOUtils != "object") {
			var {OS} = ChromeUtils.import("resource://gre/modules/osfile.jsm");
			var IOUtils = {writeUTF8: (path, txt) => OS.File.writeAtomic(path, new TextEncoder().encode(txt))};
		}
		(this.write = IOUtils.writeUTF8 || IOUtils.writeAtomicUTF8)(path, html);
	}
}).init("browser-delayed-startup-finished");

var htmlAndName = async mainWin => {

	var resolveURL = function (url, base) {
		try {
			return io.newURI(url, null, io.newURI(base)).spec;
		} catch {}
	};
	var getSelWin = function (w) {
		if (w.getSelection().toString()) return w;
		for (var i = 0, f, r; f = w.frames[i]; i++) {
			try {
				if (r = getSelWin(f)) return r;
			} catch(e) {}
		}
	};
	var encodeImg = function (src, obj) {
		var canvas, img, ret = src;
		if (/^https?:\/\//.test(src)) {
			canvas = doc.createElement('canvas');
			if (!obj || obj.nodeName.toLowerCase() != 'img') {
				img = doc.createElement('img');
				img.src = src;
			} else {
				img = obj;
			};
			if (img.complete) try{
				canvas.width = img.width;
				canvas.height = img.height;
				canvas.getContext('2d').drawImage(img, 0, 0);
				ret = canvas.toDataURL((/\.jpe?g/i.test(src) ? 'image/jpeg' : 'image/png'));
			} catch (e) {};
			if (img != obj) img.src = 'about:blank';
		};
		return ret;
	};
	var toSrc = function (obj) {
		var strToSrc = function (str) {
			var chr, ret = '', i = 0, meta = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '\x22' : '\\\x22', '\\': '\\\\'};
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
	};

	var selWin = getSelWin(mainWin), win = selWin || mainWin, doc = win.document, loc = win.location;
	var ele, pEle, clone, reUrl = /(url\(\x22)(.+?)(\x22\))/g;

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
	var head = ele.insertBefore(doc.createElement('head'), ele.firstChild);
	var meta = doc.createElement('meta');
	meta.httpEquiv = 'content-type';
	meta.content = 'text/html; charset=utf-8';
	head.appendChild(meta);
	var title = doc.getElementsByTagName('title')[0];
	if (title) head.appendChild(title.cloneNode(true));

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
				} else {
					this.copyStyle(rule.styleSheet);
				}
			}
		} catch(e) {
			if (s.ownerNode) style = s.ownerNode.cloneNode(false);
		};
		this.appendChild(style);
	};
	var sheets = doc.styleSheets;
	for (var j = 0; j < sheets.length; j++) head.copyStyle(sheets[j]);
	head.appendChild(doc.createTextNode('\n'));

	var doctype = '', dt = doc.doctype;
	if (dt && dt.name) {
		doctype += '<!DOCTYPE ' + dt.name;
		if (dt.publicId) doctype += ' PUBLIC \x22' + dt.publicId + '\x22';
		if (dt.systemId) doctype += ' \x22' + dt.systemId + '\x22';
		doctype += '>\n';
	};
	var fileName = selWin ? win.getSelection().toString() : (title && title.text ? title.text : loc.pathname.split('/').pop());
	fileName = fileName.replace(/[:\\\/<>?*|"]+/g, '_').replace(/\s+/g, ' ').slice(0, 100).replace(/^\s+|\s+$/g, '');
	fileName += (function () {
		var d = new Date(), z = function(n){return '_' + (n < 10 ? '0' : '') + n};
		return z(d.getHours()) + z(d.getMinutes()) + z(d.getSeconds());
	})();
	if(!/\.html?$/.test(fileName))fileName += '.html';

	return [doctype + sel.innerHTML + '\n<!-- This document saved from ' + (loc.protocol != 'data:' ? loc.href : 'data:uri') + ' -->', fileName];
}