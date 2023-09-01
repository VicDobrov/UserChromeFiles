// Данные опции имеют приоритет над указанными в about:config

// Включить поддержку userChrome.css и userContent.css
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

user_pref("mousewheel.with_alt.action", 1);
user_pref("mousewheel.with_meta.action", 1);

// Закрывать вкладки двойным нажатием левой кнопки мыши
user_pref("browser.tabs.closeTabByDblclick", true);

// минимальная ширина вкладок
user_pref("browser.tabs.tabMinWidth", 150);

// Восстанавливать предыдущую сессию
user_pref("browser.startup.page", 3);

// не раскрывать панель загрузок при скачивании
user_pref("browser.download.alwaysOpenPanel", false);

// Установить "Меню закладок" как папку по умолчанию для закладок, если не запоминается последнее сохранение
user_pref("browser.toolbars.bookmarks.2h2020", true);
user_pref("browser.bookmarks.defaultLocation", "menu");

// Скрыть "Последнее Избранное" в Библиотеки
user_pref("browser.library.activity-stream.enabled", false);

// Включить поиск текста на странице по мере его набора
user_pref("accessibility.typeaheadfind", true);

// Открепить ярлыки поисковых сервисов в Топе сайтов
user_pref("browser.newtabpage.activity-stream.improvesearch.topSiteSearchShortcuts", false);

// убрать навязчивый "Поиск через Яндекс" при первом клике в адресную строку
user_pref("browser.newtabpage.activity-stream.improvesearch.topSiteSearchShortcuts", false);

// Новое окно предпросмотра печати
user_pref("print.tab_modal.enabled", false);

// Отключить Pocket
user_pref("extensions.pocket.enabled", false);

// Вставка из Clipboard средней кнопкой мыши
user_pref("middlemouse.paste", true);

// уменьшение количества записей на диск
user_pref("places.database.disableDurability", true);

user_pref("toolkit.zoomManager.zoomValues", ".3,.5,.67,.8,.9,1,1.1,1.2,1.25,1.3,1.35,1.4,1.5,1.6,1.7,2,2.4,3");

// Не предупреждать при заходе на about:config
user_pref("browser.aboutConfig.showWarning", false);

// Включить переход на предыдущую страницу по нажатию Backspace (88+)
user_pref("browser.backspace_action", true);

// открывать новую вкладку рядом с текущей
user_pref("browser.tabs.insertAfterCurrent", true);

// Включить открытие ссылки в новой вкладки по нажатию на СКМ
user_pref("middlemouse.openNewWindow", true);

// Открывать новые вкладки справа
user_pref("browser.tabs.insertRelatedAfterCurrent", false);

// Не закрывать меню закладок после открытия закладки в новой вкладке
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// Отображать опцию "Компактные" в разделе "Значки" в разделе персонализации панели инструментов
user_pref("browser.compactmode.show", true);

// Не скрывать папку Мобильные закладки
user_pref("browser.bookmarks.showMobileBookmarks", false);

// Включить встроенный в адресную строку калькулятор
user_pref("suggest.calculator", true);

// Не отображать уведомление о блокировке содержимого
user_pref("browser.contentblocking.introCount", 20);

// Не открывать автоматически скачанный файл по завершению скачивания
user_pref("browser.download.improvements_to_download_panel", false);

// Отключить защиту скачивания файлов через незащищенные соединения
user_pref("dom.block_download_insecure", false);

// убрать из контекстного меню пункт "Информация об изображении"
user_pref("browser.menu.showViewImageInfo", false);

// Отключить подсчет URI в приватном режиме просмотра
user_pref("browser.engagement.total_uri_count.pbm", false);

// Включить раздел "Эксперименты Firefox" в настройках
user_pref("browser.preferences.experimental", true);

// Запретить Firefox устанавливать и проводить исследования
user_pref("app.shield.optoutstudies.enabled", false);

// Отключить Заметки (Обновления от Mozilla и Firefox)
user_pref("browser.newtabpage.activity-stream.feeds.snippets", false);

// Не уведомлять о новых функциях Firefox
user_pref("browser.messaging-system.whatsNewPanel.enabled", false);

// Не рекомендовать функции при просмотре
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);

// Не разрешать Firefox давать персональные рекомендации расширений
user_pref("browser.discovery.enabled", false);

// Отключить рекомендуемые расширения на странице "Дополнения"
user_pref("extensions.htmlaboutaddons.recommendations.enabled", false);
user_pref("extensions.htmlaboutaddons.discover.enabled", false);

// Отключить рекомендации расширений
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr", false);

// Не рекомендовать расширения при просмотре
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);

