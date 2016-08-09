/*eslint "vars-on-top" : 0*/

define(
	'alert.spec',
	['Urushi', 'Alert', 'templateEngine', 'templateConfig'],
	function (Urushi, Alert, templateEngine, templateConfig) {
		'use strict';

		var hasTransitionSupport = Urushi.hasTransitionSupport,
			hasTransitionSupportTrue = function () {return true;},
			hasTransitionSupportFalse = function () {return false;};

		describe('Alert test', function () {
			afterEach(function() {
				Urushi.hasTransitionSupport = hasTransitionSupport;
			});

			var parentNode = document.getElementById('script-modules');

			beforeEach(function(){
				parentNode.appendChild($('<br>')[0]);
				var alert = new Alert({header : 'init', content : 'init test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();
			});
			it('show', function () {
				parentNode.appendChild($('<br>')[0]);
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				var alert = new Alert({header : 'show', content : 'show test'});
				parentNode.appendChild(alert.getRootNode());
				expect(alert.show()).toBe();
				expect(alert.show()).toBe();
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				var alert2 = new Alert({header : 'show for IE', content : 'show test for IE'});
				parentNode.appendChild(alert2.getRootNode());
				expect(alert2.show()).toBe();
				expect(alert2.show()).toBe();
			});
			it('close', function () {
				parentNode.appendChild($('<br>')[0]);
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				var alert = new Alert({header : 'close', content : 'close test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();
				expect(alert.close()).toBe();
				expect(alert.close()).toBe();
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				var alert2 = new Alert({header : 'close for IE', content : 'close test for IE'});
				parentNode.appendChild(alert2.getRootNode());
				alert2.show();
				expect(alert2.close()).toBe();
				expect(alert2.close()).toBe();
			});
			it('setHeader', function () {
				parentNode.appendChild($('<br>')[0]);
				var alert = new Alert({header : 'setHeader', content : 'setHeader test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();

				expect(alert.setHeader('test modify')).toBe();
				expect(alert.headerNode.innerHTML).toBe('test modify');

				expect(alert.setHeader()).toBe();
				expect(alert.headerNode.innerHTML).toBe('');

				alert.setHeader('error');
				expect(alert.setHeader(null)).toBe();
				expect(alert.headerNode.innerHTML).toBe('');

				alert.setHeader('error');
				expect(alert.setHeader('')).toBe();
				expect(alert.headerNode.innerHTML).toBe('');
			});
			it('setContent', function () {
				parentNode.appendChild($('<br>')[0]);
				var alert = new Alert({header : 'setContent', content : 'setContent test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();

				expect(function () {
					alert.setContent();
				}).toThrow();
				expect(function () {
					alert.setContent(null);
				}).toThrow();
				expect(function () {
					alert.setContent([]);
				}).toThrow();
				expect(function () {
					alert.setContent('');
				}).toThrow();

				expect(alert.setContent('test modify')).toBe();
				expect(alert.contentNode.innerHTML).toBe('test modify');
			});
			it('setContent others', function () {
				parentNode.appendChild($('<br>')[0]);
				var alert = new Alert({header : 'setContent others', content : 'setContent test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();
				expect(alert.setContent('<span>escape</span>')).toBe();
				expect(alert.contentNode.textContent).toBe('<span>escape</span>');

				alert = new Alert({header : 'setContent others', content : 'setContent test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();
				expect(alert.setContent($('<span style="color: red;">jQ</span><span>uery</span>'))).toBe();
				expect(alert.contentNode.innerHTML).toBe('<span style="color: red;">jQ</span><span>uery</span>');

				alert = new Alert({header : 'setContent others', content : 'setContent test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();
				var contents = [
					'A',
					$('<span style="color: red;">rr</span>')[0],
					'a',
					$('<span style="color: blue;">y</span>')[0],
				];
				expect(alert.setContent(contents)).toBe();
				expect(alert.contentNode.innerHTML).toBe('A<span style="color: red;">rr</span>a<span style="color: blue;">y</span>');

				alert = new Alert({header : 'setContent others', content : 'setContent test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();
				var df = document.createDocumentFragment();
				df.appendChild($('<strong>DocumentFragment</strong>')[0]);
				df.appendChild($('<br>')[0]);
				df.appendChild(document.createTextNode('のテスト'));

				expect(alert.setContent(df)).toBe();
				expect(alert.contentNode.innerHTML).toBe('<strong>DocumentFragment</strong><br>のテスト');

				alert = new Alert({header : 'setContent others', content : 'setContent test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();
				df = document.createDocumentFragment();
				df.appendChild($('<strong>NodeList</strong>')[0]);
				df.appendChild($('<br>')[0]);
				df.appendChild(document.createTextNode('のテスト'));

				expect(alert.setContent(df.childNodes)).toBe();
				expect(alert.contentNode.innerHTML).toBe('<strong>NodeList</strong><br>のテスト');
			});
			it('displayCloseIcon', function () {
				parentNode.appendChild($('<br>')[0]);
				var alert = new Alert({header : 'displayCloseIcon', content : 'displayCloseIcon test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();

				expect(alert.displayCloseIcon()).toBe();
				expect(alert.displayCloseIcon(true)).toBe();
				expect(alert.displayCloseIcon(false)).toBe();
			});
			it('destroy', function () {
				parentNode.appendChild($('<br>')[0]);
				var alert = new Alert({header : 'destroy', content : 'destroy test'});
				parentNode.appendChild(alert.getRootNode());
				alert.show();

				expect(alert.destroy()).toBe();
			});

			describe('Template engine', function () {
				var flag = false;
				beforeEach(function (done) {
					templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
						var alerts = result.widgets,
							key;

						for (key in alerts) {
							alerts[key].show();
						}
						
						flag = true;
						done();
					}).otherwise(function (error) {
						flag = false;
						done();
					});
				});
				it('template engine alert test', function () {
					expect(flag).toBe(true);
				});
			});
			// for jscover.
			jscoverReport();
		});

	}
);
