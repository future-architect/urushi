/**
 * @fileOverView Radiobox class definition.
 * @author Yuzo Hirakawa
 * @version 1.0.0
 */

/**
 * <pre>
 * Provides Radiobox class as widget.
 *
 * constructor arguments.
 *	id
 *		type			: string
 *		specification	: optoinal
 *		descriptoin		: Instance identifier.
 *	radioboxClass
 *		type			: string
 *		specification	: optoinal
 *		default value	: ''
 *		descriptoin		: Style class of theme color of radiobox widget. For the theme color, read test/radiobox/index.html
 *	additionalClass
 *		type			: string
 *		specification	: optoinal
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	name
 *		type			: string
 *		specification	: required
 *		descriptoin		: Input name attribute.
 *	value
 *		type			: any
 *		specification	: optoinal
 *		default value	: ''
 *		descriptoin		: Value of input element node.
 *	label
 *		type			: string
 *		specification	: optoinal
 *		default value	: ''
 *		descriptoin		: Label to be displayed i flont of the radiobox.
 *	checked
 *		type			: boolean
 *		specification	: optoinal
 *		default value	: false
 *		descriptoin		: Checked, or not.
 * </pre>
 * @example
 *	require(['Radiobox'], function(Radiobox) {
 *		var radiobox = new Radiobox({
 *			id: 'myRadio',
 *			radioboxClass: 'radio-default',
 *			additionalClass: 'disabled',
 *			name: 'category',
 *			value: 'type1',
 *			label: 'CAT : TYPE1',
 *			checked: true
 *		});
 *		document.body.appendChild(radiobox.getRootNode());
 *	});
 *
 * @example
 *	<input id="myRadio1" class="radio-default" data-urushi-type="radiobox" name="radioName" value="value1" >label value1
 *	<input id="myRadio2" class="radio-default" data-urushi-type="radiobox" name="radioName" value="value2" >label value2
 *
 * @snippet-trigger urushi-radiobox
 * @snippet-content <input id="" data-urushi-type="radiobox" name="" value=""> label title
 * @snippet-description urushi-radiobox
 *
 * @module Radiobox
 * @extends module:_Base
 * @requires jquery-2.1.1.js
 * @requires module:Urushi
 * @requires module:_Base
 * @requires radiobox.html
 */
define(
	'Radiobox',
	[
		'Urushi',
		'_Base',
		'text!radioboxTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:Radiobox
	 * @returns {object} Radiobox instance.
	*/
	function(urushi, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi.Radiobox',
			EMBEDDED: {radioboxClass: '', additionalClass: '', value: '', label: '', checked: false}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return _Base.extend(/** @lends module:Radiobox.prototype */ {

			/**
			 * <pre>
			 * HTML template for Radiobox class.
			 * See ../template/radiobox.html.
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
			 * Initializes instance properties.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				if (!args.name) {
					throw new Error('Name is required.');
				}
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			/**
			 * <pre>
			 * Returns whether the radiobox is checked or not.
			 * </pre>
			 * @returns {boolean} Whether the radiobox is checked or not.
			 */
			getValue: function() {
				return this.inputNode.checked;
			},
			/**
			 * <pre>
			 * Sets check to the radiobox.
			 * </pre>
			 * @param {boolean} is Whether it finished normally or not.
			 * @returns none.
			 */
			setChecked: function(/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return;
				}
				this.inputNode.checked = is;
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * inputNode : Input element node.
			 * rippleNode : Rippel element node that has ripple animation.
			 * checkNode : Checkbox element node that has to check animation.
			 * </pre>
			 * @returns none.
			 */
			_attachNode: function() {
				this.inputNode = this.rootNode.getElementsByTagName('input')[0];
				this.rippleNode = this.rootNode.getElementsByClassName('ripple')[0];
				this.checkNode = this.rootNode.getElementsByClassName('check')[0];
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
			 * Returns radiobox value attribute.
			 * </pre>
			 * @returns {string} Radiobox value attribute.
			 */
			getPropertyValue: function() {
				return this.inputNode.value;
			},
			/**
			 * <pre>
			 * Sets radiobox value attribute.
			 * </pre>
			 * @param {string} value Value of the input value attribute.
			 * @returns none
			 */
			setPropertyValue: function(/* string */ value) {
				this.inputNode.value = value;
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
			}
		});
	}
);
