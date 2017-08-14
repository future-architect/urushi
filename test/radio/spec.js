define(
	'radio.spec',
	['Urushi', 'Radiobox', 'templateEngine', 'templateConfig'],
	function(Urushi, Radiobox, templateEngine, templateConfig) {
		'use strict';

		describe('Radiobox test', function() {
			let radio1,
				radio2,
				parentNode = document.getElementById('script-modules');

			it('init', function() {
				expect(function() {
					new Radiobox();
				}).toThrow();
				expect((new Radiobox({name: 'name'})).destroy()).toBe();

				radio1 = new Radiobox({name: 'test1', 'value': 'a'});
				parentNode.appendChild(radio1.getRootNode());
				radio2 = new Radiobox({name: 'test1', 'value': 'b'});
				parentNode.appendChild(radio2.getRootNode());
			});
			it('getValue', function() {
				expect(radio1.getValue()).toBe(false);
			});
			it('setChecked', function() {
				expect(radio1.setChecked()).toBe();

				expect(radio1.setChecked(true)).toBe();
				expect(radio1.setChecked(true)).toBe();
				expect(radio2.setChecked(false)).toBe();
			});
			it('getPropertyValue', function() {
				expect(radio1.getPropertyValue()).toBe('a');
			});
			it('setPropertyValue', function() {
				expect(radio1.setPropertyValue('ttt')).toBe();
				expect(radio1.getPropertyValue()).toBe('ttt');
			});
			it('setDisabled', function() {
				expect(radio1.setDisabled()).toBe(false);
				expect(radio1.setDisabled(true)).toBe(true);
				expect(radio1.setDisabled(false)).toBe(true);
			});
			it('destroy', function() {
				expect(radio1.destroy()).toBe();
				expect(radio2.destroy()).toBe();
			});

			it('_parse', function() {
				let tags = document.getElementsByName('radio1'),
					i, args, key, are = [
						{id: 'r1', name: 'radio1', label: '1', value: '1', styleClass: 'testClass', 'checked': false, 'disabled': false},
						{id: 'r2', name: 'radio1', label: '2', value: '2', styleClass: '', 'checked': true, 'disabled': false},
						{id: 'r3', name: 'radio1', label: '3', value: '3', styleClass: '', 'checked': false, 'disabled': false}
					];

				for (i = 0; i < tags.length; i++) {
					args = Radiobox.prototype._parse(tags[i]);
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
				let flag = false;
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
