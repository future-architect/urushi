/**
 * @fileOverView ToggleButton class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides ToggleButton class as widget.
 *
 * constructor arguments.
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	toggleButtonClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of toggleButton widget. For the theme color, read test/toggleButton/index.html
 *	additionalClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	label
 *		type			: string or element node.
 *		specification	: optional
 *		descriptoin		: Label of the toggle button.
 * </pre>
 * @example
 *	require(['ToggleButton'], function (ToggleButton) {
 *		var toggleButton = new ToggleButton({
 *			id : 'myToggleButton',
 *			toggleButtonClass : 'toggle-primary',
 *			additionalClass : '',
 *			label : 'Required'
 *		});
 *		document.body.appendChild(toggleButton.getRootNode());
 *	});
 *
 * @urushi_template
 *	Required<input id="myToggleButton" class="toggle-primary" data-urushi-type="toggleButton">
 *
 * @snippet-trigger urushi-toggle-button
 * @snippet-content <input id="" data-urushi-type="togglebutton">
 * @snippet-description urushi-toggle-button
 *
 * @module ToggleButton
 * @extends module:_Base
 * @requires jquery-2.1.1.js
 * @requires jquery-ui-1.11.4.js',
 * @requires module:urushi
 * @requires module:materialConfig
 * @requires module:_Base
 * @requires toggleButton.html
 * @requires toggleButtonTransitionUnit.html
 */
