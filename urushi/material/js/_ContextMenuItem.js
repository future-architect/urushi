/**
 * @fileOverView _ContextMenuItem definition.
 * @author ota
 * @version 1.0
 */

/**
 * <pre>
 * Class of context menu item.
 *
 * constructor arguments.
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	owner
 *		type			: object
 *		specification	: required
 *		descriptoin		: ContextMenu instance, is the parent.
 *	label
 *		type			: string
 *		specification	: required
 *		descriptoin		: Item label
 *	icon
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Icon style class of item.
 *	callback
 *		type			: function
 *		specification	: required
 *		descriptoin		: Callback function that is called when item is clicked.
 * </pre>
 *
 * @module _ContextMenuItem
 * @extends module:_CollectionItemBase
 * @requires urushi
 * @requires module:_CollectionItemBase
 */
define(
	'_ContextMenuItem',
	[
		'Urushi',
		'_CollectionItemBase',
	],
	/**
	 * @alias module:_ContextMenuItem
	 * @returns {Object} _ContextMenuItem object.
	 */
	function (urushi, _CollectionItemBase) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:_ContextMenuItem#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi._contextMenuItem',
			LI_ID_PREFIX : 'urushi._contextMenuItem.li',
			ITEM_FONT_SIZE : 18,
			ICON_MARGIN_RIGHT : 16,
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @member module:_ContextMenuItem#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0;
		/**
		 * <pre>
		 * Identifier suffix number of list item.
		 * </pre>
		 * @member module:_ContextMenuItem#idNo
		 * @type number
		 * @private
		 */
		var liIdNo = 0;

		return _CollectionItemBase.extend({
			/**
			 * <pre>
			 * Element node of menu item.
			 * </pre>
			 * @type node
			 * @private
			 */
			node : undefined,
			/**
			 * <pre>
			 * Width of label.
			 * </pre>
			 * @type number
			 * @private
			 */
			width : 0,
			/**
			 * <pre>
			 * Calback function for list item is clicked.
			 * </pre>
			 * @type function
			 * @private
			 */
			callback : undefined,
			/**
			 * <pre>
			 * Constructor.
			 * Append callback function to element node, is menu item.
			 * </pre>
			 * @function
			 * @override
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			init : function (/* object */ args) {
				args = args || {};
				this._super(args);

				urushi.addEvent(this.node, 'click', this, 'onClickItem');
			},
			/**
			 * <pre>
			 * Part of constructor.
			 * </pre>
			 * @function
			 * @override
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties : function (/* object */ args) {
				this._super(args);
				this.callback = args.callback;
			},
			/**
			 * <pre>
			 * Part of constructor.
			 * It creates element node, is the menu item.
			 * When specified icon class, It creates the element node whitch is icon.
			 * </pre>
			 * @function
			 * @override
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none
			 */
			_render : function (/* object */ args) {
				var li,
					span,
					label,
					icon;
				li = document.createElement('li');
				span = document.createElement('span');
				li.id = args.liId || this._getListItemId();
				label = args.label || '';
				urushi.setDomContents(span, label || '\u00a0');//\u00a0 = &nbsp;
				span.classList.add('label');

				this.width = this._getLabelWidth(label);

				if (args.icon) {
					icon = document.createElement('span');
					icon.classList.add(args.icon);
					icon.classList.add('icon');
					li.appendChild(icon);
					this.width = this.width + CONSTANTS.ITEM_FONT_SIZE + CONSTANTS.ICON_MARGIN_RIGHT;
				}

				li.classList.add('item');
				li.appendChild(span);
				this.node = li;
			},
			/**
			 * <pre>
			 * Set callback function for list item is clicked.
			 * </pre>
			 * @function
			 * @private
			 * @param {function} callback Callback function.
			 * @returns none.
			 */
			setCallback : function (/* function */ callback) {
				if ('function' !== typeof callback) {
					throw new Error('setCallback : Specifiy function');
				}
				this.callback = callback;
			},
			/**
			 * <pre>
			 * Wrapper of callback function for menu item is clicked.
			 * </pre>
			 * @function
			 * @param {object} event Event object.
			 * @returns none.
			 */
			onClickItem : function (/* object */ event) {
				event.stopPropagation();
				this.owner.onClickItem(this);
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @override
			 * @protected
			 * @returns {string} object's id.
			 */
			_getId : function () {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * It returns identifier of list item.
			 * </pre>
			 * @function
			 * @private
			 * @returns {string} object's id.
			 */
			_getListItemId : function () {
				return CONSTANTS.LI_ID_PREFIX + liIdNo++;
			},
			/**
			 * <pre>
			 * It returns width of menu item.
			 * The menu item width is defined by menu item label width.
			 * </pre>
			 * @function
			 * @private
			 * @params {string} label Menu item label
			 * @returns {number} width Width of men item.
			 */
			_getLabelWidth : function (/* string */ label) {
				var $body = $(document.body),
					$dummyWrapper = $('<div>'),
					$dummy = $('<span>'),
					width;

				$dummy.text('&nbsp;');

				$dummyWrapper.css({
					position : 'absolute',
					top : 0,
					left : 0,
					width : 9999,
					'z-index' : -1
				});
				$dummy.text(label);
				$dummy.css({
					'background-color' : 'transparent',
					'font-size' : CONSTANTS.ITEM_FONT_SIZE + 'px',
				});
				$body.append($dummyWrapper.append($dummy));

				width = $dummy.width();

				$dummy.remove();
				$dummyWrapper.remove();
				return width;
			},
			/**
			 * <pre>
			 * Hide and be unavailable the menu item.
			 * or show and be available the menu item.
			 * </pre>
			 * @function
			 * @param {boolean} is True is hidden, false is shown.
			 * @returns {boolean} It finished normally, returns true.
			 */
			setHidden : function (/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return false;
				}
				if (is) {
					this.node.classList.add('hidden');
				} else {
					this.node.classList.remove('hidden');
				}
				return true;
			},
			/**
			 * <pre>
			 * Returns whether the menu item is hidden or not.
			 * </pre>
			 * @function
			 * @returns {boolean} Whether the menu item is hidden or not.
			 */
			isHidden : function () {
				return this.node.classList.contains('hidden');
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * </pre>
			 * @function
			 * @returns none.
			 */
			destroy : function () {
				urushi.removeEvent(this.node, 'click', this, 'onClickItem');
				$(this.node).remove();

				this._super();
			}
		});
	}
);
