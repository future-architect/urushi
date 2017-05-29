/*eslint "vars-on-top": 0*/

define(
	'contextMenu.spec',
	['Urushi', 'ContextMenu', 'templateEngine', 'templateConfig', 'animation'],
	function(Urushi, ContextMenu, templateEngine, templateConfig, animation) {
		'use strict';

		describe('ContextMenu test', function() {
			var parentNode = document.getElementById('script-modules');

			it('init', function() {
				parentNode.appendChild(document.createTextNode('init'));
				var settingsCallback = function(id) {
					alert('Action Settings ID=' + id);
				};
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'Alert', name: 'Alert', icon: 'mdi-content-mail'},
						{label: 'Button', name: 'Button', icon: 'mdi-hardware-headset'},
						{label: 'Checkbox', name: 'Checkbox', icon: 'mdi-editor-border-color'},
						{label: 'Dialog', name: 'Dialog', icon: 'mdi-action-accessibility'},
						{label: 'Dropdown', name: 'Dropdown', icon: 'mdi-communication-phone'},
						{label: 'Hamburger', name: 'Hamburger', icon: 'mdi-image-camera-alt'},
						{label: 'Input', name: 'Input', icon: 'mdi-action-settings'},
						{label: 'Panel', name: 'Panel', icon: 'mdi-action-shopping-cart'},
						{label: 'Radio', name: 'Radio', icon: 'mdi-maps-local-atm'},
						{label: 'Settings', callback: settingsCallback, name: 'Settings', icon: 'mdi-maps-local-atm'},
					],
					defaultCallback: defaultCallback
				};

				var contextMenu1 = new ContextMenu(option);
				parentNode.appendChild(contextMenu1.rootNode);
				expect(contextMenu1.listNode.children.length).toBe(10);

				option.contextMenuClass = 'contextMenu-default';
				var contextMenu2 = new ContextMenu(option);
				parentNode.appendChild(contextMenu2.rootNode);

				option.contextMenuClass = 'contextMenu-primary';
				var contextMenu3 = new ContextMenu(option);
				parentNode.appendChild(contextMenu3.rootNode);

				option.contextMenuClass = 'contextMenu-danger';
				var contextMenu4 = new ContextMenu(option);
				parentNode.appendChild(contextMenu4.rootNode);
			});

			it('Empty arg init', function() {
				parentNode.appendChild(document.createTextNode('Empty arg init'));
				var menu = new ContextMenu();
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(0);
			});

			it('Exception init', function() {
				parentNode.appendChild(document.createTextNode('Exception init'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'Alert', name: 'Alert', icon: 'mdi-content-mail'},
						{label: 'Button', name: 'Dup', icon: 'mdi-hardware-headset'},
						{label: 'Checkbox', name: 'Dup', icon: 'mdi-editor-border-color'},
					],
					defaultCallback: defaultCallback
				};
				expect(function() {
					var menu = new ContextMenu(option);
					parentNode.appendChild(menu.rootNode);
				}).toThrow();

			});

			it('Empty items', function() {
				parentNode.appendChild(document.createTextNode('Empty items'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					defaultCallback: defaultCallback
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(0);
			});

			it('setHiddenItem for All', function() {
				parentNode.appendChild(document.createTextNode('setHiddenItem for All'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				menu.setHiddenItem(true);
				expect(menu.isHiddenItem('name_test1')).toBe(true);
				expect(menu.isHiddenItem('name_test2')).toBe(true);
				expect(menu.isHiddenItem('name_test3')).toBe(true);
			});

			it('setHiddenItem', function(done) {
				parentNode.appendChild(document.createTextNode('setHiddenItem'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				menu.setHiddenItem(true, 'name_test1', 'name_test2', 'ignore');
				expect(menu.isHiddenItem('name_test1')).toBe(true);
				expect(menu.isHiddenItem('name_test2')).toBe(true);
				expect(menu.isHiddenItem('name_test3')).toBe(false);
				expect(menu.isHiddenItem('unknown')).toBeUndefined();

				menu.setHiddenItem();
				expect(menu.isHiddenItem('name_test1')).toBe(true);
				expect(menu.isHiddenItem('name_test2')).toBe(true);
				expect(menu.isHiddenItem('name_test3')).toBe(false);

				menu.setHiddenItem(false, 'name_test1');
				expect(menu.isHiddenItem('name_test1')).toBe(false);
				expect(menu.isHiddenItem('name_test2')).toBe(true);
				expect(menu.isHiddenItem('name_test3')).toBe(false);

				var clickEventMock = {
					stopPropagation: jasmine.createSpy()
				};
				menu.onClickContext(clickEventMock);

				setTimeout(function() {
					expect(menu.listNode.children[0].classList.contains('show')).toBe(true);
					expect(menu.listNode.children[1].classList.contains('show')).toBe(false);
					expect(menu.listNode.children[2].classList.contains('show')).toBe(true);
					done();
				}, 300);
			});

			it('setupShowItems', function() {
				parentNode.appendChild(document.createTextNode('setupShowItems'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				menu.setupShowItems('name_test1', 'name_test2', 'ignore');
				expect(menu.isHiddenItem('name_test1')).toBe(false);
				expect(menu.isHiddenItem('name_test2')).toBe(false);
				expect(menu.isHiddenItem('name_test3')).toBe(true);

				menu.setupShowItems(['name_test3', 'name_test2']);
				expect(menu.isHiddenItem('name_test1')).toBe(true);
				expect(menu.isHiddenItem('name_test2')).toBe(false);
				expect(menu.isHiddenItem('name_test3')).toBe(false);
			});


			it('addItems', function(done) {
				parentNode.appendChild(document.createTextNode('addItems'));
				var defaultCallback = jasmine.createSpy();
				var option = {
					items: [
						{label: 'test1', name: 'test1'},
					],
					defaultCallback: defaultCallback,
				};

				var itemCallback = jasmine.createSpy();

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(1);
				menu.addItems([
					{label: 'test2', name: 'test2'},
					{label: 'test3', name: 'test3', callback: itemCallback},
				]);
				expect(menu.listNode.children.length).toBe(3);
				menu.addItems({});
				expect(menu.listNode.children.length).toBe(3);

				expect(function() {
					menu.addItems([{label: 'fail'}]);
				}).toThrow();
				expect(function() {
					menu.addItems([{name: 'fail'}]);
				}).toThrow();

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				setTimeout(function() {
					expect(defaultCallback.calls.count()).toBe(2);
					expect(itemCallback.calls.count()).toBe(1);
					done();
				}, 200);
			});

			it('removeItems for All', function() {
				parentNode.appendChild(document.createTextNode('removeItems for All'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test1', name: 'test1'},
						{label: 'test2', name: 'test2'},
						{label: 'test3', name: 'test3'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);

				menu.removeItems();
				expect(menu.listNode.children.length).toBe(0);
			});

			it('removeItems', function() {
				parentNode.appendChild(document.createTextNode('removeItems'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);

				menu.removeItems('name_test1', 'name_test2', 'ignore');
				expect(menu.listNode.children.length).toBe(1);
			});
			it('setCallback for All', function(done) {
				parentNode.appendChild(document.createTextNode('setCallback for All'));
				var beforeSpy = jasmine.createSpy();
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: beforeSpy,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);

				var spy = jasmine.createSpy();

				menu.setCallback(spy);
				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				setTimeout(function() {
					expect(spy.calls.count()).toBe(3);
					expect(beforeSpy.calls.count()).toBe(0);
					done();
				}, 200);
			});

			it('setCallback', function(done) {
				parentNode.appendChild(document.createTextNode('setCallback'));
				var beforeSpy = jasmine.createSpy();
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: beforeSpy,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);

				var spy = jasmine.createSpy();

				menu.setCallback(spy, 'name_test1', 'name_test2', 'ignore');
				menu.setCallback(null, 'name_test1', 'name_test2', 'ignore');

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				setTimeout(function() {
					expect(spy.calls.count()).toBe(2);
					expect(beforeSpy.calls.count()).toBe(1);
					done();
				}, 200);
			});

			it('empty callback', function() {
				parentNode.appendChild(document.createTextNode('empty callback'));
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}
			});

			it('addOnClickItemCustomArgs', function(done) {
				parentNode.appendChild(document.createTextNode('addOnClickItemCustomArgs'));
				var spy = jasmine.createSpy();
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: spy,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);
				menu.addOnClickItemCustomArgs('A', 'B');

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				setTimeout(function() {
					expect(spy.calls.argsFor(0)).toEqual(['name_test1', 'A', 'B']);
					expect(spy.calls.argsFor(1)).toEqual(['name_test2', 'A', 'B']);
					expect(spy.calls.argsFor(2)).toEqual(['name_test3', 'A', 'B']);
				}, 200);

				setTimeout(function() {
					spy.calls.reset();
					menu.clearOnClickItemCustomArgs();
					for (var i = 0; i < menu.listNode.children.length; i++) {
						menu.listNode.children[i].click();
					}
				}, 200);

				setTimeout(function() {
					expect(spy.calls.argsFor(0)).toEqual(['name_test1']);
					expect(spy.calls.argsFor(1)).toEqual(['name_test2']);
					expect(spy.calls.argsFor(2)).toEqual(['name_test3']);
					done();
				}, 400);
			});

			it('onClickContext', function() {
				parentNode.appendChild(document.createTextNode('onClickContext'));

				var clickEventMock = {
					stopPropagation: jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test', name: 'test'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(true);
				expect(menu.itemsNode.tabIndex).toBe(0);
				expect(menu.itemsNode).toBe(document.activeElement);

				menu.onClickContext(clickEventMock);//coverage

				clickEventMock.stopPropagation.calls.reset();
				menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.setDisabled(true);
				menu.onClickContext(clickEventMock);

				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(false);
				expect(menu.itemsNode.tabIndex).toBe(-1);
				expect(menu.itemsNode).not.toBe(document.activeElement);

				clickEventMock.stopPropagation.calls.reset();
				menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.disabled = true;
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(false);
				expect(menu.itemsNode.tabIndex).toBe(-1);
				expect(menu.itemsNode).not.toBe(document.activeElement);

				clickEventMock.stopPropagation.calls.reset();
				menu = new ContextMenu();//empty
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(false);
				expect(menu.itemsNode.tabIndex).toBe(-1);
				expect(menu.itemsNode).not.toBe(document.activeElement);
			});

			it('addOnClickContextCallback', function() {
				parentNode.appendChild(document.createTextNode('addOnClickContextCallback'));
				var clickEventMock = {
					stopPropagation: jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test', name: 'test'},
					],
					defaultCallback: defaultCallback,
				};
				var spy = jasmine.createSpy();

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.addOnClickContextCallback(spy);
				menu.onClickContext(clickEventMock);
				expect(spy).toHaveBeenCalled();

				expect(function() {
					menu.addOnClickContextCallback();
				}).toThrow();
			});
			it('type', function() {
				parentNode.appendChild(document.createTextNode('type'));
				var clickEventMock = {
					stopPropagation: jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test', name: 'test'},
					],
					defaultCallback: defaultCallback,
				};

				//typeなし
				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.rootNode.classList.contains('type-grid')).toBe(false);
				expect(menu.type).not.toBe('grid');

				menu.onClickContext(clickEventMock);
				expect(menu.itemsNode.style.right).toBe((menu.contentWidth - 48) + 'px');

				option.type = 'grid';
				//typegrid
				menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.rootNode.classList.contains('type-grid')).toBe(true);
				expect(menu.type).toBe('grid');

				menu.onClickContext(clickEventMock);
				expect(menu.itemsNode.style.right).toBe((menu.contentWidth - 32) + 'px');
				

			});
			it('_close', function() {
				parentNode.appendChild(document.createTextNode('_close'));
				var fucusButton = Urushi.createNode('<button>フォーカス用</button>');
				parentNode.appendChild(fucusButton);

				var clickEventMock = {
					stopPropagation: jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test', name: 'test'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(1);
				menu.onClickContext(clickEventMock);
				fucusButton.focus();
				expect(menu.itemsNode).not.toBe(document.activeElement);
				expect(menu.itemsNode.tabIndex).toBe(-1);
			});

			it('onClickClose', function() {
				parentNode.appendChild(document.createTextNode('onClickClose'));

				var clickEventMock = {
					stopPropagation: jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test', name: 'test'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(1);
				menu.onClickContext(clickEventMock);

				menu.onClickClose(clickEventMock);
				expect(menu.itemsNode.tabIndex).toBe(-1);
			});

			it('bubbling', function() {
				parentNode.appendChild(document.createTextNode('bubbling'));

				var clickEventMock = {
					stopPropagation: jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test', name: 'test'},
					],
					defaultCallback: defaultCallback,
					bubbling: true,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();


				option = {
					items: [
						{label: 'test', name: 'test'},
					],
					defaultCallback: defaultCallback,
					bubbling: 123,
				};

				menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).toHaveBeenCalled();
			});

			it('Empty label', function() {
				parentNode.appendChild(document.createTextNode('Empty label'));
				var option = {
					items: [
						{label: 'label', id: 'empty', name: 'empty'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				expect(menu.rootNode.getElementsByClassName('label')[0].innerHTML).toBe('label');
			});

			it('html escape label', function() {
				parentNode.appendChild(document.createTextNode('html escape label'));
				var option = {
					items: [
						{label: '<div>escape</div>', id: 'empty', name: 'empty'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				expect(menu.rootNode.getElementsByClassName('label')[0].textContent).toBe('<div>escape</div>');
			});

			it('dom label', function() {
				parentNode.appendChild(document.createTextNode('dom label'));
				var option = {
					items: [
						{label: Urushi.createNode('<div style="color: red;">dom</div>'), id: 'empty', name: 'empty'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				expect(
					menu.rootNode.getElementsByClassName(
						'label')[0].innerHTML).toBe(
							'<div style="color: red;">dom</div>');
			});

			it('destroy', function() {
				parentNode.appendChild(document.createTextNode('destroy'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items: [
						{label: 'test', name: 'test'},
						{label: 'test2', name: 'test2'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				menu.destroy();
				expect(menu.subItemList.length).toBe(0);

			});

			it('_ContextMenuItem.setCallback', function(done) {
				parentNode.appendChild(document.createTextNode('_ContextMenuItem.setCallback'));
				var defaultCallback = jasmine.createSpy();
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: defaultCallback,
				};

				var itemCallback = jasmine.createSpy();
				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				var item1 = menu.getItem('name_test1');
				item1.setCallback(itemCallback);
				expect(function() {
					item1.setCallback();
				}).toThrow();

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				setTimeout(function() {
					expect(defaultCallback.calls.count()).toBe(2);
					expect(itemCallback.calls.count()).toBe(1);
					done();
				}, 200);
			});

			it('_ContextMenuItem.setHidden isHidden', function() {
				parentNode.appendChild(document.createTextNode('_ContextMenuItem.setHidden isHidden'));
				var defaultCallback = jasmine.createSpy();
				var option = {
					items: [
						{label: 'test1', name: 'name_test1'},
						{label: 'test2', name: 'name_test2'},
						{label: 'test3', name: 'name_test3'},
					],
					defaultCallback: defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				var item1 = menu.getItem('name_test1');
				expect(item1.setHidden('')).toBe(false);
				expect(item1.setHidden(true)).toBe(true);

				expect(item1.isHidden()).toBe(true);
				expect(menu.isHiddenItem('name_test1')).toBe(true);
				expect(menu.isHiddenItem('name_test2')).toBe(false);
				expect(menu.isHiddenItem('name_test3')).toBe(false);
			});

			describe('Template engine', function() {
				var flag = false;
				beforeEach(function(done) {
					templateEngine.renderDocument(document.body, templateConfig).then(function(result) {
						flag = true;
						done();
					}).otherwise(function(error) {
						flag = false;
						done();
					});
				});
				it('template engine test', function() {
					expect(flag).toBe(true);
				});
			});

			// For jscover.
			jscoverReport();
		});
	}
);
