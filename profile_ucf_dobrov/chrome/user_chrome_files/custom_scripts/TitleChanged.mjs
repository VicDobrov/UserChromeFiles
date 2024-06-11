export {registerTitleChanged, TitleChangedChild};

var reg = /^Скачать |-\sПоиск\sв\sGoogle$| \| Форум Mozilla Россия$/;

function registerTitleChanged() { //исправление заголовка вкладки
	var esModuleURI = Components.stack.filename;
	ChromeUtils.registerWindowActor("TitleChanged", {
		child: {
			esModuleURI,
			events: {
				DOMTitleChanged: { capture: true },
			}
		},
		matches: ["https://*"],
		messageManagerGroups: ["browsers"],
	});
}
class TitleChangedChild extends JSWindowActorChild {
	handleEvent(e) {
		if (reg.test(this.document.title))
			this.document.title = this.document.title.replace(reg,"");
	}
}
ChromeUtils.domProcessChild.childID || registerTitleChanged();