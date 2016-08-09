define(
	'checkbox.spec',
	['Urushi', 'Checkbox', 'templateEngine', 'templateConfig'],
	function (Urushi, Checkbox, templateEngine, templateConfig) {
		'use strict';
		var temp,
			hasTransitionSupportTrue = function () {return true; },
			hasTransitionSupportFalse = function () {return false; };

		describe('Checkbox test', function () {
			var checkbox,
				legacyCheckbox,
				parentNode = document.getElementById('script-modules');

			beforeEach(function(){
				var cb = new Checkbox({label : 'optional label'});
				cb.destroy();

				checkbox = new Checkbox();
				parentNode.appendChild(checkbox.getRootNode());

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				legacyCheckbox = new Checkbox();
				parentNode.appendChild(legacyCheckbox.getRootNode());
				Urushi.hasTransitionSupport = temp;
			});
			it('getValue', function () {
				expect(checkbox.getValue()).toBe(false);
				checkbox.inputNode.checked = true;
				expect(checkbox.getValue()).toBe(true);
				checkbox.inputNode.checked = false;
			});
			it('setChecked', function () {
				expect(checkbox.setChecked()).toBe();

				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(checkbox.setChecked(true)).toBe();
				expect(checkbox.setChecked(false)).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(legacyCheckbox.setChecked(true)).toBe();
				expect(legacyCheckbox.setChecked(false)).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('clear', function () {
				expect(checkbox.setChecked(true)).toBe();
				expect(checkbox.clear()).toBe();

				expect(checkbox.getValue()).toBe(false);

			});
			it('_onClick', function () {
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(checkbox._onClick()).toBe();
				expect(checkbox._onClick()).toBe();

				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(legacyCheckbox._onClick()).toBe();
				expect(legacyCheckbox._onClick()).toBe();

				Urushi.hasTransitionSupport = temp;
			});
			it('getPropertyValue, setPropertyValue', function () {
				expect(checkbox.getPropertyValue()).toBe('on');
				expect(checkbox.setPropertyValue('test')).toBe();
				expect(checkbox.getPropertyValue('test')).toBe('test');
			});
			it('setDisabled', function () {
				expect(checkbox.setDisabled()).toBe(false);
				expect(checkbox.setDisabled(true)).toBe(true);
				expect(checkbox.setDisabled(true)).toBe(true);
				expect(checkbox.setDisabled(false)).toBe(true);
				expect(checkbox.setDisabled(false)).toBe(true);
			});
			it('destroy', function () {
				expect(checkbox.destroy()).toBe();
				expect(legacyCheckbox.destroy()).toBe();
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
