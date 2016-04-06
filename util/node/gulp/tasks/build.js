var gulp = require('gulp'),
	rimraf = require('rimraf'),
	config = require('../config.js'),
	runSequence = require('run-sequence');

gulp.task('build', function () {
	'use strict';
	return runSequence('scss-build-to-dest', 'js-build');
});

gulp.task('clean', function (cb) {
	'use strict';
	return rimraf(config.build.dest, cb);
});

gulp.task('clean-build', function (cb) {
	'use strict';
	return runSequence('clean', 'build');
});

