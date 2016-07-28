window.requireConfig.baseUrl = '../../../';

require.config(requireConfig);
//require([ 'Dialog' ], function(Dialog) {
//	var dialog = new Dialog({
//		header : 'Dialog name',
//		content : 'contens.<br /><div>...</div>',
//		footer : 'footer content',
//		parentNode : document.body,
//		isDisplayCloseIcon : false
//	});
//	document.body.appendChild(dialog.getRootNode());
//	dialog.show();
//});
require([ 'templateEngine', 'templateConfig' ], function(templateEngine,
		templateConfig) {
	templateEngine.renderDocument(document.body, templateConfig);
});
