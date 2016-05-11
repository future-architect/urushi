/*eslint "vars-on-top" : 0*/

define(
	'card.spec',
	['Urushi', 'Card', 'templateEngine', 'templateConfig'],
	function (Urushi, Card, templateEngine, templateConfig) {
		'use strict';
		// var temp,
		// 	hasTransitionSupportTrue = function () {return true;},
		// 	hasTransitionSupportFalse = function () {return false;};

		describe('Card test', function () {
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
