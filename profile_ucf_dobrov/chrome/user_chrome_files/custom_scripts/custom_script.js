// Этот скрипт можно использовать для создания кнопок с помощью CustomizableUI.createWidget

(async () => { [] // подключить внешние скрипты js или jsm, [инициализация]
	.forEach(function(js) { try { if (/\.jsm$/i.test(js)) { // var obj =
				ChromeUtils.import('chrome://user_chrome_files/content/custom_scripts/'+ js); // js[1] && obj[js[1]]();
			} else Services.scriptloader.loadSubScript('chrome://user_chrome_files/content/custom_scripts/'+ js);
		} catch(e) {Cu.reportError(e);}
	});
})();
