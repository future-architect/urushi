/**
 * @fileOverView ToastManager class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides Class to manage toasts.
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
 *		descriptoin		: Optional style class for toast class.
 *	displayTime
 *		type			: number
 *		specification	: optional
 *		default value	: 3000
 *		descriptoin		: Display time of toast[ms].
 * </pre>
 * @example
 *	require(['ToastManager'], function(ToastManager) {
 *		var toastManager = new ToastManager({
 *			id: 'toastManager',
 *			addtionalClass: '',
 *			displayTime: 5000
 *		});
 *		document.body.appendChild(toastManager.getRootNode());
 *		toastManager.add('toast mesaage.');
 *	});
 *
 * @module ToastManager
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:_Base
 * @requires module:materialConfig
 * @requires module:Toast
 * @requires toastManager.html
 */
define(
	'ToastManager',
	[
		'Urushi',
		'_Base',
		'materialConfig',
		'Toast',
		'text!toastManagerTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:ToastManager
	 * @returns {object} ToastManager instance.
	*/
	function(urushi, _Base, materialConfig, Toast, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID: 'urushi.toast-manager',
		};

		/**
		 * <pre>
		 * Flag that indicates whether the instance or been created.
		 * </pre>
		 * @type boolean
		 */
		var isCreated = false;

		/**
		 * <pre>
		 * Toast instances map.
		 * The map format is as follows.
		 * {toastId: toastobject}
		 * </pre>
		 * @type object
		 */
		var contents = {};

		return _Base.extend(/** @lends module:ToastManager.prototype */ {
			/**
			 * <pre>
			 * HTML template for ToastManager class.
			 * See ../template/toastManager.html.
			 * </pre>
			 * @type string
			 * @private
			 */
			template: undefined,
			/**
			 * <pre>
			 * Default variables there are binded to template string.
			 * There are used instead of the constructor arguments.
			 * </pre>
			 * @type object
			 * @private
			 */
			embedded: {},
			/**
			 * <pre>
			 * Display time of toast.
			 * </pre>
			 * @type number
			 * @default 3000
			 * @private
			 */
			displayTime: undefined,
			/**
			 * <pre>
			 * Initializes.
			 * </pre>
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			init: function(/* object */ args) {
				args = args || {};
				if (isCreated) {
					throw new Error('The instance is already created.');
				}
				isCreated = true;

				this._super(args);
			},
			/**
			 * <pre>
			 * Initializes the instance properties.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this.template = template;
				this.id = CONSTANTS.ID;
				this.setDisplayTime(args.displayTime || materialConfig.TOAST_DISPLAY_TIME);
			},
			/**
			 * <pre>
			 * Returns specified toast instance element node.
			 * </pre>
			 * @param {string} id Toast instance id.
			 * @returns {node} The toast element node.
			 */
			getToastNode: function(/* string */ id) {
				var toast;
				if (!id) {
					return null;
				}
				toast = contents[id];
				if (!toast) {
					return null;
				}
				return toast.rootNode;
			},
			/**
			 * <pre>
			 * Shows a toast.
			 * </pre>
			 * @param {string|node} content Toast content.
			 * @param {number} displayTime Display time of toast.
			 * @returns {string} The toast id.
			 */
			show: function(/* string|node */ content, /* number */ displayTime) {
				var args, toast;

				content = content || '';
				if ('string' !== typeof content &&
						document.DOCUMENT_FRAGMENT_NODE !== content.nodeType &&
						document.ELEMENT_NODE !== content.nodeType ||
						!content) {
					return undefined;
				}

				args = {content: content};
				toast = new Toast(args);
				contents[toast.id] = toast;

				this.rootNode.appendChild(toast.rootNode);

				displayTime = isNaN(displayTime) || displayTime < 0 ? this.displayTime : displayTime;
				setTimeout((function(displayTime, toast) {
					toast.show().then(function(displayTime, toast) {
						if (0 === displayTime) {
							return;
						}

						setTimeout((function(toast) {
							this.hide(toast.id);
						}).bind(this, toast), displayTime);
					}.bind(this, displayTime, toast));
				}).bind(this, displayTime, toast), 50);

				return toast.id;
			},
			/**
			 * <pre>
			 * Hides toast.
			 * Deletes after completion to hide.
			 * </pre>
			 * @param {string} id Toast instance id.
			 * @returns none.
			 */
			hide: function(/* string */ id) {
				var toast;
				if (!id) {
					return;
				}
				toast = contents[id];
				if (!toast) {
					return;
				}
				
				toast.hide().then((function() {
					this._deleteToast(toast.id);
				}).bind(this));
			},
			/**
			 * <pre>
			 * Deletes toast instance.
			 * </pre>
			 * @protected
			 * @param {string} id Toast instance id.
			 * @returns none.
			 */
			_deleteToast: function(/* string */ id) {
				contents[id].destroy();
				contents[id] = null;
				delete contents[id];
			},
			/**
			 * <pre>
			 * Sets the display time of toast.
			 * </pre>
			 * @param {number} displayTime Display time[ms].
			 * @returns none.
			 */
			setDisplayTime: function(/* number */ displayTime) {
				if ('number' !== typeof displayTime) {
					return;
				}
				this.displayTime = displayTime;
			},
			/**
			 * <pre>
			 * Returns instance id.
			 * </pre>
			 * @protected
			 * @returns {string} object's id.
			 */
			_getId: function() {
				return this.id;
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete toasts.
			 * </pre>
			 * @returns none
			 */
			destroy: function() {
				var key;
				for (key in contents) {
					this._deleteToast(key);
				}

				this._super();

				isCreated = false;
			}
		});
	}
);
