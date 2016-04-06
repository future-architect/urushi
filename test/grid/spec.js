/*eslint "vars-on-top" : 0*/

define(
	'grid.spec',
	[
		'Urushi',
		'Grid',
		'GridModel',
		'templateEngine',
		'templateConfig'
	],
	function (Urushi, Grid, GridModel, templateEngine, templateConfig) {
		'use strict';

		var hasTransitionSupport = Urushi.hasTransitionSupport;

		var dataList = [],
			index,
			length;

		var type = ['セット', '単品'];
		var names = ['山田', '田中', '鈴木', '成田', '村田', '吉岡', '佐々木', '遠山', '越前', '金丸', '伊藤', '沢村', '大山', '宮原', '水島', '西園寺', '下東', '丸山'];
		var familyNames = ['太郎', '花子', '次郎', '三郎', '大輔', '良太郎', '良子', '桃子', '凛', '玲子', '響', '愛', '奈々', '恵', '庄司', '圭', '勇太', '太一'];
		//belongs = ['LXL', 'LSX', 'SGW', 'TIG', 'DKT', 'MUN', 'TIH', 'SAT', 'CFS', 'HR', 'SSP', 'SKY', 'NTR', 'ORB', 'SGS', 'RTB', 'TMB'];
		//status = ['新規見積', '見積準備中', '見積作成中', '問い合わせ中', '見積済み'];
		var alpha = ['A', 'B', 'C'];
		var num = [1, 2, 3, 4, 5];

		var day = new Date();

		for (index = 0, length = 200; index < length; index++) {
			dataList.push(
				{
					Id : '' + (index + 1),
					type : type[Math.floor(Math.random() * type.length)],
					Name : names[Math.floor(Math.random() * names.length)] + ' ' + familyNames[Math.floor(Math.random() * familyNames.length)],
					Num : alpha[Math.floor(Math.random() * alpha.length)] + alpha[Math.floor(Math.random() * alpha.length)] + alpha[Math.floor(Math.random() * alpha.length)] + alpha[Math.floor(Math.random() * alpha.length)] + alpha[Math.floor(Math.random() * alpha.length)] + alpha[Math.floor(Math.random() * alpha.length)] + '-' + num[Math.floor(Math.random() * num.length)] + num[Math.floor(Math.random() * num.length)] + num[Math.floor(Math.random() * num.length)] + num[Math.floor(Math.random() * num.length)] + num[Math.floor(Math.random() * num.length)] + num[Math.floor(Math.random() * num.length)],
					order : '' + (index + 1),
					sametime : 0,
					time : day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate() + ' - ' + day.getHours() + ' : ' + day.getMinutes() + ' : ' + day.getSeconds(),
					menu : ''
				}
			);
		}


		describe('Grid test', function () {
			afterEach(function() {
				Urushi.hasTransitionSupport = hasTransitionSupport;
			});

			var parentNode = document.getElementById('script-modules');

			it('init', function () {
				parentNode.appendChild(document.createTextNode('init'));
				var model = new GridModel({dataList : dataList});
				var grid = new Grid({
					header : [
						{name : 'Id', value : 'No'},
						{name : 'type', value : ['商品', $('<br>')[0], '種別']},
						{name : 'Name', value : '品名'},
						{name : 'Num', value : '品番'},
						{name : 'order', value : '発注数'},
						{name : 'time', value : '更新日時'},
						{name : 'sametime', value : '同時納品'},
						{name : 'menu', value : 'menu'}
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				var contextMenuItems = [
						{label : 'Alert', id : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', id : 'Button', name : 'Button', icon : 'mdi-hardware-headset'},
					],
					option = {
						'sametime' : {
							module : 'checkbox'
						},
						'order' : {
							module : 'input'
						},
						'menu' : {
							module : 'contextmenu',
							// moduleClass : 'contextMenu-default',
							callback : function () {console.log(arguments); },
							items : contextMenuItems
						}
					};
				grid.load(option);
				grid.show(parentNode);
			});

			it('setHiddenColumn for All', function () {
				parentNode.appendChild(document.createTextNode('setHiddenColumn for All'));
				var model = new GridModel({dataList : dataList});
				var grid = new Grid({
					header : [
						{name : 'Id', value : 'No'},
						{name : 'type', value : ['商品', $('<br>')[0], '種別']},
						{name : 'Name', value : '品名'},
						{name : 'Num', value : '品番'},
						{name : 'order', value : '発注数'},
						{name : 'time', value : '更新日時'},
						{name : 'sametime', value : '同時納品'},
						{name : 'menu', value : 'menu'}
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				var contextMenuItems = [
						{label : 'Alert', id : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', id : 'Button', name : 'Button', icon : 'mdi-hardware-headset'},
					],
					option = {
						'sametime' : {
							module : 'checkbox'
						},
						'order' : {
							module : 'input'
						},
						'menu' : {
							module : 'contextmenu',
							// moduleClass : 'contextMenu-default',
							callback : function () {console.log(arguments); },
							items : contextMenuItems
						}
					};
				grid.load(option);
				grid.show(parentNode);

				grid.setHiddenColumn(true);
				expect(grid.isHiddenColumn('Id')).toBe(true);
				expect(grid.isHiddenColumn('type')).toBe(true);
				expect(grid.isHiddenColumn('Name')).toBe(true);
				expect(grid.isHiddenColumn('Num')).toBe(true);
				expect(grid.isHiddenColumn('order')).toBe(true);
				expect(grid.isHiddenColumn('time')).toBe(true);
				expect(grid.isHiddenColumn('sametime')).toBe(true);
				expect(grid.isHiddenColumn('menu')).toBe(true);
			});

			it('setHiddenColumn', function () {
				parentNode.appendChild(document.createTextNode('setHiddenColumn'));
				var model = new GridModel({dataList : dataList});
				var grid = new Grid({
					header : [
						{name : 'Id', value : 'No'},
						{name : 'type', value : ['商品', $('<br>')[0], '種別']},
						{name : 'Name', value : '品名'},
						{name : 'Num', value : '品番'},
						{name : 'order', value : '発注数'},
						{name : 'time', value : '更新日時'},
						{name : 'sametime', value : '同時納品'},
						{name : 'menu', value : 'menu'}
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				var contextMenuItems = [
						{label : 'Alert', id : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', id : 'Button', name : 'Button', icon : 'mdi-hardware-headset'},
					],
					option = {
						'sametime' : {
							module : 'checkbox'
						},
						'order' : {
							module : 'input'
						},
						'menu' : {
							module : 'contextmenu',
							// moduleClass : 'contextMenu-default',
							callback : function () {console.log(arguments); },
							items : contextMenuItems
						}
					};
				grid.load(option);
				grid.show(parentNode);

				grid.setHiddenColumn(true, 'Id', 'type', 'ignore');
				expect(grid.isHiddenColumn('Id')).toBe(true);
				expect(grid.isHiddenColumn('type')).toBe(true);
				expect(grid.isHiddenColumn('Name')).toBe(false);
				expect(grid.isHiddenColumn('Num')).toBe(false);
				expect(grid.isHiddenColumn('order')).toBe(false);
				expect(grid.isHiddenColumn('time')).toBe(false);
				expect(grid.isHiddenColumn('sametime')).toBe(false);
				expect(grid.isHiddenColumn('menu')).toBe(false);

				grid.setHiddenColumn();
				expect(grid.isHiddenColumn('Id')).toBe(true);
				expect(grid.isHiddenColumn('type')).toBe(true);
				expect(grid.isHiddenColumn('Name')).toBe(false);
				expect(grid.isHiddenColumn('Num')).toBe(false);
				expect(grid.isHiddenColumn('order')).toBe(false);
				expect(grid.isHiddenColumn('time')).toBe(false);
				expect(grid.isHiddenColumn('sametime')).toBe(false);
				expect(grid.isHiddenColumn('menu')).toBe(false);

				grid.setHiddenColumn(false, 'Id');
				expect(grid.isHiddenColumn('Id')).toBe(false);
				expect(grid.isHiddenColumn('type')).toBe(true);
				expect(grid.isHiddenColumn('Name')).toBe(false);
				expect(grid.isHiddenColumn('Num')).toBe(false);
				expect(grid.isHiddenColumn('order')).toBe(false);
				expect(grid.isHiddenColumn('time')).toBe(false);
				expect(grid.isHiddenColumn('sametime')).toBe(false);
				expect(grid.isHiddenColumn('menu')).toBe(false);
			});

			it('Header.setHidden', function () {
				parentNode.appendChild(document.createTextNode('init'));

			});

			it('html escape', function () {
				parentNode.appendChild(document.createTextNode('html escape'));
				var model = new GridModel({dataList : [
					{escape : '<div>escape</div>'},
				]});
				var grid = new Grid({
					header : [
						{name : 'escape', value : '<div>escape</div>'},
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				grid.load();
				grid.show(parentNode);

				expect(grid.rootNode.getElementsByClassName('grid-header')[0].getElementsByClassName('column')[0].textContent).toBe('<div>escape</div>');
				expect(grid.rootNode.getElementsByClassName('grid-body')[0].getElementsByClassName('column')[0].textContent).toBe('<div>escape</div>');
			});

			it('set dom', function () {
				parentNode.appendChild(document.createTextNode('set dom'));
				var model = new GridModel({dataList : [
					{dom : $('<div style="color: red;">dom</div>')},
				]});
				var grid = new Grid({
					header : [
						{name : 'dom', value : $('<div style="color: red;">dom</div>')},
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				grid.load();
				grid.show(parentNode);

				expect(grid.rootNode.getElementsByClassName('grid-header')[0].getElementsByClassName('column')[0].innerHTML).toBe('<div style="color: red;">dom</div>');
				expect(grid.rootNode.getElementsByClassName('grid-body')[0].getElementsByClassName('column')[0].innerHTML).toBe('<div style="color: red;">dom</div>');
			});

			it('destroy', function () {
				parentNode.appendChild(document.createTextNode('destroy'));
				var model = new GridModel({dataList : dataList});
				var grid = new Grid({
					header : [
						{name : 'Id', value : 'No'},
						{name : 'type', value : ['商品', $('<br>')[0], '種別']},
						{name : 'Name', value : '品名'},
						{name : 'Num', value : '品番'},
						{name : 'order', value : '発注数'},
						{name : 'time', value : '更新日時'},
						{name : 'sametime', value : '同時納品'},
						{name : 'menu', value : 'menu'}
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				var contextMenuItems = [
						{label : 'Alert', id : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', id : 'Button', name : 'Button', icon : 'mdi-hardware-headset'},
					],
					option = {
						'sametime' : {
							module : 'checkbox'
						},
						'order' : {
							module : 'input'
						},
						'menu' : {
							module : 'contextmenu',
							// moduleClass : 'contextMenu-default',
							callback : function () {console.log(arguments); },
							items : contextMenuItems
						}
					};
				grid.load(option);
				grid.show(parentNode);

				grid.destroy();
			});

			it('_GridColumnItem.setHidden isHidden', function () {
				parentNode.appendChild(document.createTextNode('_GridColumnItem.setHidden isHidden'));
				var model = new GridModel({dataList : dataList});
				var grid = new Grid({
					header : [
						{name : 'Id', value : 'No'},
						{name : 'type', value : ['商品', $('<br>')[0], '種別']},
						{name : 'Name', value : '品名'},
						{name : 'Num', value : '品番'},
						{name : 'order', value : '発注数'},
						{name : 'time', value : '更新日時'},
						{name : 'sametime', value : '同時納品'},
						{name : 'menu', value : 'menu'}
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				var contextMenuItems = [
						{label : 'Alert', id : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', id : 'Button', name : 'Button', icon : 'mdi-hardware-headset'},
					],
					option = {
						'sametime' : {
							module : 'checkbox'
						},
						'order' : {
							module : 'input'
						},
						'menu' : {
							module : 'contextmenu',
							// moduleClass : 'contextMenu-default',
							callback : function () {console.log(arguments); },
							items : contextMenuItems
						}
					};
				grid.load(option);
				grid.show(parentNode);

				var item1 = grid.getColumn('Id');
				expect(item1.setHidden('')).toBe(false);
				expect(item1.setHidden(true)).toBe(true);

				expect(item1.isHidden()).toBe(true);
				expect(grid.isHiddenColumn('Id')).toBe(true);
			});

			it('_GridColumnItem.destroy', function () {
				parentNode.appendChild(document.createTextNode('_GridColumnItem.setHidden isHidden'));
				var model = new GridModel({dataList : dataList});
				var grid = new Grid({
					header : [
						{name : 'Id', value : 'No'},
						{name : 'type', value : ['商品', $('<br>')[0], '種別']},
						{name : 'Name', value : '品名'},
						{name : 'Num', value : '品番'},
						{name : 'order', value : '発注数'},
						{name : 'time', value : '更新日時'},
						{name : 'sametime', value : '同時納品'},
						{name : 'menu', value : 'menu'}
					],
					model : model,
					rowsPerPage : 30,
					paginationArea : 'above',
					selection : true,
				});

				var contextMenuItems = [
						{label : 'Alert', id : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', id : 'Button', name : 'Button', icon : 'mdi-hardware-headset'},
					],
					option = {
						'sametime' : {
							module : 'checkbox'
						},
						'order' : {
							module : 'input'
						},
						'menu' : {
							module : 'contextmenu',
							// moduleClass : 'contextMenu-default',
							callback : function () {console.log(arguments); },
							items : contextMenuItems
						}
					};
				grid.load(option);
				grid.show(parentNode);

				expect(grid.rootNode.getElementsByClassName('grid-header')[0].getElementsByTagName('ul')[0].children.length).toBe(8);

				grid.getColumn('Id').destroy();
				grid.getColumn('Name').destroy();
				grid.getColumn('order').destroy();
				grid.getColumn('sametime').destroy();

				expect(grid.rootNode.getElementsByClassName('grid-header')[0].getElementsByTagName('ul')[0].children.length).toBe(4);
				
			});

			it('template engine Grid test', function () {
				templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
					// var menus = result.widgets,
					// 	key;
				});
			});
			// JSCover使用時に自動でlogをstoreさせるため、以下の記述を必須とする
			jscoverReport();
		});
	}
);
