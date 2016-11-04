/**
 * @fileOverView Dropdown class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides DropDown class as widget.
 *
 * constructor arguments.
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
 *		specification	: optional
 *		default value	: null
 *		descriptoin		: Dropdown list items.
 * </pre>
 * @example
 *	require(['Dropdown'], function(Dropdown) {
 *		var dropdown = new Dropdown({
 *			id: 'myCheckbox',
 *			dropdownClass: 'dropdown-primary',
 *			additionalClass: ''
 *		});
 *		document.body.appendChild(dropdown.getRootNode());
 *	});
 *
 * @example
 *	<select id="myCheckbox" class="dropdown-primary" data-urushi-type="dropdown">
 *		<option value="1">label1</option>
 *		<option value="2">label2</option>
 *		<option value="3">label3</option>
 *	</select>
 *
 * @snippet-trigger urushi-dropdown
 * @snippet-content	<select id="" data-urushi-type="dropdown">
 *		<option value="1">label1</option>
 *		<option value="2">label2</option>
 *		<option value="3">label3</option>
 *	</select>
 * @snippet-description urushi-dropdown
 *
 * @module DropDown
 * @extends module:_Base
 * @requires jquery-2.1.1.js
 * @requires module:Urushi
 * @requires module:legacy
 * @requires module:materialConfig
 * @requires module:animation
 * @requires module:_Base
 * @requires dropDown.html
 */
