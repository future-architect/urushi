/*eslint "vars-on-top": 0*/

define(
	'toast.spec',
	['Urushi', 'ToastManager', 'Toast', 'templateEngine', 'templateConfig'],
	function(Urushi, ToastManager, Toast, templateEngine, templateConfig) {
		'use strict';

		function createElement(str) {
			var d = document.createElement('div');
			d.innerHTML = str;

			return d.children[0];
		}

		describe('Toast test', function() {
			var toastManager,
				toast1,
				id1,
				id2,
				parentNode = document.getElementById('script-modules');

			it('toast.init', function() {
				expect((new Toast({content: 'test message'})).destroy()).toBe();

				toast1 = new Toast({content: 'test message'});
			});
			it('toast.setContent', function() {
				var fragment = document.createDocumentFragment(),
					span = document.createElement('span');

				fragment.appendChild(document.createElement('span'));

				expect(function() {
					toast1.setContent();
				}).toThrow();
				expect(function() {
					toast1.setContent('');
				}).toThrow();
				expect(function() {
					toast1.setContent([]);
				}).toThrow();

				expect(toast1.setContent('test')).toBe();
				expect(toast1.setContent(span)).toBe();
				expect(toast1.setContent(fragment)).toBe();
			});
			it('toast.show', function() {
				expect(toast1.show()).not.toBe(null);
				expect(toast1.show()).toBe(null);
			});
			it('toast.hide', function() {
				expect(toast1.hide()).not.toBe(null);
				expect(toast1.hide()).toBe(null);
			});
			it('toast.destroy', function() {
				expect(toast1.destroy()).toBe();
			});
			it('toast :html escape content', function() {
				parentNode.appendChild(document.createTextNode('toast :html escape label'));
				var toast = new Toast({content: '<div>escape</div>'});
				parentNode.appendChild(toast.rootNode);

				expect(toast.rootNode.getElementsByClassName('toast-content')[0].textContent).toBe('<div>escape</div>');
			});

			it('toast :dom content', function() {
				parentNode.appendChild(document.createTextNode('toast :dom label'));
				var toast = new Toast({content: createElement('<div style="color: red;">dom</div>')});
				parentNode.appendChild(toast.rootNode);

				expect(
					toast.rootNode.getElementsByClassName('toast-content')[0].innerHTML).toBe(
						'<div style="color: red;">dom</div>');
			});
			it('toastManager.init', function() {
				toastManager = new ToastManager();

				expect(function() {
					new ToastManager();
				}).toThrow();
			});
			it('toastManager.show', function() {
				var fragment = document.createDocumentFragment(),
					span = document.createElement('span');

				fragment.appendChild(document.createElement('span'));

				expect(toastManager.show()).toBe(undefined);
				expect(toastManager.show('')).toBe(undefined);
				expect(toastManager.show({})).toBe(undefined);
				expect(toastManager.show('test')).not.toBe(undefined);
				expect(toastManager.show(fragment)).not.toBe(undefined);
				expect(toastManager.show(span)).not.toBe(undefined);

				toastManager.setDisplayTime(NaN);
				expect((function() {
					id1 = toastManager.show('test');
					return id1;
				})()).not.toBe(undefined);
				expect((function() {
					id2 = toastManager.show('test');
					return id2;
				})()).not.toBe(undefined);
			});
			it('toastManager.getToastNode', function() {
				expect(toastManager.getToastNode()).toBe(null);
				expect(toastManager.getToastNode('error')).toBe(null);
				expect(toastManager.getToastNode(id1)).not.toBe(null);
			});
			it('toastManager.hide', function(done) {
				expect(toastManager.hide()).toBe();
				expect(toastManager.hide('error')).toBe();
				setTimeout(function() {
					expect(toastManager.hide(id1)).toBe();
					done();
				}, 50);
			});
			it('toastManager._deleteToast', function() {
				expect(toastManager._deleteToast(id2)).toBe();
			});
			it('toastManager.setDisplayTime', function() {
				expect(toastManager.setDisplayTime('')).toBe();
				expect(toastManager.setDisplayTime(NaN)).toBe();
				expect(toastManager.setDisplayTime(300)).toBe();
			});
			it('toastManager.destroy', function() {
				expect(toastManager.destroy()).toBe();
			});

			describe('Template engine', function() {
				var flag = false;
				beforeEach(function(done) {
					templateEngine.renderDocument(document.body, templateConfig).then(function(result) {
						var modules = result.widgets,
							manager;

						manager = new ToastManager();
						document.body.appendChild(manager.getRootNode());
						Urushi.addEvent(modules.button.getRootNode(), 'click', function() {
							manager.show('toast demo');
						});
						flag = true;
						done();
					}).catch(function(error) {
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
