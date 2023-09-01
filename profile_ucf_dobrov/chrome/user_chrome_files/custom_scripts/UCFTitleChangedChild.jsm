var EXPORTED_SYMBOLS = ["registerUCFTitleChanged", "UCFTitleChangedChild"];

var reg = /-\sПоиск\sв\sGoogle$| \| Форум Mozilla Россия$|^Фильм |^Дорама |^Смотреть фильм |^Смотреть сериал |Смотреть дораму |^Смотреть бесплатно дораму |^смотреть дораму с озвучкой|^Отзывы по Дорама |^Смотреть онлайн сериал |^Сериал \| Фильм | - DoramaTV| смотреть онлайн бесплатно с озвучкой$/;
var hosts = ["https://www.google.com/search?*", "https://www.google.ru/search?*", "https://doramatv.live/*", "https://forum.mozilla-russia.org"];

function registerUCFTitleChanged() { // исправление заголовка вкладки
	ChromeUtils.registerWindowActor("UCFTitleChanged", {
		child: {
			moduleURI: "chrome://user_chrome_files/content/custom_scripts/UCFTitleChangedChild.jsm",
			events: {
				DOMTitleChanged: { capture: true },
			},
		},
			matches: hosts,
			messageManagerGroups: ["browsers"],
	});
}

class UCFTitleChangedChild extends JSWindowActorChild {
	handleEvent(e) {
		if (reg.test(this.document.title))
			this.document.title = this.document.title.replace(reg, "");
	}
}
