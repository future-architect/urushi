define(
	'toggle.spec',
	['Urushi', 'ToggleButton', 'templateEngine', 'templateConfig'],
	function (Urushi, ToggleButton, templateEngine, templateConfig) {
		'use strict';
		var temp,
			hasTransitionSupportTrue = function () {return true; },
			hasTransitionSupportFalse = function () {return false; };

		describe('Toggle test', function () {
			var toggle1,
				toggle2,
				toggle3,
				parentNode = document.getElementById('script-modules');

			it('init', function () {
				expect((new ToggleButton()).destroy()).toBe();

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				toggle1 = new ToggleButton({id : 'toggle1'});
				parentNode.appendChild(toggle1.getRootNode());

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				toggle2 = new ToggleButton({id : 'toggle2'});
				toggle3 = new ToggleButton({id : 'toggle3', toggleButtonClass : 'toggle-primary'});
				parentNode.appendChild(toggle2.getRootNode());

				Urushi.hasTransitionSupport = temp;
			});
			it('setDisabled', function () {
				expect(toggle1.setDisabled()).toBe(false);
				expect(toggle1.setDisabled(true)).toBe(true);
				expect(toggle1.setDisabled(false)).toBe(true);
			});
			it('_onClick', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(toggle1._onClick()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(toggle2._onClick()).toBe();
				expect(toggle2._onClick()).toBe();
				toggle2.setDisabled(true);
				expect(toggle2._onClick()).toBe();
				toggle2.setDisabled(false);
				expect(toggle2._onClick()).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('getValue, setValue', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(toggle1.setValue(false)).toBe();
				expect(toggle1.getValue()).toBe(false);
				expect(toggle1.setValue(true)).toBe();
				expect(toggle1.getValue()).toBe(true);

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				toggle2.setDisabled(false);
				toggle3.setDisabled(false);
				expect(toggle2.setValue(false)).toBe();
				expect(toggle2.getValue()).toBe(false);
				expect(toggle2.setValue(true)).toBe();
				expect(toggle2.getValue()).toBe(true);

				expect(toggle3.setValue(false)).toBe();
				expect(toggle3.getValue()).toBe(false);
				expect(toggle3.setValue(true)).toBe();
				expect(toggle3.getValue()).toBe(true);

				Urushi.hasTransitionSupport = temp;
			});
			it('clear', function () {
				expect(toggle1.setValue(true)).toBe();
				expect(toggle1.clear()).toBe();
				expect(toggle1.getValue()).toBe(false);

				Urushi.hasTransitionSupport = temp;
			});
			it('destroy', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(toggle1.destroy()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(toggle2.destroy()).toBe();
				expect(toggle3.destroy()).toBe();

				Urushi.hasTransitionSupport = temp;
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
