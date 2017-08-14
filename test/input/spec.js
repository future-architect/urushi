/*eslint "vars-on-top": 0*/
define(
	'input.spec',
	['Urushi', 'Input', 'templateEngine', 'templateConfig'],
	function(Urushi, Input, templateEngine, templateConfig) {
		'use strict';

		describe('Input test', function() {
			var input1,
				parentNode = document.getElementById('script-modules'),
				dummyEvent = {stopPropagation: function() {}};

			beforeEach(function() {
				(new Input({placeholder: 'input sample'})).destroy();
				(new Input({hint: 'hint message'})).destroy();

				input1 = new Input();
				parentNode.appendChild(input1.getRootNode());
			});
			it('setValue, getValue', function() {
				expect(input1.setValue()).toBe();
				expect(input1.setValue('')).toBe();
				expect(input1.getValue()).toBe('');
				expect(input1.setValue('test')).toBe();
				expect(input1.getValue()).toBe('test');
			});
			it('clear', function() {
				expect(input1.setValue('aaa')).toBe();
				expect(input1.clear()).toBe();
				expect(input1.getValue()).toBe('');
			});
			it('_onFocus', function() {
				expect(input1._onFocus(dummyEvent)).toBe();
			});
			it('_onBlur', function() {
				expect(input1._onBlur(dummyEvent)).toBe();
			});
			it('setDisabled', function() {
				expect(input1.setDisabled()).toBe(false);
				expect(input1.setDisabled(true)).toBe(true);
				expect(input1.setDisabled(false)).toBe(true);
				expect(input1.setDisabled(true)).toBe(true);
			});
			it('destroy', function() {
				expect(input1.destroy()).toBe();
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
					args = Input.prototype._parse(tags[i]);
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
