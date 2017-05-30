/**
 * @fileOverView _CollectionItemBase definition.
 * @author ota
 * @version 1.0
 */

/**
 * <pre>
 * Base class of collection.
 *
 * Constructor arguments.
 *	owner
 *		type			: object - _CollectionWidgetBase|_CollectionItemBase instance
 *		specification	: required
 *		default value	: none.
 *		descriptoin		: Parent class that holds _CollectionItemBase instance.
 * </pre>
 * @module _CollectionItemBase
 * @requires underscore.js
 * @requires jquery-2.1.1.js
 * @requires extend.js
 * @requires module:_collectionMixin
 */
define(
	'_CollectionItemBase',
	[
		'extend',
		'util',
		'_collectionMixin',
	],
	/**
	 * @alias module:_CollectionItemBase
	 * @returns {Class} _CollectionItemBase class.
	 */
	function(extend, util, _collectionMixin) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:_CollectionItemBase#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi._collectionItemBase',
			EMBEDDED: {},
			ABSTRUCT_METHOD: function() {
				throw new Error('Abstruct Error');
			},
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @member module:_CollectionItemBase#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0;

		return Class.extend(util.deepCopy({
			/**
			 * @see {@link module:_Base}#idPrefix
			 */
			idPrefix: CONSTANTS.ID_PREFIX,
			/**
			 * @see {@link module:_Base}#id
			 */
			id: '',
			/**
			 * <pre>
			 * Constructor.
			 *
			 * It consists of the following processes.
			 * 1.	_initProperties
			 *		It initializes instance properties.
			 *		If you define class, want initialize constructor arguments,
			 *		Inherit _initProperties.
			 * 2.	_render
			 *		It creates node by template string.
			 *		If you define class, want create node by javaScript,
			 *		Inherit _render.
			 * 3.	_attachNode
			 *		It sets access point to element node.
			 *		If you define class, want create access point to element node,
			 *		Inherit _attachNode.
			 * 4.	It is post process of after the above.
			 *		If you want run several process, inherit initOption.
			 * 5.	Check whether inherited class has setHiden and isHidden,
			 *		and set parent instance to own instance.
			 * </pre>
			 * @function
			 * @param {object} args Constructor argumetns.
			 * @returns none.
			 */
			init: function(/* object */ args) {
				var _args = args || {};

				// Check whether parent is present.
				if (!_args.owner) {
					throw new Error('arguments must have owner');
				}

				this._initProperties(_args);
				this._render(_args);
				this._attachNode();
				this.initOption(_args);

				if (this.setHidden === CONSTANTS.ABSTRUCT_METHOD) {
					throw new Error('setHidden is a need to implement');
				}
				if (this.isHidden === CONSTANTS.ABSTRUCT_METHOD) {
					throw new Error('isHidden is a need to implement');
				}

				_args.owner._addSubItem(this);
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * It  initializes instance properties.
			 * Because it initialize _collectionMixin's properties, it calls _initPropertiesCollectionMixin.
			 * </pre>
			 * @function
			 * @param {object} args Constructor argumetns.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this._initPropertiesCollectionMixin(args);
				this.id = args && args.id || this._getId();
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * It's post process of after the initialization.
			 * It's defiend for inheritance point.
			 * </pre>
			 * @function
			 * @param {object} args Constructor argumetns.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {},
			/**
			 * <pre>
			 * Returns identifier.
			 * Part of initialization functions.
			 * When identifier is not specified with constructor arguments, it will run.
			 * !! Caution !!
			 * You will create class,
			 * please override that function and copy process.
			 * </pre>
			 * @function
			 * @private
			 * @returns {string} Instance's id.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * It will create node by javaScript.
			 * It's defiend for inheritance point.
			 * </pre>
			 * @function
			 * @private
			 * @param {object} args Constructor argumetns.
			 * @returns none
			 */
			_render: function(/* object */ args) {
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * Sets access point to node except root node.
			 * </pre>
			 * @function
			 * @private
			 * @returns none
			 */
			_attachNode: function() {
			},
			/**
			 * <pre>
			 * Hide and be unavailable the instance.
			 * or show and be available the instance.
			 * Implemet in inheritance destination class.
			 * </pre>
			 * @function
			 * @returns none.
			 */
			setHidden: CONSTANTS.ABSTRUCT_METHOD,
			/**
			 * <pre>
			 * Returns instance's active state.
			 * Implemet in inheritance destination class.
			 * </pre>
			 * @function
			 * @returns none.
			 */
			isHidden: CONSTANTS.ABSTRUCT_METHOD,
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete element nodes.
			 * </pre>
			 * @function
			 * @returns none
			 */
			destroy: function() {
				this._destroyCollectionMixin();
				this.destroyOption();
			},
			/**
			 * <pre>
			 * It's post process of after the destroy.
			 * It's defiend for inheritance point.
			 * </pre>
			 * @function
			 * @returns none
			 */
			destroyOption: function() {}
		}, _collectionMixin));
	}
);
