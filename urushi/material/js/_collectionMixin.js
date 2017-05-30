/**
 * @fileOverView _collectionMixin definition.
 * @author ota
 * @version 1.0
 */

/**
 * <pre>
 * Utility for collection classes of urushi.
 * </pre>
 * @module _collectionMixin
 * @requires underscore.js
 * @requires jquery-2.1.1.js
 * @requires extend.js
 */
define(
	'_collectionMixin',
	[
		'extend'
	],
	/**
	 * @alias module:_collectionMixin
	 * @returns {object} _collectionMixin.
	 */
	function(extend) {
		'use strict';

		return {
			/**
			 * <pre>
			 * Instance consists with _collectionMixin, is the parent.
			 * Don't set after instance is created.
			 * </pre>
			 * @type _collectionMixin
			 * @private
			 */
			owner: undefined,
			/**
			 * <pre>
			 * list of instance inherits _CollectionItemBase, is the child.
			 * </pre>
			 * @type array
			 * @private
			 */
			subItemList: [],
			/**
			 * <pre>
			 * Initialization.
			 * </pre>
			 * @function
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initPropertiesCollectionMixin: function(/* object */ args) {
				this.subItemList = [];
				this.owner = args ? args.owner : undefined;
			},
			/**
			 * <pre>
			 * Returns child instance of specified identifier.
			 * </pre>
			 * @function
			 * @param {string} id Instance identifier.
			 * @returns {object} Child instance, is the child.
			 */
			getSubItem: function(/* string */ id) {
				var index = this._getSubItemIndex(id);
				if (index > -1) {
					return this.subItemList[index];
				}
				return undefined;
			},
			/**
			 * <pre>
			 * Returns index of child instance of specified identifier.
			 * </pre>
			 * @function
			 * @param {string} id Instance identifier.
			 * @returns {number} Child instance index.
			 */
			_getSubItemIndex: function(/* string */ id) {
				var index,
					item;

				for (index = 0; index < this.subItemList.length; index++) {
					item = this.subItemList[index];
					if (item.id === id) {
						return index;
					}
				}
				return -1;
			},
			/**
			 * <pre>
			 * Returns list of child instances.
			 * </pre>
			 * @function
			 * @returns {array} Child instances.
			 */
			getSubItems: function() {
				var result = [],
					index,
					length = this.subItemList.length;
				for (index = 0; index < length; index++) {
					result.push(this.subItemList[index]);
				}
				return result;
			},
			/**
			 * <pre>
			 * Returns list of child instance ids.
			 * </pre>
			 * @function
			 * @returns {array} Child instance ids.
			 */
			getSubItemIds: function() {
				var result = [],
					index,
					length = this.subItemList.length;
				for (index = 0; index < length; index++) {
					result.push(this.subItemList[index].id);
				}
				return result;
			},
			/**
			 * <pre>
			 * Removes child instance.
			 * </pre>
			 * @function
			 * @protected
			 * @param {string} id Instance identifier.
			 * @returns none.
			 */
			_removeSubItem: function(/* string */ id) {
				var index = this._getSubItemIndex(id),
					item;

				if (index > -1) {
					item = this.subItemList[index];
					this._onRemoveSubItem(item);
					this.subItemList.splice(index, 1);
				}
			},
			/**
			 * <pre>
			 * Callback handler of _removeSubItem.
			 * </pre>
			 * @function
			 * @protected
			 * @param {object} item Child instance that is removed.
			 * @returns none
			 */
			_onRemoveSubItem: function(/* object */ item) {
			},
			/**
			 * <pre>
			 * Adds child instance.
			 * </pre>
			 * @function
			 * @protected
			 * @param {object} subCollectionItem Child instance that is added.
			 * @returns none.
			 */
			_addSubItem: function(/* object */ subCollectionItem) {
				if (this._getSubItemIndex(subCollectionItem.id) > -1) {
					throw new Error('Duplication error : id = ' + subCollectionItem.id);
				}
				this._onAddSubItem(subCollectionItem);
				this.subItemList.push(subCollectionItem);
			},
			/**
			 * <pre>
			 * Calback handler for _addSubItem.
			 * </pre>
			 * @function
			 * @protected
			 * @param {object} subCollectionItem Child instance that is added.
			 * @returns none
			 */
			_onAddSubItem: function(/* object */ item) {
			},
			/**
			 * <pre>
			 * Discarding of mixin object.
			 * </pre>
			 * @function
			 * @returns none
			 */
			_destroyCollectionMixin: function() {
				var index,
					length,
					items = this.getSubItems();
				if (this.owner) {
					this.owner._removeSubItem(this.id);
				}

				for (index = 0, length = items.length; index < length; index++) {
					items[index].destroy();
				}
				this.subItemList = [];
			}
		};
	}
);
