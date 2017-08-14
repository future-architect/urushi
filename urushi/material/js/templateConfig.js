/**
 * @fileOverView Template engine configration definitions.
 * @author Yuzo Hirakawa
 * @version b1.0
 */

/**
 * <pre>
 * Configuration for urushi template engine.
 * </pre>
 * @module templateConfig
 */
define(
	'templateConfig',
	[],
	/**
	 * @alias module:templateConfig
	 * @returns {object} templateConfig object.
	 */
	function() {
		'use strict';

		return {
			post: {tooltip: 'Tooltip'},
			base: {
				attributes: {
					ignore: ['id', 'class', 'data-urushi-type', 'data-urushi-options', 'disabled', 'readonly']
				}
			},
			button: {
				name: 'Button',
				attributes: {
					target: 'rootNode',
					ignore: ['label']
				}
			},
			checkbox: {
				name: 'Checkbox',
				attributes: {
					target: 'inputNode',
					ignore: ['checked']
				}
			},
			dialog: {
				name: 'Dialog',
				attributes: {
					target: 'dialogNode',
					ignore: ['']
				}
			},
			dropdown: {
				name: 'DropDown',
				className: 'dropdown',
				attributes: {
					target: 'inputNode',
					ignore: ['value']
				},
				setValue: {name: 'setSelected', args: ['value']}
			},
			input: {
				name: 'Input',
				attributes: {
					target: 'inputNode',
					ignore: ['value', 'placeholder']
				},
				setValue: {name: 'setValue', args: ['value']}
			},
			iconbutton: {
				name: 'IconButton',
			},
			panel: {
				name: 'Panel',
				attributes: {
					target: 'rootNode',
					ignore: ['']
				}
			},
			radiobox: {
				name: 'Radiobox',
				attributes: {
					target: 'inputNode',
//					ignore: ['checked']
					ignore: ['']
				}
			},
			textarea: {
				name: 'Textarea',
				attributes: {
					target: 'inputNode',
					ignore: ['value', 'placeholder']
				},
				setValue: {name: 'setValue', args: ['value']}
			},
			togglebutton: {
				name: 'ToggleButton',
				attributes: {
					target: 'inputNode',
					ignore: ['checked']
				}
			},
			tooltip: {
				name: 'Tooltip',
				className: 'tooltip',
				requires: [],
				method: {
					id: 'getUrushiAdditionOption',
					tooltipClass: 'getUrushiAdditionOption',
					position: 'getUrushiAdditionOption',
					content: 'getUrushiAdditionOption',
					on: 'getUrushiAdditionOption',
					off: 'getUrushiAdditionOption'
				},
				options: {
					id: 'id',
					tooltipClass: 'tooltipClass',
					position: 'position',
					content: 'content',
					on: 'on',
					off: 'off'
				},
				attributes: {
					target: 'rootNode',
					ignore: ['']
				}
			},
			hamburger: {
				name: 'Hamburger',
				attributes: {
					target: 'rootNode',
					ignore: []
				}
			},
			contextmenu: {
				name: 'ContextMenu',
				attributes: {
					target: 'rootNode',
					ignore: []
				}
			},
			calendar: {
				name: 'Calendar',
				className: 'calendar',
				requires: [],
				method: {
					id: 'getField',
					calendarClass: 'getOptionalClasses',
				},
				options: {
					id: 'id',
				},
				attributes: {
					target: 'rootNode',
					ignore: []
				}
			},

		};
	}
);
