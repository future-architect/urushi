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
 *		let dropdown = new Dropdown({
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
 * @requires module:legacy
 * @requires module:event
 * @requires module:browser
 * @requires module:_Base
 * @requires dropDown.html
 */
define(
	'DropDown',
	[
		'legacy',
		'event',
		'browser',
		'_Base',
		'text!dropDownTemplate'
	],
	/**
	 * @class
	 * @augments module:_Base
	 * @alias module:DropDown
	 * @returns {object} Dropdown instance.
	 */
	function(legacy, event, browser, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		const ID_PREFIX = 'urushi.DropDown';
		const ID_PREFIX_ITEM = 'urushi.DropDown.item';
		const EMBEDDED = {};
		const LIST_PLACE_TOP_RIGHT = 'top-right';
		const LIST_PLACE_BOTTOM_RIGHT = 'bottom-right';
		const ATTRIBUTE_INPUT_ITEM_SELECTED_VALUE = 'data-value';
		const ATTRIBUTE_UL_ITEM_SELECTED_ID = 'data-selected-id';
		const ATTRIBUTE_LI_ITEM_VALUE = 'data-value';
		const CLASS_ITEM_SELECTED = 'selected';
		const MENULIST_MIN_WIDTH = 200;

		/**
		 * <pre>
		 * Identifier suffix number for the dropDown.
		 * </pre>
		 * @type number
		 */
		let idNo = 0;

		/**
		 * <pre>
		 * Identifier suffix number for dropdown items.
		 * </pre>
		 * @type number
		 */
		let itemIdNo = 0;

		return _Base.extend(/** @lends module:DropDown.prototype */ {
			/**
			 * <pre>
			 * HTML template for DropDown class.
			 * See ../template/dropDown.html.
			 * </pre>
			 * @type string
			 * @private
			 */
			template: template,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type object
			 * @private
			 */
			embedded: EMBEDDED,
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
			 * TemplateEngineで検出されたElementから、
			 * インスタンス化に必要な定義を抽出する。
			 * </pre>
			 * @protected
			 * @param {Element} element 置換対象のエレメント。
			 * @returns none.
			 */
			_parse: function(/* Element */ element) {
				let option = this._super(element),
					children = element.children,
					items = [],
					item,
					index,
					length;

				for (index = 0, length = children.length; index < length; index++) {
					item = {};

					item.label = (children[index].textContent || '').trim();
					item.value = children[index].value || '';

					items.push(item);
				}
				option.items = items;

				return option;
			},
			/**
			 * <pre>
			 * Initializes instance properties.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this._super(args);

				this.items = {};
				this.itemsByValue = {};
				this.opened = false;
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

				event.addEvent(this.inputNode, 'click', this._onClickInput.bind(this));
				event.addEvent(this.inputNode, 'focus', this._onClickInput.bind(this));
				event.addEvent(this.inputNode, 'blur', this._onBlurInput.bind(this));
				event.addEvent(this.inputNode, 'keydown', this._onKeydownInput.bind(this));
				event.addEvent(this.listNode, 'mousedown', this._onMousedownList.bind(this));

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
				let li,
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
				li.setAttribute(ATTRIBUTE_LI_ITEM_VALUE, item.value);
				event.addEvent(li, 'click', this._onSelectItem.bind(this, {target: li}));

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
			 *	let item = {
			 *		value: 'selected value', // require
			 *		label: 'item label', // recommend
			 *		class: 'optional-class', / option
			 *	};
			 *	dropdown.addItems([item]);
			 * @params items {array} Items.
			 * @returns none.
			 */
			addItems: function(/* array */ items) {
				let index, length;

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
				let _item = this.itemsByValue[value],
					id,
					li,
					sel;
				if (!_item) {
					return;
				}
				sel = this.getSelectedItem();

				li = _item.node;
				id = li.id;

				event.removeEvent(li, 'click');

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
				let value;
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
				let id = target.id,
					item = this.items[id];

				target.classList.add(CLASS_ITEM_SELECTED);
				this.listNode.setAttribute(ATTRIBUTE_UL_ITEM_SELECTED_ID, id);
				this.inputNode.value = item.label;
				this.inputNode.setAttribute(ATTRIBUTE_INPUT_ITEM_SELECTED_VALUE, item.value);
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
				let target = args.target;

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
				let item = this.itemsByValue[value];

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
				return this.items[this.listNode.getAttribute(ATTRIBUTE_UL_ITEM_SELECTED_ID) || ''];
			},
			/**
			 * <pre>
			 * Returns selected item element node.
			 * </pre>
			 * @returns {node} Selected item element node.
			 */
			getSelectedNode: function() {
				let item = this.getSelectedItem();
				return item ? item.node : undefined;
			},
			/**
			 * <pre>
			 * Returns selected item value.
			 * </pre>
			 * @returns {any} Item value.
			 */
			getSelectedValue: function() {
				let item = this.getSelectedItem();
				return item ? item.value : undefined;
			},
			/**
			 * <pre>
			 * Clears dropdown selected status.
			 * </pre>
			 * @returns none.
			 */
			clearSelected: function() {
				let selectedNodes = this.listNode.getElementsByClassName(CLASS_ITEM_SELECTED),
					selected = Array.prototype.slice.call(selectedNodes),
					index,
					length;

				for (index = 0, length = selected.length; index < length; index++) {
					selected[index].classList.remove(CLASS_ITEM_SELECTED);
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
				console.log('_onMousedownList', event);
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
				let items = this.listNode.childNodes,
					length = items.length,
					dropDownHeight,
					inputNodeHeight,
					inputNodeTop,
					height,
					maxHeight;

				console.log('_onClickInput', event);

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

				dropDownHeight = length * items[0].offsetHeight;
				inputNodeHeight = this.inputNode.offsetHeight;
				inputNodeTop = window.pageYOffset + this.inputNode.getBoundingClientRect().top;
				maxHeight = window.innerHeight / 2 - inputNodeHeight;

				if (dropDownHeight < maxHeight) {
					this.listNode.classList.remove('scroll');

					height = dropDownHeight;
				} else {
					this.listNode.classList.add('scroll');

					height = maxHeight;
				}

				if ((inputNodeTop + height + inputNodeHeight) < document.body.scrollTop + window.innerHeight) {
					this.listNode.setAttribute('data-placement', LIST_PLACE_TOP_RIGHT);
				} else {
					this.listNode.setAttribute('data-placement', LIST_PLACE_BOTTOM_RIGHT);
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
				console.log('_onBlurInput', event, 'this.cancelBlur', this.cancelBlur);
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
				let keyCode = browser.getKeyCode(event),
					pageOffset;
				console.log('_onKeydownInput', event, 'keyCode', keyCode, 'this.opened', this.opened);
				if (this.opened) {
					if (keyCode === browser.KEYCODE.ENTER) {
						this._onBlurInput(event);
						event.stopPropagation();
					} else if (keyCode === browser.KEYCODE.ESCAPE) {
						this._onBlurInput(event);
						event.stopPropagation();
					} else if (keyCode === browser.KEYCODE.UP) {
						this._moveDisplayItems(-1, this.listNode.childNodes.length - 1, 0); // Selects previous item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === browser.KEYCODE.DOWN) {
						this._moveDisplayItems(1, 0, this.listNode.childNodes.length - 1); // Selects next item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === browser.KEYCODE.HOME) {
						this._moveSelection(0); // Selects first item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === browser.KEYCODE.END) {
						this._moveSelection(this.listNode.childNodes.length - 1); // Selects last item.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === browser.KEYCODE.PAGE_UP) {
						pageOffset = Math.floor(this.listNode.offsetHeight / this.listNode.childNodes[0].offsetHeight);
						this._moveDisplayItems(-pageOffset, this.listNode.childNodes.length - 1, 0); // Shows previous items.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					} else if (keyCode === browser.KEYCODE.PAGE_DOWN) {
						pageOffset = Math.floor(this.listNode.offsetHeight / this.listNode.childNodes[0].offsetHeight);
						this._moveDisplayItems(pageOffset, 0, this.listNode.childNodes.length - 1); // Shows next items.
						event.stopPropagation();
						event.preventDefault(); // Stops the browser scrolling.
					}
				} else {
					if ([
						browser.KEYCODE.ENTER,
						browser.KEYCODE.SPACE,
						browser.KEYCODE.UP,
						browser.KEYCODE.DOWN
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
				let prevNode,
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
				let prevNode,
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

				if (this.listNode.getAttribute('data-placement') === LIST_PLACE_TOP_RIGHT) {
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
				return ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Returns identifier for menu items.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_getItemId: function() {
				return ID_PREFIX_ITEM + itemIdNo++;
			},
			/**
			 * <pre>
			 * Opens dropdown menu.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_openDropDownMenu: function(/* number */ height) {
				let liWidth,
					liHeight,
					liList, i;

				if (this.opened) {
					return;
				}

				liWidth = Math.max(this.mainNode.parentNode.offsetWidth, MENULIST_MIN_WIDTH);
				liHeight = this.listNode.childNodes[0].offsetHight;

				liList = this.listNode.getElementsByClassName('li');
				for (i = 0; i < liList.length; i++) {
					liList[i].style.width = liWidth + 'px';
					liList[i].style.height = liHeight + 'px';
				}
				this.listNode.style.minWidth = 0;

				this.inputNode.classList.add('focus');

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
				this.inputNode.classList.remove('focus');

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
				let items = this.listNode.childNodes,
					index,
					length = items.length,
					li;

				event.removeEvent(this.inputNode, 'click');
				event.removeEvent(this.inputNode, 'focus');
				event.removeEvent(this.inputNode, 'blur');
				event.removeEvent(this.inputNode, 'keydown');

				event.removeEvent(this.listNode, 'mousedown');

				for (index = 0; index < length; index++) {
					li = items[index];
					event.removeEvent(li, 'click');
				}

				this._super();
			}
		});
	}
);
