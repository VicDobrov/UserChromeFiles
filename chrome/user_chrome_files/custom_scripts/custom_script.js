// Этот скрипт можно использовать для создания кнопок с помощью CustomizableUI.createWidget
(async (scripts) => { // подключить внешние скрипты
  [['ucf_QuickToggle.js'], ['UCFTitleChangedChild.jsm', 'registerUCFTitleChanged'], ['Test.jsm']]
  .forEach(function(js) { try { if (/\.jsm$/i.test(js[0])) { // [скрипт js или jsm, инициализация]
        var obj = ChromeUtils.import(scripts + js[0]);
        js[1] && obj[js[1]]();
      } else Services.scriptloader.loadSubScript(scripts + js[0]);
    } catch(ex) {Cu.reportError(ex);}
  });
})('chrome://user_chrome_files/content/custom_scripts/');

/* вариант с отдельными скриптами:
(async () => { var loadscript = (name, funcName) => {
  try { var {href, pathname} = new URL(`chrome://user_chrome_files/content/custom_scripts/${name}`);
    if (/\.jsm$/i.test(pathname)) {
      var obj = ChromeUtils.import(href);
      funcName && obj[funcName]();
    } else
      Services.scriptloader.loadSubScript(href);
  }
  catch(ex) {Cu.reportError(ex);}
}
loadscript("ucf_aom-button.js");
loadscript("UCFTitleChangedChild.jsm", "registerUCFTitleChanged");
})();
*/
