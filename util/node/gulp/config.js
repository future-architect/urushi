module.exports = {
	build : {
		dest : '../../../dest',
	},
	scss : {
		src : '../../../scss/materialDesign',
		dest : '../../../urushi/material/style',
		buildDest : '../../../dest/urushi/material/style'
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
				'../../../config/**/*.js',
				'../../../test/**/*.js'
			],
			trans : [
				'../../../urushi/material/**/*.html',
				'../../../scss/materialDesign/font/*.eot',
				'../../../scss/materialDesign/font/*.svg',
				'../../../scss/materialDesign/font/*.ttf',
				'../../../scss/materialDesign/font/*.woff',
				'../../../test/**/*.html',
				'../../../test/**/*.css',
				'../../../util/jasmine/**/*.*'
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
				'../../../dest/config',
				'../../../dest/test'
			],
			trans : [
				'../../../dest/urushi/material',
				'../../../dest/urushi/material/style/font',
				'../../../dest/urushi/material/style/font',
				'../../../dest/urushi/material/style/font',
				'../../../dest/urushi/material/style/font',
				'../../../dest/test',
				'../../../dest/test',
				'../../../dest/util/jasmine'
			]
		},
		rjs : {
			baseUrl : './',
			shim : {
				'jqueryUi' : ['jquery']
			},
			paths : {
				// libraries
				text : '../../../lib/js/text',
				extend : '../../../lib/js/extend',
				jquery : '../../../lib/js/jquery-2.1.1',
				jqueryUi : '../../../lib/js/jquery-ui-1.11.4',
				jqueryFileupload : '../../../lib/js/jquery.fileupload',
				jqueryIframeTransport : '../../../lib/js/jquery.iframe-transport',
				underscore : '../../../lib/js/underscore',
				// urushi core objects.
				addInputEventListener : '../../../urushi/base/addInputEventListener',
				animation : '../../../urushi/base/animation',
				browser : '../../../urushi/base/browser',
				Deferred : '../../../urushi/base/Deferred',
				event : '../../../urushi/base/event',
				legacy : '../../../urushi/base/legacy',
				node : '../../../urushi/base/node',
				Promise : '../../../urushi/base/Promise',
				removeInputEventListener : '../../../urushi/base/removeInputEventListener',
				templateEngine : '../../../urushi/base/templateEngine',
				xhr : '../../../urushi/base/xhr',
				Urushi : '../../../urushi/Urushi',
				// urushi module classes.
				templateConfig : '../../../urushi/material/js/templateConfig',
				materialConfig : '../../../urushi/material/js/materialConfig',
				_Base : '../../../urushi/material/js/_Base',
				_collectionMixin : 'urushi/material/js/_collectionMixin',
				_CollectionWidgetBase : 'urushi/material/js/_CollectionWidgetBase',
				_CollectionItemBase : 'urushi/material/js/_CollectionItemBase',
				Alert : '../../../urushi/material/js/Alert',
				Button : '../../../urushi/material/js/Button',
				Checkbox : '../../../urushi/material/js/Checkbox',
				ContextMenu : '../../../urushi/material/js/ContextMenu',
				_ContextMenuItem : '../../../urushi/material/js/_ContextMenuItem',
				Dialog : '../../../urushi/material/js/Dialog',
				DropDown : '../../../urushi/material/js/DropDown',
				Hamburger : '../../../urushi/material/js/Hamburger',
				Input : '../../../urushi/material/js/Input',
				Panel : '../../../urushi/material/js/Panel',
				Radiobox : '../../../urushi/material/js/Radiobox',
				Ripple : '../../../urushi/material/js/Ripple',
				Textarea : '../../../urushi/material/js/Textarea',
				Toast : '../../../urushi/material/js/Toast',
				ToastManager : '../../../urushi/material/js/ToastManager',
				ToggleButton : '../../../urushi/material/js/ToggleButton',
				Tooltip : '../../../urushi/material/js/Tooltip'
				// urushi module template.
				// alertTemplate : '../../../urushi/material/template/alert.html',
				// buttonTemplate : '../../../urushi/material/template/button.html',
				// checkboxTemplate : '../../../urushi/material/template/checkbox.html',
				// checkboxTransitionUnitTemplate : '../../../urushi/material/template/checkbox-transition-unit.html',
				// checkboxRippleTransitionUnitTemplate : '../../../urushi/material/template/checkbox-ripple-transition-unit.html',
				// contextMenuTemplate : '../../../urushi/material/template/context-menu.html',
				// dialogTemplate : '../../../urushi/material/template/dialog.html',
				// dropDownTemplate : '../../../urushi/material/template/drop-down.html',
				// hamburgerTemplate : '../../../urushi/material/template/hamburger.html',
				// inputTemplate : '../../../urushi/material/template/input.html',
				// inputTransitionUnitTemplate : '../../../urushi/material/template/input-transition-unit.html',
				// panelTemplate : '../../../urushi/material/template/panel.html',
				// radioboxTemplate : '../../../urushi/material/template/radiobox.html',
				// textareaTemplate : '../../../urushi/material/template/textarea.html',
				// toastTemplate : '../../../urushi/material/template/toast.html',
				// toastManagerTemplate : '../../../urushi/material/template/toast-manager.html',
				// toggleButtonTemplate : '../../../urushi/material/template/toggle-button.html',
				// toggleButtonTransitionUnitTemplate : '../../../urushi/material/template/toggle-button-transition-unit.html',
				// tooltipTemplate : '../../../urushi/material/template/tooltip.html',
			},
			urlArgs : 'ver=beta'
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