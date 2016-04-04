/*eslint "vars-on-top" : 0*/
define(
	'hamburger.spec',
	['Urushi', 'Hamburger', 'templateEngine', 'templateConfig'],
	function (Urushi, Hamburger, templateEngine, templateConfig) {
		'use strict';

		describe('hamburger test', function () {
				var parentNode = document.getElementById('script-modules');

			it('template engine input test', function () {
				templateEngine.renderDocument(document.body, templateConfig).then(function (result) {});
			});

			it('transform test', function() {
				var hamburger = new Hamburger({});
				parentNode.appendChild(hamburger.getRootNode());
				expect(hamburger.transform(true)).toBe();
				expect(Array.prototype.slice.call(hamburger.hamburgerLineNode.classList)).toContain('hamburger-transformed');
				expect(hamburger.transform(false)).toBe();
				expect(Array.prototype.slice.call(hamburger.hamburgerLineNode.classList)).not.toContain('hamburger-transformed');
				hamburger.rootNode.classList.add('disabled');
				expect(hamburger.transform(true)).toBe();
				expect(Array.prototype.slice.call(hamburger.hamburgerLineNode.classList)).not.toContain('hamburger-transformed');
			});

			it('toggle test', function() {
				var hamburger = new Hamburger({});
				parentNode.appendChild(hamburger.getRootNode());
				hamburger.hamburgerLineNode.classList.remove('hamburger-transformed');
				expect(hamburger.toggle()).toBe();
				expect(Array.prototype.slice.call(hamburger.hamburgerLineNode.classList)).toContain('hamburger-transformed');
				expect(hamburger.toggle()).toBe();
				expect(Array.prototype.slice.call(hamburger.hamburgerLineNode.classList)).not.toContain('hamburger-transformed');
				hamburger.rootNode.classList.add('disabled');
				expect(hamburger.toggle()).toBe();
				expect(Array.prototype.slice.call(hamburger.hamburgerLineNode.classList)).not.toContain('hamburger-transformed');
			});

			it('setCallback test', function() {
				var hamburger = new Hamburger({});
				var dummyFunction = function() {};
				expect(hamburger.setCallback(dummyFunction)).toBe();
			});

			it('_onClickHamburger test', function() {
				var hamburger = new Hamburger({});
				parentNode.appendChild(hamburger.getRootNode());
				var dummyEvent = {stopPropagation : function () {}};
				var dummyFunction = function() {this.hamburgerLineNode.classList.add('callbacked');};

				expect(hamburger.setCallback(dummyFunction)).toBe();
				expect(hamburger._onClickHamburger(dummyEvent)).toBe();
				waits(100);
				runs(function() {
					expect(Array.prototype.slice.call(hamburger.hamburgerLineNode.classList)).toContain('callbacked');
				});
				hamburger.rootNode.classList.add('disabled');
				expect(hamburger._onClickHamburger(dummyEvent)).toBe();
			});

			it('destroy test', function() {
				var hamburger = new Hamburger({});
				expect(hamburger.destroy()).toBe();
			});
			// JSCover使用時に自動でlogをstoreさせるため、以下の記述を必須とする
			jscoverReport();
		});
	}
);
