
(function () {
	'use strict';
	var header, onscroll;
	
	require.config(requireConfig);

	header = document.getElementById('header');

	onscroll = function () {
		var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		if (y && !header.classList.contains('floating')) {
			header.classList.add('floating');
		} else if (!y && header.classList.contains('floating')) {
			header.classList.remove('floating');
		}
	};

	if (document.addEventListener) {
		document.addEventListener('scroll', onscroll, false);
	} else {
		document.attachEvent('on' + 'scroll', onscroll);
	}
	require(['templateEngine', 'templateConfig'], function (templateEngine, templateConfig) {
		templateEngine.renderDocument(document.body, templateConfig);
	});
})();