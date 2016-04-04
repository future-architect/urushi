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

			it('init', function () {
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
			it('_onInput', function () {
				// Tested with setValue.
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
			it('IE placeholder', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;

				var input = new Input({
					placeholder : 'test'
				});
				expect(input.initFloatinglabelCss).toEqual({top : 5, 'font-size' : '14px'});
				parentNode.appendChild(input.getRootNode());

				expect(input._onFocus(dummyEvent)).toBe();

				waits(310);

				runs(function() {
					expect(input._onBlur(dummyEvent)).toBe();
					expect(input._onFocus(dummyEvent)).toBe();
					expect(input._onBlur(dummyEvent)).toBe();
				});

				waits(200);

				runs(function() {
					expect(input._onFocus(dummyEvent)).toBe();
					input.setValue('Test');
					expect(input._onBlur(dummyEvent)).toBe();
				});

				waits(310);

				runs(function() {
					expect(input._onFocus(dummyEvent)).toBe();
				});

				waits(310);

				runs(function() {
					input.destroy();
					Urushi.hasTransitionSupport = temp;
				});
			});
			it('IE placeholder on setValue', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;

				var input = new Input({
					placeholder : 'test'
				});
				parentNode.appendChild(input.getRootNode());

				input.setValue('');

				waits(310);

				runs(function() {
					input.setValue('');
					input.setValue('value');
				});

				waits(310);

				runs(function() {
					input.setValue('value');
				});

				waits(310);

				runs(function() {
					input.setValue('');
				});

				waits(310);

				runs(function() {
					input.destroy();
					Urushi.hasTransitionSupport = temp;
				});
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
