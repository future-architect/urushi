var gulp = require('gulp'),
	config = require('../config.js'),
	common = require('../common.js'),
	results = [];


gulp.task('docco-include-css', function (){
	'use strict';
	var fs = require("fs"),
		dest = config.styleDocco.style;
		
	var list = fs.readdirSync(dest);

	for (var i=0, length = list.length; i<length; i++){
		if(/.*\.css$/.test(list[i])){
			results.push(dest + "\/" + list[i]);
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


gulp.task('docco', ['docco-include-css'], function (){
	'use strict';
	var styledocco = require('gulp-styledocco'),
		target = config.styleDocco.src + '/**/*.scss',
		dest = config.styleDocco.dest,
		style = results;
	// styeleDocco
	gulp.src(target)
		.pipe(styledocco({
			out: dest,
			preprocessor: 'sass',
			include: style,
			verbose: false
	}));
});

