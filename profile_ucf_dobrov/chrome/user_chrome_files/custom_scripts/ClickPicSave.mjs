// © Dumby, mod Dobrov сохранить картинку колёсиком или перетащив вправо; DBL поиск похожих. нужен SingleHTML
export {MouseImgSaverChild, MouseImgSaverParent};
var u = {get it() {
	delete this.it; return this.it = Cc["@mozilla.org/image/tools;1"].getService(Ci.imgITools);
}};
["E10SUtils", "PrivateBrowsingUtils"].forEach(name => Object.defineProperty(u, name, {
	configurable: true, enumerable: true, get() {
		var url = `resource://gre/modules/${name}.`;
		try {var exp = ChromeUtils.importESModule(url + "sys.mjs");}
		catch {exp = ChromeUtils.import(url + "jsm");}
		delete this[name]; return this[name] = exp[name];
	}
}));

class MouseImgSaverChild extends JSWindowActorChild {
	handleEvent(e) { //клики мыши
		if (e.button > 1) return; //ЛКМ+СКМ
		var trg = e.explicitOriginalTarget; // dragstart
		trg.nodeType == Node.ELEMENT_NODE
			&& trg instanceof Ci.nsIImageLoadingContent
			&& this[e.type](trg, e);
	}
	handleDragEvent(e) {
		this[e.type](e);
	}
	dragstart(trg, e) {
		this.trg = trg;
		this.x = e.screenX; this.y = e.screenY;
		this.drag("add");
		this.handleEvent = this.handleDragEvent;
		this.checkTextLinkyTool(trg.ownerDocument);
	}
	events = ["dragover", "drop", "dragend"];
	drag(meth = (delete this.handleEvent, delete this.trg, "remove")) {
		meth += "EventListener";
		var win = this.contentWindow;
		for(var type of this.events) win[meth](type, this, true);
	}
	drop() {
		this.drag();
	}
	dragover(e) {
		var {x, y} = this,
			cx = e.screenX, cy = e.screenY,
			dx = cx - x,
			ax = Math.abs(dx), ay = Math.abs(cy - y);

		if (ax < 10 && ay < 10) return;
		if (dx < 0 || ax < ay) return this.drag();
		this.x = cx; this.y = cy;
	}
	dragend(e) { // перетаскивание рисунка
		var dt = e.dataTransfer, {trg} = this;
		this.drag();
		dt.mozUserCancelled || this.send(trg, e.screenX); // сохранить
		// dt.mozUserCancelled || this.sendAsyncMessage("dragend", (trg.currentRequestFinalURI || uri).spec);
	}
	auxclick(trg) { //СКМ
		trg.matches(":any-link :scope") || this.send(trg);
	}
	dblclick(trg) { // ЛКМ
		trg.matches(":any-link :scope")
			|| this.sendAsyncMessage("dblclick", (trg.currentRequestFinalURI || uri).spec);
	}
	send(trg, sx) {
		var uri = trg.currentURI;
		if (!uri) return;
		var doc = trg.ownerDocument;
		var cookieJarSettings = u.E10SUtils.serializeCookieJarSettings(doc.cookieJarSettings);
		var referrerInfo = Cc["@mozilla.org/referrer-info;1"].createInstance(Ci.nsIReferrerInfo);
		referrerInfo.initWithElement(trg);
		referrerInfo = u.E10SUtils.serializeReferrerInfo(referrerInfo);
		var contentType = null, contentDisposition = null;
		try {
			var props = u.it.getImgCacheForDocument(doc).findEntryProperties(uri, doc);
			var cs = Ci.nsISupportsCString;
			try {contentType = props.get("type", cs).data;} catch {}
			try {contentDisposition = props.get("content-disposition", cs).data;} catch {}
		} catch {}
		this.sendAsyncMessage("", {
			title: trg.closest("[title]")?.title,
			url: (trg.currentRequestFinalURI || uri).spec,
			contentType, referrerInfo, cookieJarSettings, contentDisposition, sx,
			isPrivate: u.PrivateBrowsingUtils.isContentWindowPrivate(trg.ownerGlobal)
		});
	}
	checkTextLinkyTool(doc) {
		if (doc.title || !doc.documentURI.startsWith("moz-extension:")) return;
		var lab = doc.querySelector("body > label#lblFrom:first-child")?.textContent;
		if (lab) doc.title = lab.slice(0, lab.lastIndexOf("("));
	}
}
if (!ChromeUtils.domProcessChild.childID) {
	var esModuleURI = Components.stack.filename;
	ChromeUtils.registerWindowActor("MouseImgSaver", {
		allFrames: true,
		parent: {esModuleURI},
		messageManagerGroups: ["browsers"],
		child: {esModuleURI, events: {auxclick: {capture: true}, dblclick: {capture: true}, dragstart: {capture: true}}}
	});
	var wref, titles = Object.create(null);
	var data = Object.assign(Object.create(null), {
		"browser.download.dir": {type: "String", get set(){
			var win = wref.get();
			win.Downloads.getList(win.Downloads.ALL).then(list => list.addView({
				onDownloadChanged(download) {
					if (!download.stopped) return;
					var {url} = download.source, title = titles[url];
					if (!title) return;
					delete titles[url];
					if (!download.succeeded) return;
					var file = win.FileUtils.File(download.target.path), {leafName} = file;
					var ext = leafName.slice(leafName.lastIndexOf("."));
					var newName = title + ext, {parent} = file;
					var newFile = parent.clone();
					newFile.append(newName);
					try {
						newFile.createUnique(file.NORMAL_FILE_TYPE, file.permissions);
						file.renameTo(parent, newFile.leafName);
						download.target.path = newFile.path;
						download.refresh();
					} catch {}
				}
			}));
			Object.defineProperty(this, "set", {get() { //Загрузки/Фото/Имя вкладки
				try {var dir = Cu.getGlobalForObject(Cu)[Symbol.for("UcfGlob")].TitlePath(2)[0];}
					catch {dir = Services.dirsvc.get("DfltDwnld",Ci.nsIFile)}
				try {dir.exists() && dir.isDirectory() || dir.create(dir.DIRECTORY_TYPE, 0o777);} catch{}
				return dir.path;
			}});
			return this.set;
		}},
		"browser.download.folderList": {type: "Int", set: 2},
		"browser.download.useDownloadDir": {type: "Bool", set: true}
	});
	var MouseImgSaverParent = class extends JSWindowActorParent {
		receiveMessage(msg) {
			var win = msg.target.browsingContext.topChromeWindow, {name} = msg;
			if (name) return this[name](win, msg.data);
			var {url, contentType, contentDisposition, sx, title,
				isPrivate, referrerInfo, cookieJarSettings} = msg.data;
			if (sx && sx > win.mozInnerScreenX + win.innerWidth) return;
			if (title) titles[url] = title;
			wref = Cu.getWeakReference(win);
			var p = win.Services.prefs;
			for(var pref in data) {
				var obj = data[pref], meth = `et${obj.type}Pref`;
				obj.val = p.prefHasUserValue(pref) ? p["g" + meth](pref) : null;
				p["s" + meth](pref, obj.set);
			}
			try { var args = [url,
				null, // document
				null, // file name
				contentDisposition,
				contentType,
				false, // no cache
				null, // filepicker title key
				null, // chosen data
				u.E10SUtils.deserializeReferrerInfo(referrerInfo),
				u.E10SUtils.deserializeCookieJarSettings(cookieJarSettings),
				win.document, // initiating doc
				true, // skip prompt for where to save
				null, // cache key
				isPrivate,
				win.document.nodePrincipal],
				{length} = win.internalSave, lfix = length >15;
				lfix && args.splice(1, 0, null); //FIX FF113+
				try {win.internalSave(...args);} catch{console.log("ERROR")}
			} finally {
				for(var pref in data) data[pref].val === null
					? p.clearUserPref(pref)
					: p[`set${data[pref].type}Pref`](pref, data[pref].val);
			}
			Cu.getGlobalForObject(Cu)[Symbol.for("UcfGlob")].Succes(data["browser.download.dir"].set, 2);
		}
		dblclick(win, imgURL) {
			var gb = win.gBrowser, index = gb.selectedTab._tPos +1;
			gb.selectedTab = gb.addTrustedTab('https://yandex.ru/images/search?rpt=imageview&url=' + imgURL, {index});
		}
	}
}
