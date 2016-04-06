var gulp = require('gulp'),
	config = require('../config.js');


/**
 * Build scss.
 */
function build (dest) {
	'use strict';
	var sass = require('gulp-sass'),
		minifyCss = require('gulp-minify-css'),
		plumber = require('gulp-plumber'),
		target = config.scss.src + '/**/*.scss';

	gulp.src(target)
		.pipe(plumber())
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(gulp.dest(dest));

	gulp.src([
		config.scss.src + '/**/*.eot',
		config.scss.src + '/**/*.svg',
		config.scss.src + '/**/*.ttf',
		config.scss.src + '/**/*.woff'
	])
	.pipe(gulp.dest(dest));
}

/**
 * Task.
 * Check and build scss.
 */
gulp.task('scss-watch', function () {
	'use strict';
	gulp.watch(config.scss.src + '/**/*.scss', ['scss-build']);
});

/**
 * Task.
 * Build scss.
 */
gulp.task('scss-build', function () {
	'use strict';
	build(config.scss.dest);
});

gulp.task('scss-build-to-dest', function () {
	'use strict';
	build(config.scss.buildDest);
});
