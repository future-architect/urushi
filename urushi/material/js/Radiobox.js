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
 *		let radiobox = new Radiobox({
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
 * @requires module:parser
 * @requires module:_Base
 * @requires radiobox.html
 */
define(
	'Radiobox',
	[
		'parser',
		'_Base',
		'text!radioboxTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:Radiobox
	 * @returns {object} Radiobox instance.
	*/
	function(parser, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		const ID_PREFIX = 'urushi.Radiobox';
		const EMBEDDED = {value: '', label: ''};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		let idNo = 0;

		return _Base.extend(/** @lends module:Radiobox.prototype */ {

			/**
			 * <pre>
			 * HTML template for Radiobox class.
			 * See ../template/radiobox.html.
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

				option.name = element.getAttribute('name');
				option.value = element.getAttribute('value');
				option.checked = !!element.checked;
				option.disabled = !!element.disabled;
				option.label = parser.getNextText(element);
				if (option.label) {
					parser.removeNextNode(element);
				}

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
				if (!args.name) {
					throw new Error('Name is required.');
				}
				this._super(args);
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
			 * Returns whether the radiobox is checked or not.
			 * </pre>
			 * @returns {boolean} Whether the radiobox is checked or not.
			 */
			getValue: function() {
				return this.getChecked();
			},
			setValue: function(/* boolean */ is) {
				return this.setChecked(is);
			},
			getChecked: function() {
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
				return ID_PREFIX + idNo++;
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
