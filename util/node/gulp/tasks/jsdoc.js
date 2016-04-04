// Gulp
var gulp = require('gulp');

gulp.task('prepareDest', function() {
  var gutil = require('gulp-util'),
      template = require('gulp-template'),
      jsdoc = require('gulp-jsdoc'),
      config = require('../config.js'),
      pkg = require(config.jsdoc.jsonPath);
  return gulp.src([
    config.jsdoc.prepare + "/images/**",
    config.jsdoc.prepare + "/scripts/**",
    config.jsdoc.prepare + "/styles/**"
  ],{base: config.jsdoc.prepare})
  .pipe(gulp.dest(config.jsdoc.dest));
});

gulp.task('jsdoc', ['prepareDest'], function() {
  var gutil = require('gulp-util'),
      template = require('gulp-template'),
      jsdoc = require('gulp-jsdoc'),
      config = require('../config.js'),
      pkg = require(config.jsdoc.jsonPath);
  config.jsdoc.template.systemName = pkg.name;
  gulp.src([
    'README.md',
    'index.js',
    config.jsdoc.src + "/**/*.js"
  ])
  .pipe(template({pkg: pkg}))
  .pipe(jsdoc.parser())
  .pipe(jsdoc.generator(config.jsdoc.dest, config.jsdoc.template, config.jsdoc.option));
});
