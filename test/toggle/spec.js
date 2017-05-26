define(
	'toggle.spec',
	['Urushi', 'ToggleButton', 'templateEngine', 'templateConfig'],
	function(Urushi, ToggleButton, templateEngine, templateConfig) {
		'use strict';

		describe('Toggle test', function() {
			var toggle1,
				parentNode = document.getElementById('script-modules');

			it('init', function() {
				expect((new ToggleButton()).destroy()).toBe();

				toggle1 = new ToggleButton({id: 'toggle1'});
				parentNode.appendChild(toggle1.getRootNode());
			});
			it('setDisabled', function() {
				expect(toggle1.setDisabled()).toBe(false);
				expect(toggle1.setDisabled(true)).toBe(true);
				expect(toggle1.setDisabled(false)).toBe(true);
			});
			it('getValue, setValue', function() {
				expect(toggle1.setValue(false)).toBe();
				expect(toggle1.getValue()).toBe(false);
				expect(toggle1.setValue(true)).toBe();
				expect(toggle1.getValue()).toBe(true);
			});
			it('clear', function() {
				expect(toggle1.setValue(true)).toBe();
				expect(toggle1.clear()).toBe();
				expect(toggle1.getValue()).toBe(false);
			});
			it('destroy', function() {
				expect(toggle1.destroy()).toBe();
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
