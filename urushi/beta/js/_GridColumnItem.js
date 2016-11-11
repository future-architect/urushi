/**
 * @fileOverView _GridColumnItem definition.
 * @author ota
 * @version 1.0
 */

/**
 * <pre>
 * Column item for Grid class.
 *
 * constructor arguments
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	owner
 *		type			: ContextMenu
 *		specification	: required
 *		descriptoin		: ContextMenu instance, is the parent.
 *	value
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Label on header.
 * </pre>
 *
 * @module _GridColumnItem
 * @extends module:_CollectionItemBase
 * @requires urushi
 * @requires module:_CollectionItemBase
 */
define(
	'_GridColumnItem',
	[
		'Urushi',
		'_CollectionItemBase',
	],
	/**
	 * @alias module:_GridColumnItem
	 * @returns {object} _GridColumnItem object.
	 */
	function(urushi, _CollectionItemBase) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:_GridColumnItem#CONSTANTS
		 * @type obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi._gridColumnItem',
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @member module:_GridColumnItem#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0;

		return _CollectionItemBase.extend({
			/**
			 * <pre>
			 * Header element node of grid.
			 * </pre>
			 * @type node
			 * @private
			 */
			headerNode: undefined,
			/**
			 * <pre>
			 * List of cell element node.
			 * </pre>
			 * @type array
			 * @private
			 */
			cellNodes: [],
			/**
			 * <pre>
			 * Initialize cellNodes.
			 * </pre>
			 * @see {@link module:_Base}#_initProperties
			 * @function
			 * @override
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this._super(args);
				this.cellNodes = [];
			},
			/**
			 * <pre>
			 * Craete cell.
			 * </pre>
			 * @see {@link module:_Base}#_render
			 * @function
			 * @override
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none
			 */
			_render: function(/* object */ args) {
				var li,
					name,
					value;

				if (!args.name || !args.value) {
					throw new Error('_renderHeader: header must contains valid name and value');
				}
				name = args.name;
				value = args.value;
				li = document.createElement('li');
				urushi.setDomContents(li, value);
				li.setAttribute('name', name);
				li.classList.add('column');

				this.headerNode = li;
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @override
			 * @protected
			 * @returns {string} instance id.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Adds cell element nodes to this.
			 * </pre>
			 * @function
			 * @private
			 * @param {node} cellNode The cell element node that is added.
			 * @returns none
			 */
			_addCellNode: function(/* node */ cellNode) {
				this.cellNodes.push(cellNode);

				if (this.isHidden()) {
					cellNode.classList.add('hidden');
				}
			},
			/**
			 * <pre>
			 * Removes all of cell element nodes from this.
			 * </pre>
			 * @function
			 * @private
			 * @returns none
			 */
			_clearCells: function() {
				this.cellNodes = [];
			},
			/**
			 * <pre>
			 * Hide and be unavailable the instance.
			 * or show and be available the instance.
			 * </pre>
			 * @function
			 * @param {boolean} is True is hidden, false is shown.
			 * @returns {boolean} It finished normally, returns true.
			 */
			setHidden: function(/* boolean */ is) {
				var index,
					length;
				if ('boolean' !== typeof is) {
					return false;
				}
				if (is) {
					this.headerNode.classList.add('hidden');
					for (index = 0, length = this.cellNodes.length; index < length; index++) {
						this.cellNodes[index].classList.add('hidden');
					}
				} else {
					this.headerNode.classList.remove('hidden');
					for (index = 0, length = this.cellNodes.length; index < length; index++) {
						this.cellNodes[index].classList.remove('hidden');
					}
				}
				return true;
			},
			/**
			 * <pre>
			 * Returns instance's active state.
			 * </pre>
			 * @function
			 * @returns {boolean} Avtive state. Instance is disabled, returns true.
			 */
			isHidden: function() {
				return this.headerNode.classList.contains('hidden');
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete element nodes.
			 * </pre>
			 * @function
			 * @returns none.
			 */
			destroy: function() {
				var index,
					length;
				$(this.headerNode).remove();
				for (index = 0, length = this.cellNodes.length; index < length; index++) {
					$(this.cellNodes[index]).remove();
				}
				this._super();
			}
		});
	}
);
