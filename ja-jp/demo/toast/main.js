window.requireConfig.baseUrl = './../../../';
require.config(requireConfig);
require([ 'templateEngine', 'templateConfig', 'Urushi','ToastManager' ], function(
		templateEngine, templateConfig, Urushi,ToastManager) {
	templateEngine.renderDocument(document.body, templateConfig).then(
			function(result) {
				var modules = result.widgets, key, manager;
				console.log(modules);
				manager = new ToastManager();
				console.log(manager);
				document.body.appendChild(manager.getRootNode());
				Urushi.addEvent(modules.button.getRootNode(), 'click', manager,
						'show', 'toast demo');
				done();
			}).otherwise(function(error) {
		done();
	});
});
