var gulp = require('gulp'),
	config = require("../config.js");

/**
 * Scssファイル更新チェック。
 */
gulp.task("scss-watch", function () {
	gulp.watch(config.scss.src + "/**/*.scss", ["scss-build"]);
});

/**
 * Scssビルド
 */
gulp.task("scss-build", function () {
	var fs = require('fs'),
		path = require("path"),
		sass = require('gulp-sass'),
		minifyCss = require('gulp-minify-css'),
		plumber = require('gulp-plumber'),
		target = config.scss.src + "/**/*.scss";

	gulp.src(target)
		.pipe(plumber())
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(gulp.dest(config.scss.dest));

	gulp.src([
			config.scss.src + "/**/*.eot",
			config.scss.src + "/**/*.svg",
			config.scss.src + "/**/*.ttf",
			config.scss.src + "/**/*.woff"
		])
		.pipe(gulp.dest(config.scss.dest));
});
