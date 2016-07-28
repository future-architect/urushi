window.requireConfig.baseUrl = '../../../../';
require.config(requireConfig);
require(['Urushi','Alert', 'templateEngine', 'templateConfig'], function(Urushi,Alert,templateEngine,
		templateConfig) {
	templateEngine.renderDocument(document.body, templateConfig).then(
			function(result) {
				var alerts = result.widgets, key;
				for (key in alerts) {
					alerts[key].show();
				}
				flag = true;
				done();
			}).otherwise(function(error) {
		flag = false;
		done();
	});
});
