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
 *		let checkbox = new Checkbox({
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
 * @requires module:_Base
 * @requires checkbox.html
 */
define(
	'Checkbox',
	[
		'materialConfig',
		'parser',
		'_Base',
		'text!checkboxTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:Checkbox
	 * @returns {object} Checkbox instance.
	 */
	function(materialConfig, parser, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		const ID_PREFIX = 'urushi.checkbox';
		const EMBEDDED = {label: ''};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		let idNo = 0;

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
			embedded: EMBEDDED,

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
				let option = this._super(element);

				option.label = parser.getNextText(element);
				if (option.label) {
					parser.removeNextNode(element);
				}
				option.checked = !!element.checked;
				option.disabled = !!element.disabled;

				return option;
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
			_setInitial: function(args) {
				this.setValue(args.checked);
				this.setDisabled(args.disabled);
			},
			/**
			 * <pre>
			 * チェックの付け外しをする。
			 * </pre>
			 * @param {boolean} is チェック状態
			 * @returns 無し
			 */
			setValue: function(/* boolean */ is) {
				return this.setChecked(is);
			},
			/**
			 * <pre>
			 * チェック状態を取得する。
			 * </pre>
			 * @returns {boolean} チェック状態
			 */
			getValue: function() {
				return this.getChecked();
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
			 * チェックの付け外しをする。
			 * </pre>
			 * @param {boolean} is チェック状態
			 * @returns 無し
			 */
			setChecked: function(/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return;
				}

				this.inputNode.checked = is;
			},
			/**
			 * <pre>
			 * チェック状態を取得する。
			 * </pre>
			 * @returns {boolean} チェック状態
			 */
			getChecked: function() {
				return this.inputNode.checked;
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
				return ID_PREFIX + idNo++;
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
			}
		});
	}
);
