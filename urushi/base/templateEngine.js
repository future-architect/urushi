/**
 * @fileOverView templateEngine Object.
 * @author Yuzo Hirakawa
 * @version 1.0.0
 */

/**
 * <pre>
 * Urushiのコンポーネントをマークアップで利用可能にするための、Template Engineです。
 * </pre>
 * @module templateEngine
 */
define(
	'templateEngine',
	['node', 'promise'],
	/**
	 * @alias module:templateEngine
	 * @returns {object} templateEngine object.
	 */
	function(node) {
		'use strict';

		/**
		 * <pre>
		 * TemplateEngineでのみ利用する定数定義。
		 * </pre>
		 * @member module:templateEngine#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		const ATTRIBUTE_NAME_URUSHI_TYPE = 'data-urushi-type';

		let Tooltip;

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
			renderDocument: function(/* node */ docTree, /* object */ configMap, /* object */ presetOptions) {
				let promise,
					widgets = {},
					ret = {compiled: docTree, widgets: widgets},
					renderingCount = NaN,
					tooltipArgs = [];

				presetOptions = presetOptions || {};

				function registTooltip(/* Element */ element) {
					tooltipArgs.push(Tooltip.prototype._parse(element));
				}
				function renderTooltip() {
					let i;
					for (i = 0; i < tooltipArgs.length; i++) {
						new Tooltip(tooltipArgs[i]);
					}
				}
				function startRender() {
					renderingCount = renderingCount || 0;
					renderingCount++;
				}
				function finishRender(resolve, reject) {
					renderingCount--;

					if (0 === renderingCount) {
						renderTooltip();
						resolve(ret);
					}
				}
				function render(/* node */ doc, /* object */ config, resolve, reject) {
					if (!config) {
						throw new Error('Invalid module type. set valid module type(data-urushi-type).');
					}
					startRender();

					require([config.name], function(/* Class */ Module) {
						let key,
							args,
							module,
							attributes,
							index,
							length,
							name,
							value;

						args = Module.prototype._parse(doc);
						for (key in presetOptions) {
							if (!args.hasOwnProperty(key)) {
								args[key] = presetOptions[key];
							}
						}
						module = new Module(args);

						attributes = doc.attributes;
						for (index = 0, length = attributes.length; index < length; index++) {
							name = attributes[index].name;
							value = attributes[index].value;

							// 先頭ノードへ属性を引き継ぐ。
							if (Module.prototype._isTakedOver(name)) {
								module.getRootNode().setAttribute(name, value);
							}
						}

						widgets[module.id] = module;

						doc.parentNode.replaceChild(module.getRootNode(), doc);
						if (module.getRootNode() &&
							module.getRootNode().getAttribute(Tooltip.prototype.getTypeName())) {

							registTooltip(module.getRootNode());
						}
						finishRender(resolve, reject);
					});
				}
				function circulate(/* node */ doc, resolve, reject) {
					let type = (doc.getAttribute(ATTRIBUTE_NAME_URUSHI_TYPE) || '').toLowerCase(),
						children = doc.children || [],
						index,
						length;

					if (type) {
						render(doc, configMap[type], resolve, reject);
					} else if (doc.getAttribute(Tooltip.prototype.getTypeName())) {
						registTooltip(doc);
					}
					for (index = 0, length = children.length; index < length; index++) {
						circulate(children[index], resolve, reject);
					}
				}

				promise = new Promise(function(resolve, reject) {
					if (!configMap) {
						throw new Error('Set configuration of urushi template engine.');
					}
					require([configMap.post.tooltip], function(/* Class */ Module) {
						Tooltip = Module;
						docTree = docTree || document.body;
						circulate(docTree, resolve, reject);

						if (isNaN(renderingCount)) {
							setTimeout(function() {
								resolve(ret);
							}, 10);
						}
					});
				});

				return promise;
			}
		};
	}
);
