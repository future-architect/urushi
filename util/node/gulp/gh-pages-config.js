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
	]
};