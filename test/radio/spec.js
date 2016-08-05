define(
	'radio.spec',
	['Urushi', 'Radiobox', 'templateEngine', 'templateConfig'],
	function (Urushi, Radiobox, templateEngine, templateConfig) {
		'use strict';
		var temp,
			hasTransitionSupportTrue = function () {return true;},
			hasTransitionSupportFalse = function () {return false;};

		describe('Radiobox test', function () {
			var radio1,
				radio2,
				radio3,
				radio4,
				parentNode = document.getElementById('script-modules');

			it('init', function () {
				expect(function () {
					new Radiobox();
				}).toThrow();
				expect((new Radiobox({name : 'name'})).destroy()).toBe();

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				radio1 = new Radiobox({name : 'test1', 'value' : 'a'});
				parentNode.appendChild(radio1.getRootNode());
				radio2 = new Radiobox({name : 'test1', 'value' : 'b'});
				parentNode.appendChild(radio2.getRootNode());

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				radio3 = new Radiobox({name : 'test2', 'value' : 'a'});
				parentNode.appendChild(radio3.getRootNode());
				radio4 = new Radiobox({name : 'test2', 'value' : 'b'});
				parentNode.appendChild(radio4.getRootNode());

				Urushi.hasTransitionSupport = temp;
			});
			it('getValue', function () {
				expect(radio1.getValue()).toBe(false);
			});
			it('setChecked', function () {
				expect(radio1.setChecked()).toBe();

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(radio1.setChecked(true)).toBe();
				expect(radio1.setChecked(true)).toBe();
				expect(radio2.setChecked(false)).toBe();
				expect(radio3.setChecked(false)).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(radio3.setChecked(true)).toBe();
				expect(radio3.setChecked(true)).toBe();
				expect(radio4.setChecked(false)).toBe();
				expect(radio4.setChecked(false)).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('_onClick', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(radio1._onClick()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(radio3._onClick()).toBe();
				expect(radio3._onClick()).toBe();
				expect(radio4._onClick()).toBe();
				expect(radio4._onClick()).toBe();
				expect(radio3._onClick()).toBe();
				expect(radio3._onClick()).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('getPropertyValue', function () {
				expect(radio1.getPropertyValue()).toBe('a');
			});
			it('setPropertyValue', function () {
				expect(radio1.setPropertyValue('ttt')).toBe();
				expect(radio1.getPropertyValue()).toBe('ttt');
			});
			it('setDisabled', function () {
				expect(radio1.setDisabled()).toBe(false);
				expect(radio1.setDisabled(true)).toBe(true);
				expect(radio1.setDisabled(false)).toBe(true);
			});
			it('destroy', function () {
				expect(radio1.destroy()).toBe();
				expect(radio2.destroy()).toBe();
				expect(radio3.destroy()).toBe();
				expect(radio4.destroy()).toBe();
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
