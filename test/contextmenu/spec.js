/*eslint "vars-on-top" : 0*/

define(
	'contextMenu.spec',
	['Urushi', 'ContextMenu', 'templateEngine', 'templateConfig', 'animation'],
	function (Urushi, ContextMenu, templateEngine, templateConfig, animation) {
		'use strict';

		var hasTransitionSupport = Urushi.hasTransitionSupport,
			hasTransitionSupportTrue = function () {return true;},
			hasTransitionSupportFalse = function () {return false;};

		describe('ContextMenu test', function () {
			afterEach(function() {
				Urushi.hasTransitionSupport = hasTransitionSupport;
			});

			var parentNode = document.getElementById('script-modules');

			it('init', function () {
				parentNode.appendChild(document.createTextNode('init'));
				var settingsCallback = function(id) {
					alert('Action Settings ID=' + id);
				};
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', name : 'Button', icon : 'mdi-hardware-headset'},
						{label : 'Checkbox', name : 'Checkbox', icon : 'mdi-editor-border-color'},
						{label : 'Dialog', name : 'Dialog', icon : 'mdi-action-accessibility'},
						{label : 'Dropdown', name : 'Dropdown', icon : 'mdi-communication-phone'},
						{label : 'Hamburger', name : 'Hamburger', icon : 'mdi-image-camera-alt'},
						{label : 'Input', name : 'Input', icon : 'mdi-action-settings'},
						{label : 'Panel', name : 'Panel', icon : 'mdi-action-shopping-cart'},
						{label : 'Radio', name : 'Radio', icon : 'mdi-maps-local-atm'},
						{label : 'Settings', callback : settingsCallback, name : 'Settings', icon : 'mdi-maps-local-atm'},
					],
					defaultCallback : defaultCallback
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

			it('Empty arg init', function () {
				parentNode.appendChild(document.createTextNode('Empty arg init'));
				var menu = new ContextMenu();
				parentNode.appendChild(menu.rootNode);
			});

			it('Exception init', function () {
				parentNode.appendChild(document.createTextNode('Exception init'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'Alert', name : 'Alert', icon : 'mdi-content-mail'},
						{label : 'Button', name : 'Dup', icon : 'mdi-hardware-headset'},
						{label : 'Checkbox', name : 'Dup', icon : 'mdi-editor-border-color'},
					],
					defaultCallback : defaultCallback
				};
				expect(function() {
					var menu = new ContextMenu(option);
					parentNode.appendChild(menu.rootNode);
				}).toThrow();

			});

			it('Empty items', function () {
				parentNode.appendChild(document.createTextNode('Empty items'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					defaultCallback : defaultCallback
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(0);
			});

			it('setHiddenItem for All', function () {
				parentNode.appendChild(document.createTextNode('setHiddenItem for All'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				menu.setHiddenItem(true);
				expect(menu.isHiddenItem('name_test1')).toBe(true);
				expect(menu.isHiddenItem('name_test2')).toBe(true);
				expect(menu.isHiddenItem('name_test3')).toBe(true);
			});

			it('setHiddenItem', function () {
				parentNode.appendChild(document.createTextNode('setHiddenItem'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : defaultCallback,
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
					stopPropagation : jasmine.createSpy()
				};
				menu.onClickContext(clickEventMock);

				waits(300);

				runs(function() {
					expect(menu.listNode.children[0].classList.contains('show')).toBe(true);
					expect(menu.listNode.children[1].classList.contains('show')).toBe(false);
					expect(menu.listNode.children[2].classList.contains('show')).toBe(true);
				});
			});

			it('setupShowItems', function () {
				parentNode.appendChild(document.createTextNode('setupShowItems'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : defaultCallback,
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


			it('addItems', function () {
				parentNode.appendChild(document.createTextNode('addItems'));
				var defaultCallback = jasmine.createSpy();
				var option = {
					items : [
						{label : 'test1', name : 'test1'},
					],
					defaultCallback : defaultCallback,
				};

				var itemCallback = jasmine.createSpy();

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(1);
				menu.addItems([
					{label : 'test2', name : 'test2'},
					{label : 'test3', name : 'test3', callback : itemCallback},
				]);
				expect(menu.listNode.children.length).toBe(3);
				menu.addItems({});
				expect(menu.listNode.children.length).toBe(3);

				expect(function() {
					menu.addItems([{label : 'fail'}]);
				}).toThrow();
				expect(function() {
					menu.addItems([{name : 'fail'}]);
				}).toThrow();

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				waits(200);

				runs(function() {
					expect(defaultCallback.callCount).toBe(2);
					expect(itemCallback.callCount).toBe(1);
				});
			});

			it('removeItems for All', function () {
				parentNode.appendChild(document.createTextNode('removeItems for All'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test1', name : 'test1'},
						{label : 'test2', name : 'test2'},
						{label : 'test3', name : 'test3'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);

				menu.removeItems();
				expect(menu.listNode.children.length).toBe(0);
			});

			it('removeItems', function () {
				parentNode.appendChild(document.createTextNode('removeItems'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				expect(menu.listNode.children.length).toBe(3);

				menu.removeItems('name_test1', 'name_test2', 'ignore');
				expect(menu.listNode.children.length).toBe(1);
			});
			it('setCallback for All', function () {
				parentNode.appendChild(document.createTextNode('setCallback for All'));
				var beforeSpy = jasmine.createSpy();
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : beforeSpy,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				var spy = jasmine.createSpy();

				menu.setCallback(spy);
				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				waits(200);

				runs(function() {
					expect(spy.callCount).toBe(3);
					expect(beforeSpy.callCount).toBe(0);
				});
			});

			it('setCallback', function () {
				parentNode.appendChild(document.createTextNode('setCallback'));
				var beforeSpy = jasmine.createSpy();
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : beforeSpy,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				var spy = jasmine.createSpy();

				menu.setCallback(spy, 'name_test1', 'name_test2', 'ignore');
				menu.setCallback(null, 'name_test1', 'name_test2', 'ignore');

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				waits(200);

				runs(function() {
					expect(spy.callCount).toBe(2);
					expect(beforeSpy.callCount).toBe(1);
				});
			});

			it('empty callback', function () {
				parentNode.appendChild(document.createTextNode('empty callback'));
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}
			});

			it('addOnClickItemCustomArgs', function () {
				parentNode.appendChild(document.createTextNode('addOnClickItemCustomArgs'));
				var spy = jasmine.createSpy();
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : spy,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.addOnClickItemCustomArgs('A', 'B');

				for (var i = 0; i < menu.listNode.children.length; i++) {
					menu.listNode.children[i].click();
				}

				waits(200);

				runs(function() {
					expect(spy.argsForCall[0]).toEqual(['name_test1', 'A', 'B']);
					expect(spy.argsForCall[1]).toEqual(['name_test2', 'A', 'B']);
					expect(spy.argsForCall[2]).toEqual(['name_test3', 'A', 'B']);
				});

				runs(function() {
					spy.reset();
					menu.clearOnClickItemCustomArgs();
					for (var i = 0; i < menu.listNode.children.length; i++) {
						menu.listNode.children[i].click();
					}
				});

				waits(200);

				runs(function() {
					expect(spy.argsForCall[0]).toEqual(['name_test1']);
					expect(spy.argsForCall[1]).toEqual(['name_test2']);
					expect(spy.argsForCall[2]).toEqual(['name_test3']);
				});
			});

			it('onClickContext', function () {
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				parentNode.appendChild(document.createTextNode('onClickContext'));

				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(true);
				expect(menu.itemsNode.tabIndex).toBe(0);
				expect(menu.itemsNode).toBe(document.activeElement);

				menu.onClickContext(clickEventMock);//coverage

				clickEventMock.stopPropagation.reset();
				menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.setDisabled(true);
				menu.onClickContext(clickEventMock);

				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(false);
				expect(menu.itemsNode.tabIndex).toBe(-1);
				expect(menu.itemsNode).not.toBe(document.activeElement);

				clickEventMock.stopPropagation.reset();
				menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.disabled = true;
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(false);
				expect(menu.itemsNode.tabIndex).toBe(-1);
				expect(menu.itemsNode).not.toBe(document.activeElement);

				clickEventMock.stopPropagation.reset();
				menu = new ContextMenu();//empty
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(false);
				expect(menu.itemsNode.tabIndex).toBe(-1);
				expect(menu.itemsNode).not.toBe(document.activeElement);
			});

			it('onClickContext for IE', function () {
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				parentNode.appendChild(document.createTextNode('onClickContext for IE'));

				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).toHaveBeenCalled();
				expect(menu.itemsNode.classList.contains('items-open')).toBe(true);
				expect(menu.itemsNode.tabIndex).toBe(0);
				expect(menu.itemsNode).toBe(document.activeElement);

				waits(200);

				runs(function() {
					menu._close();
					menu.onClickContext(clickEventMock);
				});

				waits(200);
			});

			it('addOnClickContextCallback', function () {
				parentNode.appendChild(document.createTextNode('addOnClickContextCallback'));
				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
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
			it('type', function () {
				parentNode.appendChild(document.createTextNode('type'));
				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
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
			it('_close', function () {
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				parentNode.appendChild(document.createTextNode('_close'));
				var fucusButton = $('<button>フォーカス用</button>')[0];
				parentNode.appendChild(fucusButton);

				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);

				waits(300);

				runs(function() {
					fucusButton.focus();
				});

				waits(300);

				runs(function() {
					expect(menu.itemsNode).not.toBe(document.activeElement);
					expect(menu.itemsNode.tabIndex).toBe(-1);
				});
			});
			it('_close for IE', function () {
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				parentNode.appendChild(document.createTextNode('_close for IE'));
				var fucusButton = $('<button>フォーカス用</button>')[0];
				parentNode.appendChild(fucusButton);

				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);

				waits(300);

				runs(function() {
					fucusButton.focus();
				});

				waits(300);

				runs(function() {
					expect(menu.itemsNode).not.toBe(document.activeElement);
					expect(menu.itemsNode.tabIndex).toBe(-1);
				});

				runs(function() {
					menu.onClickContext(clickEventMock);
					fucusButton.focus();
				});

				waits(300);

				runs(function() {
					expect(menu.itemsNode).not.toBe(document.activeElement);
					expect(menu.itemsNode.tabIndex).toBe(-1);
				});
			});
			it('_onCloseIconMouseEnter _onCloseIconMouseLeave for IE', function () {
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				parentNode.appendChild(document.createTextNode('_onCloseIconMouseEnter _onCloseIconMouseLeave for IE'));

				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);

				waits(300);

				runs(function() {
					menu._onCloseIconMouseEnter(clickEventMock);
				});

				waits(300);

				runs(function() {
					expect(menu.closeIconNode.style[animation.STYLEKEYS.transform]).toBe('rotate(90deg)');
					
					menu._onCloseIconMouseLeave(clickEventMock);
				});

				waits(300);

				runs(function() {
					expect(menu.closeIconNode.style[animation.STYLEKEYS.transform]).toBe('');

					menu._onCloseIconMouseEnter(clickEventMock);
					menu._onCloseIconMouseLeave(clickEventMock);
					menu._onCloseIconMouseEnter(clickEventMock);
				});

				waits(300);

				runs(function() {
					expect(menu.closeIconNode.style[animation.STYLEKEYS.transform]).toBe('rotate(90deg)');
				});
			});

			it('onClickClose', function () {
				parentNode.appendChild(document.createTextNode('onClickClose'));

				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);

				waits(300);

				runs(function() {
					menu.onClickClose(clickEventMock);
					expect(menu.itemsNode.tabIndex).toBe(-1);
				});
			});

			it('bubbling', function () {
				parentNode.appendChild(document.createTextNode('bubbling'));

				var clickEventMock = {
					stopPropagation : jasmine.createSpy()
				};

				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
					bubbling : true,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();


				option = {
					items : [
						{label : 'test', name : 'test'},
					],
					defaultCallback : defaultCallback,
					bubbling : 123,
				};

				menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);
				menu.onClickContext(clickEventMock);
				expect(clickEventMock.stopPropagation).toHaveBeenCalled();
			});

			it('Empty label', function () {
				parentNode.appendChild(document.createTextNode('Empty label'));
				var option = {
					items : [
						{label : 'label', id : 'empty', name : 'empty'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				expect(menu.rootNode.getElementsByClassName('label')[0].innerHTML).toBe('label');
			});

			it('html escape label', function () {
				parentNode.appendChild(document.createTextNode('html escape label'));
				var option = {
					items : [
						{label : '<div>escape</div>', id : 'empty', name : 'empty'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				expect(menu.rootNode.getElementsByClassName('label')[0].textContent).toBe('<div>escape</div>');
			});

			it('dom label', function () {
				parentNode.appendChild(document.createTextNode('dom label'));
				var option = {
					items : [
						{label : $('<div style="color: red;">dom</div>'), id : 'empty', name : 'empty'},
					],
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				expect(menu.rootNode.getElementsByClassName('label')[0].innerHTML).toBe('<div style="color: red;">dom</div>');
			});

			it('destroy', function () {
				parentNode.appendChild(document.createTextNode('destroy'));
				var defaultCallback = function(id) {
					alert('Action Default ID=' + id);
				};
				var option = {
					items : [
						{label : 'test', name : 'test'},
						{label : 'test2', name : 'test2'},
					],
					defaultCallback : defaultCallback,
				};

				var menu = new ContextMenu(option);
				parentNode.appendChild(menu.rootNode);

				menu.destroy();

			});

			it('_ContextMenuItem.setCallback', function () {
				parentNode.appendChild(document.createTextNode('_ContextMenuItem.setCallback'));
				var defaultCallback = jasmine.createSpy();
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : defaultCallback,
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

				waits(200);

				runs(function() {
					expect(defaultCallback.callCount).toBe(2);
					expect(itemCallback.callCount).toBe(1);
				});
			});

			it('_ContextMenuItem.setHidden isHidden', function () {
				parentNode.appendChild(document.createTextNode('_ContextMenuItem.setHidden isHidden'));
				var defaultCallback = jasmine.createSpy();
				var option = {
					items : [
						{label : 'test1', name : 'name_test1'},
						{label : 'test2', name : 'name_test2'},
						{label : 'test3', name : 'name_test3'},
					],
					defaultCallback : defaultCallback,
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
			it('template engine ContextMenu test', function () {
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
