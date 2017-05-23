/**
 * @fileOverView Checkbox class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides Checkbos class as widget.
 *
 * constructor arguments
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	checkboxClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of checkbox widget. For the theme color, read test/checkbox/index.html.
 *	additionalClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	label
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Chechbox label.
 * </pre>
 * @example
 *	require(['Checkbox'], function(Checkbox) {
 *		var checkbox = new Checkbox({
 *			id: 'myCheckbox',
 *			checkboxClass: 'checkbox-primary',
 *			additionalClass: '',
 *			label: 'Required'
 *		});
 *		document.body.appendChild(checkbox.getRootNode());
 *	});
 *
 * @example
 *	<input id="myCheckbox" class="checkbox-primary" data-urushi-type="checkbox" checked>Required
 *
 * @snippet-trigger urushi-checkbox
 * @snippet-content <input id="" data-urushi-type="checkbox">
 * @snippet-description urushi-checkbox
 *
 * @module Checkbox
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:_Base
 * @requires checkbox.html
 * @requires checkboxTransitionUnit.html
 * @requires checkboxRippleTransitionUnit.html
 */
define(
	'Checkbox',
	[
		'jquery',
		'Urushi',
		'materialConfig',
		'_Base',
		'text!checkboxTemplate',
		'text!checkboxTransitionUnitTemplate',
		'text!checkboxRippleTransitionUnitTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:Checkbox
	 * @returns {object} Checkbox instance.
	 */
	function($, urushi, materialConfig, _Base, template, transitionUnit, rippleTransitionUnit) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi.checkbox',
			EMBEDDED: {checkboxClass: '', additionalClass: '', label: ''}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return _Base.extend(/** @lends module:Checkbox.prototype */ {
			/**
			 * <pre>
			 * HTML template for Checkbox class.
			 * See ../template/checkbox.html
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
			embedded: CONSTANTS.EMBEDDED,
			/**
			 * <pre>
			 * Animation time.
			 * It is used in browser that don't support CSS3.0.
			 * </pre>
			 * @type number
			 * @private
			 */
			duration: undefined,
			/**
			 * <pre>
			 * Initialize instance properties.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.duration = materialConfig.DEFAULT_VALUE_DURATION;
			},
			/**
			 * <pre>
			 * Show close icon.
			 * Set checkbox initialize value.
			 * The browser not support CSS3.0,
			 * it attaches callback function to input onclick.
			 * </pre>
			 * @protected
			 * @param {object} Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				this.setChecked(args.checked);
			},
			/**
			 * <pre>
			 * Returns checkbox state that is checked or not.
			 * </pre>
			 * @returns {boolean} Checkbox state.
			 */
			getValue: function() {
				return this.inputNode.checked;
			},
			/**
			 * <pre>
			 * Turn off on checkbox.
			 * </pre>
			 * @returns none.
			 */
			clear: function() {
				this.setChecked(false);
			},
			/**
			 * <pre>
			 * Turn on / off checkbox with animation.
			 * The browser supports CSS3.0, it animates by CSS3.0,
			 * not support CSS3.0, it animates by javaScript.
			 * </pre>
			 * @param {boolean} is On or off checkbox.
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
			 * Creates access points of checkbox element nodes.
			 *
			 * inputNode : Hidden input element.
			 * Bellows is created when the browser not support CSS3.0.
			 * rippleNode : Element node that has ripple animation.
			 * checkNode : Element node that has check animation.
			 * checkBackgroundNode : Element node that is background of checkbox.
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
			 * @returns {string} object's id.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Returns value of input node attribute(value).
			 * </pre>
			 * @returns {string} Value of input node attribute.
			 */
			getPropertyValue: function() {
				return this.inputNode.value;
			},
			/**
			 * <pre>
			 * Set value to input node attribute(value).
			 * </pre>
			 * @param {string} value
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
			},
		});
	}
);
