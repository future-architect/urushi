/*eslint "vars-on-top" : 0*/

define(
	'toast.spec',
	['Urushi', 'ToastManager', 'Toast', 'templateEngine', 'templateConfig'],
	function (Urushi, ToastManager, Toast, templateEngine, templateConfig) {
		'use strict';
		var temp,
			hasTransitionSupportTrue = function () {return true;},
			hasTransitionSupportFalse = function () {return false;};

		describe('Toast test', function () {
			var toastManager,
				toast1,
				toast2,
				id1,
				id2,
				parentNode = document.getElementById('script-modules');

			it('toast.init', function () {
				expect((new Toast({content : 'test message'})).destroy()).toBe();

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				toast1 = new Toast({content : 'test message'});

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				toast2 = new Toast({content : 'test message'});

				Urushi.hasTransitionSupport = temp;
			});
			it('toast.setContent', function () {
				var fragment = document.createDocumentFragment(),
					span = document.createElement('span');

				fragment.appendChild(document.createElement('span'));

				expect(function () {
					toast1.setContent();
				}).toThrow();
				expect(function () {
					toast1.setContent('');
				}).toThrow();
				expect(function () {
					toast1.setContent([]);
				}).toThrow();

				expect(toast1.setContent('test')).toBe();
				expect(toast1.setContent(span)).toBe();
				expect(toast1.setContent(fragment)).toBe();
			});
			it('toast.show', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(toast1.show()).not.toBe(null);
				expect(toast1.show()).toBe(null);

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(toast2.show()).not.toBe(null);
				expect(toast2.show()).toBe(null);

				Urushi.hasTransitionSupport = temp;
			});
			it('toast.hide', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(toast1.hide()).not.toBe(null);
				expect(toast1.hide()).toBe(null);

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(toast2.hide()).not.toBe(null);
				expect(toast2.hide()).toBe(null);

				Urushi.hasTransitionSupport = temp;
			});
			it('toast._onEndShow', function () {
				var deferred = new Urushi.Deferred();

				expect(toast2._onEndShow(deferred)).toBe();
			});
			it('toast._onEndHide', function () {
				var deferred = new Urushi.Deferred();

				expect(toast2._onEndHide(deferred)).toBe();
			});
			it('toast.destroy', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(toast1.destroy()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(toast2.destroy()).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('toast :html escape content', function () {
				parentNode.appendChild(document.createTextNode('toast :html escape label'));
				var toast = new Toast({content : '<div>escape</div>'});
				parentNode.appendChild(toast.rootNode);

				expect(toast.rootNode.getElementsByClassName('toast-content')[0].textContent).toBe('<div>escape</div>');
			});

			it('toast :dom content', function () {
				parentNode.appendChild(document.createTextNode('toast :dom label'));
				var toast = new Toast({content : $('<div style="color: red;">dom</div>')});
				parentNode.appendChild(toast.rootNode);

				expect(toast.rootNode.getElementsByClassName('toast-content')[0].innerHTML).toBe('<div style="color: red;">dom</div>');
			});
			it('toastManager.init', function () {
				toastManager = new ToastManager();

				expect(function () {
					new ToastManager();
				}).toThrow();
			});
			it('toastManager.show', function () {
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
				expect((function () {
					id1 = toastManager.show('test');
					return id1;
				})()).not.toBe(undefined);
				expect((function () {
					id2 = toastManager.show('test');
					return id2;
				})()).not.toBe(undefined);
			});
			it('toastManager.getToastNode', function () {
				expect(toastManager.getToastNode()).toBe(null);
				expect(toastManager.getToastNode('error')).toBe(null);
				expect(toastManager.getToastNode(id1)).not.toBe(null);
			});
			it('toastManager.hide', function () {
				expect(toastManager.hide()).toBe();
				expect(toastManager.hide('error')).toBe();
				setTimeout(function () {
					expect(toastManager.hide(id1)).toBe();
				}, 50);
			});
			it('toastManager._deleteToast', function () {
				expect(toastManager._deleteToast(id2)).toBe();
			});
			it('toastManager.setDisplayTime', function () {
				expect(toastManager.setDisplayTime('')).toBe();
				expect(toastManager.setDisplayTime(NaN)).toBe();
				expect(toastManager.setDisplayTime(300)).toBe();
			});
			it('toastManager.destroy', function () {
				expect(toastManager.destroy()).toBe();
			});

			it('template engine test', function () {
				templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
					var modules = result.widgets,
						key,
						manager;

					manager = new ToastManager();
					document.body.appendChild(manager.getRootNode());
					Urushi.addEvent(modules.button.getRootNode(), 'click', manager, 'show', 'toast demo');
				});
			});
			// JSCover使用時に自動でlogをstoreさせるため、以下の記述を必須とする
			jscoverReport();
		});
	}
);
