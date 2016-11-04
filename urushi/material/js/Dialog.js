/**
 * @fileOverView Dialog class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides Dialog class as widget.
 *
 * constructor arguments
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	additionalClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	header
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Header content.
 *	content
 *		type			: string|node|NodeList|function
 *		specification	: required
 *		default value	: N/A
 *		descriptoin		: Contents of dialog body.
 *	footer
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Footer content.
 *	parentNode
 *		type			: node
 *		specification	: optional
 *		default value	: ddocument.body
 *		descriptoin		: Place to show the modal and dialog.
 *	isDisplayCloseIcon
 *		type			: boolean
 *		specification	: optional
 *		default value	: true
 *		descriptoin		: A flag indicating whether or not to display the icon.
 * </pre>
 * @example
 *	require(['Dialog'], function(Dialog) {
 *		var dialog = new Dialog({
 *			id: 'myDialog',
 *			dialogClass: 'dialog-primary',
 *			additionalClass: 'emphasis',
 *			header: 'Dialog name',
 *			content: 'contens.<br /><div>...</div>',
 *			footer: 'footer content',
 *			parentNode: document.body,
 *			isDisplayCloseIcon: false
 *		});
 *		document.body.appendChild(dialog.getRootNode());
 *		dialog.show();
 *	});
 *
 * @example
 *	<div
 *		id="myDialog"
 *		class="dialog-primary emphasis"
 *		data-urushi-type="dialog"
 *		data-urushi-options='{"header": "Dialog name", "footer": "footer content", "parentNode": document.body, "isDisplayCloseIcon': false}'>
 *
 *		<p>contens. test message.</p>
 *		<div>
 *			<span class="hoge">message 1</span>
 *			<span class="hoge">message 2</span>
 *		</div>
 *	</div>
 *
 * @snippet-trigger urushi-dialog
 * @snippet-content <div id="" data-urushi-type="dialog" data-urushi-options='{"header": "Header name"}'>Dialog contents</div>
 * @snippet-description urushi-dialog
 *
 * @module Dialog
 * @extends module:Panel
 * @requires jquery-2.1.1.js
 * @requires module:Urushi
 * @requires module:materialConfig
 * @requires module:Panel
 * @requires dialog.html
 */
