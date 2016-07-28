window.requireConfig.baseUrl = '../../../';

require.config(requireConfig);
require([ 'templateEngine', 'templateConfig' ], function(templateEngine,
		templateConfig) {
	templateEngine.renderDocument(document.body, templateConfig);
});
