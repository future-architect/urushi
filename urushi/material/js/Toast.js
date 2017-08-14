/**
 * @fileOverView Toast class definition.
 * @author Yuzo Hirakawa
 * @version 1.0.0
 */

/**
 * <pre>
 * Provides Toast class as widget.
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
 *	content
 *		type			: string|node
 *		specification	: required
 *		default value	: ''
 *		descriptoin		: Body contents.
 * </pre>
 * @example
 *	require(['ToastManager'], function(ToastManager) {
 *		let toastManager = new ToastManager({
 *			id: 'toastManager',
 *			addtionalClass: '',
 *			displayTime: 5000
 *		});
 *		document.body.appendChild(toastManager.getRootNode());
 *		toastManager.add('toast mesaage.');
 *	});
 *
 * @module Toast
 * @requires module:event
 * @requires module:node
 * @requires module:materialConfig
 * @requires module:_Base
 * @requires toast.html
 * @requires module:promse
 */
define(
	'Toast',
	[
		'event',
		'node',
		'materialConfig',
		'_Base',
		'text!toastTemplate',
		'promise'
	],
	/**
	 * @alias module:Toast
	 * @returns {object} Toast object.
	*/
	function(event, node, materialConfig, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		const ID_PREFIX = 'urushi.toast';
		const EMBEDDED = {content: ''};
		const CLASS_NAME_TOAST_OPENED = 'toast-opened';

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		let idNo = 0;

		return _Base.extend(/** @lends module:Input.prototype */ {
			/**
			 * <pre>
			 * HTML template for Input class.
			 * See ../template/input.html
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
			 * Indicates whether the toast is displayed.
			 * </pre>
			 * @type boolean
			 * @private
			 */
			isShown: undefined,
			/**
			 * <pre>
			 * Initializes instance properties.
			 * </pre>
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this._super(args);

				this.isShown = false;
			},
			/**
			 * <pre>
			 * Sets contents.
			 * </pre>
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				this.setContent(args.content);
			},
			/**
			 * <pre>
			 * Sets contents to body.
			 * </pre>
			 * @param {string|node} content Contents.
			 * @returns none.
			 */
			setContent: function(/* string|node */content) {
				if (!node.setDomContents(this.contentNode, content)) {
					throw new Error('Bad argument : content is required.');
				}
			},
			/**
			 * <pre>
			 * Shows toast.
			 * </pre>
			 * @returns none.
			 */
			show: function() {
				let promise;

				if (this.isShown) {
					return null;
				}
				this.isShown = true;

				promise = new Promise((function(resolve, reject) {
					event.addEvent(this.rootNode, 'transitionend', (function() {
						event.removeEvent(this.rootNode, 'transitionend');

						resolve();
					}).bind(this));
				}).bind(this));

				this.rootNode.classList.add(CLASS_NAME_TOAST_OPENED);

				return promise;
			},
			/**
			 * <pre>
			 * Shows toast.
			 * </pre>
			 * @returns none.
			 */
			hide: function() {
				let promise;

				if (!this.isShown) {
					return null;
				}
				this.isShown = false;
				
				promise = new Promise((function(resolve, reject) {
					event.addEvent(this.rootNode, 'transitionend', (function() {
						this.rootNode.classList.add('hidden');
						event.removeEvent(this.rootNode, 'transitionend');

						resolve();
					}).bind(this));
				}).bind(this));

				this.rootNode.classList.remove(CLASS_NAME_TOAST_OPENED);

				return promise;
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * contentNode : div element node that shows contents.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode: function() {
				this.contentNode = this.rootNode.childNodes[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @protected
			 * @returns {string} object's id.
			 */
			_getId: function() {
				return ID_PREFIX + idNo++;
			}
		});
	}
);
