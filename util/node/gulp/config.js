module.exports = {
	scss : {
		src: '../../../scss/materialDesign',
		dest: '../../../urushi/material/style'
	},
	js : {
		src : {
			rjs : [
				'../../../urushi/*.js',
				'../../../urushi/base/*.js'
			],
			uglify : [
				'../../../urushi/material/**/*.js',
				'../../../lib/**/*.js',
				'../../../test/**/*.js'
			],
			trans : [
				'../../../urushi/material/**/*.html',
				'../../../urushi/material/style/*.css',
				'../../../urushi/material/style/font/*.*',
				'../../../test/**/*.html'
			]
		},
		dest : {
			rjs : [
				'../../../dest/urushi',
				'../../../dest/urushi/base'
			],
			uglify : [
				'../../../dest/urushi/material',
				'../../../dest/lib',
				'../../../dest/test'
			],
			trans : [
				'../../../dest/urushi/material',
				'../../../dest/urushi/material/style',
				'../../../dest/urushi/material/style/font',
				'../../../dest/test'
			]
		},
		rjs : {
			baseUrl : './',
			shim : {
				'lib/js/extend' : {exports : 'extend'},
				'lib/js/jquery-2.1.1' : {exports : '$'},
				'lib/js/underscore' : {exports : '_'}
			},
			paths : {
				// libraries
				text : '../../../lib/js/text',
				extend : '../../../lib/js/extend',
				jquery : '../../../lib/js/jquery-2.1.1',
				underscore : '../../../lib/js/underscore',
				Backbone : '../../../lib/js/backbone',
				// urushi core objects.
				addInputEventListener : '../../../urushi/base/addInputEventListener',
				browser : '../../../urushi/base/browser',
				context :   '../../../urushi/base/context',
				Deferred : '../../../urushi/base/Deferred',
				event : '../../../urushi/base/event',
				legacy : '../../../urushi/base/legacy',
				node : '../../../urushi/base/node',
				Promise : '../../../urushi/base/Promise',
				templateEngine : '../../../urushi/base/templateEngine',
				xhr : '../../../urushi/base/xhr',
				Urushi : '../../../urushi/Urushi',
				// urushi module classes.
				_Base : '../../../urushi/material/js/_Base',
				Alert : '../../../urushi/material/js/Alert',
				Button : '../../../urushi/material/js/Button',
				Checkbox : '../../../urushi/material/js/Checkbox',
				Dialog : '../../../urushi/material/js/Dialog',
				DropDown : '../../../urushi/material/js/DropDown',
				Input : '../../../urushi/material/js/Input',
				Panel : '../../../urushi/material/js/Panel',
				Radiobox : '../../../urushi/material/js/Radiobox',
				Ripple : '../../../urushi/material/js/Ripple',
				Textarea : '../../../urushi/material/js/Textarea',
				ToggleButton : '../../../urushi/material/js/ToggleButton',
				Toast : '../../../urushi/material/js/Toast',
				ToastManager : '../../../urushi/material/js/ToastManager',
				Tooltip : '../../../urushi/material/js/Tooltip'
			}
		}
	},
	styleDocco : {
		src : '../../../scss/materialDesign',
		dest : '../../../document/StyleDocco',
		style : '../../../urushi/material/style',
	},
	jsdoc : {
		jsonPath : '../node_modules/gulp-jsdoc/package.json',
		option : {
			'showPrivate' : true,
			monospaceLinks : true,
			cleverLinks : true,
			outputSourceFiles : true
		},
		template : {
			path : './jsdoc-template/jsdoc3-bootstrap-master/',
			footer : 'Generated with gulp',
			copyright : 'Copyright WebItUp 2014',
			navType : 'vertical',
			theme : 'United',
			linenums : true,
			collapseSymbols : false,
			inverseNav : false
		},
		src : '../../../urushi',
		dest : '../../../document/urushi-reference',
		prepare : './jsdoc-template/jsdoc3-bootstrap-master/static'
	},
};