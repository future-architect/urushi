/*eslint "vars-on-top" : 0*/

define(
	'tooltip.spec',
	['Urushi', 'Tooltip', 'Button', 'templateEngine', 'templateConfig'],
	function (Urushi, Tooltip, Button, templateEngine, templateConfig) {
		'use strict';
		var temp,
			hasTransitionSupportTrue = function () {return true;},
			hasTransitionSupportFalse = function () {return false;};

		describe('Tooltip test', function () {
			var button, button1, button2,
				tooltip1, tooltip2,
				parentNode = document.getElementById('script-modules');

			it('init', function () {
				button = new Button();
				parentNode.appendChild(button.getRootNode());
				expect((new Tooltip({parentNode : button.getRootNode(), content : 'test message.'})).destroy()).toBe();
				button.destroy();

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				button1 = new Button({label : 'button 1', duration : 200});
				tooltip1 = new Tooltip({parentNode : button.getRootNode(), content : 'test message 1.'});

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				button2 = new Button({label : 'button 2'});
				tooltip2 = new Tooltip({parentNode : button.getRootNode(), content : 'test message 2.'});

				Urushi.hasTransitionSupport = temp;
			});
			it('setPosition', function () {
				expect(tooltip1.setPosition()).toBe();
				expect(tooltip1.setPosition({})).toBe();
				expect(tooltip1.setPosition('string')).toBe();
				expect(tooltip1.setPosition('top')).toBe();
				expect(tooltip1.setPosition('TOP')).toBe();
				expect(tooltip1.setPosition('right')).toBe();
				expect(tooltip1.setPosition('RIGHT')).toBe();
				expect(tooltip1.setPosition('left')).toBe();
				expect(tooltip1.setPosition('LEFT')).toBe();
				expect(tooltip1.setPosition('bottom')).toBe();
				expect(tooltip1.setPosition('BOTTOM')).toBe();
			});
			it('setParent', function () {
				expect(function () {
					tooltip1.setParent();
				}).toThrow();
				expect(function () {
					tooltip1.setParent('');
				}).toThrow();
				expect(tooltip1.setParent(button1.getRootNode())).toBe();
			});
			it('setOn', function () {
				expect(tooltip1.setOn()).toBe();
				expect(tooltip1.setOn('')).toBe();
				expect(tooltip1.setOn('click')).toBe();
			});
			it('setOff', function () {
				expect(tooltip1.setOff()).toBe();
				expect(tooltip1.setOff('')).toBe();
				expect(tooltip1.setOff('click')).toBe();
			});
			it('setContent', function () {
				expect(function () {
					tooltip1.setContent('');
				}).toThrow();
				expect(function () {
					tooltip1.setContent();
				}).toThrow();
				expect(tooltip1.setContent('some message.')).toBe();
			});
			it('html escape content', function () {
				var button = $('<button>html escape content</button>')[0];
				parentNode.appendChild(button);
				var tooltip = new Tooltip({parentNode : button, content : '<div>escape</div>'});

				expect(tooltip.rootNode.getElementsByClassName('popover-content')[0].textContent).toBe('<div>escape</div>');
			});

			it('dom content', function () {
				var button = $('<button>dom content</button>')[0];
				parentNode.appendChild(button);
				var tooltip = new Tooltip({parentNode : button, content : $('<div style="color: red;">dom</div>')});

				expect(tooltip.rootNode.getElementsByClassName('popover-content')[0].innerHTML).toBe('<div style="color: red;">dom</div>');
			});
			it('show', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(tooltip1.show()).toBe();
				expect(tooltip1.show()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(tooltip2.show()).toBe();
				expect(tooltip2.show()).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('hide', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(tooltip1.hide()).toBe();
				expect(tooltip1.hide()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(tooltip2.hide()).toBe();
				expect(tooltip2.hide()).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('_calculatePosition', function () {
				var position = tooltip1.position;
				tooltip1.position = '';

				expect(tooltip1._calculatePosition()).toEqual({top : '', left : ''});

				tooltip1.position = position;
			});
			it('getDuration', function () {
				expect(tooltip2.getDuration()).toBe(200);
			});
			it('destroy', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(tooltip1.destroy()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(tooltip2.destroy()).toBe();

				Urushi.hasTransitionSupport = temp;
			});

			describe('Template engine', function () {
				var flag = false;
				beforeEach(function (done) {
					templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
						flag = true;
						done();
					}).otherwise(function (error) {
						flag = false;
						done();
					});
				});
				it('template engine test', function () {
					expect(flag).toBe(true);
				});
			});

			// For jscover.
			jscoverReport();
		});
	}
);
