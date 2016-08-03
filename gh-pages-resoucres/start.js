
(function () {
	'use strict';
	var header, onscroll, contextItems, contextItem, localeChangeItem, key, itemCallback, callbackFnc;

	// 画面情報
	var screens = {
		'index' : {
			'id' : 'index',
			'name' : 'TOP PAGE',
			'path' : './',
			'screenFileNm' : 'index'
		},
		'get-started' : {
			'id' : 'getStarted',
			'name' : 'GET STARTED',
			'path' : './get-started.html',
			'screenFileNm' : 'get-started'
		},
		'for-developers' : {
			'id' : 'forDevelopers',
			'name' : 'FOR DEVELOPERS',
			'path' : './for-developers.html',
			'screenFileNm' : 'for-developers'
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
		localeChangeItem.name = 'ENGLISH';
		localeChangeItem.label = 'ENGLISH';
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

	header = document.getElementById('header');

	onscroll = function () {
		var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		if (y && !header.classList.contains('floating')) {
			header.classList.add('floating');
		} else if (!y && header.classList.contains('floating')) {
			header.classList.remove('floating');
		}
	};

	if (document.addEventListener) {
		document.addEventListener('scroll', onscroll, false);
	} else {
		document.attachEvent('on' + 'scroll', onscroll);
	}

	require(['templateEngine', 'templateConfig'], function (templateEngine, templateConfig) {
		templateEngine.renderDocument(document.body, templateConfig).then(
			function (result) {
				// コンテキストメニュー作成
				require(['ContextMenu'], function (ContextMenu) {
					var contextMenu = new ContextMenu({
						id : 'headerContextMenu',
						additionalClass : '',
						items : contextItems
					});
					document.querySelector('.headerContextNarrow').appendChild(contextMenu.getRootNode());
				});
			}).otherwise(function (error) {
				console.log(error);
			}
		);
	});
})();