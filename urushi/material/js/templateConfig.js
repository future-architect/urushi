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
	function () {
		'use strict';

		return {
			base : {
				attributes : {
					ignore : ['id', 'class', 'data-urushi-type', 'data-urushi-options', 'disabled', 'readonly']
				}
			},
			alert : {
				name : 'Alert',
				className : 'alert',
				requires : ['content'],
				method : {
					id : 'getField',
					alertClass : 'getOptionalClasses',
					header : 'getUrushiOption',
					content : 'getField',
					isDisplayCloseIcon : 'getUrushiOption'
				},
				options : {
					id : 'id',
					content : 'innerHTML'
				},
				attributes : {
					target : 'rootNode',
					ignore : ['content']
				}
			},
			button : {
				name : 'Button',
				className : 'button',
				requires : ['label'],
				method : {
					id : 'getField',
					buttonClass : 'getOptionalClasses',
					label : 'getField'
				},
				options : {
					id : 'id',
					label : 'innerHTML'
				},
				attributes : {
					target : 'rootNode',
					ignore : ['label']
				}
			},
			checkbox : {
				name : 'Checkbox',
				className : 'checkbox',
				requires : [],
				method : {
					id : 'getField',
					checkboxClass : 'getOptionalClasses',
					label : 'getNextText',
					checked : 'getField'
				},
				options : {
					id : 'id',
					checked : 'checked'
				},
				remove : ['removeNextNode'],
				attributes : {
					target : 'inputNode',
					ignore : ['checked']
				}
			},
			dialog : {
				name : 'Dialog',
				className : 'dialog',
				requires : ['content'],
				method : {
					id : 'getField',
					dialogClass : 'getOptionalClasses',
					header : 'getUrushiOption',
					content : 'getChildNodesFunction',
					footer : 'getUrushiOption',
					duration : 'getUrushiOption',
					isDisplayCloseIcon : 'getUrushiOption',
					isUnderlayClickClose : 'getUrushiOption',
				},
				options : {
					id : 'id'
				},
				attributes : {
					target : 'dialogNode',
					ignore : ['']
				}
			},
			dropdown : {
				name : 'DropDown',
				className : 'dropdown',
				requires : [],
				method : {
					id : 'getField',
					className : 'getOptionalClasses',
					items : function (/* node */ doc) {
						var children = doc.children,
							items = [],
							item,
							index,
							length;

						for (index = 0, length = children.length; index < length; index++) {
							item = {};

							item.label = (children[index].textContent || '').trim();
							item.value = children[index].value || '';

							items.push(item);
						}
						return items;
					}
				},
				options : {
					id : 'id'
				},
				attributes : {
					target : 'inputNode',
					ignore : ['value']
				},
				setValue : {name : 'setSelected', args : ['value']}
			},
			input : {
				name : 'Input',
				className : 'input',
				requires : [],
				method : {
					id : 'getField',
					inputClass : 'getOptionalClasses',
					placeholder : 'getAttribute',
					hint : 'getUrushiOption',
					value : 'getAttribute'
				},
				options : {
					id : 'id',
					placeholder : 'placeholder',
					value : 'value'
				},
				attributes : {
					target : 'inputNode',
					ignore : ['value', 'placeholder']
				},
				setValue : {name : 'setValue', args : ['value']}
			},
			panel : {
				name : 'Panel',
				className : 'panel',
				requires : [],
				method : {
					id : 'getField',
					panelClass : 'getOptionalClasses',
					header : 'getUrushiOption',
					content : 'getChildNodesFunction',
					footer : 'getUrushiOption',
				},
				options : {
					id : 'id'
				},
				attributes : {
					target : 'rootNode',
					ignore : ['']
				}
			},
			card : {
				name : 'Card',
				className : 'card',
				requires : [],
				method : {
					id : 'getField',
					cardClass : 'getOptionalClasses',
					title : 'getUrushiOption',
					titleImg : 'getUrushiOption',
					content : 'getChildNodesFunction',
					buttonClass : 'getUrushiOption',
					buttonLabel : 'getUrushiOption',
					isActionButton : 'getUrushiOption'
				},
				options : {
					id : 'id'
				}
			},
			radiobox : {
				name : 'Radiobox',
				className : 'radiobox',
				requires : ['name'],
				method : {
					id : 'getField',
					radioboxClass : 'getOptionalClasses',
					name : 'getAttribute',
					value : 'getAttribute',
					label : 'getNextText',
					checked : 'getField'
				},
				options : {
					id : 'id',
					name : 'name',
					value : 'value',
					checked : 'checked'
				},
				remove : ['removeNextNode'],
				attributes : {
					target : 'inputNode',
//					ignore : ['checked']
					ignore : ['']
				}
			},
			textarea : {
				name : 'Textarea',
				className : 'textarea',
				requires : [],
				method : {
					id : 'getField',
					textareaClass : 'getOptionalClasses',
					placeholder : 'getAttribute',
					hint : 'getUrushiOption',
					value : 'getAttribute'
				},
				options : {
					id : 'id',
					placeholder : 'placeholder',
					value : 'value'
				},
				attributes : {
					target : 'inputNode',
					ignore : ['value', 'placeholder']
				},
				setValue : {name : 'setValue', args : ['value']}
			},
			togglebutton : {
				name : 'ToggleButton',
				className : 'togglebutton',
				requires : ['label'],
				method : {
					id : 'getField',
					toggleButtonClass : 'getOptionalClasses',
					label : function (/* node */ doc, /* string */ key) {
						var index,
							length,
							node,
							label,
							options = ['previousSibling', 'nextSibling'];

						for (index = 0, length = options.length; index < length; index++) {
							node = doc[options[index]];
							if (node && node.wholeText && node.wholeText.trim()) {
								label = node.wholeText.trim();
								
								if (node.remove) {
									node.remove();
								} else {
									node.parentNode.removeChild(node);
								}

								return label;
							}
						}
						return '';
					},
					checked : function (/* node */ doc, /* string */ key) {
						return doc.hasAttribute('checked') && true || false;
					}
				},
				options : {
					id : 'id',
					checked : 'checked'
				},
				attributes : {
					target : 'inputNode',
					ignore : ['checked']
				}
			},
			tooltip : {
				name : 'Tooltip',
				className : 'tooltip',
				requires : [],
				method : {
					id : 'getUrushiAdditionOption',
					tooltipClass : 'getUrushiAdditionOption',
					position : 'getUrushiAdditionOption',
					content : 'getUrushiAdditionOption',
					on : 'getUrushiAdditionOption',
					off : 'getUrushiAdditionOption'
				},
				options : {
					id : 'id',
					tooltipClass : 'tooltipClass',
					position : 'position',
					content : 'content',
					on : 'on',
					off : 'off'
				},
				attributes : {
					target : 'rootNode',
					ignore : ['']
				}
			},
			fileinput : {
				name : 'FileInput',
				className : 'fileinput',
				requires : [],
				method : {
					id : 'getField',
					label : 'getUrushiOption',
					url : 'getUrushiOption',
					additionalClass : 'getOptionalClasses',
					allowedTypes : 'getUrushiOption',
				},
				options : {
					id : 'id',
				},
				attributes : {
					target : 'rootNode',
					ignore : []
				}
			},
			uploadmanager : {
				name : 'UploadManager',
				className : 'uploadmanager',
				requires : [],
				method : {
					id : 'getField',
					url : 'getUrushiOption',
					uploadManagerClass : 'getOptionalClasses',
					allowedTypes : 'getUrushiOption',
				},
				options : {
					id : 'id',
					url : 'url',
					allowedTypes : 'allowedTypes',
				},
				attributes : {
					target : 'rootNode',
					ignore : []
				}
			},
			hamburger : {
				name : 'Hamburger',
				className : 'hamburger',
				requires : [],
				method : {
					id : 'getField',
				},
				options : {
					id : 'id',
				},
				attributes : {
					target : 'rootNode',
					ignore : []
				}
			},
			contextmenu : {
				name : 'ContextMenu',
				className : 'contextmenu',
				requires : [],
				method : {
					id : 'getField',
					bubbling : 'getUrushiOption',
					type : 'getUrushiOption',
					items : function (/* node */ doc) {
						var children = doc.children,
							items = [],
							index,
							length,
							item;

						for (index = 0, length = children.length; index < length; index++) {
							item = {};

							item.liId = children[index].id;
							item.name = children[index].getAttribute('name');
							item.label = (children[index].textContent || '').trim();
							item.icon = children[index].className || '';

							items.push(item);
						}
						return items;
					}
				},
				options : {
					id : 'id',
				},
				attributes : {
					target : 'rootNode',
					ignore : []
				}
			},
			grid : {
				name : 'Grid',
				className : 'grid',
				requires : [],
				method : {
					id : 'getField',
					rowsPerPage : 'getUrushiOption',
					paginationArea : 'getUrushiOption',
					selection : 'getUrushiOption',
					header : function (/* node */ doc) {
						var children,
							header = [],
							index,
							length,
							head;

						if (!doc.children[0] || !doc.children[0].children[0] || !doc.children[0].children[0].children) {
							throw new Error('Invalid header.');
						}
						children = doc.children[0].children[0].children;

						for (index = 0, length = children.length; index < length; index++) {
							head = {};
							head.name = children[index].getAttribute('name') || '';
							head.value = children[index].childNodes || '';
							header.push(head);
						}
						return header;
					}
				},
				options : {
					id : 'id',
				},
				attributes : {
					target : 'rootNode',
					ignore : []
				}
			},
		};
	}
);
