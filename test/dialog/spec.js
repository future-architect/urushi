/*eslint "vars-on-top": 0*/

define(
	'dialog.spec',
	['Urushi', 'Dialog', 'templateEngine', 'templateConfig', 'materialConfig'],
	function(Urushi, Dialog, templateEngine, templateConfig, materialConfig) {
		'use strict';

		function createElement(str) {
			var d = document.createElement('div');
			d.innerHTML = str;

			return d.children[0];
		}

		describe('Dialog test', function() {
			var dialog,
				parentNode = document.getElementById('script-modules');

			beforeEach(function() {
				(new Dialog({content: 'content'})).destroy();
				(new Dialog({content: 'content', parentNode: document.body})).destroy();
				(new Dialog({content: 'content', isDisplayCloseIcon: false})).destroy();
				(new Dialog({content: 'content', isDisplayCloseIcon: true})).destroy();

				dialog = new Dialog({header: 'head', footer: 'foot', content: 'content'});
			});
			it('show', function(done) {
				dialog.isShown = false;
				expect(dialog.show()).toBe();
				Urushi.removeEvent(dialog.getRootNode(), 'keydown', dialog, 'onKeydown');
				expect(dialog.show()).toBe();
				done();
			});
			it('hide', function() {
				dialog.isShown = true;
				expect(dialog.hide()).toBe();
				expect(dialog.hide()).toBe();
			});
			it('setHeader', function() {
				expect(dialog.setHeader()).toBe();
				expect(dialog.setHeader(1)).toBe();
				expect(dialog.setHeader(true)).toBe();
				expect(dialog.setHeader({})).toBe();
				expect(dialog.setHeader([])).toBe();
				expect(dialog.setHeader('')).toBe();
				expect(dialog.setHeader('test')).toBe();
			});
			it('displayCloseIcon', function() {
				expect(dialog.displayCloseIcon()).toBe();
				expect(dialog.displayCloseIcon(true)).toBe();
				expect(dialog.displayCloseIcon(false)).toBe();
			});
			it('_onKeydown', function() {
				var invalidEvent = {stopPropagation: function() {}, which: '10'},
					validEvent = {stopPropagation: function() {}, which: '27'};

				expect(dialog._onKeydown(invalidEvent)).toBe();
				expect(dialog._onKeydown(validEvent)).toBe();
			});
			it('setHeader empty', function() {
				var button = createElement('<button>setHeader empty</button>');
				parentNode.appendChild(button);
				var dlg = new Dialog({header: '', footer: 'foot', content: 'content'});
				parentNode.appendChild(dlg.rootNode);
				button.onclick = function() {
					dlg.show();
				};
				expect(dlg.headerNode.classList.contains('hidden')).toBe(true);

				dlg.setHeader('');
				expect(dlg.headerNode.classList.contains('hidden')).toBe(true);

				dlg.setHeader('A');
				expect(dlg.headerNode.classList.contains('hidden')).toBe(false);

				dlg.setHeader([]);
				expect(dlg.headerNode.classList.contains('hidden')).toBe(true);

				dlg.setHeader('A');
				expect(dlg.headerNode.classList.contains('hidden')).toBe(false);

				dlg.setHeader();
				expect(dlg.headerNode.classList.contains('hidden')).toBe(true);
			});

			it('setHeader html escape', function() {
				var button = createElement('<button>setHeader html escape</button>');
				parentNode.appendChild(button);
				var dlg = new Dialog({header: '<div>escape init</div>', footer: 'foot', content: 'content'});
				parentNode.appendChild(dlg.rootNode);
				button.onclick = function() {
					dlg.show();
				};
				expect(dlg.titleNode.textContent).toBe('<div>escape init</div>');

				dlg.setHeader('<div>escape</div>');
				expect(dlg.titleNode.textContent).toBe('<div>escape</div>');
			});

			it('setHeader dom', function() {
				var button = createElement('<button>setHeader dom</button>');
				parentNode.appendChild(button);
				var dlg = new Dialog({
					header: createElement('<div style="color: blue;">dom</div>'),
					footer: 'foot',
					content: 'content'});
				parentNode.appendChild(dlg.rootNode);
				button.onclick = function() {
					dlg.show();
				};
				expect(dlg.titleNode.innerHTML).toBe('<div style="color: blue;">dom</div>');
				
				dlg.setHeader(createElement('<div style="color: red;">dom</div>'));
				expect(dlg.titleNode.innerHTML).toBe('<div style="color: red;">dom</div>');
			});

			it('materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = true', function() {
				var button = createElement('<button>materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = true</button>');
				parentNode.appendChild(button);
				materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = true;

				var dlg = new Dialog({
					header: 'materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = true',
					footer: 'foot',
					content: 'content',
					isDisplayCloseIcon: true});
				parentNode.appendChild(dlg.rootNode);
				button.onclick = function() {
					dlg.show();
				};

				dlg.show();

				expect(dlg.isShown).toBe(true);

				dlg.underlayNode.click();

				expect(dlg.isShown).toBe(false);
			});

			it('materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = false', function() {
				var button = createElement('<button>materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = false</button>');
				parentNode.appendChild(button);
				materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = false;
				try {
					var dlg = new Dialog({
						header: 'materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = false',
						footer: 'foot',
						content: 'content',
						isDisplayCloseIcon: true});
					parentNode.appendChild(dlg.rootNode);
					button.onclick = function() {
						dlg.show();
					};

					dlg.show();

					expect(dlg.isShown).toBe(true);

					dlg.underlayNode.click();

					expect(dlg.isShown).toBe(true);

					dlg.hide();
				} finally {
					materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE = true;
				}
			});

			it('destroy', function() {
				expect(dialog.destroy()).toBe();
			});

			describe('Template engine', function() {
				var flag = false;
				beforeEach(function(done) {
					templateEngine.renderDocument(document.body, templateConfig).then(function(result) {
						var modules = result.widgets;
						Urushi.addEvent(modules.button1.getRootNode(), 'click', modules.button1, function() {
							modules.dialog1.show();
						});
						Urushi.addEvent(modules.button2.getRootNode(), 'click', modules.button2, function() {
							modules.dialog2.show();
						});

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
