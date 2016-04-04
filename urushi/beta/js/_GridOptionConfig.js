/**
 * @fileOverView GridOptionConfig definition.
 * @author Yasuhiro Murata
 * @version 1.0
 */
/**
 * <pre>
 * Provides a definition for using Classes in Grid.
 * </pre>
 *
 * @module _GridOptionConfig
 */
define(
	'_GridOptionConfig', [],
	/**
	 * @alias module:_GridOptionConfig
	 * @returns {object} GridOptionConfig object.
	 */
	function () {
		'use strict';

		return {
			allowedModules : {
				'icon' : 'icon',
				'button' : 'Button',
				'checkbox' : 'Checkbox',
				'contextmenu' : 'ContextMenu',
				'dropdown' : 'DropDown',
				'hamburger' : 'Hamburger',
				'input' : 'Input',
				'togglebutton' : 'ToggleButton'
			},
			properties : {
				'Button' : {
					'moduleClass' : 'buttonClass',
					'additionalClass' : 'additionalClass',
					'label' : 'label',
				},
				'Checkbox' : {
					'moduleClass' : 'checkboxClass',
					'additionalClass' : 'additionalClass',
				},
				'ContextMenu' : {
					'moduleClass' : 'contextMenuClass',
					'additionalClass' : 'additionalClass',
					'items' : 'items',
					'callback' : 'defaultCallback',
					'bubbling' : 'bubbling',
					'type' : 'type',
				},
				'DropDown' : {
					'moduleClass' : 'dropdownClass',
					'additionalClass' : 'additionalClass',
					'items' : 'items',
				},
				'Hamburger' : {
					'additionalClass' : 'additionalClass',
					'callback' : 'callback'
				},
				'Input' : {
					'moduleClass' : 'inputClass',
					'additionalClass' : 'additionalClass',
				},
				'ToggleButton' : {
					'moduleClass' : 'toggleButtonClass',
					'additionalClass' : 'additionalClass',
				}
			},
			presetProperties : {
				'Button' : {
					'moduleClass' : 'button-default',
				},
				'ContextMenu' : {
					'moduleClass' : 'contextMenu-default',
				},
			},
			forceProperties : {
				'ContextMenu' : {
					'bubbling' : true,
					'type' : 'grid',
				},
			},
			finalizeArgs : {
				contextmenu : function (args, id) {
					var index,
						length;
					for (index = 0, length = args.items.length; index < length; index++) {
						args.items[index].id = id + '.' + args.items[index].name;
					}
				},
			},
			setValueMap : {
				input : function (module, label) {
					module.setValue(label);
				},
				checkbox : function (module, label) {
					module.setChecked(label);
				},
				togglebutton : function (module, label) {
					module.setValue(label);
				},
				dropdown : function (module, label) {
					module.setSelected(label);
				}
			},
			additionalColumnStyle : {
				'dropdown' : 'ignoreOverflow',
				'contextmenu' : 'ignoreOverflow'
			}
		};
	}
);
