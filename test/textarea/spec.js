define(
	'textarea.spec',
	['Urushi', 'Textarea', 'templateEngine', 'templateConfig'],
	function (Urushi, Textarea, templateEngine, templateConfig) {
		'use strict';

		describe('Textarea test', function () {
			var textarea,
				parentNode = document.getElementById('script-modules');

			it('init', function () {
				expect((new Textarea()).destroy()).toBe();
				textarea = new Textarea();
				parentNode.appendChild(textarea.getRootNode());
			});
			it('getValue, setValue', function () {
				expect(textarea.getValue()).toBe('');
				expect(textarea.setValue('test message')).toBe();
				expect(textarea.getValue()).toBe('test message');
			});
			it('destroy', function () {
				expect(textarea.destroy()).toBe();
			});

			it('template engine input test', function () {
				templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
					var modules = result.widgets,
						key;
				});
			});

			// For jscover.
			jscoverReport();
		});
	}
);
