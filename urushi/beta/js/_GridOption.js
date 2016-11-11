/**
 * @fileOverView GridOption class definition.
 * @author Yasuhiro Murata
 * @version 1.0
 */
/**
 * <pre>
 * Optional utilities for Grid class.
 *
 * constructor argument.
 *	dataList
 *		type			: array
 *		specification	: required
 *		descriptoin		: Model
 * </pre>
 *
 * @example
 *	require(['_GridOption'], function(_GridOption) {
 *		var option = new GridOption({
 *			dataList: []
 *		});
 *	});
 *
 * @module _GridOption
 * @requires module:extend
 * @requires module:_GridOptionConfig
 */
define(
	'_GridOption', [
		'extend', '_GridOptionConfig', 'Deferred'
	],
	/**
	 * @alias module:_GridOption
	 * @returns {object} _GridOption object.
	 */
	function(extend, Config, Deferred) {
		'use strict';

		return Class.extend({
			/**
			 * <pre>
			 * Option object that is used in Grid.
			 * </pre>
			 * @type object
			 */
			option: undefined,
			/**
			 * <pre>
			 * Modules that is used in Grid.
			 * </pre>
			 * @type object
			 */
			moduleMap: undefined,
			/**
			 * <pre>
			 * GridOptionにて使用するthis.config情報を保持するオブジェクト
			 * </pre>
			 * @type object
			 */
			config: undefined,

			/**
			 * <pre>
			 * Constructor.
			 * Initializes this.
			 * </pre>
			 * @function
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			init: function(/* object */ args) {
				var _args = args || {};
				// this._super(_args);
				this._initProperties(_args);
			},
			/**
			 * <pre>
			 * Part of constructor.
			 * Initializes own properties.
			 * </pre>
			 * @function
			 * @private
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this.option = {};
				this.moduleMap = {};
				this.config = Config;
			},
			/**
			 * <pre>
			 * Loads the Class file to be used in Grid.
			 * </pre>
			 * @function
			 * @param {object} args Constructor arguments for the Class.
			 * @returns deferred Deferred instance.
			 */
			requireModules: function(/* array */ moduleNames) {
				var deferred = new Deferred(),
					unrequiredModules = this._detectUnrequired(moduleNames),
					index,
					length,
					requireModules;

				if (0 === unrequiredModules.length) {
					deferred.resolve();
					return deferred;
				}

				// Get Class file path from this.config.
				requireModules = [];
				for (index = 0, length = unrequiredModules.length; index < length; index++) {
					requireModules.push(this.config.allowedModules[unrequiredModules[index]]);
				}
				require(requireModules, function() {
					for (index = 0, length = unrequiredModules.length; index < length; index++) {
						this.moduleMap[unrequiredModules[index]] = arguments[index];
					}
					deferred.resolve();
				}.bind(this));
				return deferred;
			},
			/**
			 * <pre>
			 * Returns Class name list that must be loaded.
			 * </pre>
			 * @function
			 * @private
			 * @param {array} moduleNames List of Class name.
			 * @returns Class name list that must be loaded.
			 */
			_detectUnrequired: function(/* array */ moduleNames) {
				var moduleName,
					requiredModules = Object.keys(this.moduleMap),
					index,
					length,
					unrequiredModules = [];

				for (index = 0, length = moduleNames.length; index < length; index++) {
					moduleName = moduleNames[index];
					if (-1 !== requiredModules.indexOf(moduleName)) {
						continue;
					}
					unrequiredModules.push(moduleName);
				}
				return unrequiredModules;
			},
			/**
			 * <pre>
			 * Adds options.
			 * </pre>
			 * @function
			 * @param {object} options Options.
			 * @returns none
			 */
			addOptions: function(/* object */ options) {
				var name;
				if (!(options instanceof Object)) {
					throw new Error('addOptions: Invalid Argument.');
				}
				for (name in options) {
					try {
						this._addOption(name, options[name]);
					} catch (e) {
						console.error(e);
					}
				}
			},
			// addOption: function(/* string */ name, /* object */ option) {
			// 	this._addOption(name, option);
			// },
			/**
			 * <pre>
			 * Inner function.
			 + Addes a option.
			 * </pre>
			 * @function
			 * @private
			 * @param {string} name Column name of grid.
			 * @param {object} option Option.
			 * @returns none
			 */
			_addOption: function(/* string */ name, /* object */ option) {
				var module;

				if (!(option instanceof Object)) {
					throw new Error('_addOption: Invalid Argument.');
				}
				if (-1 === Object.keys(this.config.allowedModules).indexOf(option.module)) {
					throw new Error('_addOption: Invalid module for Grid. name:' + name);
				}
				if ('icon' === option.module) {
					this.option[name] = option;
				} else {
					try {
						module = this._createModule(option, 'test', 'test');
					} catch (e) {
						console.error(e);
					}
					this.option[name] = option;
					if (module.destroy) {
						module.destroy();
					}
					module = undefined;
				}
			},
			/**
			 * <pre>
			 * Creates instance.
			 * </pre>
			 * @function
			 * @param {string} name Column name.
			 * @param {string} id Id of row.
			 * @param {string} label Label.
			 * @returns Instance.
			 */
			createModule: function(/* string */ name, /* string */ id, /* string */ label) {
				var _id = id + '.' + name + '.' + this.option[name].module;
				return this._createModule(this.option[name], _id, label);
			},
			/**
			 * <pre>
			 * Inner function.
			 + Creates instance.
			 * </pre>
			 * @function
			 * @private
			 * @param {object} option Option.
			 * @param {string} id Id of row.
			 * @param {string} label Label.
			 * @returns module
			 */
			_createModule: function(/* object */ option, /* string */ id, /* string */ label) {
				var key,
					moduleName,
					properties,
					presetProp,
					forceProp,
					module,
					args = {};

				moduleName = this.config.allowedModules[option.module];
				properties = this.config.properties[moduleName];
				presetProp = this.config.presetProperties[moduleName];
				forceProp = this.config.forceProperties[moduleName];

				for (key in properties) {
					if (undefined === properties[key]) {
						continue;
					}
					args[properties[key]] = forceProp && forceProp[key] ||
											option[key] ||
											presetProp && presetProp[key] ||
											undefined;
				}
				if (this.config.finalizeArgs[option.module]) {
					this.config.finalizeArgs[option.module](args, id);
				}
				args.id = id;
				module = new this.moduleMap[option.module](args);
				if (this.config.setValueMap[option.module]) {
					this.config.setValueMap[option.module](module, label);
				}

				return module;
			},
			/**
			 * <pre>
			 * Returns whether the option, is specified by the name, is set or not.
			 * </pre>
			 * @function
			 * @param {string} name Column name.
			 * @returns Whether the option is set or not.
			 */
			contains: function(/* string */ name) {
				return !!this.option[name];
			},
			/**
			 * <pre>
			 * Returns additional class name that is set column.
			 * </pre>
			 * @function
			 * @param {string} name Column name.
			 * @returns Additional class name that is set to column.
			 */
			getAdditionalColumnStyle: function(/* string */ name) {
				return this.config.additionalColumnStyle[this.option[name].module];
			},
			/**
			 * <pre>
			 * Returns Class name is specified to column.
			 * </pre>
			 * @function
			 * @param {string} name Colmun name.
			 * @returns Class name.
			 */
			getModuleName: function(/* string */ name) {
				return this.option[name].module;
			},
			/**
			 * <pre>
			 * Returns and creates icon.
			 * </pre>
			 * @function
			 * @param {string} name Column name.
			 * @param {string} id Id of row.
			 * @returns element node that contains icon element node.
			 */
			createIcon: function(/* string */ name, /* string */ id) {
				var icon = document.createElement('span');
				icon.id = id + '.' + name + '.icon';
				icon.classList.add('grid-icon');
				icon.classList.add('icon-' + name);
				icon.classList.add(this.option[name].style);
				return icon;
			}
		});
	}
);
