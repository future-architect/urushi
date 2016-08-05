/*eslint "vars-on-top" : 0*/
define(
	'input.spec',
	['Urushi', 'Input', 'templateEngine', 'templateConfig'],
	function (Urushi, Input, templateEngine, templateConfig) {
		'use strict';
		var temp,
			hasTransitionSupportTrue = function () {return true; },
			hasTransitionSupportFalse = function () {return false; };

		describe('Input test', function () {
			var input1,
				input2,
				parentNode = document.getElementById('script-modules'),
				dummyEvent = {stopPropagation : function () {}};

			beforeEach(function(){
				(new Input({placeholder : 'input sample'})).destroy();
				(new Input({hint : 'hint message'})).destroy();

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				input1 = new Input();
				parentNode.appendChild(input1.getRootNode());

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				(new Input({placeholder : 'input sample'})).destroy();
				input2 = new Input();
				parentNode.appendChild(input2.getRootNode());

				Urushi.hasTransitionSupport = temp;
			});
			it('setValue, getValue', function () {
				expect(input1.setValue()).toBe();
				expect(input1.setValue('')).toBe();
				expect(input1.getValue()).toBe('');
				expect(input1.setValue('test')).toBe();
				expect(input1.getValue()).toBe('test');
			});
			it('clear', function () {
				expect(input1.setValue('aaa')).toBe();
				expect(input1.clear()).toBe();
				expect(input1.getValue()).toBe('');
			});
			it('_onClickFloatingLabel', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(input1._onClickFloatingLabel()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				input2.timeoutId = 1;
				expect(input2._onClickFloatingLabel()).toBe();
				input2.timeoutId = NaN;
				expect(input2._onClickFloatingLabel()).toBe();
				input2.inputNode.classList.remove('empty');
				expect(input2._onClickFloatingLabel()).toBe();
				input2.inputNode.classList.add('empty');
				expect(input2._onClickFloatingLabel()).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('_onFocus', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(input1._onFocus(dummyEvent)).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(input2._onFocus(dummyEvent)).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('_onBlur', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(input1._onBlur(dummyEvent)).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(input2._onBlur(dummyEvent)).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('IE placeholder', function (done) {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;

				var input = new Input({
					placeholder : 'test'
				});
				expect(input.initFloatinglabelCss).toEqual({top : 5, 'font-size' : '14px'});
				parentNode.appendChild(input.getRootNode());

				expect(input._onFocus(dummyEvent)).toBe();

				setTimeout(function() {
					expect(input._onBlur(dummyEvent)).toBe();
					expect(input._onFocus(dummyEvent)).toBe();
					expect(input._onBlur(dummyEvent)).toBe();
				}, 310);

				setTimeout(function() {
					expect(input._onFocus(dummyEvent)).toBe();
					input.setValue('Test');
					expect(input._onBlur(dummyEvent)).toBe();
				}, 200 + 310);

				setTimeout(function() {
					expect(input._onFocus(dummyEvent)).toBe();
				}, 200 + 310 * 2);

				setTimeout(function() {
					input.destroy();
					Urushi.hasTransitionSupport = temp;
					done();
				}, 200 + 310 * 3);
			});
			it('IE placeholder on setValue', function (done) {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;

				var input = new Input({
					placeholder : 'test'
				});
				parentNode.appendChild(input.getRootNode());

				input.setValue('');

				setTimeout(function() {
					input.setValue('');
					expect(input.setValue('value')).toBe();
				}, 310);

				setTimeout(function() {
					input.setValue('value');
				}, 310 * 2);

				setTimeout(function() {
					input.setValue('');
				}, 310 * 3);

				setTimeout(function() {
					input.destroy();
					Urushi.hasTransitionSupport = temp;
					done();
				}, 310 * 4);
			});
			it('setDisabled', function () {
				expect(input1.setDisabled()).toBe(false);
				expect(input1.setDisabled(true)).toBe(true);
				expect(input1.setDisabled(false)).toBe(true);
				expect(input1.setDisabled(true)).toBe(true);
			});
			it('destroy', function () {
				expect(input1.destroy()).toBe();
				expect(input2.destroy()).toBe();
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
