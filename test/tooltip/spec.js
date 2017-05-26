/*eslint "vars-on-top": 0*/

define(
	'tooltip.spec',
	['Urushi', 'Tooltip', 'Button', 'templateEngine', 'templateConfig'],
	function(Urushi, Tooltip, Button, templateEngine, templateConfig) {
		'use strict';

		function createElement(str) {
			var d = document.createElement('div');
			d.innerHTML = str;

			return d.children[0];
		}

		describe('Tooltip test', function() {
			var button, button1,
				tooltip1,
				parentNode = document.getElementById('script-modules');

			it('init', function() {
				button = new Button();
				parentNode.appendChild(button.getRootNode());
				expect((new Tooltip({parentNode: button.getRootNode(), content: 'test message.'})).destroy()).toBe();
				button.destroy();

				button1 = new Button({label: 'button 1', duration: 200});
				tooltip1 = new Tooltip({parentNode: button.getRootNode(), content: 'test message 1.'});
			});
			it('setPosition', function() {
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
			it('setParent', function() {
				expect(function() {
					tooltip1.setParent();
				}).toThrow();
				expect(function() {
					tooltip1.setParent('');
				}).toThrow();
				expect(tooltip1.setParent(button1.getRootNode())).toBe();
			});
			it('setOn', function() {
				expect(tooltip1.setOn()).toBe();
				expect(tooltip1.setOn('')).toBe();
				expect(tooltip1.setOn('click')).toBe();
			});
			it('setOff', function() {
				expect(tooltip1.setOff()).toBe();
				expect(tooltip1.setOff('')).toBe();
				expect(tooltip1.setOff('click')).toBe();
			});
			it('setContent', function() {
				expect(function() {
					tooltip1.setContent('');
				}).toThrow();
				expect(function() {
					tooltip1.setContent();
				}).toThrow();
				expect(tooltip1.setContent('some message.')).toBe();
			});
			it('html escape content', function() {
				var button = createElement('<button>html escape content</button>');
				parentNode.appendChild(button);
				var tooltip = new Tooltip({parentNode: button, content: '<div>escape</div>'});

				expect(
					tooltip.rootNode.getElementsByClassName(
						'popover-content')[0].textContent).toBe('<div>escape</div>');
			});

			it('dom content', function() {
				var button = createElement('<button>dom content</button>');
				parentNode.appendChild(button);
				var tooltip = new Tooltip({
					parentNode: button,
					content: createElement('<div style="color: red;">dom</div>')});

				expect(
					tooltip.rootNode.getElementsByClassName(
						'popover-content')[0].innerHTML).toBe('<div style="color: red;">dom</div>');
			});
			it('show', function() {
				expect(tooltip1.show()).toBe();
				expect(tooltip1.show()).toBe();
			});
			it('hide', function() {
				expect(tooltip1.hide()).toBe();
				expect(tooltip1.hide()).toBe();
			});
			it('_calculatePosition', function() {
				var position = tooltip1.position;
				tooltip1.position = '';

				expect(tooltip1._calculatePosition()).toEqual({top: '', left: ''});

				tooltip1.position = position;
			});
			it('getDuration', function() {
				expect(tooltip1.getDuration()).toBe(200);
			});
			it('destroy', function() {
				expect(tooltip1.destroy()).toBe();
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
