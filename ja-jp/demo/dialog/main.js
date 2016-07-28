window.requireConfig.baseUrl = '../../../';
require.config(requireConfig);
require([ 'templateEngine', 'templateConfig', 'Urushi' ], function(
		templateEngine, templateConfig, Urushi) {
	templateEngine.renderDocument(document.body, templateConfig).then(
			function(result) {
				var modules = result.widgets;
				console.log(modules);
				Urushi.addEvent(modules.button1.getRootNode(), 'click',
						modules.button1, function() {
							modules.dialog1.show();
						});
				Urushi.addEvent(modules.button2.getRootNode(), 'click',
						modules.button2, function() {
							modules.dialog2.show();
						});
				done();
			}).otherwise(function(error) {
		done();
	});
});
