function createPage() {
	'use strict';
	var targets, i;

	function createBox(name, uri) {
		var span = document.createElement('span'),
			a = document.createElement('a');

		span.className = 'box';
		a.innerHTML = name;
		a.href = uri;
		a.target = '_blank';
		span.appendChild(a);
		span.onclick = function() {
			a.click();
		};
		document.body.appendChild(span);
	}

	targets = [
		'Button',
		'Checkbox',
		'ContextMenu',
		'Dialog',
		'Dropdown',
		'Hamburger',
		'Input',
		'Panel',
		'Radio',
		'Textarea',
		'Toast',
		'Toggle',
		'Tooltip',

		'browser',
		'event',
		'node',
		'templateEngine',
		'xhr'
	];

	for (i = 0; i < targets.length; i++) {
		createBox(targets[i], './' + targets[i].toLowerCase() + '/');
	}
}

window.onload = createPage;