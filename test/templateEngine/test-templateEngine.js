require.config(requireConfig);

require(['templateEngine', 'templateConfig', 'GridModel'], function (templateEngine, templateConfig, Model) {
	'use strict';
	templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
		var dataList = [],
			index,
			len,
			model;
		console.log('testsete', result);

		// set Callback to hamburger
		result.widgets.hamburger.setCallback(function (status) {console.log(status); });
		// set Callback to contextmenu
		result.widgets.contextmenu.setCallback(function (label) {console.log(label); });
		// set model to grid
		for (index = 0, len = 200; index < len; index++) {
			dataList.push({'name1' : 'No' + index, 'name2' : 'test2', 'name3' : 'test3'});
		}
		model = new Model({dataList : dataList});
		result.widgets['urushi.grid0'].setModel(model);
		result.widgets['urushi.grid0'].load();
	});
});
