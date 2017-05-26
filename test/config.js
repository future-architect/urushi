// You must import requireConfig.js before it.
(function() {
	'use strict';
	var paths,
		i,
		specs = [
			'browser',
			'deferred',
			'event',
			'node',
			'templateEngine',
			'animation',
			'xhr',

			'button',
			'checkbox',
			'contextMenu',
			'dialog',
			'dropdown',
			'hamburger',
			'input',
			'panel',
			'radio',
			'textarea',
			'toast',
			'toggle',
			'tooltip',

			'fileInput',
			'grid',
			'uploadManager'
		];

	if (!window.requireConfig) {
		window.alert('You must import requireConfig.js before it.');
		throw Error('You must import requireConfig.js before it.');
	}

	window.requireConfig.baseUrl = '../../';

	paths = window.requireConfig.paths;
	for (i = 0; i < specs.length; i++) {
		paths[specs[i] + '.spec'] = 'test/' + specs[i] + '/spec';
	}
})();
