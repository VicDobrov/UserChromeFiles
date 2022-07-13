(async () => { // https://forum.mozilla-russia.org/viewtopic.php?pid=794944#p794944
	var id = "ucf-loads-favicons",
	label = "Восстановить фавиконки",
	tooltiptext = "Восстановить фавиконки закладок",
	img = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path style='fill:none;stroke:context-fill rgb(142, 142, 152);stroke-opacity:context-fill-opacity;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;' d='M3.6.6v14.8L8 11l4.4 4.4V.6z'/></svg>",
	maxrequests = 50, // Максимальное количество параллельных запросов
	maxtimeout = 30, // Длительность до прерывания запроса в секундах
	alertnotification = true; // Уведомление о завершении поиска фавиконок для закладок

	var favicons = {
		_favrunning: false,
		get alertsService() {
			delete this.alertsService;
			return this.alertsService = Cc["@mozilla.org/alerts-service;1"].getService(Ci.nsIAlertsService);
		},
		showAlert(title, val) {
			try {
				this.alertsService.showAlertNotification(img, title, val, false);
			} catch(e) {}
		},
		favSearchStart() {
			if (this._favrunning) return;
			this._favrunning = true;
			this.callWithEachWindow(id, {fill: "color-mix(in srgb, currentColor 20%, #e31b5d)"});
			PlacesUtils.promiseBookmarksTree(PlacesUtils.bookmarks.rootGuid).then(root => {
				var urlsList = [];
				var convert = (node, url) => {
					if (node.children)
						node.children.map(convert);
					else if ((url = node.uri) && /^(?:https?|ftp|file):/.test(url))
						urlsList.push(url);
				};
				convert(root);
				var favForPage = siteURI => {
					return new Promise(resolve => {
						try {
							siteURI = Services.io.newURI(siteURI);
						} catch(e) {
							resolve(null);
						}
						PlacesUtils.favicons.getFaviconURLForPage(siteURI, uri => {
							if (uri === null)
								resolve(siteURI);
							else
								resolve(null);
						});
					});
				};
				Promise.all(urlsList.map(favForPage)).then(results => this.favSearchResults(results.filter(url => url !== null)));
			});
		},
		favComplete(favsuccesslength, favmaxlength) {
			this._favrunning = false;
			this.callWithEachWindow(id, {fill: ""});
			if (alertnotification)
				this.showAlert("Поиск фавиконок", `Успешно обработано - ${favsuccesslength}, не удалось обработать - ${favmaxlength - favsuccesslength}`);
		},
		favSearchResults(results) {
			var favmaxlength = results.length;
			var favsuccesslength = 0;
			if (!favmaxlength) {
				this.favComplete(0, 0);
				return;
			}
			var favmaxtimeout = maxtimeout * 1000;
			var _favmaxlength = favmaxlength;
			var splice = results.splice(0, maxrequests);
			var favSearchPage = siteURI => {
				(new Promise(resolve => {
					try {
						let req = new XMLHttpRequest();
						req.mozBackgroundRequest = true;
						req.open("GET", siteURI.spec, true);
						req.responseType = "document";
						req.overrideMimeType("text/html");
						req.timeout = favmaxtimeout;
						req.onload = () => {console.log(req)
							try {
								let doc = req.responseXML, favURI;
								if (doc) {
									let links = doc.querySelectorAll("head link[href][rel~='icon']"), lastlink, is16, is32, isany;
									for (let link of links) {
										if (link.sizes.length === 1) {
											let size = link.sizes[0];
											if (/any/i.test(size))
												isany = link;
											else if (/32x32/i.test(size))
												is32 = link;
											else if (/16x16/i.test(size))
												is16 = link;
										}
										lastlink = link;
									}
									links = isany || is32 || is16 || lastlink;
									if (links)
										favURI = links.href;
								}
								if (!favURI)
									favURI = `${req.responseURL ? Services.io.newURI(req.responseURL).prePath : siteURI.prePath}/favicon.ico`;
								let timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
								let request = PlacesUtils.favicons.setAndFetchFaviconForPage(siteURI, Services.io.newURI(favURI), false, PlacesUtils.favicons.FAVICON_LOAD_NON_PRIVATE, {
									onComplete() {
										++favsuccesslength;
										resolve();
										timer.cancel();
										timer = null;
										request = null;
									},
								}, Services.scriptSecurityManager.getSystemPrincipal());
								if (!request) {
									resolve();
									timer = null;
									return;
								}
								timer.initWithCallback(() => {
									resolve();
									try {
										request.cancel();
									} catch(e) {}
									timer = null;
									request = null;
								}, favmaxtimeout, timer.TYPE_ONE_SHOT);
							} catch(e) {
								resolve();
							}
						};
						req.onabort = () => {
							resolve();
						};
						req.onerror = req.ontimeout = () => {
							resolve();
							req.abort();
						};
						req.send(null);
					} catch(e) {
						resolve();
					}
				})).then(() => {
					if (!(--_favmaxlength)) {
						this.favComplete(favsuccesslength, favmaxlength);
						return;
					}
					if (!results.length) return;
					favSearchPage(results.shift());
				});
			};
			splice.map(favSearchPage);
		},
		callWithEachWindow(buttonID, atr) {
			var getW = CustomizableUI.getWidget(buttonID);
			if (getW.instances.length)
				for (let {node} of getW.instances) {
					if (!node) continue;
					for (let a in atr)
						node.style.setProperty(a, atr[a]);
				}
			else
				for (let win of CustomizableUI.windows) {
					let node = getW.forWindow(win).node;
					if (!node) continue;
					for (let a in atr)
						node.style.setProperty(a, atr[a]);
				}
		},
	};
	CustomizableUI.createWidget({
		id: id,
		label: label,
		tooltiptext: tooltiptext,
		localized: false,
		defaultArea: CustomizableUI.AREA_NAVBAR,
		onCreated(btn) {
			btn.style.setProperty("list-style-image", `url("${img}")`, "important");
			if (favicons._favrunning)
				btn.style.setProperty("fill", "color-mix(in srgb, currentColor 20%, #e31b5d)");
		},
		onCommand(e) {
			favicons.favSearchStart();
		},
	});
})();