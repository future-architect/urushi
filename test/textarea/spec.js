define(
	'textarea.spec',
	['Urushi', 'Textarea', 'templateEngine', 'templateConfig'],
	function(Urushi, Textarea, templateEngine, templateConfig) {
		'use strict';

		describe('Textarea test', function() {
			var textarea,
				parentNode = document.getElementById('script-modules');

			it('init', function() {
				expect((new Textarea()).destroy()).toBe();
				textarea = new Textarea();
				parentNode.appendChild(textarea.getRootNode());
			});
			it('getValue, setValue', function() {
				expect(textarea.getValue()).toBe('');
				expect(textarea.setValue('test message')).toBe();
				expect(textarea.getValue()).toBe('test message');
			});
			it('destroy', function() {
				expect(textarea.destroy()).toBe();
			});
			it('_parse', function() {
				let tags = document.getElementById('parse').children,
					i, args, key, are = [
						{
							id: '',
							styleClass: '',
							value: '',
							placeholder: '',
							disabled: false,
							readonly: false
						},
						{
							id: 'testId',
							styleClass: 'testClass',
							value: 'test message',
							placeholder: 'placeholder',
							hint: 'hint',
							caption: 'test caption',
							disabled: true,
							readonly: true
						}
					];

				for (i = 0; i < tags.length; i++) {
					args = Textarea.prototype._parse(tags[i]);
					console.log('XXXX', args);
					for (key in args) {
						if (args[key] !== are[i][key]) {
							console.error('key in args', key, args[key], are[i][key]);
						}
						expect(args[key]).toBe(are[i][key]);
					}
					for (key in are[i]) {
						if (args[key] !== are[i][key]) {
							console.error('key in are[' + i + ']', key, args[key], are[i][key]);
						}
						expect(args[key]).toBe(are[i][key]);
					}

				}
			});

			describe('Template engine', function() {
				var flag = false;
				beforeEach(function(done) {
					templateEngine.renderDocument(document.body, templateConfig).then(function(result) {
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
