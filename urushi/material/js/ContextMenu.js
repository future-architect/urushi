/**
 * @fileOverView ContextMenu class definition.
 * @author Yasuhiro Murata
 * @version 1.0
 */

/**
 * <pre>
 * It provides ContextMenu class as widget.
 * It has a menu icon and item list menu.
 * A menu icon is clicked, it show menu list.
 * Items are in menu, are clicked, it runs callback function.
 *
 * constructor arguments
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	additionalClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	items
 *		type			: array
 *		specification	: required
 *		default value	: N/A
 *		descriptoin		: item labels and callbacks.
 *	defaultCallback
 *		type			: function
 *		specification	: optional
 *		default value	: null
 *		descriptoin		: Callback function for the item is clicked and clicked item not have callback.
 *	bubbling
 *		type			: boolean
 *		specification	: optional
 *		default value	: false
 *		descriptoin		: Whether to bubble click event that fired when item is clicked or not.
 *	type
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: 特殊スタイルのコンテキストメニューを生成する。
 * </pre>
 * @example
 *	require(['ContextMenu'], function(ContextMenu) {
 *		var contextMenu = new ContextMenu({
 *			id: 'myContextMenu',
 *			additionalClass: '',
 *			items:[
 *				{
 *					id: 'item1',
 *					name: 'item1',
 *					label: 'label1',
 *					callback: function() {},
 *					icon: 'mdi-action-alarm'
 *				},
 *				{
 *					id: 'item2',
 *					name: 'item2',
 *					label: 'label2',
 *					callback: function() {},
 *					icon: 'mdi-action-backup'
 *				}
 *			],
 *			defaultCallback: function() {}
 *		});
 *		document.body.appendChild(contextMenu.getRootNode());
 *	});
 *
 * @snippet-trigger urushi-context-menu
 * @snippet-content	<select id="" data-urushi-type="contextmenu">
 *		<option id='item1' name='item1' class='icon-class'>label1</option>
 *		<option id='item2' name='item2' class='icon-class'>label2</option>
 *		<option id='item3' name='item3' class='icon-class'>label3</option>
 *	</select>
 * @snippet-description urushi-context-menu
 *
 * @module ContextMenu
 * @extends module:_CollectionWidgetBase
 * @requires jquery-2.1.1.js
 * @requires module:Urushi
 * @requires module:materialConfig
 * @requires module:_CollectionWidgetBase
 * @requires module:legacy
 * @requires module:animation
 * @requires contextMenu.html
 */
