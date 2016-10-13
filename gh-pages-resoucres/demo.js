
(function () {
	'use strict';
	var header, contextItems, contextItem, localeChangeItem, key, itemCallback, callbackFnc;

	// 画面情報
	var screens = {
		'index' : {
			'id' : 'index',
			'name' : 'INDEX',
			'path' : './',
			'screenFileNm' : 'index'
		},
		'alert' : {
			'id' : 'alert',
			'name' : 'ALERT',
			'path' : '../alert/',
			'screenFileNm' : 'alert'
		},
		'button' : {
			'id' : 'button',
			'name' : 'BUTTON',
			'path' : '../button/',
			'screenFileNm' : 'button'
		},
		'checkbox' : {
			'id' : 'checkbox',
			'name' : 'CHECKBOX',
			'path' : '../checkbox/',
			'screenFileNm' : 'checkbox'
		},
		'contextmenu' : {
			'id' : 'contextmenu',
			'name' : 'CONTEXTMENU',
			'path' : '../contextmenu/',
			'screenFileNm' : 'contextmenu'
		},
		'dialog' : {
			'id' : 'dialog',
			'name' : 'DIALOG',
			'path' : '../dialog/',
			'screenFileNm' : 'dialog'
		},
		'dropdown' : {
			'id' : 'dropdown',
			'name' : 'DROPDOWN',
			'path' : '../dropdown/',
			'screenFileNm' : 'dropdown'
		},
		'hamburger' : {
			'id' : 'hamburger',
			'name' : 'HAMBURGER',
			'path' : '../hamburger/',
			'screenFileNm' : 'hamburger'
		},
		'input' : {
			'id' : 'input',
			'name' : 'INPUT',
			'path' : '../input/',
			'screenFileNm' : 'input'
		},
		'panel' : {
			'id' : 'panel',
			'name' : 'PANEL',
			'path' : '../panel/',
			'screenFileNm' : 'panel'
		},
		'radio' : {
			'id' : 'radio',
			'name' : 'RADIO',
			'path' : '../radio/',
			'screenFileNm' : 'radio'
		},
		'textarea' : {
			'id' : 'textarea',
			'name' : 'TEXTAREA',
			'path' : '../textarea/',
			'screenFileNm' : 'textarea'
		},
		'toast' : {
			'id' : 'toast',
			'name' : 'TOAST',
			'path' : '../toast/',
			'screenFileNm' : 'toast'
		},
		'togglebutton' : {
			'id' : 'togglebutton',
			'name' : 'TOGGLEBUTTON',
			'path' : '../toggle/',
			'screenFileNm' : 'togglebutton'
		},
		'tooltip' : {
			'id' : 'tooltip',
			'name' : 'TOOLTIP',
			'path' : '../tooltip/',
			'screenFileNm' : 'tooltip'
		}
	};
	var isLocaleJa = false;
	var LOCALE_JA_JP = 'ja-jp';

	// URLからファイル名取得
	var screenFileNm = window.location.href.split('/').pop().split('.')[0];

	// index.htmlの場合
	if(!screenFileNm) {
		screenFileNm = 'index';
	}

	if (window.location.pathname.match(LOCALE_JA_JP)) {
		isLocaleJa = true;
	}

	// コンテキストアイテムのコールバック関数を返す
	itemCallback = function (path) {
		return function() {
			location.href = path;
		};
	};

	// ロケール変更アイテム
	localeChangeItem = {};
	localeChangeItem.id = screens[screenFileNm].id;
	if(isLocaleJa) {
		localeChangeItem.name = 'INDEX';
		localeChangeItem.label = 'INDEX';
		localeChangeItem.path = './../' + screens[screenFileNm].path;
	} else {
		localeChangeItem.name = 'JAPANESE';
		localeChangeItem.label = 'JAPANESE';
		localeChangeItem.path = './' + LOCALE_JA_JP + screens[screenFileNm].path.replace(/./, '');
	}
	localeChangeItem.callback = itemCallback(localeChangeItem.path);

	contextItems = [];
	for(key in screens) {
		if(key !== screenFileNm) {
			callbackFnc = itemCallback(screens[key].path);
			contextItem = {
				id : screens[key].id,
				name : screens[key].name,
				label : screens[key].name,
				callback : callbackFnc
			};
			contextItems.push(contextItem);
		}
	}
	contextItems.push(localeChangeItem);

	require.config(requireConfig);

	// コンテキストメニュー作成
	require(['ContextMenu'], function (ContextMenu) {
		var contextMenu = new ContextMenu({
			id : 'headerContextMenu',
			additionalClass : '',
			items : contextItems
		});
		document.querySelector('#headerContextNarrow').appendChild(contextMenu.getRootNode());
	});

	header = document.getElementById('header');

	// デモ動作設定
	const DIALOG="dialog"
	const TOAST="toast"
	var dir = location.href.split("/");  
	var demoNm = dir[dir.length -2];
	  
	require(['Urushi','Alert', 'templateEngine', 'templateConfig','ToastManager'], function(Urushi,Alert,templateEngine,
		templateConfig,ToastManager) {
		if(demoNm === DIALOG){
			templateEngine.renderDocument(document.body, templateConfig).then(
				function(result) {
					var modules = result.widgets;
					console.log(modules);
					Urushi.addEvent(modules.button1.getRootNode(), 'click',
						modules.button1, function() {
							modules.dialog1.show();
						});
					Urushi.addEvent(modules.button2.getRootNode(), 'click',
						modules.button2, function() {
							modules.dialog2.show();
						});
					done();
				}).otherwise(function(error) {
					done();
				});
			}else if(demoNm === TOAST){
				templateEngine.renderDocument(document.body, templateConfig).then(
					function(result) {
						var modules = result.widgets, key, manager;
						console.log(modules);
						manager = new ToastManager();
						console.log(manager);
						document.body.appendChild(manager.getRootNode());
						Urushi.addEvent(modules.button.getRootNode(), 'click', manager,
							'show', 'toast demo');
						done();
					}).otherwise(function(error) {
						done();
					});
				}else if(demoNm ==='toast'){
					templateEngine.renderDocument(document.body, templateConfig);
				}
				else{
					templateEngine.renderDocument(document.body, templateConfig).then(
						function(result) {
							var alerts = result.widgets, key;
							for (key in alerts) {
								alerts[key].show();
							}
							flag = true;
							done();
						}).otherwise(function(error) {
							flag = false;
							done();
						});
					}
				});
})();