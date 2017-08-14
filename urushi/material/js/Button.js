/**
 * @fileOverView Button class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides button class as widget.
 *
 * constructor arguments.
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	styleClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	label
 *		type			: string
 *		specification	: optional
 *		default value	: 'Button Name'
 *		descriptoin		: Label of button.
 * </pre>
 * @example
 *	require(['Button'], function(Button) {
 *		let button = new Button({
 *			id: 'myButton',
 *			buttonClass: 'button-raised button-primary',
 *			additionalClass: 'disabled',
 *			label: 'Commit'
 *		});
 *		document.body.appendChild(button.getRootNode());
 *	});
 *
 * @example
 *	<button id="commitButton" class="button-primary" data-urushi-type="button">Commit</button>
 *	<button id="disabledButton" class="button-flat button-primary" data-urushi-type="button" disabled>Disabled</button>
 *
 * @snippet-trigger urushi-button
 * @snippet-content <button id="" data-urushi-type="button">label</button>
 * @snippet-description urushi-button
 *
 * @module Button
 * @extends module:Ripple
 * @requires module:Ripple
 * @requires button.html
 */
define(
	'Button',
	[
		'parser',
		'Ripple',
		'text!buttonTemplate'
	],
	/**
	 * @class
	 * @auguments module:Ripple
	 * @alias module:Button
	 * @returns {object} Button object.
	 */
	function(parser, Ripple, template) {
		'use strict';

		const ID_PREFIX = 'urushi.button';
		const EMBEDDED = {label: ''};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @member module:Button#idNo
		 * @type number
		 * @private
		 */
		let idNo = 0;
		
		return Ripple.extend(/** @lends module:Button.prototype */ {
			/**
			 * <pre>
			 * HTML template for button class.
			 * See ../template/button.html.
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

				option.label = element.innerText;

				return option;
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
			 * @returns {mpde} Button node.
			 */
			getButtonNode: function() {
				return this.rootNode;
			},
		});
	}
);
