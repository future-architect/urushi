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
	function(urushi, materialConfig, _Base, template, transitionUnit, rippleTransitionUnit) {
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
			EMBEDDED: {checkboxClass: '', additionalClass: '', label: ''},
			INTERVAL: 20,
			RIPPLE_SCALE_MIN: 0,
			RIPPLE_SCALE_MAX: 1,
			CHECK_DEFAULT_TOP: 14,
			CHECK_DEFAULT_LEFT: -3,
			CHECK_DEFAULT_WIDTH: 0,
			CHECK_DEFAULT_HIGHT: 0,
			CHECK_ANIMATE_WIDTH_TOP: 13,
			CHECK_ANIMATE_WIDTH_LEFT: -5,
			CHECK_ANIMATE_WIDTH_WIDTH: 7,
			CHECK_ANIMATE_WIDTH_HIGHT: 2,
			CHECK_ANIMATE_HIGHT_TOP: 4,
			CHECK_ANIMATE_HIGHT_LEFT: -1,
			CHECK_ANIMATE_HIGHT_HIGHT: 13
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
			 * The browser not support CSS3.0,
			 * it creates element nodes there have check animation.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_render: function(args) {
				this._super(args);

				if (urushi.hasTransitionSupport()) {
					return;
				}
				$(this.rootNode).find('.ripple').replaceWith(rippleTransitionUnit);
				$(this.rootNode).find('.check').replaceWith(transitionUnit);
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

				if (urushi.hasTransitionSupport()) {
					return;
				}
				urushi.addEvent(this.inputNode, 'click', this, '_onClick');
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
				var checkDuration,
					checkNode;

				if ('boolean' !== typeof is) {
					return;
				}

				this.inputNode.checked = is;

				if (urushi.hasTransitionSupport()) {
					return;
				}

				if (is) {
					checkDuration = this.duration * 0.5;
					checkNode = this.checkNode;

					$(this.checkNode).css({
						top: CONSTANTS.CHECK_DEFAULT_TOP,
						left: CONSTANTS.CHECK_DEFAULT_LEFT,
						width: CONSTANTS.CHECK_DEFAULT_WIDTH,
						height: CONSTANTS.CHECK_DEFAULT_HIGHT,
						opacity: materialConfig.DEFAULT_VALUE_OPACITY_MAX,
					});

					$(this.checkBackgroundNode).animate({
						opacity: materialConfig.DEFAULT_VALUE_OPACITY_MAX
					}, checkDuration);

					$(this.checkBackgroundNode).css({
						opacity: materialConfig.DEFAULT_VALUE_OPACITY_MAX
					});

					$(checkNode).animate({
						top: CONSTANTS.CHECK_ANIMATE_WIDTH_TOP,
						left: CONSTANTS.CHECK_ANIMATE_WIDTH_LEFT,
						width: CONSTANTS.CHECK_ANIMATE_WIDTH_WIDTH,
						hight: CONSTANTS.CHECK_ANIMATE_WIDTH_HIGHT
					}, checkDuration, function() {
						$(checkNode).animate({
							top: CONSTANTS.CHECK_ANIMATE_HIGHT_TOP,
							left: CONSTANTS.CHECK_ANIMATE_HIGHT_LEFT,
							height: CONSTANTS.CHECK_ANIMATE_HIGHT_HIGHT
						}, checkDuration);
					});
				} else {
					$(this.checkBackgroundNode).animate({
						opacity: materialConfig.DEFAULT_VALUE_OPACITY_MIN
					}, this.duration);

					$(this.checkNode).animate({
						opacity: materialConfig.DEFAULT_VALUE_OPACITY_MIN
					}, this.duration);
				}
			},
			/**
			 * <pre>
			 * Callback function for checkbox is clicked.
			 * It used in the browser not support CSS3.0.
			 * </pre>
			 * @param {object} event Event object.
			 * @returns none.
			 */
			_onClick: function(/* object */ event) {
				var rippleCounter = 0,
					rippleScale = CONSTANTS.RIPPLE_SCALE_MIN,
					opacityMin = materialConfig.DEFAULT_VALUE_RIPPLE_OPACITY_MIN,
					opacityMax = materialConfig.DEFAULT_VALUE_RIPPLE_OPACITY_MAX,
					rippleOpacity = opacityMin,
					ripple = function(/* object */ rippleNode, /* number */ duration) {
						if (rippleCounter * CONSTANTS.INTERVAL < duration) {
							setTimeout(function() {
								rippleScale += CONSTANTS.RIPPLE_SCALE_MAX * CONSTANTS.INTERVAL / duration;
								rippleOpacity += opacityMax * CONSTANTS.INTERVAL / duration;
								$(rippleNode).css({
									'msTransform': 'scale(' + rippleScale + ')',
									'opacity': rippleOpacity
								});
								rippleCounter++;
								ripple(rippleNode, duration);
							}, CONSTANTS.INTERVAL);
						} else {
							$(rippleNode).animate({
								'msTransform': 'scale(' + CONSTANTS.RIPPLE_SCALE_MIN + ')',
								'opacity': opacityMin
							}, duration - 100);
						}
					};

				if (urushi.hasTransitionSupport()) {
					return;
				}

				ripple(this.rippleNode, this.duration);
				this.setChecked(this.inputNode.checked);
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

				if (urushi.hasTransitionSupport()) {
					return;
				}

				this.rippleNode = this.rootNode.getElementsByClassName('checkbox-ripple-unit')[0];
				this.checkNode = this.rootNode.getElementsByClassName('checkbox-check-unit')[0];
				this.checkBackgroundNode = this.rootNode.getElementsByClassName('checkbox-check-background')[0];
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
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete Callback functions.
			 * </pre>
			 * @returns none.
			 */
			destroy: function() {
				if (!urushi.hasTransitionSupport()) {
					urushi.removeEvent(this.inputNode, 'click', this, '_onClick');
				}

				this._super();
			}
		});
	}
);