define(
	'DropDown',
	[
		'jquery',
		'Urushi',
		'legacy',
		'materialConfig',
		'animation',
		'_Base',
		'text!dropDownTemplate'
	],
	/**
	 * @class
	 * @augments module:_Base
	 * @alias module:DropDown
	 * @returns {object} Dropdown instance.
	 */
	function($, urushi, legacy, materialConfig, animation, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi.DropDown',
			ID_PREFIX_ITEM: 'urushi.DropDown.item',
			EMBEDDED: {additionalClass: ''},
			TIMEOUT_TRIGGER: 10,
			LIST_PLACE_TOP_RIGHT: 'top-right',
			LIST_PLACE_BOTTOM_RIGHT: 'bottom-right',
			ATTRIBUTE_INPUT_ITEM_SELECTED_VALUE: 'data-value',
			ATTRIBUTE_UL_ITEM_SELECTED_ID: 'data-selected-id',
			ATTRIBUTE_LI_ITEM_VALUE: 'data-value',
			CLASS_ITEM_SELECTED: 'selected',
			MENULIST_MIN_WIDTH: 200,
		};

		/**
		 * <pre>
		 * Identifier suffix number for the dropDown.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		/**
		 * <pre>
		 * Identifier suffix number for dropdown items.
		 * </pre>
		 * @type number
		 */
		var itemIdNo = 0;

		return _Base.extend(/** @lends module:DropDown.prototype */ {
			/**
			 * <pre>
			 * HTML template for DropDown class.
			 * See ../template/dropDown.html.
			 * </pre>
			 * @type string
			 * @private
			 */
			template: undefined,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type object
			 * @private
			 */
			embedded: undefined,
			/**
			 * <pre>
			 * Dropdown menu is whether opend, or not.
			 * </pre>
			 * @type boolean
			 * @private
			 */
			opened: false,
			/**
			 * <pre>
			 * All of the dropdown items.
			 * The format is as follows.
			 * id : {label: '', value: '', node: node}
			 * </pre>
			 * @type object
			 * @private
			 */
			items: undefined,
			/**
			 * <pre>
			 * All of the dropdown items.
			 * The format is as follows.
			 * value : {label: '', value: '', node: node}
			 * </pre>
			 * @type object
			 * @private
			 */
			itemsByValue: undefined,
			/**
			 * <pre>
			 * Deferred object for animation.
			 * </pre>
			 * @type object
			 * @private
			 */
			animDeferred: undefined,
			/**
			 * <pre>
			 * Initializes instance properties.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.items = {};
				this.itemsByValue = {};
				this.opened = false;
				this.animDeferred = null;
			},
			/**
			 * <pre>
			 * Initializes dropdown items.
			 * Attaches callback function to dropdown events.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				if (args.items) {
					this.addItems(args.items);
				}

				urushi.addEvent(this.inputNode, 'click', this, '_onClickInput');
				urushi.addEvent(this.inputNode, 'focus', this, '_onClickInput');
				urushi.addEvent(this.inputNode, 'blur', this, '_onBlurInput');
				urushi.addEvent(this.inputNode, 'keydown', this, '_onKeydownInput');
				urushi.addEvent(this.listNode, 'mousedown', this, '_onMousedownList');

				this.listNode.classList.add('hidden');
			},
			/**
			 * <pre>
			 * Adds an item to dropdown.
			 * </pre>
			 * @protected
			 * @params item {object} An item.
			 * @returns none.
			 */
			_addItem: function(/* object */ item) {
				var li,
					label,
					value,
					id,
					_item;

				if (!item || !item.hasOwnProperty('value')) {
					return;
				}
				li = document.createElement('li');
				id = li.id = this._getItemId();
				label = item.label || '';
				li.textContent = item.label || '\u00a0';//\u00a0 = &nbsp;
				li.className = item.class || '';
				value = item.value;
				li.setAttribute(CONSTANTS.ATTRIBUTE_LI_ITEM_VALUE, item.value);
				urushi.addEvent(li, 'click', this, '_onSelectItem', {target: li});

				this.listNode.appendChild(li);

				_item = {label: label, value: value, node: li};
				this.items[id] = _item;
				this.itemsByValue[value] = _item;
				
				if (item.selected) {
					this._onSelect(li);
				}
			},
			/**
			 * <pre>
			 * Adds items to dropdown.
			 * </pre>
			 * @example
			 *	var item = {
			 *		value: 'selected value', // require
			 *		label: 'item label', // recommend
			 *		class: 'optional-class', / option
			 *	};
			 *	dropdown.addItems([item]);
			 * @params items {array} Items.
			 * @returns none.
			 */
			addItems: function(/* array */ items) {
				var index, length;

				if (!(items instanceof Array)) {
					return;
				}
				for (index = 0, length = items.length; index < length; index++) {
					this._addItem(items[index]);
				}
			},
			/**
			 * <pre>
			 * Removes an item.
			 * </pre>
			 * @params value {string} Item value.
			 * @returns none.
			 */
			removeItem: function(/* string */ value) {
				var _item = this.itemsByValue[value],
					id,
					li,
					sel;
				if (!_item) {
					return;
				}
				sel = this.getSelectedItem();

				li = _item.node;
				id = li.id;

				urushi.removeEvent(li, 'click', this, '_onSelectItem');

				this.listNode.removeChild(li);
				delete this.items[id];
				delete this.itemsByValue[value];

				// Removes selected item.
				if ((sel === _item) && (this.listNode.childNodes.length > 0)) {
					this._onSelect(this.listNode.childNodes[0]);
				}
			},
			/**
			 * <pre>
			 * Removes all items.
			 * </pre>
			 * @returns none.
			 */
			removeAllItems: function() {
				var value;
				for (value in this.itemsByValue) {
					this.removeItem(value);
				}
			},
			/**
			 * <pre>
			 * Common processing at the time of item is clicked.
			 * </pre>
			 * @protected
			 * @param {node} target Selected element node.
			 * @returns none.
			 */
			_onSelect: function(/* node */ target) {
				var id = target.id,
					item = this.items[id];

				target.classList.add(CONSTANTS.CLASS_ITEM_SELECTED);
				this.listNode.setAttribute(CONSTANTS.ATTRIBUTE_UL_ITEM_SELECTED_ID, id);
				this.inputNode.value = item.label;
				this.inputNode.setAttribute(CONSTANTS.ATTRIBUTE_INPUT_ITEM_SELECTED_VALUE, item.value);
			},
			/**
			 * <pre>
			 * Callback function that is called when item is clicked.
			 * </pre>
			 * @protected
			 * @params {object} args Clicked item.
			 * @params {object} event Event object.
			 * @returns none.
			 */
			_onSelectItem: function(/* object */ args, /* object */ event) {
				var target = args.target;

				this.onSelect(target);
				this._closeDropDownMenu();
			},
			/**
			 * <pre>
			 * Common processing at the time of item is selected.
			 * </pre>
			 * @params {node} target Element node to be selected.
			 * @returns none.
			 */
			onSelect: function(/* node */ target) {
				this.clearSelected();
				this._onSelect(target);
			},
			/**
			 * <pre>
			 * Changes selected item.
			 * </pre>
			 * @params {any} value Item's value
			 * @returns none.
			 */
			setSelected: function(/* any */ value) {
				var item = this.itemsByValue[value];

				if (!item) {
					return;
				}
				this.onSelect(item.node);
			},
			/**
			 * <pre>
			 * Returns selected item.
			 * </pre>
			 * @returns {object} Selected item.
			 */
			getSelectedItem: function() {
				return this.items[this.listNode.getAttribute(CONSTANTS.ATTRIBUTE_UL_ITEM_SELECTED_ID) || ''];
			},
			/**
			 * <pre>
			 * Returns selected item element node.
			 * </pre>
			 * @returns {node} Selected item element node.
			 */
			getSelectedNode: function() {
				var item = this.getSelectedItem();
				return item ? item.node : undefined;
			},
			/**
			 * <pre>
			 * Returns selected item value.
			 * </pre>
			 * @returns {any} Item value.
			 */
			getSelectedValue: function() {
				var item = this.getSelectedItem();
				return item ? item.value : undefined;
			},
			/**
			 * <pre>
			 * Clears dropdown selected status.
			 * </pre>
			 * @returns none.
			 */
			clearSelected: function() {
				var selectedNodes = this.listNode.getElementsByClassName(CONSTANTS.CLASS_ITEM_SELECTED),
					selected = Array.prototype.slice.call(selectedNodes),
					index,
					length;

				for (index = 0, length = selected.length; index < length; index++) {
					selected[index].classList.remove(CONSTANTS.CLASS_ITEM_SELECTED);
				}
			},
			/**
			 * <pre>
			 * Callback function for dropdown mousedown event.
			 * </pre>
			 * @protected
			 * @params {object} event Event object.
			 * @returns none.
			 */
			_onMousedownList: function(/* object */ event) {
				event.preventDefault();

				this.cancelBlur = true;
				setTimeout(function() {
					delete this.cancelBlur;
					this.inputNode.focus();
				}.bind(this), 1);
			},
			/**
			 * <pre>
			 * Callback function for input click event.
			 * </pre>
			 * @protected
			 * @params {object} event Event object.
			 * @returns none.
			 */
			_onClickInput: function(/* object */ event) {
				var items = this.listNode.childNodes,
					length = items.length,
					dropDownHeight,
					inputNodeHeight,
					inputNodeTop,
					height,
					maxHeight;

				if (this.inputNode.getAttribute('disabled') || this.readonly) {
					return;
				}
				if (!length) {
					return;
				}
				if (this.opened) {
					return;
				}

				this.listNode.classList.remove('hidden');

				dropDownHeight = length * $(items[0]).outerHeight();
				inputNodeHeight = $(this.inputNode).outerHeight();
				inputNodeTop = $(this.inputNode).offset().top;
				maxHeight = window.innerHeight / 2 - inputNodeHeight;

				if (dropDownHeight < maxHeight) {
					this.listNode.classList.remove('scroll');

					height = dropDownHeight;
				} else {
					this.listNode.classList.add('scroll');

					height = maxHeight;
				}

				if ((inputNodeTop + height + inputNodeHeight) < $(document).scrollTop() + window.innerHeight) {
					this.listNode.setAttribute('data-placement', CONSTANTS.LIST_PLACE_TOP_RIGHT);
				} else {
					this.listNode.setAttribute('data-placement', CONSTANTS.LIST_PLACE_BOTTOM_RIGHT);
				}
				this.listNode.style.maxHeight = height + 'px';

				this._openDropDownMenu(height);
			},
			/**
			 * <pre>
			 * Callback function for input blur event.
			 * </pre>
			 * @protected
			 * @params {object} event Event object.
			 * @returns none.
			 */
			_onBlurInput: function(event) {
				if (this.cancelBlur) {
					delete this.cancelBlur;
					return;
				}

				this._closeDropDownMenu();
			},
			/**
			 * <pre>
			 * Callback function for keydown event.
			 * </pre>
			 * @protected
			 * @params {object} event Event object.
			 * @returns none.
			 */
			_onKeydownInput: function(event) {
				var keyCode = urushi.getKeyCode(event),
					pageOffset;
				if (this.opened) {
					if (keyCode === urushi.KEYCODE.ENTER) {
						this._onBlurInput(event);
						event.stopPropagation();
					} else if (keyCode === urushi.KEYCODE.ESCAPE) {
						this._onBlurInput(event);
						event.stopPropagation();
					} else if (keyCode === urushi.KEYCODE.UP) {
						this._moveDisplayItems(-1, this.listNode.childNodes.length - 1, 0); // Selects previous item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === urushi.KEYCODE.DOWN) {
						this._moveDisplayItems(1, 0, this.listNode.childNodes.length - 1); // Selects next item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === urushi.KEYCODE.HOME) {
						this._moveSelection(0); // Selects first item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === urushi.KEYCODE.END) {
						this._moveSelection(this.listNode.childNodes.length - 1); // Selects last item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === urushi.KEYCODE.PAGE_UP) {
						pageOffset = Math.floor(this.listNode.offsetHeight / this.listNode.childNodes[0].offsetHeight);
						this._moveDisplayItems(-pageOffset, this.listNode.childNodes.length - 1, 0); // Shows previous items.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === urushi.KEYCODE.PAGE_DOWN) {
						pageOffset = Math.floor(this.listNode.offsetHeight / this.listNode.childNodes[0].offsetHeight);
						this._moveDisplayItems(pageOffset, 0, this.listNode.childNodes.length - 1); // Shows next items.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					}
				} else {
					if ([
						urushi.KEYCODE.ENTER,
						urushi.KEYCODE.SPACE,
						urushi.KEYCODE.UP,
						urushi.KEYCODE.DOWN
					].indexOf(keyCode) > -1) {
						this._onClickInput(event);
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					}
				}
			},
			/**
			 * <pre>
			 * Moves display items.
			 * </pre>
			 * @protected
			 * @params {number} distance Moving distance that count on the number of items.
			 * @params {number} initial Item to be displayed at the top when Item isn't selected.
			 * @params {number} overInitial Item to be displayed at the top when Display item is over the menu list.
			 * @returns none.
			 */
			_moveDisplayItems: function(/* number */ distance, /* number */ initial, /* number */ overInitial) {
				var prevNode,
					prevIndex = NaN,
					nextIndex;
				prevNode = this.getSelectedNode();
				if (prevNode) {
					prevIndex = Array.prototype.slice.apply(this.listNode.childNodes).indexOf(prevNode);
					nextIndex = prevIndex + distance;
					if (nextIndex < 0 || this.listNode.childNodes.length <= nextIndex) {
						nextIndex = overInitial;
					}
				} else {
					nextIndex = initial;
				}
				this._moveSelection(nextIndex);
			},
			/**
			 * <pre>
			 * Moves select states of item.
			 * </pre>
			 * @protected
			 * @params {number} index index of item.
			 * @returns none.
			 */
			_moveSelection: function(/* number */ nextIndex) {
				var prevNode,
					prevIndex = NaN,
					nextNode;

				prevNode = this.getSelectedNode();
				if (prevNode) {
					prevIndex = Array.prototype.slice.apply(this.listNode.childNodes).indexOf(prevNode);
				}
				if (prevIndex === nextIndex) {
					return;//変更なし
				}
				nextNode = this.listNode.childNodes[nextIndex];
				this.onSelect(nextNode);

				this._makeVisibleItem(nextNode);
			},
			/**
			 * <pre>
			 * Displays item on menu with scroll.
			 * </pre>
			 * @protected
			 * @params {node} target Item element node.
			 * @returns none.
			 */
			_makeVisibleItem: function(/* node */ target) {
				if (!this.listNode.classList.contains('scroll')) {
					return;
				}
				if ((this.listNode.scrollTop + this.listNode.offsetHeight) < (target.offsetTop + target.offsetHeight)) {
					this._setScrollVisibleBottom(target);
				} else if (this.listNode.scrollTop > target.offsetTop) {
					this._setScrollVisibleTop(target);
				}
			},
			/**
			 * <pre>
			 * Adjusts the initial scroll position.
			 * </pre>
			 * @protected
			 * @params {node} target Item element node.
			 * @returns none.
			 */
			_makeVisibleItemForInit: function(/* node */ target) {
				if (!target || !this.listNode.classList.contains('scroll')) {
					return;
				}

				if (this.listNode.getAttribute('data-placement') === CONSTANTS.LIST_PLACE_TOP_RIGHT) {
					this._setScrollVisibleTop(target);
				} else {
					this._setScrollVisibleBottom(target);
				}
			},
			/**
			 * <pre>
			 * Moves the specified item at the top of the scroll of menu.
			 * </pre>
			 * @protected
			 * @params {node} target Item element node.
			 * @returns none.
			 */
			_setScrollVisibleTop: function(/* node */ target) {
				this.listNode.scrollTop = target.offsetTop;
			},
			/**
			 * <pre>
			 * Moves the specified item at the bottom of the scroll of menu.
			 * </pre>
			 * @protected
			 * @params {node} target Item element node.
			 * @returns none.
			 */
			_setScrollVisibleBottom: function(/* node */ target) {
				this.listNode.scrollTop = target.offsetTop + target.offsetHeight - this.listNode.offsetHeight;
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * mainNode : Child of wrapper element node.
			 * inputNode : Input.
			 * listNode : Dropdown menu list element node.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode: function() {
				this.mainNode = this.rootNode.getElementsByClassName('dropdown')[0];
				this.inputNode = this.rootNode.getElementsByTagName('input')[0];
				this.listNode = this.rootNode.getElementsByTagName('ul')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @protected
			 * @returns {string} Instance id.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Returns identifier for menu items.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_getItemId: function() {
				return CONSTANTS.ID_PREFIX_ITEM + itemIdNo++;
			},
			/**
			 * <pre>
			 * Opens dropdown menu.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_openDropDownMenu: function(/* number */ height) {
				var liWidth,
					liHeight,
					select,
					startWidth,
					startHeight,
					startOpacity;
				if (this.opened) {
					return;
				}
				this.inputNode.classList.add('focus');

				liWidth = Math.max($(this.mainNode).parent().width(), CONSTANTS.MENULIST_MIN_WIDTH);
				liHeight = $(this.listNode.childNodes[0]).outerHeight();

				$(this.listNode).find('li').css({
					width: liWidth,
					height: liHeight,
				});
				this.listNode.style.minWidth = 0;

				this.listNode.classList.remove('hidden');

				if (this.animDeferred) {
					this.animDeferred.cancel();
					startWidth = this.listNode.offsetWidth;
					startHeight = this.listNode.offsetHeight;
					startOpacity = this.listNode.style.opacity;
				} else {
					this.listNode.style.width = 0;
					this.listNode.style.height = 0;
					startWidth = 0;
					startHeight = 0;
					startOpacity = 0;
				}
				select = this.getSelectedNode();
				this.animDeferred = animation.animate(
					materialConfig.DEFAULT_VALUE_DURATION,
					function(p) {
						this.listNode.style.width = animation.calcPoint(startWidth, liWidth, p) + 'px';
						this.listNode.style.height = animation.calcPoint(startHeight, height, p) + 'px';
						this.listNode.style.opacity = animation.calcPoint(startOpacity, 1, p);
						this._makeVisibleItemForInit(select);
					}.bind(this)
				).then(function() {
					this.listNode.style.minWidth = '';
					this._makeVisibleItemForInit(select);
					this.animDeferred = null;
				}.bind(this));

				this.opened = true;
			},
			/**
			 * <pre>
			 * closes dropdown menu.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_closeDropDownMenu: function() {
				var startWidth,
					startHeight,
					startOpacity;

				this.listNode.style.minWidth = 0;
				if (this.animDeferred) {
					this.animDeferred.cancel();
				}

				startWidth = this.listNode.offsetWidth;
				startHeight = this.listNode.offsetHeight;
				startOpacity = this.listNode.style.opacity;
				this.animDeferred = animation.animate(
					materialConfig.DEFAULT_VALUE_DURATION,
					function(p) {
						this.listNode.style.width = animation.calcPoint(startWidth, 0, p) + 'px';
						this.listNode.style.height = animation.calcPoint(startHeight, 0, p) + 'px';
						this.listNode.style.opacity = animation.calcPoint(startOpacity, 0, p);
					}.bind(this)
				).then(function() {
					this.listNode.classList.add('hidden');
					this.inputNode.classList.remove('focus');
					this.animDeferred = null;
				}.bind(this));
				this.opened = false;
			},
			/**
			 * <pre>
			 * Disable or enable instance.
			 * </pre>
			 * @param {boolean} is True is disabled, false is enabled.
			 * @returns {boolean} It finished normally, returns true.
			 */
			setDisabled: function(/* boolean */ is) {
				if (!this._super(is)) {
					return false;
				}

				if (is) {
					this.inputNode.setAttribute('tabIndex', '-1');
					this.inputNode.setAttribute('disabled', true);
				} else {
					this.inputNode.removeAttribute('tabIndex');
					this.inputNode.removeAttribute('disabled');
				}
				return true;
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete callback functions.
			 * </pre>
			 * @returns none
			 */
			destroy: function() {
				var items = this.listNode.childNodes,
					index,
					length = items.length,
					li;

				urushi.removeEvent(this.inputNode, 'click', this, '_onClickInput');
				urushi.removeEvent(this.inputNode, 'focus', this, '_onClickInput');
				urushi.removeEvent(this.inputNode, 'blur', this, '_onBlurInput');
				urushi.removeEvent(this.inputNode, 'keydown', this, '_onKeydownInput');

				urushi.removeEvent(this.listNode, 'mousedown', this, '_onMousedownList');

				for (index = 0; index < length; index++) {
					li = items[index];
					urushi.removeEvent(li, 'click', this, '_onSelectItem');
				}

				this._super();
			}
		});
	}
);
