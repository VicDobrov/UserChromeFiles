(async (id, sel) => { // расположение закладки в Избранном, Недавняя папка Ff90+
	var g = Cu.getGlobalForObject(Cu), stt = g[id];
	if (!stt) {
		var {obs, prefs} = Services, {bookmarks: bm, observers: pobs} = PlacesUtils;
		stt = g[id] = {
			bm,
			help_star: `(${Services.appinfo.OS == "Darwin" ? "⌘" : "Ctrl+"}D)\n
Правый клик		➜ Быстрая закладка
◉ Колёсико	1-я строка Меню закладок
◧ держать	Перевод сайт/выдел. текст\n`, //клики в ucf_hookClicks.js
			pref: `ucf.${id}Guid`,

			async init() {
				this.args = [b => this.bguids.add(b.parentGuid), {concurrent: true}];
				this.pobsArgs = [
					["bookmark-added", "bookmark-moved"],
					this.record = this.record.bind(this)
				];
				pobs.addListener(...this.pobsArgs);
				obs.addObserver(this, "quit-application-granted");

				var guid = prefs.getCharPref(this.pref, "");
				if (!guid) try {var [guid] = await PlacesUtils.metadata.get(
					PlacesUIUtils.LAST_USED_FOLDERS_META_KEY, []
				)} catch {}
				this.guids.push(guid || await PlacesUIUtils.defaultParentGuid || bm.unfiledGuid);
			},
			observe() {
				pobs.removeListener(...this.pobsArgs);
				obs.removeObserver(this, "quit-application-granted");
				prefs.setCharPref(this.pref, this.guids[0]);
			},
			record(events) {
				for(var e of events) if (
					e.itemType == bm.TYPE_BOOKMARK && e.source == bm.SOURCES.DEFAULT
					&& !(e.type == "bookmark-moved" && e.parentGuid == e.oldParentGuid)
				)
					this.guids[0] = e.parentGuid;
			},
			bguids: new g.Set(),
			guids: new g.Array(),
			fetch(win) {
				this.bguids.clear();
				return bm.fetch({url: win.gBrowser.currentURI.spec}, ...this.args);
			},
			find: obj => obj.name == "tooltiptext",
			tt(de) {
				var kids = InspectorUtils.getChildrenForNode;
				return (this.tt = kids.length == 2
					? de => {
						var list = kids(de, true);
						return list.item(list.length - 1);
					}
					: de => kids(de, true, false).at(-1)
				)(de);
			}
		};
		stt.init();

		var func = id => this[id].handleEvent = async function(e) {
			var win = e.view;
			var star = e.target;
			var starred = star.hasAttribute("starred");

			starred && await this.fetch(win);
			var result = [];
			for(var guid of (starred ? this.bguids : this.guids)) {
				var arr = [], num = 50;
				while(--num) {
					if (!star.matches(":hover")) return;
					var res = await this.bm.fetch(guid);
					if (!res) break;
					if ((guid = res.parentGuid) == this.bm.rootGuid) {
						arr.unshift(this.bm.getLocalizedTitle(res));
						break;
					}
					arr.unshift(res.title || "[Безымянная папка]");
				}
				arr.length && result.push(arr.join("\\"));
			}
			if (!star.matches(":hover")) return;
			if (!result.length) return win.document.l10n.translateElements([star]);

			var text = '\n' + result.join("\n");
			if (starred) {
				var m = result.length > 1;
				text = `Редактировать эту закладку ${this.help_star}Адрес${m ? "а" : ""} заклад${m ? "ок" : "ки"}:${text}`;
      } else
        text = `Добавить страницу в закладки ${this.help_star}Недавно добавлялось в:${text}`;
			star.defaultTT.state == "open"
				? star.defaultTT.label = text : star.tooltipText = text;
		}
		var url = "data:;charset=utf-8," + encodeURIComponent(`(${func})("${id}")`);
		g.ChromeUtils.compileScript(url).then(ps => ps.executeInGlobal(g));
	}
	await delayedStartupPromise;
	var tt = stt.tt(document.documentElement);
	var stars = Array.from(document.querySelectorAll(sel));
	for(var star of stars) star.defaultTT = tt, star.addEventListener("mouseenter", stt);

	var destructor = () => {
		for(var star of stars) star.removeEventListener("mouseenter", stt);
	}
	var ucf = window.ucf_custom_script_win;
	if (ucf) ucf[id] = {destructor}, ucf.unloadlisteners.push(id);
	else window.addEventListener("unload", destructor, {once: true});

})("ucfBookmarksStarFTooltipHelper", "#star-button, #star-button-box"); // #context-bookmarkpage