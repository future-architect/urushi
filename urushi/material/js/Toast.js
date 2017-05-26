/**
 * @fileOverView Toast class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
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
 *	require(['Toast'], function(Toast) {
 *		var toast = new Toast({
 *			id: 'myToast',
 *			toastClass: '',
 *			additionalClass: '',
 *			content: 'message'
 *		});
 *		document.body.appendChild(toast.getRootNode());
 *		toast.show();
 *	});
 *
 * @module Toast
 * @extends module:_Base
 * @requires jquery-2.1.1.js
 * @requires module:Urushi
 * @requires module:materialConfig
 * @requires module:_Base
 * @requires module:Deferred
 * @requires toast.html
 */
define(
	'Toast',
	[
		'Urushi',
		'materialConfig',
		'_Base',
		'Deferred',
		'text!toastTemplate'
	],
	/**
	 * @alias module:Toast
	 * @returns {object} Toast object.
	*/
	function(urushi, materialConfig, _Base, Deferred, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi.toast',
			EMBEDDED: {additionalClass: '', content: ''},
			CLASS_NAME_TOAST_OPENED: 'toast-opened'
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return _Base.extend(/** @lends module:Input.prototype */ {
			/**
			 * <pre>
			 * HTML template for Input class.
			 * See ../template/input.html
			 * </pre>
			 * @type string
			 * @private
			 */
			template: undefined,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type object
			 * @private
			 */
			embedded: undefined,
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
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
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
				if (!urushi.setDomContents(this.contentNode, content)) {
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
				var style, deferred;

				if (this.isShown) {
					return null;
				}
				this.isShown = true;

				deferred = new Deferred();

				urushi.addEvent(this.rootNode, 'transitionend', this, '_onEndShow', deferred);
				this.rootNode.classList.add(CONSTANTS.CLASS_NAME_TOAST_OPENED);

				return deferred;
			},
			/**
			 * <pre>
			 * Shows toast.
			 * </pre>
			 * @returns none.
			 */
			hide: function() {
				var deferred;

				if (!this.isShown) {
					return null;
				}
				this.isShown = false;
				
				deferred = new Deferred();
				urushi.addEvent(this.rootNode, 'transitionend', this, '_onEndHide', deferred);
				this.rootNode.classList.remove(CONSTANTS.CLASS_NAME_TOAST_OPENED);

				return deferred;
			},
			/**
			 * <pre>
			 * Callback function for the showing animation transitionend event.
			 * Removes the callback function.
			 * </pre>
			 * @param {object} deferred
			 * @protected
			 * @returns none.
			 */
			_onEndShow: function(/* object */ deferred) {
				deferred.resolve();
				urushi.removeEvent(this.rootNode, 'transitionend', this, '_onEndShow');
			},
			/**
			 * <pre>
			 * Callback function for the hiding animation transitionend event.
			 * Removes the callback function.
			 * </pre>
			 * @param {object} deferred
			 * @protected
			 * @returns none.
			 */
			_onEndHide: function(/* object */ deferred) {
				this.rootNode.classList.add('hidden');
				deferred.resolve();

				urushi.removeEvent(this.rootNode, 'transitionend', this, '_onEndHide');
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
				return CONSTANTS.ID_PREFIX + idNo++;
			}
		});
	}
);
