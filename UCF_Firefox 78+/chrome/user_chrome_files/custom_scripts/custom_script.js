// Этот скрипт можно использовать для создания кнопок с помощью CustomizableUI.createWidget

(async () => { [] // подключить внешние скрипты js или jsm, [инициализация]
	.forEach(function(js) { try { if (/\.jsm$/i.test(js)) { // var obj =
				ChromeUtils.import('chrome://user_chrome_files/content/custom_scripts/'+ js); // js[1] && obj[js[1]]();
			} else Services.scriptloader.loadSubScript('chrome://user_chrome_files/content/custom_scripts/'+ js);
		} catch(e) {Cu.reportError(e);}
	});
})();


/* вариант с отдельными скриптами:
(async () => { var loadscript = (name, funcName) => {
  try { var {href, pathname} = new URL(`chrome://user_chrome_files/content/custom_scripts/${name}`);
    if (/\.jsm$/i.test(pathname)) {
      var obj = ChromeUtils.import(href);
      funcName && obj[funcName]();
    } else
      Services.scriptloader.loadSubScript(href);
    return true;
  }
  catch(ex) {Cu.reportError(ex);}
}
loadscript("ucf_aom-button.js");
loadscript("UCFTitleChangedChild.jsm", "registerUCFTitleChanged");
})();
*/