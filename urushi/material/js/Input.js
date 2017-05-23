/**
 * @fileOverView Input class definition.
 * @author Yuzo Hirakawa
 * @version b1.0
 */

/**
 * <pre>
 * Provides Input class as widget.
 *
 * constructor arguments.
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	inputClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of input widget. For the theme color, read test/input/index.html.
 *	additionalClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	placeholder
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Input placeholder.
 *	hint
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Hint message for input. It is displayed at the bottom of input.
 * </pre>
 * @example
 *	require(['Input'], function(Input) {
 *		var input = new Input({
 *			id: 'myInput',
 *			inputClass: '',
 *			additionalClass: 'disabled',
 *			placeholder: 'Input mail address.',
 *			hint: 'hint message.',
 *		});
 *		document.body.appendChild(input.getRootNode());
 *		input.setValue('input value text');
 *	});
 *
 * @example
 *	<input id="myInput" class="disabled" type="text" value="input value text" placeholder="Input mail address." data-urushi-type="input" data-urushi-options='{"hint": "hint message."}'>
 *
 * @snippet-trigger urushi-input
 * @snippet-content <input id="" placeholder="example value." data-urushi-type="input">
 * @snippet-description urushi-input
 *
 * @module Input
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:materialConfig
 * @requires module:addInputEventListener
 * @requires module:removeInputEventListener
 * @requires module:_Base
 * @requires input.html
 * @requires inputTransitionUnit.html
 */
define(
	'Input',
	[
		'Urushi',
		'materialConfig',
		'addInputEventListener',
		'removeInputEventListener',
		'_Base',
		'text!inputTemplate',
		'text!inputTransitionUnitTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:Input
	 * @returns {object} Input object.
	 */
	function(urushi, materialConfig, addInputEventListener, removeInputEventListener, _Base, template, transitionUnit) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi.input',
			EMBEDDED: {inputClass: '', additionalClass: ''}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return _Base.extend(/** @lends module:Input.prototype */ {
			/**
			 * <pre>
			 * HTML template for Input class.
			 * See ../template/input.html
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
			 * Callback functions for input events.
			 * </pre>
			 * @type object
			 * @private
			 */
			callbacks: undefined,
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
				this.callbacks = {};
			},
			/**
			 * <pre>
			 * Creates placeholder and hint element node.
			 * The follow is for the browser does not support CSS3.0.
			 * Adds element node that has material design animation by javascript.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_render: function(/* object */ args) {
				this._super(args);

				this._createPraceholder(args.placeholder);
				this._createHint(args.hint);
			},
			/**
			 * <pre>
			 * Attaches callback function to input events.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				this.callbacks = addInputEventListener(this.inputNode, this._onInput.bind(this));
				urushi.addEvent(this.inputNode, 'focus', this, '_onFocus');
				urushi.addEvent(this.inputNode, 'blur', this, '_onBlur');
			},
			/**
			 * <pre>
			 * Returns the input element node.
			 * </pre>
			 * @protected
			 * @returns The input element node.
			 */
			_getInputNode: function() {
				return this.rootNode.getElementsByTagName('input')[0];
			},
			/**
			 * <pre>
			 * Creates placeholder element node.
			 * </pre>
			 * @protected
			 * @param {string} placeholder Placeholder message.
			 * @returns none.
			 */
			_createPraceholder: function(/* string */ placeholder) {
				if (!placeholder) {
					return;
				}
				this.floatinglabelNode = document.createElement('div');
				this.floatinglabelNode.id = this.id + '-floating-lebel';
				this.floatinglabelNode.className = 'floating-label';
				this.floatinglabelNode.textContent = placeholder;
				this._getInputNode().parentElement.appendChild(this.floatinglabelNode);
			},
			/**
			 * <pre>
			 * Creates hint element node.
			 * </pre>
			 * @protected
			 * @param {string} hint Hint message.
			 * @returns none.
			 */
			_createHint: function(/* string */ hint) {
				var div;
				if (!hint) {
					return;
				}
				div = document.createElement('div');
				div.className = 'hint';
				div.textContent = hint;
				this._getInputNode().parentElement.appendChild(div);
			},
			/**
			 * <pre>
			 * Sets value.
			 * </pre>
			 * @param {string} value Value.
			 * @returns none.
			 */
			setValue: function(/* string */ value) {
				if ('string' !== typeof value) {
					return;
				}
				this.inputNode.value = value;

				this._onInput();
			},
			/**
			 * <pre>
			 * Gets value.
			 * </pre>
			 * @returns {string} Value.
			 */
			getValue: function() {
				return this.inputNode.value;
			},
			/**
			 * <pre>
			 * Clears value.
			 * </pre>
			 * @returns none.
			 */
			clear: function() {
				this.setValue('');
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * inputNode : Input element node.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode: function() {
				this.inputNode = this.rootNode.getElementsByTagName('input')[0];
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
			 * Post processing of setting value.
			 * Changes styles.
			 * </pre>
			 * @protected
			 * @param {object} event Event object.
			 * @returns none
			 */
			_onInput: function(/* object */ event) {
				if (this.inputNode.value) {
					this.inputNode.classList.remove('empty');
				} else {
					this.inputNode.classList.add('empty');
				}
			},
			/**
			 * <pre>
			 * Callback function for the input focus event.
			 * Runs focus animation by javascipt.
			 * For the browser does not support CSS3.0.
			 * </pre>
			 * @protected
			 * @param {object} event Event object.
			 * @returns none
			 */
			_onFocus: function(/* object */ event) {
				event.stopPropagation();
			},
			/**
			 * <pre>
			 * Callback function for the input blur event.
			 * Runs blur animation by javascipt.
			 * For the browser does not support CSS3.0.
			 * </pre>
			 * @protected
			 * @param {object} event Event object.
			 * @returns none
			 */
			_onBlur: function(/* object */ event) {
				event.stopPropagation();
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
			 * Delete Callback functions.
			 * </pre>
			 * @returns none
			 */
			destroy: function() {
				urushi.removeEvent(this.inputNode, 'focus', this, '_onFocus');
				urushi.removeEvent(this.inputNode, 'blur', this, '_onBlur');

				removeInputEventListener(this.inputNode, this.callbacks);

				this._super();
			}
		});
	}
);
