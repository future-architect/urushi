var gulp = require('gulp'),
	rimraf = require('rimraf'),
	config = require('../config.js');

gulp.task('build', ['scss-build-to-dest', 'js-build'], function () {
	'use strict';
});

gulp.task('clean', function (cb) {
	'use strict';
	rimraf(config.build.dest, cb);
});

gulp.task('clean-build', ['clean', 'build'], function (cb) {
	'use strict';
});

