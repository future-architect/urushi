var gulp = require('gulp'),
	config = require('../gh-pages-config.js'),
	runSequence = require('run-sequence');

gulp.task('copy-dest', function () {
	'use strict';
	var i;

	for (i = 0; i < config.trans.src.length; i++) {
		gulp.src(config.trans.src[i]).pipe(gulp.dest(config.trans.dest[i]));
	}
});

gulp.task('build-gh-pages', function () {
	'use strict';

	runSequence('clean-build', 'copy-dest');
});
