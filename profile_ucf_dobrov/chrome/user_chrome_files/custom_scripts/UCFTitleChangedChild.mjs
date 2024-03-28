export {registerUCFTitleChanged, UCFTitleChangedChild};

var reg = /^Скачать |-\sПоиск\sв\sGoogle$| \| Форум Mozilla Россия$/;

function registerUCFTitleChanged() { // исправление заголовка вкладки
	var esModuleURI = Components.stack.filename;
	ChromeUtils.registerWindowActor("UCFTitleChanged", {
		child: {
			esModuleURI,
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