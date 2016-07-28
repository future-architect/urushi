window.requireConfig.baseUrl = '../../../';

require.config(requireConfig);

require([ 'templateEngine', 'templateConfig', 'Urushi','Tooltip' ], function(
		templateEngine, templateConfig, Urushi,Tooltip) {
	templateEngine.renderDocument(document.body, templateConfig)
	});
