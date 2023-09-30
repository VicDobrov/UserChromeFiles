try {(() => {
	var id = "ucf-undo-tab", label = "Закрытые вкладки/окна",
	tooltiptextbtnmenu = "ЛКМ: Открыть меню\nПКМ: Восстановить вкладку\nСКМ: Показать весь журнал";
	CustomizableUI.createWidget({
		id, label, localized: false, defaultArea: CustomizableUI.AREA_NAVBAR,
		onCreated(trbn_1) {
			var win = trbn_1.ownerGlobal, doc = win.document;
			trbn_1.setAttribute("type", "menu");
			trbn_1.setAttribute("image", "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 48 48'><g><rect x='0' y='0' width='48' height='48' rx='3' ry='3' style='fill:rgb(0, 120, 173);'/><path style='opacity:0.25;fill:black;' d='M 16,12 C 16,12 3,27 3,26.81 L 24.2,48 H 45 C 46.7,48 48,46.7 48,45 V 17.3 L 40,9.3 Z'/><path style='fill:white;' d='M 27.68,3.93 C 26.7,3.93 25.66,3.992 24.58,4.138 19.23,5.17 13.74,8.472 10.22,12.78 3.018,5.815 7.525,10.29 3.021,5.815 L 3,26.81 H 24.18 L 17.03,19.7 C 20.44,14.7 30.87,6.752 38.32,19.08 40.69,25.69 40.58,36.52 35.69,44 40.97,38.26 45.35,30.55 44.98,21.33 44.59,14.08 39.37,3.992 27.68,3.93' /></g></svg>");
			trbn_1.setAttribute("tooltiptext", tooltiptextbtnmenu);
			trbn_1.setAttribute("context", "");
			trbn_1.addEventListener("click", e => {
				if (e.button == 1)
					win.PlacesCommandHook.showPlacesOrganizer("History");
				else if (e.button == 2) {
					e.preventDefault(); e.stopPropagation();
					win.undoCloseTab();
				}
			});
			var mupp_0 = doc.createXULElement("menupopup");
			mupp_0.id = `${id}-popup`;
			mupp_0.setAttribute("tooltip", "bhTooltip");
			mupp_0.setAttribute("popupsinherittooltip", true);
			mupp_0.addEventListener("click", e => {
				e.stopPropagation();
			});
			mupp_0.addEventListener("command", e => {
				e.stopPropagation();
			});
			var muim_0 = doc.createXULElement("menuitem");
			muim_0.id = `${id}-all-history`;
			muim_0.className = "ucf-menuitem";
			muim_0.setAttribute("label", "Показать весь журнал");
			muim_0.addEventListener("command", e => {
				e.stopPropagation();
				win.PlacesCommandHook.showPlacesOrganizer("History");
			});
			mupp_0.append(muim_0);
			var muim_1 = doc.createXULElement("menuitem");
			muim_1.id = `${id}-sanitize`;
			muim_1.className = "ucf-menuitem";
			muim_1.setAttribute("label", "Удалить недавнюю историю…");
			muim_1.addEventListener("command", e => {
				e.stopPropagation();
				win.Sanitizer.showUI(win);
			});
			mupp_0.append(muim_1);
			var muim_2 = doc.createXULElement("menuitem");
			muim_2.id = `${id}-session`;
			muim_2.className = "ucf-menuitem";
			muim_2.setAttribute("hidden", "true");
			muim_2.setAttribute("label", "Восстановить последнюю сессию");
			muim_2.addEventListener("command", e => {
				e.stopPropagation();
				win.SessionStore.restoreLastSession();
			});
			mupp_0.append(muim_2);
			var menu_0 = doc.createXULElement("menu");
			menu_0.id = `${id}-menu-closed-win`;
			menu_0.setAttribute("hidden", "true");
			menu_0.setAttribute("label", "Недавно закрытые окна");
			var mupp_1 = doc.createXULElement("menupopup");
			var muim_3 = doc.createXULElement("menuitem");
			muim_3.id = `${id}-item-closed-win`;
			muim_3.className = "ucf-menuitem";
			muim_3.setAttribute("hidden", "true");
			muim_3.setAttribute("label", "Забыть закрытые окна");
			muim_3.addEventListener("command", e => {
				e.stopPropagation();
				var sessionStore = win.SessionStore;
				var count = sessionStore.getClosedWindowCount();
				while(count--)
					sessionStore.forgetClosedWindow(0);
			});
			mupp_1.append(muim_3);
			var musr_0 = doc.createXULElement("menuseparator");
			musr_0.id = `${id}-sep-closed-win`;
			musr_0.className = "ucf-menuseparator";
			musr_0.setAttribute("hidden", "true");
			mupp_1.append(musr_0);
			mupp_1.addEventListener("popupshowing", e => {
				e.stopPropagation();
				for (let item of mupp_1.querySelectorAll(":scope > :is(menuitem:not(.ucf-menuitem), menuseparator:not(.ucf-menuseparator))"))
					item.remove();
				if (win.SessionStore.getClosedWindowCount() == 0) {
					muim_3.setAttribute("hidden", "true");
					musr_0.setAttribute("hidden", "true");
					return;
				}
				if ("RecentlyClosedTabsAndWindowsMenuUtils" in win) {
					muim_3.removeAttribute("hidden");
					musr_0.removeAttribute("hidden");
					var windowsFragment = win.RecentlyClosedTabsAndWindowsMenuUtils.getWindowsFragment(win, "menuitem");
					mupp_1.append(windowsFragment);
					menu_0.removeAttribute("hidden");
				}
			});
			menu_0.append(mupp_1);
			mupp_0.append(menu_0);
			var musr_1 = doc.createXULElement("menuseparator");
			musr_1.className = "ucf-menuseparator";
			musr_1.setAttribute("hidden", "true");
			mupp_0.append(musr_1);
			var muim_4 = doc.createXULElement("menuitem");
			muim_4.id = `${id}-item-closed-tabs`;
			muim_4.className = "ucf-menuitem";
			muim_4.setAttribute("hidden", "true");
			muim_4.setAttribute("label", "Забыть закрытые вкладки");
			muim_4.addEventListener("command", e => {
				e.stopPropagation();
				var sessionStore = win.SessionStore, count;
				try{count = sessionStore.getClosedTabCountForWindow(win);} catch(e){count = sessionStore.getClosedTabCount(win)}
				while(count--)
					sessionStore.forgetClosedTab(win, 0);
			});
			mupp_0.append(muim_4);
			var musr_2 = doc.createXULElement("menuseparator");
			musr_2.id = `${id}-sep-closed-tabs`;
			musr_2.className = "ucf-menuseparator";
			musr_2.setAttribute("hidden", "true");
			mupp_0.append(musr_2);
			mupp_0.addEventListener("popupshowing", e => {
				var sessionStore = win.SessionStore;
				if (sessionStore.getClosedWindowCount() == 0)
					menu_0.setAttribute("hidden", "true");
				else
					menu_0.removeAttribute("hidden");
				if (!sessionStore.canRestoreLastSession)
					muim_2.setAttribute("hidden", "true");
				else
					muim_2.removeAttribute("hidden");
				for (let item of mupp_0.querySelectorAll(":scope > :is(menuitem:not(.ucf-menuitem), menuseparator:not(.ucf-menuseparator))"))
					item.remove();
				try{var sSgCTC = sessionStore.getClosedTabCountForWindow(win);} catch(e){var sSgCTC = sessionStore.getClosedTabCount(win)}
				if (win == Services.appShell.hiddenDOMWindow || sSgCTC == 0) {
					musr_1.setAttribute("hidden", "true");
					muim_4.setAttribute("hidden", "true");
					musr_2.setAttribute("hidden", "true");
					return;
				}
				if ("RecentlyClosedTabsAndWindowsMenuUtils" in win) {
					musr_1.removeAttribute("hidden");
					muim_4.removeAttribute("hidden");
					musr_2.removeAttribute("hidden");
					var tabsFragment = win.RecentlyClosedTabsAndWindowsMenuUtils.getTabsFragment(win, "menuitem");
					mupp_0.append(tabsFragment);
				}
			});
			trbn_1.append(mupp_0);
		}
	});
})()} catch(e){}