define(
	'ContextMenu',
	[
		'Urushi',
		'materialConfig',
		'_CollectionWidgetBase',
		'_ContextMenuItem',
		'legacy',
		'animation',
		'text!contextMenuTemplate'
	],
	/**
	 * @alias module:ContextMenu
	 * @returns {object} ContextMenu object.
	 */
	function(urushi, materialConfig, _CollectionWidgetBase, ContextMenuItem, legacy, animation, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:ContextMenu#CONSTANTS
		 * @type object
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi.context-menu',
			ITEM_ID_PREFIX: '.item',
			EMBEDDED: {contextMenuClass: '', additionalClass: ''},
			DURATION: 150,
			ITEMS_TRANSITION_DURATION: 150,
			ITEMS_LI_MARGIN: 20,
			MINIMUM_WIDTH: 100,
			CONTEXTMENU_WIDTH: 48,
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @member module:ContextMenu#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0;

		return _CollectionWidgetBase.extend({
			/**
			 * <pre>
			 * HTML template for Alert class.
			 * See ../template/contextMenu.html.
			 * </pre>
			 * @see {@link module:_Base}#template
			 * @type string
			 * @private
			 */
			template: undefined,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type object
			 * @constant
			 * @private
			 */
			embedded: undefined,
			/**
			 * <pre>
			 * Width of menu items.
			 * It adopts max width of li element node.
			 * </pre>
			 * @type string
			 * @private
			 */
			contentWidth: undefined,
			/**
			 * <pre>
			 * Callback function for items are clicked.
			 * When item callback function is not set, it is used.
			 * itemsのdefaultCallback
			 * </pre>
			 * @type function
			 * @private
			 */
			defaultCallback: undefined,
			/**
			 * <pre>
			 * Callback function for context menu icon click event.
			 * </pre>
			 * @type array
			 * @private
			 */
			onClickContextCallbacks: undefined,
			/**
			 * <pre>
			 * Arguments for item click callback function.
			 * </pre>
			 * @type array
			 * @private
			 */
			onClickItemCustomArgs: undefined,
			/**
			 * <pre>
			 * Whether bubbling contextMenu click event.
			 * </pre>
			 * @type boolean
			 * @private
			 */
			bubbling: undefined,
			/**
			 * TODO: 削除予定
			 * <pre>
			 * コンテキストメニューの特殊スタイルを管理する
			 * </pre>
			 * @type string
			 * @private
			 */
			type: undefined,
			/**
			 * <pre>
			 * Identifier for item.
			 * </pre>
			 * @type string
			 * @private
			 */
			itemIdNo: undefined,
			/**
			 * <pre>
			 * It manages the end of display animation of context menu.
			 * </pre>
			 * @type object
			 * @private
			 */
			animationDeferred: undefined,
			/**
			 * <pre>
			 * It manages the end of transform animation of close icon.
			 * </pre>
			 * @type Deferred
			 * @private
			 */
			closeIconAnimationDeferred: undefined,
			/**
			 * <pre>
			 * Initialize instance property.
			 * </pre>
			 * @function
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this._super(args);

				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.contentWidth = -1;
				this.onClickContextCallbacks = [];
				this.onClickItemCustomArgs = [];
				this.itemIdNo = 0;
				this.animationDeferred = undefined;
				this.defaultCallback = args.defaultCallback;
				this._setBubbling(args.bubbling);
			},
			/**
			 * <pre>
			 * Sets whether bubbling context menu click event or not.
			 * </pre>
			 * @function
			 * @private
			 * @param {boolean} is Bubbling or not.
			 * @returns none.
			 */
			_setBubbling: function(/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return;
				}
				this.bubbling = is;
			},
			/**
			 * <pre>
			 * Sets special style mode name.
			 * </pre>
			 * @function
			 * @private
			 * @param {string} type Special style mode name.
			 * @returns none.
			 */
			_setType: function(/* string */ type) {
				if ('grid' === type) {
					this.rootNode.classList.add('type-grid');
					this.type = 'grid';
				} else {
					this.rootNode.classList.remove('type-grid');
					this.type = undefined;
				}
			},
			/**
			 * <pre>
			 * It attaches callback functions for click events.
			 * The browser not support CSS3.0, it attaches callback function to mouseover events.
			 * </pre>
			 * @function
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				this._setType(args.type || false);

				this.itemsNode.tabIndex = -1;

				if (args.items) {
					this.addItems(args.items);
				}

				urushi.addEvent(this.contextMenuIconNode, 'click', this, 'onClickContext');
				urushi.addEvent(this.closeIconNode, 'click', this, 'onClickClose');
				urushi.addEvent(this.itemsNode, 'blur', this, 'onBlurContext');
			},
			/**
			 * <pre>
			 * Adds items to contextMenu.
			 * </pre>
			 * @function
			 * @params {Array} items Items are added.
			 * @returns none.
			 */
			addItems: function(/* Array */ items) {
				var index,
					length;

				if (!(items instanceof Array)) {
					return;
				}
				for (index = 0, length = items.length; index < length; index++) {
					items[index].callback = items[index].callback || this.defaultCallback;
					// TODO :村田くんにどうするか確認。
					// templateEngine利用時にcallbackの設定が出来ないため、
					// callbackがなくてもスルーする仕様にしている。
					// ここでエラー出すとtemplateEngineとかで生成できなくなっちゃう
					// if (!items[index].callback || 'function' !== typeof items[index].callback) {
					// 	throw new Error('addItems : callback mus');
					// }
					this._addItem(items[index]);
				}
				this._setContentWidth();
			},
			/**
			 * <pre>
			 * Returns item that is specified by argument.
			 * </pre>
			 * @function
			 * @params {string} name Item's name.
			 * @returns {object} item.
			 */
			getItem: function(/* string */ name) {
				return this.getSubItem(name);
			},
			/**
			 * <pre>
			 * Returns item list.
			 * </pre>
			 * @function
			 * @returns {array} item list.
			 */
			getItems: function() {
				return this.getSubItems();
			},
			/**
			 * <pre>
			 * Displays item that is specified by argument.
			 * Sets hide to otherwise.
			 * </pre>
			 * @function
			 * @param {string|array} itemName Item name(s).
			 * @returns none.
			 */
			setupShowItems: function(/* string|Array */ itemName) {
				var itemNames = itemName instanceof Array ? itemName : Array.prototype.slice.call(arguments),
					isShowTarget = function(itemName) {
						return itemNames.indexOf(itemName) > -1;
					},
					items = this.getItems(),
					index,
					length = items.length,
					item;

				for (index = 0; index < length; index++) {
					item = items[index];
					item.setHidden(!isShowTarget(item.id));
				}
			},
			/**
			 * <pre>
			 * It sets item(s) to hidden state, or to not hidden state.
			 * Specify the name of the item you want to change in state to the second and subsequent argument.
			 * </pre>
			 * @function
			 * @param {boolean} is Item's state that is hideen or not.
			 * @returns {boolean} It finished function normally or not.
			 */
			setHiddenItem: function(/* boolean */ is) {
				var itemNames = Array.prototype.slice.call(arguments, 1),
					index,
					item,
					length;

				if ('boolean' !== typeof is) {
					return false;
				}
				if (0 === itemNames.length) {
					itemNames = this.getSubItemIds();
				}
				for (index = 0, length = itemNames.length; index < length; index++) {
					item = this.getItem(itemNames[index]);
					if (!item) {
						continue;
					}

					item.setHidden(is);
				}

				return true;
			},
			/**
			 * <pre>
			 * Returns hidden state of specified item.
			 * </pre>
			 * @function
			 * @param {string} itemName Item's name.
			 * @returns {boolean} Item's state.
			 */
			isHiddenItem: function(/* string */ itemName) {
				var item = this.getItem(itemName);
				if (!item) {
					return undefined;
				}
				return item.isHidden();
			},
			/**
			 * <pre>
			 * Removes specified item from this.
			 * </pre>
			 * @function
			 * @param {string} itemId Item's identifier.
			 * @returns none.
			 */
			removeItems: function() {
				var itemNames = Array.prototype.slice.call(arguments),
					index,
					length,
					item;

				if (0 === itemNames.length) {
					itemNames = this.getSubItemIds();
				}
				for (index = 0, length = itemNames.length; index < length; index++) {
					item = this.getItem(itemNames[index]);
					if (!item) {
						continue;
					}

					item.destroy();
				}
			},
			/**
			 * <pre>
			 * Removes specified item from this.
			 * </pre>
			 * @function
			 * @private
			 * @param {string} itemId Item's identifier.
			 * @returns none.
			 */
			_removeItem: function(/* string */ itemName) {
				urushi.removeEvent(this.itemsMap[itemName].node, 'click', this, 'onClickItem');
				this.listNode.removeChild(this.itemsMap[itemName].node);
				delete this.itemsMap[itemName];
			},
			/**
			 * <pre>
			 * Adds a item to context menu.
			 * </pre>
			 * @function
			 * @private
			 * @params {object} item A item that is added to context menu.
			 * @returns none.
			 */
			_addItem: function(/* object */ item) {
				var itemArgs,
					menuItem;

				if (!item ||
						!item.hasOwnProperty('name') || !item.name ||
						!item.hasOwnProperty('label') || !item.label) {
					throw new Error('Item must have name and label.');
				}
				itemArgs = {
					owner: this,
					id: item.name,
					liId: item.liId,
					label: item.label,
					icon: item.icon,
					callback: item.callback,
				};
				menuItem = new ContextMenuItem(itemArgs);
				this.listNode.appendChild(menuItem.node);
			},
			/**
			 * <pre>
			 * It returns max width of items.
			 * Item widths are less than the constant minimum width,
			 * it returns constant minimumn width.
			 * </pre>
			 * @function
			 * @private
			 * @returns none
			 */
			_setContentWidth: function() {
				var index,
					length,
					item,
					items = this.getItems(),
					maxWidth = -1;

				for (index = 0, length = items.length; index < length; index++) {
					item = items[index];
					if (item.width > maxWidth) {
						maxWidth = item.width;
					}
				}
				this.contentWidth = maxWidth + CONSTANTS.ITEMS_LI_MARGIN * 2;
				this.contentWidth = Math.max(this.contentWidth, CONSTANTS.MINIMUM_WIDTH);
			},
			/**
			 * <pre>
			 * Sets callback function to item click event.
			 * </pre>
			 * @function
			 * @param {function} callback Callback function.
			 * @returns none.
			 */
			setCallback: function(/* function */ callback) {
				var index,
					length,
					item,
					itemNames = Array.prototype.slice.call(arguments).slice(1);

				if ('function' !== typeof callback) {
					return;
				}

				if (0 === itemNames.length) {
					itemNames = this.getSubItemIds();
				}
				for (index = 0, length = itemNames.length; index < length; index++) {
					item = this.getItem(itemNames[index]);
					if (!item) {
						continue;
					}

					item.setCallback(callback);
				}
			},
			/**
			 * <pre>
			 * item押下時にコールバック関数に対して渡す追加引数を初期値に戻す。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			clearOnClickItemCustomArgs: function() {
				this.onClickItemCustomArgs = [];
			},
			/**
			 * <pre>
			 * item押下時にコールバック関数に対して渡す追加引数を初期値に戻す。
			 * </pre>
			 * @function
			 * @param {any} arguments item押下時のコールバック関数に渡す引数。可変長引数のためいくつでも記載可。
			 * @returns none.
			 */
			addOnClickItemCustomArgs: function() {
				var index,
					length;
				for (index = 0, length = arguments.length; index < length; index++) {
					this.onClickItemCustomArgs.push(arguments[index]);
				}
			},
			/**
			 * <pre>
			 * MenuItemが削除されるタイミングを検知する
			 * </pre>
			 * @see {@link module:_collectionMixin}#_onRemoveSubItem
			 * @function
			 * @protected
			 * @param {_CollectionItemBase} item 削除される子_CollectionItemBase
			 * @returns none
			 */
			_onRemoveSubItem: function(/* _CollectionItemBase */ item) {
				this._setContentWidth();
			},
			/**
			 * <pre>
			 * Callback function for item click event.
			 * </pre>
			 * @function
			 * @param {object} item Item object.
			 * @returns none.
			 */
			onClickItem: function(/* object */ item) {
				var fnc,
					args = [],
					index,
					length;

				this._close();

				if ('function' !== typeof item.callback) {
					return;
				}
				args.push(item.id);
				for (index = 0, length = this.onClickItemCustomArgs.length; index < length; index++) {
					args.push(this.onClickItemCustomArgs[index]);
				}
				fnc = function() {
					item.callback.apply(this, args);
				};
				setTimeout(fnc, CONSTANTS.ITEMS_TRANSITION_DURATION);
			},
			/**
			 * <pre>
			 * Adds callback function that is called when context menu icon is clicked.
			 * </pre>
			 * @function
			 * @param {function} callback Callback function.
			 * @returns none.
			 */
			addOnClickContextCallback: function(/* function */ callback) {
				if ('function' !== typeof callback) {
					throw new Error('addOnClickContextCallback : Specify function.');
				}
				this.onClickContextCallbacks.push(callback);
			},
			/**
			 * <pre>
			 * Callback function for context menu icon click event.
			 * Opens item list with animation.
			 * </pre>
			 * @function
			 * @params {object} event Event object.
			 * @returns none.
			 */
			onClickContext: function(/* object */ event) {
				var items = this.listNode.childNodes,
					index,
					length,
					itemsHeight,
					closeIconWrapperHeight,
					height,
					show,
					displayTargets = [],
					delay = function(node) {
						return function() {
							node.classList.add('show');
						};
					},
					contextMenuSize;
				if (this.isDisabled()) {
					return;
				}
				if (this.disabled) {
					return;
				}
				for (index = 0, length = items.length; index < length; index++) {
					if (items[index].classList.contains('hidden')) {
						continue;
					}
					displayTargets.push(items[index]);
				}
				if (!displayTargets.length) {
					return;
				}

				if (!this.bubbling) {
					event.stopPropagation();
				}

				if (this.itemsNode.classList.contains('items-open')) {
					return;
				}

				this.itemsNode.tabIndex = 0;

				itemsHeight = length * displayTargets[0].offsetHeight;
				closeIconWrapperHeight = this.closeIconWrapperNode.offsetHeight;
				height = itemsHeight + closeIconWrapperHeight;
				this.itemsNode.style.maxHeight = height + 'px';
				this.itemsNode.style.minWidth = this.contentWidth + 'px';
				contextMenuSize = 'grid' === this.type ? 32 : CONSTANTS.CONTEXTMENU_WIDTH;
				this.itemsNode.style.right = (this.contentWidth - contextMenuSize) + 'px';

				this.itemsNode.classList.add('items-open');
				for (index = 0, length = displayTargets.length; index < length; index++) {
					show = delay(displayTargets[index]);
					setTimeout(show, CONSTANTS.ITEMS_TRANSITION_DURATION + 30 * index);
				}
				show = delay(this.closeIconNode);
				setTimeout(show, CONSTANTS.ITEMS_TRANSITION_DURATION + 30 * (displayTargets.length - 1));

				this.itemsNode.focus();
				for (index = 0, length = this.onClickContextCallbacks.length; index < length; index++) {
					this.onClickContextCallbacks[index](this);
				}
			},
			/**
			 * <pre>
			 * Close item list with animation.
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_close: function() {
				var items = this.listNode.childNodes,
					index,
					length = items.length;

				if (!this.itemsNode.classList.contains('items-open')) {
					return;
				}

				this.itemsNode.tabIndex = -1;
				this.itemsNode.classList.remove('items-open');
				for (index = 0; index < length; index++) {
					items[index].classList.remove('show');
				}
				this.closeIconNode.classList.remove('show');
			},
			/**
			 * <pre>
			 * Callback function for menu list blur event.
			 * </pre>
			 * @function
			 * @params {object} event Event object.
			 * @returns none.
			 */
			onBlurContext: function(/* object */ event) {
				event.stopPropagation();
				this._close();
			},
			/**
			 * <pre>
			 * Callback function for close icon click event.
			 * </pre>
			 * @function
			 * @params {object} event Event object.
			 * @returns none.
			 */
			onClickClose: function(/* object */ event) {
				event.stopPropagation();
				this._close();
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * contextMenuIconNode : Context menu icon element node.
			 * itemsNode : Root node of item element nodes and close icon.
			 * listNode : ul element node.
			 * closeIconWrapperNode : Wrapper element node of close icon element node.
			 * closeIconNode : Close icon element node.
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_attachNode: function() {
				this.contextMenuIconNode = this.rootNode.getElementsByClassName('context-menu')[0];
				this.itemsNode = this.rootNode.getElementsByClassName('items')[0];
				this.listNode = this.rootNode.getElementsByClassName('items-list')[0];
				this.closeIconWrapperNode = this.rootNode.getElementsByClassName('close-icon-wrapper')[0];
				this.closeIconNode = this.rootNode.getElementsByClassName('close-icon')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @private
			 * @returns {string} object's id.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Returns the identifier of a item.
			 * </pre>
			 * @function
			 * @private
			 * @returns {string} object's id.
			 */
			_getItemId: function() {
				return this.id + CONSTANTS.ITEM_ID_PREFIX + this.itemIdNo++;
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Remove callback function from element event.
			 * </pre>
			 * @function
			 * @returns none.
			 */
			destroy: function() {
				urushi.removeEvent(this.contextMenuIconNode, 'click', this, 'onClickContext');
				urushi.removeEvent(this.closeIconNode, 'click', this, 'onClickClose');
				urushi.removeEvent(this.itemsNode, 'blur', this, 'onBlurContext');

				this._super();
			}
		});
	}
);
