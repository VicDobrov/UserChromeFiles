var EXPORTED_SYMBOLS = ["registerUCFTitleChanged", "UCFTitleChangedChild"];

var reg = /^Скачать |-\sПоиск\sв\sGoogle$| \| Форум Mozilla Россия$|^Фильм |^Дорама |^Смотреть фильм |^Смотреть сериал |Смотреть дораму |^Смотреть бесплатно дораму |^смотреть дораму с озвучкой|^Отзывы по Дорама |^Смотреть онлайн сериал |^Сериал \| Фильм | - DoramaTV| смотреть онлайн бесплатно с озвучкой$/;

function registerUCFTitleChanged() { // исправление заголовка вкладки
	ChromeUtils.registerWindowActor("UCFTitleChanged", {
		child: {
			moduleURI: "chrome://user_chrome_files/content/custom_scripts/UCFTitleChangedChild.jsm",
			events: {
				DOMTitleChanged: { capture: true },
			},
		},
		matches: ["https://*"],
		messageManagerGroups: ["browsers"],
	});
}

class UCFTitleChangedChild extends JSWindowActorChild {
	handleEvent(e) {
		if (reg.test(this.document.title))
			this.document.title = this.document.title.replace(reg, "");
	}
}