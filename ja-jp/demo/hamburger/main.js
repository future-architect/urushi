require.config(requireConfig);
require(['Urushi', 'templateEngine', 'templateConfig', 'Dialog'], function(Urushi, templateEngine, templateConfig, Dialog) {
	'use strict';

	templateEngine.renderDocument(document.body, templateConfig).then(function(result) {
		result.widgets.hamburger.setCallback(function () {
			document.getElementById('demo-slide-underlay').classList.add('show');
			document.getElementById('demo-slide-menu').classList.add('show');
		});

		Urushi.addEvent(document.getElementById('demo-slide-underlay'), 'click', this, function () {
			document.getElementById('demo-slide-underlay').classList.remove('show');
			document.getElementById('demo-slide-menu').classList.remove('show');
			result.widgets.hamburger.transform(false);
		});

		return result;
	}).then(function (result) {
		var dialog = new Dialog({content: 'DUMMY'});
		document.body.appendChild(dialog.getRootNode());

		result.widgets['hamburger-demo'].setCallback(function (is) {
			dialog.setContent('Clicked hamburger : ' + (!!is ? 'ON' : 'OFF'));
			dialog.show();
		});
	}).then(function () {
		document.getElementById('loading-pane').classList.add('close');
	});
});
