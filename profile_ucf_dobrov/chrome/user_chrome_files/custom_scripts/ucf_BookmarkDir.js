(async (id, sel) => { // расположение закладки в Избранном, Недавняя папка (F90+)
	var g = Cu.getGlobalForObject(Cu), stt = g[id];
	if (!stt) {
		var {obs, prefs} = Services, pu = PlacesUtils, {bookmarks: bm, observers: pobs} = pu, stt = g[id] = {
			bm, // клики и подсказки заданы в ucf_hookClicks.js
			help_star: '\n'+ hmap.get("star-button"),
			pref: `ucf.${id}Guid`,

			async init() {
				var args = [
					["bookmark-added", "bookmark-moved"],
					events => {for(var e of events) e.isTagging || this[e.constructor.name](e);}
				];
				pobs.addListener(...args);
				pu.registerShutdownFunction(() => {
					pobs.removeListener(...args);
					prefs.setStringPref(this.pref, this.lastGuid);
				});
				this.args = [
					res => this.fetchRes.push(res),
					{concurrent: true, includePath: true}
				];
				var guid = prefs.getStringPref(this.pref, "");
				if (!guid) try {var [guid] = await PlacesUtils.metadata.get(
					PlacesUIUtils.LAST_USED_FOLDERS_META_KEY, [])} catch {}
				this.lastGuid = guid || await PlacesUIUtils.defaultParentGuid || bm.unfiledGuid;
			},
			PlacesBookmarkAddition(e) {
				if (e.itemType == bm.TYPE_BOOKMARK && e.source == bm.SOURCES.DEFAULT)
					this.lastGuid = e.parentGuid;
			},
			PlacesBookmarkMoved(e) {
				e.parentGuid != e.oldParentGuid && this.PlacesBookmarkAddition(e);
			},
			find: obj => obj.name == "tooltiptext",
			tt(win) {
				var list = win.InspectorUtils.getChildrenForNode(win.document.documentElement, true);
				return list.item(list.length - 1);
			},
			mapInfs(inf) {
				return inf.path.map(this.mapPaths).join("\\");
			},
			mapPaths: path => bm.getLocalizedTitle(path) || "[Безымянная папка]",
		};
		stt.init();

		var func = id => this[id].handleEvent = async function(e) {
			var win = e.view, star = e.target;
			var starred = win.BookmarkingUI._itemGuids.size;
			var arg = starred ? {url: win.gBrowser.currentURI.spec} : this.lastGuid;

			var arr = this.fetchRes = [];
			await this.bm.fetch(arg, ...this.args);
			if (!star.matches(":hover")) return;

			!starred && arr.length && arr[0].path.push(arr[0]);
			var paths = arr.length ? arr.map(this.mapInfs, this).join("\n") : "<Folder Not Found>";

			if (!star.matches(":hover")) return;
			var footer = '★ ' + (
				starred
					? (arr.length > 1 ? "Данные закладки добавлены" : "Данная закладка добавлена") + " в"
					: "Недавно добавлялось в папку"
			) + ":\n" + paths;

			var header = (await win.document.l10n.formatMessages([{ // стандартная подсказка
				id: star.getAttribute("data-l10n-id"),
				args: JSON.parse(star.getAttribute("data-l10n-args"))
			}]))[0].attributes.find(this.find).value;

			var text = header + '\n' + this.help_star + footer;
			var tt = star.linkedTooltip;
			star.contains(tt.triggerNode) ? tt.label = text : star.tooltipText = text;
		}
		var url = "data:;charset=utf-8," + encodeURIComponent(`(${func})("${id}")`);
		g.ChromeUtils.compileScript(url).then(ps => ps.executeInGlobal(g));
	}
	await delayedStartupPromise;

	var stars = Array.from(document.querySelectorAll(sel));
	for(var star of stars) {
		star.linkedTooltip = stt.tt(window);
		star.addEventListener("mouseenter", stt);
	}
	var destructor = () => {
		for(var star of stars)
			star.removeEventListener("mouseenter", stt);
	}
	var ucf = window.ucf_custom_script_win || window.ucf_custom_script_all_win;
	if (ucf)
		ucf[id] = {destructor}, ucf.unloadlisteners.push(id);
	else
		window.addEventListener("unload", destructor, {once: true});
})("ucfBookmarksStarFTooltipHelper", "#star-button, #star-button-box, #context-bookmarkpage");