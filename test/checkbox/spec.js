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
			it('_parse', function() {
				let tags = document.getElementById('parse').children,
					i, args, key, are = [
						{id: '', label: '', styleClass: '', 'checked': false, 'disabled': false},
						{id: 'chk1', label: 'Any', styleClass: '', 'checked': false, 'disabled': false},
						{id: 'chk2', label: 'Disabled Checked', styleClass: 'checkbox-default', 'checked': true, 'disabled': true}
					];

				for (i = 0; i < tags.length; i++) {
					args = Checkbox.prototype._parse(tags[i]);
					for (key in args) {
						console.log('key in args', key, args[key], are[i][key]);
						expect(args[key]).toBe(are[i][key]);
					}
					for (key in are[i]) {
						console.log('key in are[' + i + ']', key, args[key], are[i][key]);
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
