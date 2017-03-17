var gulp = require('gulp');
var config = require('../config.js');
var common = require('../common.js');
var results = [];

gulp.task('docco-include-css', function() {
	'use strict';
	
	var fs = require('fs');
	var dest = config.styleDocco.style;
	var list = fs.readdirSync(dest);
	var i, length;

	for (i = 0, length = list.length; i < length; i++) {
		if (/.*\.css$/.test(list[i])) {
			results.push(dest + '\/' + list[i]);
		}
	}
	
	common._insertBlankLine();
	common._writeLine('+');
	common._insertBlankLine();
	console.log('Detected css files are shown below.');
	common._insertBlankLine();
	common._writeLine('-');
	common._insertBlankLine();
	console.log(results);
	common._insertBlankLine();
	common._writeLine('+');
	common._insertBlankLine();
});

gulp.task('docco', ['docco-include-css'], function() {
	'use strict';
	var styledocco = require('gulp-styledocco');
	var target = config.styleDocco.src + '/**/*.scss';
	var dest = config.styleDocco.dest;
	var style = results;

	// styeleDocco
	gulp.src(target).pipe(styledocco({
		out: dest,
		preprocessor: 'sass',
		include: style,
		verbose: false
	}));
});

