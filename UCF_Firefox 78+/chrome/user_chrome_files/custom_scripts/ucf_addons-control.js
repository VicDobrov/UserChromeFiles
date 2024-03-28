(async (css, self) => ({

	//===[ Buttons ]===================================================================

	vertical: true,
	btnActions: ["preferences", "toggle-disabled", "remove", "install-update"],

	cn: "ucf-cloned-button",
	update(e) {
		var trg = e.target;
		trg.nodeName == "ADDON-CARD" && trg.addon.type != "theme" && this.onCard(trg);
	},
	onCard(card, again) {
		var btnsParent = card.querySelector("addon-options");
		if (!btnsParent) return again || card.ownerGlobal
			.requestAnimationFrame(() => this.onCard(card, true));

		var doc = card.ownerDocument;
		var [span] = card.getElementsByClassName(this.ccn);
		if (span) span.textContent = "";
		else
			card.querySelector("button.more-options-button")
				.before(span = doc.createElement("span")),
			span.className = this.ccn;

		var item, num = 0;
		for(var sel of this.btnActions) {
			if (num++ == this.tInd) {
				if (!card.querySelector(this.ts)) continue;
				item = this.createPanelItem(doc);
				item.setAttribute("action", "toggle-disabled");
				doc.l10n.setAttributes(item, `${
					btnsParent.parentNode.getAttribute("active") == "true" ? "dis" : "en"
				}able-addon-button`);
			} else {
				item = btnsParent.querySelector(sel);
				if (!item) continue;
				item = this.clone(item);
			}
			span.append(item);
			item.shadowRoot.querySelector("button").classList.add(this.cn);
		}
	},

	//===[ Popup ]=====================================================================

	items: {
		"Копировать имя": [
			addon => self.copy(addon.name),
			"data:image/webp;base64,UklGRjYBAABXRUJQVlA4TCoBAAAvD8ADENVAsbZtWfTvEneaQ3SINA7J3TPLILEDdxufafq9swZ31+QS54njExhGkqTk8o/xcYfdPdyhGLaNpDi593iMM7MK2raR2AzB7mEbqDabtk2SdtMj66uVDV5mhuwMK12nNVAp4Eb/ZdEMEJuBxumqdEX/veu1cDzm1g/8E5B4HZWvCP/t7Te7fqanCGYKi+IT8jm4XUyU/8acTE3RhLLM2hHkEjW/R2X/JXREsYW6yd8MBS4UWUSYWX8fE56NUBS5EOQdad0swZRHyy/qB0HwOK1rKBgjG/ZFv2kIGg4VHtfVEAy66nifRYO+6jUdztfFcADAoKuzTjHgfZ03uNUyqFt17XxopgveOLPhzP5qGXR1VgsH7taZ/oD0h8kyWqNMtm5pObMF",
		],
		"Копировать ID": [
			addon => self.copy(addon.id),
			"Копировать имя"
		],
		"Копировать версию": [
			addon => self.copy(addon.version),
			"Копировать имя",
			addon => !addon.version
		],
		"Копировать имя и версию": [
			addon => self.copy(addon.name + " " + addon.version),
			"Копировать имя",
			addon => !addon.version
		],
		"Копировать URL кнопки": [
			(addon, win) => {
				var btn = Object.assign({
					parameters: {},
					get initcode() {return this.initCode;},
					setText(doc, name, t, cds) {
						win.custombutton.buttonSetText(doc, name, this[name], cds);
					}
				}, win.custombuttons.cbService.getButtonParameters(addon.buttonLink));
				self.copy(win.custombutton.buttonGetURI(btn));
			},
			"Копировать имя",
			addon => addon.type != "custombuttons"
		],
		"Домашняя страница": [
			(addon, win) => win.openURL(addon.homepageURL || addon.reviewURL.replace(/\/reviews\/.*$/, "/")),
			"data:image/webp;base64,UklGRn4FAABXRUJQVlA4THEFAAAvH8AHEA0wbNs2Ui33vXP2H7gdIqL/E0BLIkGeEDsdoGqsa38aV68YiCQb9Bq4jiRbqTr/KHH4cnd4mgITSZLbNBQS1v/fJJycsw0NGTSSpKiOnv8P/Wt7Kf1PvPkBoEB7fE/pABBo5zLnoyoXRw1AK+M7awxXrn9A/a3+qnX4avX0zh8ggbpv3zpUmQT/QcnatmOSdD/fj1DZtkcaWduoae2gMe6FuHsNPbNto2wFOuOP/PV9byP+1AooSJKkSJLUI6tnamfhGP//mvsA/YD5hrq6XHIkSYpsedb0wGem45fh6y/PPzEPdcutbVvVsrkvGrpLpl1RBBn10AI9OOSk7m6/3DMBELAEYQ42YR3WYH1+UAAavMPgFNFg9Rn23pDTFzl+pU4JKgSgQgAqABCAYACChUBvM/A1pzAwDQberAvDuORFRR1oCIAiAAJopBDeqjOoKUZBzfBNjdZ0aMASBIoFCgkMNFQsuEBQAxBA4P/KGsjiBzJFBOIirgAAAMUayRAvKrginS0SFJpaEFQAADYQQKMKIFBAQJxINx4krj6GPfLL6vza7Ohl2cMvh+5+2GhTTvHBFUsQKHMguGIAAe0V4+6+/Clmvluxd2vfx+atrLwO7vWRG33kt7Lxh09OfvVRa0pVHAwElSYJAAyWKBo380Dn36ZYt/67W2svK9/cVvd0Z53Wvmwe95HaavT0SnmbuQ4IB0BoAhIUhy7WPZcNl+by4yo+aHfC0N9v3dW19/L0OvSeZtV2WN6SmrTnFEMtQKJJDQyWSIYNly7aHug0zv528ScubBzu74R7sqdT0c5fyl1YuvbLJtm/SmCYC4FGrPT9U5QHZp+8j8fp+hM3JgwPNMGpdU9yKZMr5e2BSVj19MgdpwdPkU4AQxNAxC795w/C8IldtoZdE4khCUmidUZ3du25tNtt81W0yuNbWV7uP8bPP0fcABJNKgLKoC+FawwulxCSkIYEpKy22zRfVJrMI/3zlckxS/a/ls3qzr/N/T/DxFwEBRNVmxAOop/hrugFBhMRVnYX0qDYObn/uum39G6rPx8pjpkADE22kA6ExPhcxWn2pfuu1CKdQPdkVle3V6qJJzuTjQxq9LrScVm3ZmEAEk06sZRIYd38dbZqHts0L53wWnUyTqmHeIYeajwIMw0/t9656CZ0bTY9oBMwRxJCpKzMoX+EmzKr6XRztIuTiA3jRqGMJqoy7EXHYrVwiYeeWP0xwlzUAAFbV/yxwumsXd6YnI+1bk98VL7ton2ihAm1PO1qWXEJvzZbPj+UUwwGqAYSoEpseonJdI8Xobvi3FUW6Tnph+658AZCatLT2IQXdVar9+869/8rP1MSnoI0UIASJbK1udp3OA96+SXqhcsTK/NYexoaJGhnpX2/Mtz+i7+PSnauaiOeDoFqIAAHjwh5F1VI/v9r9dB7eGzbcevNImTiGyVGqxsf3ez1VFwhUXTKhA5tzCf8bVAD0HBCAK1c9p+fXf2Hmwej7YFI6Qg65BvR5dZ+N2Rbud3hz/J7/Z9l8GseXmAHSmSaDYAgEcJo58YHrn77T/H9c0/W7r5uMJ0lunex5Y4jZk/v+Ek81SmVdZGJ8ecKW7APoKapAMFgKJAha5TbrViXvFHdQok0t3RIj8n6s+ThNLZRyxlZyzRwBMzRABwEBwdAIYAgSpTFR23Be/Ao0WMMNENBAYgAgAAEIAiGGhVKqiB51W1aCgdgaDICPGV0AQj/A/+rMKRXJOM35xUIoFkU5G12L7EA5hxQIOftCTcAAuZoFNw/z/YJViq6owkACP8LVICnCt5H3AIRMFfocA6ggzlCQQD8A0aBucOflBYRI1DTBAMECkCDgLkCAA==",
			addon => !addon.homepageURL && !addon.reviewURL
		],
		"Поиск на АМО": [
			(addon, win) => win.openURL(
				addon.homepageURL || ("https://addons.mozilla.org/search/?q=" + encodeURIComponent(addon.name))
			),
			"data:image/webp;base64,UklGRggCAABXRUJQVlA4TPwBAAAvD8ADEAmyAcpUYRPR/3jcQiyYhhx2BVAoSNuAhQL21/8Yqt0CNdu2Zcv14w7JIjPQNLsPSHNdwy2RnAHcXkM+meH50Y/28benuY0k2VV6H7bO4EP+UfHx+CZarNvItp3m3HsZIvlMddEKQzmSItcG9Sjz/sGxre149cRJZVuVU9kDcL4p/GX6v47LpPRVadu+o7CNkhMAGDK7jP4C0UikEEsCwdKr7e/AhAY4ldi5ZaQKSSngzoSWqycC4yUigY2FNDO2UDGlH6eG+pduDDiAFvyCi4G5J6a/IZLSbeWPUNOe7vqXbhQkgUjBH7CB4OQ8dLz/HYWOEEdMaAE7EKrm4Puj9ERTRJFIIZK4ZgKowY/mqgqUNkwUWBIJNTyj+Af+VTMt+hZcQMRUryEm4AJYs1zzIrjzMXluvUaMOvBDxpFznwc+IMw0A89gY2baroaQAnIReU41ymXG+A9NX4Y2sAAF+PvX9WkzvnHcX92szX+gpoiAU0NUeVSy5c6EKYuJUMEPkcXTbvdwOl11W3M6/hO03IJn2RIRuSU/oAscIUgCwfz5qk7KXf85s9MK9Ro8jjfO0v4ZhiTfxMXGBlVpEFK48sZpXri8cubxlSQmxkOEq7xx7o7Ncca232vr4e1NIRY4ArZcsLa63e00ciBNI5YW3YvqsQiABjwD",
			["custombuttons", "theme", "plugin"]
		],
		"Папка установки": [
			addon => self.getFile(addon).reveal(),
			"data:image/webp;base64,UklGRugAAABXRUJQVlA4TNsAAAAvD8ADEN/BKJIkRTUQ+z7/ts7ACWDmaxtsI0ly0i+B/EPE1GBpCLaRJDlp5PpoAiAy8vc1BKBAiWBFiWBDhSCIpxpl5rl0nWEYpFpYYBhGM+z8FDw82Of7iR8lNzyEB3dy87B93sMfVD3DaFfDpJ5s669f7N+8vD/iR4zLkehCRP8DbmvbVqKDWxeE9F8GESE5FbhfmPnSQkRMAN5RGvw9x2Oq6jtEivvlTxQL/2oCY3unpkEAYantlgieEGOQ7BgDE0pMVhF4QOyjwEP4IB9thZzCe+wCp+fixBMA",
			["custombuttons", "theme", "plugin"]
		],
		"Файл установки": [
			addon => self.getFile(addon).launch(),
			"data:image/webp;base64,UklGRlQAAABXRUJQVlA4TEcAAAAvD8ADEAWDto0kmT/p3tOZoRBBIAjBewP9aQLkzF2O4H0RdePu/rM6uIvFv0Qxs8lbhP1iiLDmJcJKLCICvItVEJFUltzlDAA=",
			["custombuttons", "theme", "plugin"]
		],
		"Проверить обновления": [
			Cr.NS_ERROR_NET_TIMEOUT_EXTERNAL // Fx 87+
				? (addon, win) => win.content.checkForUpdate(addon)
				: (addon, win) => win.content.frames[0].checkForUpdate(addon),
			"data:image/webp;base64,UklGRqwBAABXRUJQVlA4TKABAAAvD8ADEB641bYtT7JC9skUqZz3/QV3d9fS3Xp3d5eOitLdqThUsS//DM85lBwGYJS02QDraLWyCVhFkuw03y+RvkBAzhKQgQ5YRZLsNN8vkb5AQM4SkIEOoFjbtkwZd3d395k8cXA24LILp7IDdxpZGwkS0d29ucM9ARATUqI2nDWZCDQaUch0lbDjKIVevgMwa5Cpy+dkDRzbhuN5cDTNfwWnIXTfeSHiJZw74AZO4QoeHedJOuuMUYQAvNnsv21BDf8TsACOvieJRf0wCAEmQJSYogk5CGcWZ+ugMhjORCv8tAFTAZI5P4B/Jgswnig2FGoQwewAPESzAKTzeQ2z/BAWAAbEPhDhUn7/07kEUjjehVX+vyF8L+axA3L4ACIYmwTHOBLBNGQCKvOvQAC6Ij4aIJ1ngCmXwxEMgsIg07gBCWzbMOoQGFEoNMm0yjQAvhhW++AAVqCAJ8f34fh/stgkrBAztiS2/FNw6+g6RsHxvhSxx3hFYAzhDBfx1gKd0Av3jXwr9HsBFKwZ3PkL+AhnjklDo4w2gttghogQxA==",
			addon => !addon.applyBackgroundUpdates || addon.isBuiltin
		],
	},
	listContainerId: "ucf-aa-extra-items-container",
	showing(e) {
		var card = e.target.closest("addon-card");
		if (!card) return;

		this.labs = [];
		var imgs = new Map();
		var set = (key, val) => imgs.set(key, imgs.has(key) ? imgs.get(key).concat(val) : [val]);
		var entries = Object.entries(this.items);

		entries.forEach(([lab, [func, img, hideOn]], ind) => {
			this.labs.push(lab);
			(this[lab] = func).hideOn = hideOn;
			img && set(this.items[img]?.[1] ? entries.findIndex(a => a[0] == img): ind, ind);
		});
		if (imgs.size) {
			var cspRe = /^(?:chrome|file|jar|resource|moz-extension|https?):/;
			var [s, p, o] = this.vers >= 110
				? ["::part(button)", "background-image", "AUTHO"] : ["", "--icon", "USE"];

			var reg = [], push = (ind, icon) => {
				var chromeImg = "chrome://user_chrome_files/content/aaepiimg_" + ind;
				reg.push(["override", chromeImg, icon]);
				return chromeImg;
			}
			var rules = [];
			for(var [ind, nums] of imgs) {
				var sel = [], img = entries[ind][1][1];
				for(var num of nums) sel.push(
					`\t#${this.listContainerId} > panel-item:nth-child(${num + 1})${s}`
				);
				rules.push(`${sel.join(",\t\n")} {\n\t\t${p}: url(${
					cspRe.test(img) ? img : push(ind, img)
				}) !important;\n\t}`);
			}
			if (reg.length) {
				var ams = Cc["@mozilla.org/addons/addon-manager-startup;1"]
					.getService(Ci.amIAddonManagerStartup);
				var mUri = Services.io.newFileURI(Services.dirsvc.get("ProfD", Ci.nsIFile));
				this.chromeReg = ams.registerChrome(mUri, reg);
			}
			this.regSheet(`\n${rules.join("\n")}\n}`, o + "R_SHEET");
		}
		delete this.items;

		self = this;
		this.sym = Symbol.for(this.listContainerId);
		(this.showing = e => {
			var card = e.target.closest("addon-card");
			card && this.onListShowind(card.addon, e.target);
		})(e);
		this.onListShowind(card.addon, e.target);
	},
	async onListShowind(addon, list) {
		var doc = list.ownerDocument, win = doc.ownerGlobal;
		var container = doc[this.sym];
		if (!container) {
			container = doc[this.sym] = doc.createElement("div");
			container.onclick = this.cclick;
			container.id = this.listContainerId;
			for(var lab of this.labs)
				container.appendChild(this.createPanelItem(doc)).append(lab);

			var mo = new win.MutationObserver(this.mut);
			(container.mo = mo).container = container;
		}
		for(var item of container.children) {
			var h = this[item.textContent].hideOn;
			item.hidden = h && (h.call ? h(addon) : h.includes(addon.type));
		}
		var {mo} = container;
		mo.disconnect();
		list.contains(container) || list.prepend(container);
		mo.count = 0;
		mo.ts = Date.now();
		mo.observe(list, {childList: true});
	},
	mut(muts, mo) {
		if (++mo.count > 10 || Date.now() - mo.ts > 100)
			return mo.disconnect();
		var list = muts[0].target, {container} = mo;
		if (list.firstElementChild != container)
			mo.disconnect(),
			list.prepend(container),
			mo.observe(list, {childList: true});
	},
	cclick(e) {
		e.stopImmediatePropagation();
		this.parentNode.hide();
		self[e.target.textContent](
			e.target.closest("addon-card").addon,
			e.view.windowRoot.ownerGlobal
		);
	},
	copy: str => (self.copy =
		Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper).copyString
	)(str),
	getFile(addon) {
		var file, uri = addon.getResourceURI();
		if (uri instanceof Ci.nsIJARURI) uri = uri.JARFile;
		if (uri instanceof Ci.nsIFileURL) file = uri.file;
		return file;
	},

	//================================================================================

	init(topic, quit) {
		Services.obs.addObserver(this, topic);
		Services.obs.addObserver(quit = (s, t) => {
			Services.obs.removeObserver(quit, t);
			Services.obs.removeObserver(this, topic);
		}, "quit-application-granted");
	},
	isTargetDoc: doc => doc.ownerGlobal.docShell
		.currentDocumentChannel.name.endsWith("/aboutaddons.html"),
	observe(doc) {
		if (!this.isTargetDoc(doc)) return;

		var vers = this.vers = parseInt(Services.appinfo.platformVersion);
		this.ts = `${vers >= 111 ? "moz-toggle" : "input"}[action="toggle-disabled"]`;

		css = css.replace("%TS%", this.ts)
			.replace(/%CN%/g, this.cn)
			.replace(/;$/gm, " !important;")
			.replace("%FD%", this.vertical ? "column" : "row");

		this.regSheet(css, "USER_SHEET");

		var unload = e => {
			e.target.removeEventListener("update", this, true);
			e.target.removeEventListener("showing", this, true);
		}
		var load = doc => {
			doc.addEventListener("update", this, true);
			doc.addEventListener("showing", this, true);
			var win = doc.ownerGlobal;
			win.addEventListener("unload", unload, {once: true});
			this.inactiveAddonsVersion(win);
		}
		this.handleEvent = e => this[e.type](e);
		this.observe = doc => this.isTargetDoc(doc) && load(doc);

		this.ccn = this.cn + "s-container";
		this.tInd = this.btnActions.findIndex(s => s == "toggle-disabled");

		this.btnActions = this.btnActions.map(
			action => `panel-list > panel-item[action="${action}"]`
		);
		this.createPanelItem = vers == 110
			? doc => new (doc.ownerGlobal.customElements.get("panel-item"))
			: doc => doc.createElement("panel-item");

		if (vers >= 89) this.clone = item => item.cloneNode(true);
		else {
			var cf = function(e) {
				var win = e.view;
				win.InspectorUtils.removeContentState(this, 4, true);
				Services.focus.clearFocus(win);
			}
			this.clone = item => {
				var clone = item.cloneNode(true);
				clone.onclick = cf;
				return clone;
			}
		}
		load(doc);
	},
	inactiveAddonsVersion(win) {
		var desc = win.Object.getOwnPropertyDescriptor(win.HTMLElement.prototype, "title");
		var {set} = desc, cfg = {attributes: true, attributeFilter: ["title"]};

		var handleMuts = function(m, {trg, val}) {
			this.disconnect();
			var txt = trg.firstChild;
			if (txt) txt.data = txt.data.replace(trg.closest("addon-card").addon.name, val);
		}
		desc.set = function(val) {
			set.call(this, val);
			if (this.getAttribute("data-l10n-id") != "addon-name-disabled") return;

			var mo = new win.MutationObserver(handleMuts);
			mo.val = val;
			mo.observe(mo.trg = this, cfg);
		}
		for(var Elm of [win.HTMLAnchorElement, win.HTMLHeadingElement])
			win.Object.defineProperty(Elm.prototype, "title", desc);
	},
	regSheet(...args) {
		var prfx = "data:text/css;charset=utf8,@-moz-document url(about:addons),%0A"
			+ "url(chrome://mozapps/content/extensions/aboutaddons.html) {";
		var sss = Cc["@mozilla.org/content/style-sheet-service;1"]
			.getService(Ci.nsIStyleSheetService);
		(this.regSheet = (code, origin) => sss.loadAndRegisterSheet(
			Services.io.newURI(prfx + encodeURIComponent(code)), sss[origin]
		))(...args);
	}
}).init("chrome-document-loaded"))(`\

	span.%CN%s-container {
		display: flex;
		flex-direction: %FD%;
		row-gap: 1px;
	}
	addon-card[expanded] span.%CN%s-container {
		flex-direction: row;
	}
	button.%CN% {
		-moz-appearance: none;

		margin: 0 1px;
		padding: 1px 6px 3px 6px;
		background-image: none;
		background-color: rgba(174, 236, 235, 0.9);

		border-radius: 0;
		border: 1px solid #bbb;

		font-size: 13px;
		white-space: nowrap;
		font-family: Segoe UI;
	}
	button.%CN%:hover {
		background-color: gold;
	}
	button.%CN%:after, %TS% {
		display: none;
	}
}`);