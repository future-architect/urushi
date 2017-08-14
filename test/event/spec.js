define(
	'event.spec',
	['event', 'Button'],
	function(event, Button) {
		'use strict';

		describe('Event test', function() {
			var parentNode = document.getElementById('script-modules');

			afterEach(function() {});

			it('register and delete test', function() {
				let button1 = new Button({
						label: 'Click me'
					}),
					button2 = document.getElementById('normal-button');

				parentNode.appendChild(button1.getRootNode());

				event.addEvent(button1.getRootNode(), 'click', (function() {
					expect(this.a).toBe(true);

					event.removeEvent(button1.getRootNode(), 'click');
				}).bind({a: true}));

				let testFnc = (function() {
					expect(this.a).toBe(true);

					event.removeEvent(button2, 'click', testFnc);
				}).bind({a: true});
				event.addEvent(button2, 'click', testFnc);

				button1.getRootNode().click();
				button2.click();
			});

			// For jscover.
			jscoverReport();
		});
	}
);