define(
	'Dialog',
	[
		'jquery',
		'Urushi',
		'materialConfig',
		'Panel',
		'text!dialogTemplate'
	],
	/**
	 * @class
	 * @augments module:Panel
	 * @alias module:Dialog
	 * @returns {object} Dialog instance.
	 */
	function($, urushi, materialConfig, Panel, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			EMBEDDED: {additionalClass: ''},
			ID_PREFIX: 'urushi.dialog'
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return Panel.extend(/** @lends module:Dialog.prototype */ {
			/**
			 * <pre>
			 * HTML template for Dialog class.
			 * See ../template/dialog.html.
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
			 * Parent element node serving as a display range of the dialog.
			 * </pre>
			 * @type node
			 * @default document.body
			 * @private
			 */
			parentNode: undefined,
			/**
			 * <pre>
			 * Indicates whether the dialog is displayed.
			 * </pre>
			 * @type boolean
			 * @private
			 */
			isShown: undefined,

			/**
			 * <pre>
			 * Shows the dialog.
			 * </pre>
			 * @returns none.
			 */
			show: function() {
				var transformOffset;
				if (this.isShown) {
					return;
				}
				this.isShown = true;

				this.parentNode.classList.add('modal-open');

				this._createUnderlay();

				urushi.addEvent(this.rootNode, 'keydown', this, '_onKeydown');

				this.rootNode.style.display = 'block';
				setTimeout((function() {
					if (urushi.hasTransitionSupport()) {
						this.rootNode.classList.add('in');
						this.underlayNode.classList.add('in');
					} else {
						transformOffset = $(this.dialogNode).height() / 2;
						$(this.rootNode).css({opacity: materialConfig.DEFAULT_VALUE_OPACITY_MIN});
						$(this.dialogNode).css({'margin-top': materialConfig.DIALOG_POINT_WAITING - transformOffset});
						$(this.underlayNode).css({opacity: materialConfig.DEFAULT_VALUE_OPACITY_MIN});

						this.rootNode.classList.add('in');
						
						$(this.rootNode).animate({
							opacity: materialConfig.DEFAULT_VALUE_OPACITY_MAX
						}, materialConfig.DIALOG_ANIMATION_DURATION);
						$(this.dialogNode).animate({
							'margin-top': materialConfig.DIALOG_POINT_VIEW
						}, materialConfig.DIALOG_ANIMATION_DURATION);
						$(this.underlayNode).animate({
							opacity: materialConfig.DEFAULT_VALUE_OPACITY_MAX
						}, materialConfig.DIALOG_ANIMATION_DURATION);
					}
					this._enforceFocus();
				}).bind(this), materialConfig.DIALOG_ANIMATION_DELAY);
			},
			/**
			 * <pre>
			 * Closes the dialog.
			 * </pre>
			 * @returns none.
			 */
			hide: function() {
				var transformOffset;
				if (!this.isShown) {
					return;
				}
				this.isShown = false;

				this.parentNode.classList.remove('modal-open');

				urushi.removeEvent(this.rootNode, 'keydown', this, '_onKeydown');

				if (urushi.hasTransitionSupport()) {
					this.rootNode.classList.remove('in');
					this.underlayNode.classList.remove('in');
				} else {
					transformOffset = $(this.dialogNode).height() / 2;
					$(this.rootNode).animate({
						opacity: materialConfig.DEFAULT_VALUE_OPACITY_MIN
					}, materialConfig.DIALOG_ANIMATION_DURATION);
					$(this.dialogNode).animate({'margin-top': materialConfig.DIALOG_POINT_WAITING - transformOffset}, {
						duration: materialConfig.DIALOG_ANIMATION_DURATION,
						complete: function() {
							this.rootNode.classList.remove('in');
						}.bind(this),
					});
					$(this.underlayNode).animate({
						opacity: materialConfig.DEFAULT_VALUE_OPACITY_MIN
					}, materialConfig.DIALOG_ANIMATION_DURATION);
				}

				setTimeout((function() {
					this.rootNode.style.display = 'none';
				}).bind(this), materialConfig.DIALOG_ANIMATION_DURATION);
			},
			/**
			 * <pre>
			 * Sets title to header.
			 * </pre>
			 * @param {string} header Header strings.
			 * @returns none.
			 */
			setHeader: function(/* string */ header) {
				if (urushi.setDomContents(this.titleNode, header)) {
					if (this.titleNode.textContent) {
						this.headerNode.classList.remove('hidden');
					} else {
						this.headerNode.classList.add('hidden');
					}
				} else {
					this.headerNode.classList.add('hidden');
				}
			},
			/**
			 * <pre>
			 * Displays the close icon, or hides.
			 * </pre>
			 * @param {boolean} is To display or hide.
			 * @returns none.
			 */
			displayCloseIcon: function(/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return;
				}

				if (is) {
					this.closeIconNode.classList.remove('hidden');
				} else {
					this.closeIconNode.classList.add('hidden');
				}
			},
			/**
			 * <pre>
			 * Creates underlay.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_createUnderlay: function() {
				this.underlayNode.style.height = this.parentNode.offsetHeight;
				// for SCSS issue
				this.underlayNode.style.zIndex = 'auto';
				this.underlayNode.style.position = 'absolute';
			},
			/**
			 * <pre>
			 * Forces to give focus to the dialog.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_enforceFocus: function() {
				this.rootNode.focus();
			},
			/**
			 * <pre>
			 * It's callback function for keydown event.
			 * User press the ESC key, it closes the dialog.
			 * </pre>
			 * @protected
			 * @param {object} event Event object
			 * @returns none.
			 */
			_onKeydown: function(/* object */ event) {
				event.stopPropagation();
				if (urushi.KEYCODE.ESCAPE !== (event.which - 0)) {
					return;
				}
				this.hide();
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
				var parentNode = args.parentNode;
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.parentNode = urushi.isElementNode(parentNode) ? parentNode : materialConfig.DIALOG_PARENT_NODE;
				this.isShown = false;
			},
			/**
			 * <pre>
			 * Initializes close icon.
			 * Attaches callback function that closes dialog.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				this._super(args);

				this.rootNode.style.display = 'none';

				this.displayCloseIcon(!!args.isDisplayCloseIcon);

				urushi.addEvent(this.closeIconNode, 'click', this, 'hide');
				if (materialConfig.DIALOG_UNDERLAY_CLICK_CLOSE) {
					urushi.addEvent(this.underlayNode, 'click', this, 'hide');
				}
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * headerNode : Header.
			 * titleNode : Element node that displays title.
			 * closeIconNode : Close icon.
			 * underlayNode : Underlay of the dialog.
			 * contentNode : Content area.
			 * footerNode : Footer.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode: function() {
				this.dialogNode = this.rootNode.getElementsByClassName('modal-dialog')[0];
				this.headerNode = this.rootNode.getElementsByClassName('modal-header')[0];
				this.titleNode = this.rootNode.getElementsByClassName('modal-title')[0];
				this.closeIconNode = this.headerNode.getElementsByClassName('close')[0];
				this.underlayNode = this.rootNode.getElementsByClassName('modal-underlay')[0];
				this.contentNode = this.rootNode.getElementsByClassName('modal-body')[0];
				this.footerNode = this.rootNode.getElementsByClassName('modal-footer')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @protected
			 * @returns {string} object's id.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Remove callback function from element event.
			 * </pre>
			 * @returns none.
			 */
			destroy: function() {
				urushi.removeEvent(this.rootNode, 'keydown', this, '_onKeydown');

				urushi.removeEvent(this.closeIconNode, 'click', this, 'hide');
				urushi.removeEvent(this.underlayNode, 'click', this, 'hide');

				this._super();
			}
		});
	}
);
