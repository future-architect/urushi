require.config(requireConfig);
require(['Urushi', 'templateEngine', 'templateConfig', 'ToastManager'], function(Urushi, templateEngine, templateConfig, ToastManager) {
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
		var manager = new ToastManager();
		document.body.appendChild(manager.getRootNode());

		Urushi.addEvent(
			result.widgets.button.getRootNode(),
			'click',
			manager,
			'show',
			'Toast demo');
	}).then(function () {
		document.getElementById('loading-pane').classList.add('close');
	});
});
