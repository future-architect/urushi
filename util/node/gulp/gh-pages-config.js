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
			'../../../gh-pages-resoucres/config/**/*.js',
		],
		base : '../../../gh-pages-resoucres/',
		dest : '../../../gh-pages-resoucres/'
	},
	renameFile : {
		src : [
			'../../../gh-pages-resoucres/urushi/material/js/_Base.js',
			'../../../gh-pages-resoucres/urushi/material/js/_CollectionItemBase.js',
			'../../../gh-pages-resoucres/urushi/material/js/_CollectionWidgetBase.js',
			'../../../gh-pages-resoucres/urushi/material/js/_ContextMenuItem.js'
		],
		dest : '../../../gh-pages-resoucres/urushi/material/js'
	}
};