require.config(requireConfig);

require(["templateEngine", "templateConfig"], function(templateEngine, templateConfig) {
	templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
		console.log("testsete", result);
	});
});
