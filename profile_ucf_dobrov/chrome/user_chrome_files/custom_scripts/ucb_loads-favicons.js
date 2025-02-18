(async widget => widget = CustomizableUI.createWidget({

	maxtimeout: 30,  // Длительность до прерывания запроса в секундах
	maxrequests: 50, // Максимальное количество параллельных запросов
	alertnotification: true, // Уведомление о завершении поиска фавиконок для закладок
	image: "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path style='fill:none;stroke:context-fill rgb(142, 142, 152);stroke-opacity:context-fill-opacity;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;' d='M3.6.6v14.8L8 11l4.4 4.4V.6z'/></svg>",

	id: "ucf-loads-favicons",
	label: "Восстановить фавиконки",
	tooltiptext: "Восстановить фавиконки закладок",

	defaultArea: CustomizableUI.AREA_NAVBAR,
	localized: false,
	onCreated(btn) {
		this.setFill(btn);
		btn.style.setProperty("list-style-image", this.lsi, "important");
		btn._handleClick = this.favSearchStart;
	},
	get lsi() {
		this.favSearchStart = this.favSearchStart.bind(this);
		ChromeUtils.defineESModuleGetters(this, {
			NetUtil: "resource://gre/modules/NetUtil.sys.mjs"
		});
		var subst = this.id + "-img";
		Services.io.getProtocolHandler("resource")
			.QueryInterface(Ci.nsIResProtocolHandler)
			.setSubstitution(subst, Services.io.newURI(this.image));
		delete this.lsi;
		return this.lsi = `url("${this.image = "resource://" + subst}")`;
	},
	setFill(btn) {
		this.favrunning
			? btn.style.setProperty("fill", "color-mix(in srgb, currentColor 20%, #e31b5d)")
			: btn.style.removeProperty("fill");
	},
	setBtnsFill() {
		for(var win of CustomizableUI.windows) {
			var btn = widget.forWindow(win).node;
			btn && this.setFill(btn);
		}
	},
	get showAlert() {
		delete this.showAlert;
		return this.showAlert = Cc["@mozilla.org/alerts-service;1"]
			.getService(Ci.nsIAlertsService).showAlertNotification.bind(null, this.image);
	},
	favSearchStart() {
		if (this.favrunning) return;
		this.favrunning = true;
		this.setBtnsFill();
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
					} catch {
						resolve(null);
					}
					PlacesUtils.favicons.getFaviconURLForPage(siteURI, uri => resolve((uri === null) ? siteURI : null));
				});
			};
			Promise.all(urlsList.map(favForPage)).then(results => this.favSearchResults(results.filter(url => url !== null)));
		});
	},
	favComplete(favsuccesslength, favmaxlength) {
		this.favrunning = false;
		this.setBtnsFill();
		this.alertnotification && this.showAlert(
			"Поиск фавиконок",
			`Успешно обработано - ${favsuccesslength}, не удалось обработать - ${favmaxlength - favsuccesslength}`
		);
	},
	favSearchResults(results) {
		var favmaxlength = _favmaxlength = results.length;
		var favsuccesslength = 0;
		if (!favmaxlength) {
			this.favComplete(0, 0);
			return;
		}
		var {maxrequests} = this;
		var favmaxtimeout = this.maxtimeout * 1000;

		var setFaviconForPage = "setAndFetchFaviconForPage" in PlacesUtils.favicons

			? async (siteURI, favURI) => {
				var timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
				var request = PlacesUtils.favicons.setAndFetchFaviconForPage(siteURI, favURI, false, PlacesUtils.favicons.FAVICON_LOAD_NON_PRIVATE, {
					onComplete() {
						++favsuccesslength;
						timer.cancel();
						timer = request = null;
					},
				}, Services.scriptSecurityManager.getSystemPrincipal());
				if (!request) {
					timer = null;
					return;
				}
				timer.initWithCallback(() => {
					try {
						request.cancel();
					} catch {}
					timer = request = null;
				}, favmaxtimeout, timer.TYPE_ONE_SHOT);
			}

			: async (siteURI, uri, type) => {
				var resolver = Promise.withResolvers();
				if (uri.schemeIs("data"))
					resolver.resolve(uri);
				else {
					let {NetUtil} = this;
					let channel = NetUtil.newChannel({
						uri,
						loadingPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
						securityFlags:
							Ci.nsILoadInfo.SEC_REQUIRE_CORS_INHERITS_SEC_CONTEXT |
							Ci.nsILoadInfo.SEC_COOKIES_INCLUDE |
							Ci.nsILoadInfo.SEC_ALLOW_CHROME |
							Ci.nsILoadInfo.SEC_DISALLOW_SCRIPT,
						contentPolicyType: Ci.nsIContentPolicy.TYPE_INTERNAL_IMAGE_FAVICON,
					});
					NetUtil.asyncFetch(channel, async (input, status, request) => {
						if (!Components.isSuccessCode(status)) {
							resolver.reject(status);
							return;
						}
						try {
							let data = NetUtil.readInputStream(input, input.available());
							let {contentType} = request.QueryInterface(Ci.nsIChannel);
							input.close();
							let buffer = new Uint8ClampedArray(data);
							let blob = new Blob([buffer], {type: type || contentType});
							let dataURL = await new Promise((resolve, reject) => {
								let reader = new FileReader();
								reader.onload = () => resolve(reader.result);
								reader.onerror = e => reject(e);
								reader.readAsDataURL(blob);
							});
							resolver.resolve(Services.io.newURI(dataURL));
						} catch (e) {
							resolver.reject(e);
						}
					});
				}
				try {
					PlacesUtils.favicons.setFaviconForPage(siteURI, uri, await resolver.promise);
					++favsuccesslength;
				} catch {}
			};
		
		var favSearchPage = siteURI => {
			new Promise(resolve => {
				let req = new XMLHttpRequest({mozAnon: false});
				req.mozBackgroundRequest = true;
				req.open("GET", siteURI.spec, true);
				req.responseType = "document";
				req.overrideMimeType("text/html");
				req.timeout = favmaxtimeout;
				req.onload = async () => {
					try {
						let doc = req.responseXML, favURI, favType;
						if (doc) {
							let lastlink, is16, is32, isany;
							for (let link of doc.head.querySelectorAll("link[href][rel~='icon']")) {
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
							let icon = (isany || is32 || is16 || lastlink);
							favURI = icon?.href;
							favType = icon?.type;
						}
						if (!favURI) {
							favURI = `${req.responseURL ? Services.io.newURI(req.responseURL).prePath : siteURI.prePath}/favicon.ico`;
							favType = "image/x-icon";
						}
						setFaviconForPage(siteURI, Services.io.newURI(favURI), favType);
					} catch {}
					resolve();
				};
				req.onabort = () => resolve();
				req.onerror = req.ontimeout = () => {
					resolve();
					req.abort();
				};
				req.send(null);
			}).then(() => {
				if (!(--_favmaxlength)) {
					this.favComplete(favsuccesslength, favmaxlength);
					return;
				}
				if (results.length)
					favSearchPage(results.shift());
			});
		};
		results.splice(0, maxrequests).map(favSearchPage);
	}
}))();
