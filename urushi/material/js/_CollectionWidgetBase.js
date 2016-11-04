/**
 * @fileOverView _CollectionWidgetBase definition.
 * @author ota
 * @version 1.0
 */

/**
 * <pre>
 * Base class for collection classes.
 * </pre>
 * @module _CollectionWidgetBase
 * @extends module:_Base
 * @extends module:_collectionMixin
 * @requires underscore.js
 * @requires module:_Base
 * @requires module:_collectionMixin
 */
define(
	'_CollectionWidgetBase',
	[
		'underscore',
		'_Base',
		'_collectionMixin'
	],
	/**
	 * @alias module:_CollectionWidgetBase
	 * @returns {object} _CollectionWidgetBase object.
	 */
	function(_, _Base, _collectionMixin) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:_CollectionWidgetBase#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi._collectionWidgetBase',
			EMBEDDED: {}
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

		return _Base.extend(_.extend(_.clone(_collectionMixin), {
			/**
			 * @see {@link module:_Base}#_initProperties
			 * @function
			 * @override
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this._initPropertiesCollectionMixin(args);
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @override
			 * @protected
			 * @returns {string} Instance identifier.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * @see {@link module:_Base}#destroy
			 * @function
			 * @private
			 * @protected
			 * @returns none.
			 */
			destroy: function() {
				this._destroyCollectionMixin();

				this._super();
			}
		}));
	}
);
