/**
 * @fileOverView Button class definition.
 * @author Yuzo Hirakawa
 * @version 1.0.0
 */

/**
 * <pre>
 * Icon形式のButtonを提供する。
 * Material DesignのFloating actoin buttonに該当する。
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
 *	icon
 *		type			: string
 *		specification	: required
 *		default value	: N/A
 *		descriptoin		: Iconのクラス。 利用可能なアイコンはicon-material-design.scssを参照すること。
 *	label
 *		type			: string
 *		specification	: optional
 *		default value	: 'Button Name'
 *		descriptoin		: IconButtonのラベル。
 * </pre>
 * @example
 *	require(['IconButton'], function(IconButton) {
 *		let icon = new IconButton({
 *			id: 'myButton',
 *			additionalClass: 'disabled',
 *			icon: 'mdi-action-3d-rotation',
 *			label: 'Commit'
 *		});
 *		document.body.appendChild(icon.getRootNode());
 *	});
 *
 * @example
 *	<button id="commitButton" data-urushi-type="iconbutton">Commit</button>
 *
 * @snippet-trigger urushi-button
 * @snippet-content <button id="" data-urushi-type="button">label</button>
 * @snippet-description urushi-button
 *
 * @module IconButton
 * @extends module:Ripple
 * @requires module:Ripple
 * @requires icon-button.html
 */
define(
	'IconButton',
	[
		'parser',
		'Ripple',
		'text!iconButtonTemplate'
	],
	/**
	 * @class
	 * @auguments module:Ripple
	 * @alias module:IconButton
	 * @returns {object} IconButton object.
	 */
	function(parser, Ripple, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:Button#CONSTANTS
		 * @type object
		 * @constant
		 * @private
		 */
		const ID_PREFIX = 'urushi.icon-button',
			EMBEDDED = {};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @member module:IconButton#idNo
		 * @type number
		 * @private
		 */
		let idNo = 0;
		
		return Ripple.extend(/** @lends module:IconButton.prototype */ {

			/**
			 * <pre>
			 * HTML template for IconButton class.
			 * See ../template/icon-button.html.
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

				Object.assign(option, parser.getOption(element));
				option.label = element.innerText || undefined;

				return option;
			},
			/**
			 * <pre>
			 * ラベルが指定されていれば、ラベルノードの作成を行う。
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_render: function(/* object */ args) {
				this._super(args);

				this.createLabel(args.label);
			},
			/**
			 * <pre>
			 * ラベルが指定されていれば、ラベルノードの作成を行う。
			 * </pre>
			 * @protected
			 * @param {string} label アイコンホバー時に表示するラベル。
			 * @returns none.
			 */
			createLabel: function(/* string */ label) {
				let node, left, height;

				if (!label) {
					return;
				}

				node = document.createElement('span');
				node.classList.add('label');
				node.innerText = label;

				this.getButtonNode().appendChild(node);
				document.body.appendChild(this.getButtonNode());

				left = this.getButtonNode().offsetWidth - node.offsetWidth;
				height = node.offsetHeight;
				if (left) {
					left = left / 2;
				}
				node.style.left = '' + left + 'px';
				node.style.bottom = '' + (-4 - height) + 'px';

				document.body.removeChild(this.getButtonNode());

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
			 * Disabled or enable the instance
			 * </pre>
			 * @see {@link module:_Base}#setDisabled
			 * @param {boolean} is True is disabled, false is enabled.
			 * @returns {boolean} It finished normally, returns true.
			 */
			setDisabled: function(/* boolean */ is) {
				if (!this._super(is)) {
					return false;
				}
				if (is) {
					this.getButtonNode().setAttribute('disabled', true);
				} else {
					this.getButtonNode().removeAttribute('disabled');
				}
				return true;
			},
			/**
			 * <pre>
			 * Returns button element node.
			 * </pre>
			 * @returns {Element} Button node.
			 */
			getButtonNode: function() {
				return this.rootNode;
			},
		});
	}
);
