var gulp = require('gulp'),
	rjs = require('gulp-r'),
	uglify = require('gulp-uglify'),
	config = require('../config.js');

gulp.task('js-build', function() {
	'use strict';
	var i, length;

	for (i = 0, length = config.js.src.rjs.length; i < length; i++) {
		gulp.src(config.js.src.rjs[i]).pipe(rjs(config.js.rjs)).pipe(uglify()).pipe(gulp.dest(config.js.dest.rjs[i]));
	}

	for (i = 0, length = config.js.src.uglify.length; i < length; i++) {
		gulp.src(config.js.src.uglify[i]).pipe(uglify()).pipe(gulp.dest(config.js.dest.uglify[i]));
	}

	for (i = 0, length = config.js.src.trans.length; i < length; i++) {
		gulp.src(config.js.src.trans[i]).pipe(gulp.dest(config.js.dest.trans[i]));
	}
});