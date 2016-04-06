/**
 * @fileOverView Textarea class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides Textarea class as widget.
 *
 * constructor arguments.
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	textareaClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of textarea widget. For the theme color, read test/textarea/index.html
 *	additionalClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	placeholder
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Textarea placeholder.
 *	hint
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Hint message for textarea. It is displayed at the bottom of textarea.
 * </pre>
 * @example
 *	require(['Textarea'], function (Textarea) {
 *		var textarea = new Textarea({
 *			id : 'myTextarea',
 *			textareaClass : '',
 *			additionalClass : '',
 *			placeholder : 'Input free.',
 *			hint : 'hint message.'
 *		});
 *		document.body.appendChild(textarea.getRootNode());
 *
 *		textarea.setValue('input value text.\ntest 2nd line.');
 *	});
 *
 * @example
 *	<textarea id="myTextarea" class="" value="input value text.\ntest 2nd line." placeholder="Input free." data-urushi-type="textarea" data-urushi-options='{"hint" : "hint message."}'></textarea>
 *
 * @snippet-trigger urushi-textarea
 * @snippet-content <textarea id="" value="" data-urushi-type="textarea" data-urushi-options='{"hint" : "hint message."}'></textarea>
 * @snippet-description urushi-textarea
 *
 * @module Textarea
 * @extends module:Input
 * @requires module:Urushi
 * @requires module:Input
 * @requires textarea.html
 */
define(
	'Textarea',
	[
		'Urushi',
		'Input',
		'text!textareaTemplate',
	],
	/**
	 * @class
	 * @auguments module:Input
	 * @alias module:Textarea
	 * @returns {object} Textarea object.
	 */
	function (urushi, Input, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi.Textarea',
			EMBEDDED : {textareaClass : '', additionalClass : ''}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return Input.extend(/** @lends module:Textarea.prototype */ {
			/**
			 * <pre>
			 * HTML template for Input class.
			 * See ../template/input.html
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
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties : function (/* object */ args) {
				this._super(args);
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * inputNode : The textarea element node.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode : function () {
				this._super();
				this.inputNode = this.rootNode.getElementsByTagName('textarea')[0];
			},
			/**
			 * <pre>
			 * Returns the textarea element node.
			 * </pre>
			 * @protected
			 * @returns The textarea element node.
			 */
			_getInputNode : function () {
				return this.rootNode.getElementsByTagName('textarea')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @protected
			 * @returns {string} Instance id.
			 */
			_getId : function () {
				return CONSTANTS.ID_PREFIX + idNo++;
			}
		});
	}
);
