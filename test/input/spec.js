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