define(
	'ToggleButton',
	[
		'jquery',
		'jqueryUi',
		'Urushi',
		'materialConfig',
		'_Base',
		'text!toggleButtonTemplate',
		'text!toggleButtonTransitionUnitTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:ToggleButton
	 * @returns {object} ToggleButton object.
	 */
	function ($, jqueryUi, Urushi, materialConfig, _Base, template, transitionUnit) {
		'use strict';
		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi.ToggleButton',
			EMBEDDED : {toggleButtonClass : '', additionalClass : '', label : ''},
			INTERVAL : 10,
			RIPPLE_SCALE_MIN : 0,
			RIPPLE_SCALE_MAX : 1,
			CHECKMARK_POSITION_LEFT : 15,
			CHECKMARK_POSITION_RIGHT : -5,
			RIPPLE_POSITION_LEFT : 2,
			RIPPLE_POSITION_RIGHT : -18
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return _Base.extend({
			/**
			 * <pre>
			 * HTML template for Panel class.
			 * See ../template/toggleButton.html.
			 * </pre>
			 * @type string
			 * @private
			 */
			template : undefined,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type object
			 * @private
			 */
			embedded : undefined,
			/**
			 * <pre>
			 * Initializes instance properties.
			 * </pre>
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties : function (/* object */ args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			/**
			 * <pre>
			 * For the browser does not support CSS3.0.
			 * Adds element nodes.
			 * There have ripple and button animation with ajvascript.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_render : function (/* object */ args) {
				this._super(args);

				if (Urushi.hasTransitionSupport()) {
					return;
				}
				$(this.rootNode).find('.toggle').replaceWith(transitionUnit);
			},
			/**
			 * <pre>
			 * If the browser does not support CSS3.0, it adds callback function to input click event.
			 * It sets initial value to input.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arugments.
			 * @returns none.
			 */
			initOption : function (/* object */ args) {
				if (!Urushi.hasTransitionSupport()) {
					Urushi.addEvent(this.inputNode, 'click', this, '_onClick');
				}

				this.setValue(args.checked);
			},
			/**
			 * <pre>
			 * For the browser does not support CSS3.0.
			 * Runs toggle and ripple animation with javascript.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_onClick : function () {
				var rippleCounter = 0,
					rippleScale = CONSTANTS.RIPPLE_SCALE_MIN,
					rippleOpacity = materialConfig.DEFAULT_VALUE_RIPPLE_OPACITY_MIN,
					checkedBackgroundColor,
					checkedButtonColor,
					tmpCheckedBackgroundTag,
					tmpCheckedButtonTag,
					notCheckedBackgroundColor,
					notCheckedButtonColor,
					tmpNotCheckedBackgroundTag,
					tmpNotCheckedButtonTag,
					ripple = function (/* object */ node, /* number */ duration) {
						if (rippleCounter * CONSTANTS.INTERVAL < duration) {
							setTimeout(function() {
								rippleScale += CONSTANTS.RIPPLE_SCALE_MAX * CONSTANTS.INTERVAL / duration;
								rippleOpacity += materialConfig.DEFAULT_VALUE_RIPPLE_OPACITY_MAX * CONSTANTS.INTERVAL / duration;
								$(node).css({
									'msTransform' : 'scale(' + rippleScale + ')',
									'opacity' : rippleOpacity
								});
								rippleCounter++;
								ripple(node, duration);
							}, CONSTANTS.INTERVAL);
						} else {
							$(node).animate({
								'msTransform' : 'scale(' + CONSTANTS.RIPPLE_SCALE_MIN + ')',
								'opacity' : materialConfig.DEFAULT_VALUE_RIPPLE_OPACITY_MIN
							}, duration, function () {
								$(node).parents('.togglebutton').find('input').prop('disabled', false);
							});
						}
					};

				if (Urushi.hasTransitionSupport()) {
					return;
				}

				if (this.inputNode.hasAttribute('disabled')) {
					return;
				}

				if (this.inputNode.checked) {
					if (this.rootNode.classList.contains('togglebutton') && 1 !== this.rootNode.classList.length) {
						tmpCheckedBackgroundTag = document.createElement('div');
						tmpCheckedBackgroundTag.classList.add('toggle-transition-unit-tmp');
						this.inputNode.appendChild(tmpCheckedBackgroundTag);

						tmpCheckedButtonTag = document.createElement('div');
						tmpCheckedButtonTag.classList.add('toggle-button-unit-tmp');
						this.inputNode.appendChild(tmpCheckedButtonTag);

						checkedBackgroundColor = $(this.inputNode).find('.toggle-transition-unit-tmp').css('background-color');
						checkedButtonColor = $(this.inputNode).find('.toggle-button-unit-tmp').css('background-color');
						$(tmpCheckedBackgroundTag).remove();
						$(tmpCheckedButtonTag).remove();
					}

					$(this.buttonNode).animate({
						left : CONSTANTS.CHECKMARK_POSITION_LEFT,
						'backgroundColor' : checkedButtonColor
					}, materialConfig.DEFAULT_VALUE_DURATION);
					$(this.toggleNode).animate({
						'backgroundColor' : checkedBackgroundColor
					}, materialConfig.DEFAULT_VALUE_DURATION);
					$(this.rippleNode).animate({
						left : CONSTANTS.RIPPLE_POSITION_LEFT,
					}, materialConfig.DEFAULT_VALUE_DURATION, ripple(this.rippleNode, materialConfig.DEFAULT_VALUE_DURATION));
				} else {
					tmpNotCheckedBackgroundTag = document.createElement('div');
					tmpNotCheckedButtonTag = document.createElement('div');
					tmpNotCheckedBackgroundTag.className = 'toggle-transition-unit';
					tmpNotCheckedButtonTag.className = 'toggle-button-unit';
					this.inputNode.appendChild(tmpNotCheckedBackgroundTag);
					this.inputNode.appendChild(tmpNotCheckedButtonTag);
					notCheckedBackgroundColor = $(this.inputNode).find('.toggle-transition-unit').css('background-color');
					notCheckedButtonColor = $(this.inputNode).find('.toggle-button-unit').css('background-color');
					$(tmpNotCheckedBackgroundTag).remove();
					$(tmpNotCheckedButtonTag).remove();

					$(this.buttonNode).animate({
						left : CONSTANTS.CHECKMARK_POSITION_RIGHT,
						'backgroundColor' : notCheckedButtonColor
					}, materialConfig.DEFAULT_VALUE_DURATION);
					$(this.toggleNode).animate({
						'backgroundColor' : notCheckedBackgroundColor
					}, materialConfig.DEFAULT_VALUE_DURATION);
					$(this.rippleNode).animate({
						left : CONSTANTS.RIPPLE_POSITION_RIGHT
					}, materialConfig.DEFAULT_VALUE_DURATION, ripple(this.rippleNode, materialConfig.DEFAULT_VALUE_DURATION));
				}
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * inputNode : Input element node that has checked attribute.
			 *
			 * The following is for the browser that does not support CSS3.0.
			 *
			 * toggleNode : Toggle button background element node.
			 * rippleNode : Element node that has ripple animation.
			 * buttonNode : Toggle button element node.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode : function () {
				this.inputNode = this.rootNode.getElementsByTagName('input')[0];

				if (Urushi.hasTransitionSupport()) {
					return;
				}
				this.toggleNode = this.rootNode.getElementsByClassName('toggle-transition-unit')[0];
				this.rippleNode = this.rootNode.getElementsByClassName('toggle-ripple-unit')[0];
				this.buttonNode = this.rootNode.getElementsByClassName('toggle-button-unit')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @returns {string} object's id.
			 */
			_getId : function () {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Disable or enable instance.
			 * </pre>
			 * @param {boolean} is True is disabled, false is enabled.
			 * @returns {boolean} It finished normally, returns true.
			 */
			setDisabled : function (/* boolean */ is) {
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
			 * Returns the toggle button checked attribute.
			 * </pre>
			 * @returns {boolean} The toggle button checked attribute.
			 */
			getValue : function () {
				return this.inputNode.checked;
			},
			/**
			 * <pre>
			 * Sets checked status to the toggle button checked attribute.
			 * </pre>
			 * @param {boolean} Status.
			 * @returns none.
			 */
			setValue : function (/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return;
				}
				this.inputNode.checked = is;

				this._onClick();
			},
			/**
			 * <pre>
			 * Sets false to toggle button checked attirbute.
			 * </pre>
			 * @returns none.
			 */
			clear : function () {
				this.setValue(false);
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete callback function.
			 * </pre>
			 * @returns none.
			 */
			destroy : function () {
				if (!Urushi.hasTransitionSupport()) {
					Urushi.removeEvent(this.inputNode, 'click', this, '_onClick');
				}

				this._super();
			}
		});
	}
);
