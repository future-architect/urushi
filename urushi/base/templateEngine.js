/**
 * @fileOverView urushi object for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides utility to generate urushi modules from html element.
 * </pre>
 * @module templateEngine
 */
define(
	'templateEngine',
	['node', 'Deferred'],
	/**
	 * @alias module:templateEngine
	 * @returns {object} templateEngine object.
	 */
	function (node, Deferred) {
		'use strict';

		/**
		 * <pre>
		 * Constants
		 * </pre>
		 * @member module:templateEngine#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
				TEMPLATE_NAME_TYPE : 'data-urushi-type',
				TEMPLATE_NAME_OPTIONS : 'data-urushi-options',
				TEMPLATE_NAME_ADDITION_TYPE : 'data-urushi-addition-type',
				TEMPLATE_NAME_ADDITION_OPTIONS : 'data-urushi-addition-options'
			},
			generics = {};

		/**
		 * <pre>
		 * Get style classes from html other than it defined by the module.
		 * </pre>
		 * @member module:templateEngine#getOptionalClasses
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key Style class name is used module.
		 * @param {string} accessor not used.
		 * @returns {string} style classes from html other than it defined by the module.
		 */
		generics.getOptionalClasses = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			var tempClass = doc.className,
				classList,
				className,
				index,
				length;

			tempClass = tempClass.replace(key, '');
			classList = tempClass.trim().split(/[ ]+/);

			className = '';
			for (index = 0, length = classList.length; index < length; index++) {
				className += classList[index];
				className += ' ';
			}

			return className.trim();
		};
		/**
		 * <pre>
		 * Get text in the location specified by [accessor] from [doc].
		 * </pre>
		 * @member module:templateEngine#getAdjacentLabel
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key Not used.
		 * @param {string} accessor Place name.
		 * @returns {string} text.
		 */
		generics.getAdjacentLabel = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			var textNode = doc[accessor] || {};
			return (textNode.wholeText || '').trim();
		};
		/**
		 * <pre>
		 * Get attribute with name specified by [accessor] from [doc].
		 * </pre>
		 * @member module:templateEngine#getAttribute
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key Not used.
		 * @param {string} accessor Attribute key name.
		 * @returns {string} attribute.
		 */
		generics.getAttribute = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			return doc.getAttribute(accessor);
		};
		/**
		 * <pre>
		 * Get field with name specified by [accessor] from [doc].
		 * </pre>
		 * @member module:templateEngine#getField
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key Not used.
		 * @param {string} accessor Field key name.
		 * @returns {string} value in field
		 */
		generics.getField = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			return doc[accessor];
		};
		/**
		 * <pre>
		 * From the constructor argument of the module that is defined in the data-urushi-options,
		 * to get the set value of the specified key.
		 * </pre>
		 * @member module:templateEngine#getUrushiOption
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key data-urushi-options field key name.
		 * @param {string} accessor Not used.
		 * @returns {string} data-urushi-options value.
		 */
		generics.getUrushiOption = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			var options = doc.getAttribute(CONSTANTS.TEMPLATE_NAME_OPTIONS);
			try {
				options = JSON.parse(options) || {};
			} catch (e) {
				throw new Error('It\'s wrong syntax in ' + CONSTANTS.TEMPLATE_NAME_OPTIONS + ' : ID = ' + doc.id + ', key = ' + key);
			}
			return options[key];
		};
		/**
		 * <pre>
		 * From the constructor argument of the additional module that is defined in the data-urushi-addition-options,
		 * to get the set value of the specified key.
		 * Additional module is defined with name data-urushi-addition-type.
		 * </pre>
		 * @member module:templateEngine#getUrushiAdditionOption
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key data-urushi-options field key name.
		 * @param {string} accessor Not used.
		 * @returns {string} data-urushi-addition-options value.
		 */
		generics.getUrushiAdditionOption = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			var options = doc.getAttribute(CONSTANTS.TEMPLATE_NAME_ADDITION_OPTIONS);
			try {
				options = JSON.parse(options) || {};
			} catch (e) {
				throw new Error('It\'s wrong syntax in ' + CONSTANTS.TEMPLATE_NAME_ADDITION_OPTIONS + ' : ID = ' + doc.id + ', key = ' + key);
			}
			return options[key] || '';
		};
		/**
		 * <pre>
		 * Get text that is in front of [doc].
		 * </pre>
		 * @member module:templateEngine#getPreviousText
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key Not used.
		 * @param {string} accessor Not used.
		 * @returns {string} Text.
		 */
		generics.getPreviousText = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			var textNode = doc.previousSibling || {};
			return (textNode.wholeText || '').trim();
		};
		/**
		 * <pre>
		 * Get text that is on back of [doc].
		 * </pre>
		 * @member module:templateEngine#getNextText
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key Not used.
		 * @param {string} accessor Not used.
		 * @returns {string} Text.
		 */
		generics.getNextText = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			var textNode = doc.nextSibling || {};
			return (textNode.wholeText || '').trim();
		};
		/**
		 * <pre>
		 * Get document element and text element from [doc].
		 * </pre>
		 * @member module:templateEngine#getChildNodes
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key Not used.
		 * @param {string} accessor Not used.
		 * @returns {Array} Element list.
		 */
		generics.getChildNodes = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			var nodes = [],
				childNodes = doc.childNodes,
				childNode,
				index,
				length;

			for (index = 0, length = childNodes.length; index < length; index++) {
				childNode = childNodes[index];
				if (!node.isNode(childNode)) {
					continue;
				}
				if (node.isTextNode(childNode) && !childNode.wholeText.trim()) {
					continue;
				}
				nodes.push(childNode);
			}
			return nodes;
		};
		/**
		 * <pre>
		 * Get function that provide to get child nodes.
		 * </pre>
		 * @member module:templateEngine#getChildNodesFunction
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @param {string} key
		 * @param {string} accessor
		 * @returns {function} function that provide to get child nodes.
		 */
		generics.getChildNodesFunction = function (/* node */ doc, /* string */ key, /* string */ accessor) {
			return function() {
				return generics.getChildNodes(doc, key, accessor);
			};
		};
		/**
		 * <pre>
		 * Delete element taht is in front of [doc].
		 * </pre>
		 * @member module:templateEngine#removePreviousNode
		 * @function
		 * @private
		 * @param {node} doc Document element that converted by the template engine.
		 * @returns none.
		 */
		generics.removePreviousNode = function (/* node */ doc) {
			if (!doc || !doc.previousSibling || !doc.previousSibling.wholeText.trime()) {
				return;
			}
			if (doc.nextSibling.remove) {
				doc.previousSibling.remove();
			} else {
				doc.previousSibling.parentNode.removeChild(doc.previousSibling);
			}
		};
		/**
		 * <pre>
		 * Delete element taht is on back of [doc].
		 * </pre>
		 * @member module:templateEngine#removeNextNode
		 * @function
		 * @private
		 * @param {node} doc 変換対象のモジュールのnode
		 * @param {string} key 変換対象のクラス名
		 * @param {string} accessor 変換対象
		 * @returns none.
		 */
		generics.removeNextNode = function (/* node */ doc) {
			if (!doc || !doc.nextSibling || !doc.nextSibling) {
				return;
			}
			if (doc.nextSibling.remove) {
				doc.nextSibling.remove();
			} else {
				doc.nextSibling.parentNode.removeChild(doc.nextSibling);
			}

		};

		return {
			/**
			 * <pre>
			 * Generate module.
			 * Scans [domTree], tocreate a module of Urushi.
			 * Then, replace the module was created with element.
			 * </pre>
			 * @function
			 * @param {node} docTree scan target.
			 * @param {object} configMap Template engine configuration.
			 * @param {object} presetOptions preset constructor arguments.
			 * @returns {object} Translated [docTree] and, created modules.
			 */
			renderDocument : function (/* node */ docTree, /* object */ configMap, /* object */ presetOptions) {
				var deferred = new Deferred(),
					widgets = {},
					ret = {compiled : docTree, widgets : widgets},
					renderingCount = NaN;

				presetOptions = presetOptions || {};

				function setAddition (/* object */ module, /* object */ config, /* string */ additionOptions) {
					try {
						additionOptions = JSON.parse(additionOptions) || {};
					} catch (e) {
						throw new Error('It\'s wrong syntax in ' + CONSTANTS.TEMPLATE_NAME_ADDITION_OPTIONS);
					}
					additionOptions.parentNode = module.rootNode;
					require([config.name], function (Module) {
						new Module(additionOptions);
					});
				}
				function startRender () {
					renderingCount = renderingCount || 0;
					renderingCount++;
				}
				function finishRender () {
					renderingCount--;

					if (0 === renderingCount) {
						deferred.resolve(ret);
					}
				}
				function render (/* node */ doc, /* object */ config) {
					var options,
						methods,
						method,
						option,
						key,
						args = {},
						additionType = doc.getAttribute(CONSTANTS.TEMPLATE_NAME_ADDITION_TYPE),
						additionOption = doc.getAttribute(CONSTANTS.TEMPLATE_NAME_ADDITION_OPTIONS);
					
					if (!config) {
						throw new Error('Invalid module type. set valid module type(data-urushi-type).');
					}
					startRender();

					methods = config.method;
					options = config.options;
					for (key in methods) {
						method = methods[key];
						option = options[key];

						if ('string' === typeof method) {
							args[key] = generics[method](doc, key, option);
						} else if ('function' === typeof method) {
							args[key] = method(doc, key, option);
						}
						if (config.requires.indexOf(key) && undefined === key) {
							throw new Error('Require option is not defined. : ' + key);
						}
					}

					for (key in presetOptions) {
						if (!args.hasOwnProperty(key)) {
							args[key] = presetOptions[key];
						}
					}

					require([config.name], function (/* Class */ Module) {
						var module = new Module(args),
							target,
							method,
							attributes,
							attrIndex,
							attrLength,
							name,
							value;

						if (additionType) {
							setAddition(module, configMap[additionType], additionOption);
						}

						attributes = doc.attributes;
						for (attrIndex = 0, attrLength = attributes.length; attrIndex < attrLength; attrIndex++) {
							name = attributes[attrIndex].name;
							value = attributes[attrIndex].value;

							if (-1 === configMap.base.attributes.ignore.indexOf(name) && -1 === config.attributes.ignore.indexOf(name)) {
								module[config.attributes.target].setAttribute(name, value);
							}
							if (config.setValue && 'value' === name) {
								module[config.setValue.name](value);
							}
							if ('disabled' === name) {
								module.setDisabled(true);
							}
							if ('readonly' === name && 'function' === typeof module.setReadonly) {
								module.setReadonly(true);
							}
						}

						widgets[module.id] = module;

						for (target in config.remove) {
							method = config.remove[target];
							if ('string' === typeof method) {
								args[key] = generics[method](doc);
							} else if ('function' === typeof method) {
								args[key] = method(doc, key, option);
							}
						}

						doc.parentNode.replaceChild(module.rootNode, doc);
						finishRender();
					});
				}
				function circulate (/* node */ doc) {
					var type = (doc.getAttribute(CONSTANTS.TEMPLATE_NAME_TYPE) || '').toLowerCase(),
						children = doc.children || [],
						index,
						length;

					if (type) {
						render(doc, configMap[type]);
					}
					for (index = 0, length = children.length; index < length; index++) {
						circulate(children[index]);
					}
				}

				if (!configMap) {
					throw new Error('Set configuration of urushi template engine.');
				}
				docTree = docTree || document.body;
				circulate(docTree);

				if (isNaN(renderingCount)) {
					setTimeout(function () {
						deferred.resolve(ret);
					}, 10);
				}

				return deferred;
			}
		};
	}
);
