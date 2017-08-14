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
 *	require(['ToggleButton'], function(ToggleButton) {
 *		let toggleButton = new ToggleButton({
 *			id: 'myToggleButton',
 *			toggleButtonClass: 'toggle-primary',
 *			additionalClass: '',
 *			label: 'Required'
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
 * @requires module:parser
 * @requires module:materialConfig
 * @requires module:_Base
 * @requires toggleButton.html
 */
define(
	'ToggleButton',
	[
		'parser',
		'materialConfig',
		'_Base',
		'text!toggleButtonTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:ToggleButton
	 * @returns {object} ToggleButton object.
	 */
	function(parser, materialConfig, _Base, template) {
		'use strict';
		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		const ID_PREFIX = 'urushi.ToggleButton';
		const EMBEDDED = {label: ''};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		let idNo = 0;

		return _Base.extend({
			/**
			 * <pre>
			 * HTML template for Panel class.
			 * See ../template/toggleButton.html.
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
			 * TemplateEngineで検出されたElementから、
			 * インスタンス化に必要な定義を抽出する。
			 * </pre>
			 * @protected
			 * @param {Element} element 置換対象のエレメント。
			 * @returns インスタンス化に必要な定義情報
			 */
			_parse: function(/* Element */ element) {
				let option = this._super(element);
				
				option.label = parser.getPreviousText(element);
				if (option.label) {
					parser.removePreviousNode(element);
				}
				option.checked = !!element.checked;
				option.disabled = !!element.disabled;

				return option;
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
			initOption: function(/* object */ args) {
				this.setValue(args.checked);
			},
			/**
			 * <pre>
			 * コンストラクタ引数から初期値を設定する。
			 * 下記を設定する。
			 * - チェック状態
			 * - disabledステータス
			 * - readonlyステータス TODO
			 * </pre>
			 * @protected
			 * @param {object} args コンストラクタ引数
			 * @returns none.
			 */
			_setInitial: function(/* object */ args) {
				this.setValue(args.checked);
				this.setDisabled(args.disabled);
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
			_attachNode: function() {
				this.inputNode = this.rootNode.getElementsByTagName('input')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @returns {string} object's id.
			 */
			_getId: function() {
				return ID_PREFIX + idNo++;
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
			 * Returns the toggle button checked attribute.
			 * </pre>
			 * @returns {boolean} The toggle button checked attribute.
			 */
			getValue: function() {
				return this.inputNode.checked;
			},
			/**
			 * <pre>
			 * Sets checked status to the toggle button checked attribute.
			 * </pre>
			 * @param {boolean} Status.
			 * @returns none.
			 */
			setValue: function(/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return;
				}
				this.inputNode.checked = is;
			},
			/**
			 * <pre>
			 * Sets false to toggle button checked attirbute.
			 * </pre>
			 * @returns none.
			 */
			clear: function() {
				this.setValue(false);
			}
		});
	}
);
