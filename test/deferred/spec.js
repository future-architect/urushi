define(
	'deferred.spec',
	['event', 'Deferred', 'Button'],
	function (event, Deferred, Button) {
		'use strict';

		describe('Alert test', function () {
			var parentNode = document.getElementById('script-modules');

			afterEach(function() {});

			it('User test', function () {
				var button = new Button({
					label : 'Click me'
				});

				parentNode.appendChild(button.getRootNode());

				window.deferredTest = function () {
					var deferred = new Deferred();
					setTimeout(function () {
						deferred.resolve('finished.');
					}, 3000);

					deferred.then(function (result) {
						var tag = document.createElement('div');
						tag.innerText = 'test message 1' + result;
						parentNode.appendChild(tag);

						return 'second line';
					}, function (error) {
						var tag = document.createElement('div');
						tag.innerText = 'error 1' + error;
						parentNode.appendChild(tag);
					}).then(function (result) {
						var tag = document.createElement('div');
						tag.innerText = 'test message 2' + result;
						parentNode.appendChild(tag);
					}, function (error) {
						var tag = document.createElement('div');
						tag.innerText = 'error 2' + error;
						parentNode.appendChild(tag);
					});
				};
				event.addEvent(button.getRootNode(), 'click', window, 'deferredTest');
			});

			// For jscover.
			jscoverReport();
		});
	}
);
