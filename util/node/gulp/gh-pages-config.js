module.exports = {
	trans : {
		src : [
			'../../../dest/config/**/*.*',
			'../../../dest/lib/**/*.*',
			'../../../dest/urushi/**/*.*',
		],
		dest : '../../../gh-pages-resoucres/'
	},
	clean : [
		'../../../gh-pages-resoucres/config',
		'../../../gh-pages-resoucres/lib',
		'../../../gh-pages-resoucres/urushi'
	],
	removeUnderscore : {
		src : [
			'../../../gh-pages-resoucres/urushi/**/*.js',
		],
		base : '../../../gh-pages-resoucres/urushi/',
		dest : '../../../gh-pages-resoucres/urushi/'
	},
	replaceBaseFile : {
		src : [
			'../../../gh-pages-resoucres/urushi/material/js/_Base.js'
		],
	}
};