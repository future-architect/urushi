define(
	'checkbox.spec',
	['Urushi', 'Checkbox', 'templateEngine', 'templateConfig'],
	function(Urushi, Checkbox, templateEngine, templateConfig) {
		'use strict';

		describe('Checkbox test', function() {
			var checkbox,
				parentNode = document.getElementById('script-modules');

			beforeEach(function() {
				var cb = new Checkbox({label: 'optional label'});
				cb.destroy();

				checkbox = new Checkbox();
				parentNode.appendChild(checkbox.getRootNode());
			});
			it('getValue', function() {
				expect(checkbox.getValue()).toBe(false);
				checkbox.inputNode.checked = true;
				expect(checkbox.getValue()).toBe(true);
				checkbox.inputNode.checked = false;
			});
			it('setChecked', function() {
				expect(checkbox.setChecked()).toBe();

				expect(checkbox.setChecked(true)).toBe();
				expect(checkbox.setChecked(false)).toBe();
			});
			it('clear', function() {
				expect(checkbox.setChecked(true)).toBe();
				expect(checkbox.clear()).toBe();

				expect(checkbox.getValue()).toBe(false);

			});
			it('getPropertyValue, setPropertyValue', function() {
				expect(checkbox.getPropertyValue()).toBe('on');
				expect(checkbox.setPropertyValue('test')).toBe();
				expect(checkbox.getPropertyValue('test')).toBe('test');
			});
			it('setDisabled', function() {
				expect(checkbox.setDisabled()).toBe(false);
				expect(checkbox.setDisabled(true)).toBe(true);
				expect(checkbox.setDisabled(true)).toBe(true);
				expect(checkbox.setDisabled(false)).toBe(true);
				expect(checkbox.setDisabled(false)).toBe(true);
			});
			it('destroy', function() {
				expect(checkbox.destroy()).toBe();
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