// Не предлагать импорт закладок, истории и паролей из другого браузера
user_pref("browser.newtabpage.activity-stream.migrationExpired", true);

// Отображать поисковые предложения в Приватных вкладках
user_pref("browser.search.suggest.enabled.private", true);

// Отобразить место для перетаскивания окна
user_pref("browser.tabs.extraDragSpace", true);

// Установить количество закрытых вкладок для восстановления на 20
user_pref("browser.sessionstore.max_tabs_undo", 20);

// Не предупреждать при закрытии нескольких вкладок
user_pref("browser.tabs.warnOnClose", false);

// Отображать эскизы вкладок на панели задач
user_pref("browser.taskbar.previews.enable", true);

// Декодировать URL, содержащий UTF8-символы
user_pref("browser.urlbar.decodeURLsOnCopy", true);

// Не отправлять поисковый запрос через DNS-сервер провайдера
user_pref("browser.urlbar.dnsResolveSingleWordsAfterSearch", 0);

// При использовании панели адреса не предлагать ссылки из поисковых
user_pref("browser.urlbar.suggest.engines", false);

// Включить отложенную загрузку для изображений
user_pref("dom.dom.image-lazy-loading.enabled", true);

// Запускать дополнения в приватном режиме
user_pref("extensions.allowPrivateBrowsingByDefault", true);

// Подсветить всех вхождения фразы в текст при поиске
user_pref("findbar.highlightAll", true);

// Включить поддержку AVIF (86)
user_pref("image.avif.enabled", true);

// Не выделять при выделении слова двойным нажатием идущий за ним пробел
user_pref("layout.word_select.eat_space_to_next_word", false);

// Включить элементы управления мультимедиа
user_pref("media.hardwaremediakeys.enabled", true);

// Блокировать новые запросы на отправку уведомлений
user_pref("permissions.default.desktop-notification", 2);

// Выбрать "Удалить всё" при удаление истории
user_pref("privacy.sanitize.timeSpan", 0);

// Привязывать модальные диалоги по умолчанию к окну
user_pref("prompts.defaultModalType", 3);

// Включить синхронизацию кастомизации интерфейса
user_pref("services.sync.prefs.sync.browser.uiCustomization.state", true);

// Включить импорт паролей в виде CSV-файла на странице "about: logins"
user_pref("signon.management.page.fileImport.enabled", true);

// Показать индикаторы на сохраненных логинах, которые повторно используют эти скомпрометированные пароли
user_pref("signon.management.page.vulnerable-passwords.enabled", true);

// Показывать совпадения поверх полосы прокрутки (87+)
user_pref("ui.textHighlightBackground", "Fireprick");

// Передавать сайтам сигнал "Не отслеживать" всегда
user_pref("privacy.donottrackheader.enabled", true);

// telemetry disable
user_pref("app.normandy.api_url", "");
user_pref("app.normandy.enabled", false);
user_pref("app.normandy.first_run", false);
user_pref("app.shield.optoutstudies.enabled", false);
user_pref("breakpad.reportURL", "");
user_pref("browser.crashReports.unsubmittedCheck.autoSubmit", false);
user_pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false);
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.newtabpage.activity-stream.telemetry.ping.endpoint", "");
user_pref("browser.newtabpage.activity-stream.telemetry", false);
user_pref("browser.ping-centre.production.endpoint", "");
user_pref("browser.ping-centre.staging.endpoint", "");
user_pref("browser.ping-centre.telemetry", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.policy.dataSubmissionPolicyAcceptedVersion", 2);
user_pref("extensions.systemAddon.update.enabled", false);
user_pref("extensions.systemAddon.update.url", "");
user_pref("network.allow-experiments", false);
user_pref("toolkit.telemetry.archive.enabled", false);
user_pref("toolkit.telemetry.bhrPing.enabled", false);
user_pref("toolkit.telemetry.cachedClientID", "");
user_pref("toolkit.telemetry.firstShutdownPing.enabled", false);
user_pref("toolkit.telemetry.hybridContent.enabled", false);
user_pref("toolkit.telemetry.newProfilePing.enabled", false);
user_pref("toolkit.telemetry.reportingpolicy.firstRun", false);
user_pref("toolkit.telemetry.server", "data:,");
user_pref("toolkit.telemetry.shutdownPingSender.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("experiments.supported", false);
user_pref("experiments.activeExperiment", false);
user_pref("toolkit.telemetry.updatePing.enabled", false);
user_pref("nsITelemetry.canRecordBase", false);
user_pref("nsITelemetry.canRecordExtended", false);
user_pref("extensions.screenshots.upload-disabled", true);
// END telemetry disable
