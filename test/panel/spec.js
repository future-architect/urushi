/*eslint "vars-on-top" : 0*/

define(
	'panel.spec',
	['Urushi', 'Panel', 'templateEngine', 'templateConfig'],
	function (Urushi, Panel, templateEngine, templateConfig) {
		'use strict';
		// var temp,
		// 	hasTransitionSupportTrue = function () {return true;},
		// 	hasTransitionSupportFalse = function () {return false;};

		describe('Panel test', function () {
			var panel,
				parentNode = document.getElementById('script-modules');
				//dummyEvent = {stopPropagation : function () {}};

			it('init', function () {
				expect((new Panel()).destroy()).toBe();
				panel = new Panel();
				parentNode.appendChild(panel.getRootNode());
			});
			it('setHeader', function () {
				expect(panel.setHeader()).toBe();
				expect(panel.setHeader({})).toBe();
				expect(panel.setHeader('')).toBe();
				expect(panel.setHeader('header')).toBe();
			});
			it('setContent', function () {
				var nodeList = [document.createElement('div'), null],
					fragment = document.createDocumentFragment();

				fragment.appendChild(document.createElement('div'));
				
				expect(panel.setContent()).toBe();
				expect(panel.setContent({})).toBe();
				expect(panel.setContent('')).toBe();
				expect(panel.setContent('content')).toBe();
				expect(panel.setContent(fragment)).toBe();
				expect(panel.setContent(nodeList)).toBe();
			});
			it('setFooter', function () {
				expect(panel.setFooter()).toBe();
				expect(panel.setFooter({})).toBe();
				expect(panel.setFooter('')).toBe();
				expect(panel.setFooter('footer')).toBe();
			});

			it('setHeader empty', function () {
				var pnl = new Panel({header : '', footer : 'foot', content : 'setHeader empty'});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.headerNode.classList.contains('hidden')).toBe(true);

				pnl.setHeader('');
				expect(pnl.headerNode.classList.contains('hidden')).toBe(true);

				pnl.setHeader('A');
				expect(pnl.headerNode.classList.contains('hidden')).toBe(false);

				pnl.setHeader([]);
				expect(pnl.headerNode.classList.contains('hidden')).toBe(true);

				pnl.setHeader('A');
				expect(pnl.headerNode.classList.contains('hidden')).toBe(false);

				pnl.setHeader();
				expect(pnl.headerNode.classList.contains('hidden')).toBe(true);
			});

			it('setHeader html escape', function () {
				var pnl = new Panel({header : '<div>escape init</div>', footer : 'foot', content : 'setHeader html escape'});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.headerNode.textContent).toBe('<div>escape init</div>');

				pnl.setHeader('<div>escape</div>');
				expect(pnl.headerNode.textContent).toBe('<div>escape</div>');
			});

			it('setHeader dom', function () {
				var pnl = new Panel({header : $('<div style="color: blue;">dom</div>'), footer : 'foot', content : 'setHeader dom'});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.headerNode.innerHTML).toBe('<div style="color: blue;">dom</div>');
				
				pnl.setHeader($('<div style="color: red;">dom</div>'));
				expect(pnl.headerNode.innerHTML).toBe('<div style="color: red;">dom</div>');
			});

			it('setFooter empty', function () {
				var pnl = new Panel({header : 'head', footer : '', content : 'setFooter empty'});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.footerNode.classList.contains('hidden')).toBe(true);

				pnl.setFooter('');
				expect(pnl.footerNode.classList.contains('hidden')).toBe(true);

				pnl.setFooter('A');
				expect(pnl.footerNode.classList.contains('hidden')).toBe(false);

				pnl.setFooter([]);
				expect(pnl.footerNode.classList.contains('hidden')).toBe(true);

				pnl.setFooter('A');
				expect(pnl.footerNode.classList.contains('hidden')).toBe(false);

				pnl.setFooter();
				expect(pnl.footerNode.classList.contains('hidden')).toBe(true);
			});

			it('setFooter html escape', function () {
				var pnl = new Panel({header : 'head', footer : '<div>escape init</div>', content : 'setFooter html escape'});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.footerNode.textContent).toBe('<div>escape init</div>');

				pnl.setFooter('<div>escape</div>');
				expect(pnl.footerNode.textContent).toBe('<div>escape</div>');
			});

			it('setFooter dom', function () {
				var pnl = new Panel({header : 'head', footer : $('<div style="color: blue;">dom</div>'), content : 'setFooter dom'});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.footerNode.innerHTML).toBe('<div style="color: blue;">dom</div>');
				
				pnl.setFooter($('<div style="color: red;">dom</div>'));
				expect(pnl.footerNode.innerHTML).toBe('<div style="color: red;">dom</div>');
			});
			it('setContent empty', function () {
				var pnl = new Panel({header : 'setContent empty', footer : 'foot', content : ''});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.contentNode.innerHTML).toBe('');

				pnl.setContent('');
				expect(pnl.contentNode.innerHTML).toBe('');

				pnl.setContent('A');
				expect(pnl.contentNode.innerHTML).toBe('A');

				pnl.setContent([]);
				expect(pnl.contentNode.innerHTML).toBe('');

				pnl.setContent('A');
				expect(pnl.contentNode.innerHTML).toBe('A');

				pnl.setContent();
				expect(pnl.contentNode.innerHTML).toBe('');
			});

			it('setContent html escape', function () {
				var pnl = new Panel({header : 'setContent html escape', footer : 'foot', content : '<div>escape init</div>'});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.contentNode.textContent).toBe('<div>escape init</div>');

				pnl.setContent('<div>escape</div>');
				expect(pnl.contentNode.textContent).toBe('<div>escape</div>');
			});

			it('setContent dom', function () {
				var pnl = new Panel({header : 'setContent dom', footer : 'foot', content : $('<div style="color: blue;">dom</div>')});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.contentNode.innerHTML).toBe('<div style="color: blue;">dom</div>');
				
				pnl.setContent($('<div style="color: red;">dom</div><br><span>span</span>'));
				expect(pnl.contentNode.innerHTML).toBe('<div style="color: red;">dom</div><br><span>span</span>');
			});

			it('setContent function dom', function () {
				var pnl = new Panel({header : 'setContent function dom', footer : 'foot', content : function() {
					return $('<div style="color: blue;">dom</div>');
				}});
				parentNode.appendChild(pnl.rootNode);
				expect(pnl.contentNode.innerHTML).toBe('<div style="color: blue;">dom</div>');
			});

			it('destroy', function () {
				expect(panel.destroy()).toBe();
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
