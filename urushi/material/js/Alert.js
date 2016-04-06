/**
 * @fileOverView Alert class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides Alert class as widget.
 *
 * constructor arguments
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	alertClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of alert widget. For the theme color, read test/alert/index.html.
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
 *		type			: string
 *		specification	: required
 *		default value	: N/A
 *		descriptoin		: Body contents.
 *	isDisplayCloseIcon
 *		type			: boolean
 *		specification	: optional
 *		default value	: true
 *		descriptoin		: Specify to display close button on header.
 * </pre>
 * @example
 *	require(['Alert'], function (Alert) {
 *		var alert = new Alert({
 *			id : 'myAlert',
 *			alertClass : 'alert-primary',
 *			additionalClass : '',
 *			header : 'Caution!',
 *			content : 'alert message.',
 * 			isDisplayCloseIcon : false
 *		});
 *		document.body.appendChild(alert.getRootNode());
 *		alert.show();
 *	});
 *
 * @example
 * <div id='myAlert' class="alert-primary" data-urushi-type="alert" data-urushi-options='{"header" : "Caution!", "isDisplayCloseIcon" : false}'>content</div>
 *
 * @snippet-trigger urushi-alert
 * @snippet-content <div id="" data-urushi-type="alert" data-urushi-options='{"header" : "title"}'>Alert message.</div>
 * @snippet-description urushi-alert
 *
 * @module Alert
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:materialConfig
 * @requires module:_Base
 * @requires alert.html
 */
define(
	'Alert',
	[
		'jquery',
		'Urushi',
		'materialConfig',
		'_Base',
		'text!alertTemplate'
	],
	/**
	 * @class
	 * @augments module:Alert
	 * @alias module:Alert
	 * @returns {object} Alert class.
	 */
	function ($, urushi, materialConfig, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi.alert',
			EMBEDDED : {alertClass : '', additionalClass : '', header : '', content : ''}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;
		
		return _Base.extend(/** @lends module:Alert.prototype */ {

			/**
			 * <pre>
			 * HTML template for Alert class.
			 * See ../template/alert.html.
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
			 * Animation time to close alert.
			 * </pre>
			 * @type number
			 * @private
			 */
			duration : undefined,
			/**
			 * <pre>
			 * display status of alert.
			 * </pre>
			 * @type boolean
			 * @private
			 */
			isShown : undefined,

			/**
			 * <pre>
			 * Initialize instance properties.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties : function (/* object */ args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.duration = materialConfig.DEFAULT_VALUE_DURATION;
				this.isShown = false;
			},
			/**
			 * <pre>
			 * Show close icon.
			 * Attach callback function to close icon button.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption : function (/* object */ args) {
				this.displayCloseIcon(args.isDisplayCloseIcon);
				urushi.addEvent(this.buttonNode, 'click', this, 'close');
			},
			/**
			 * <pre>
			 * It shows alert with animation.
			 * The browser supports CSS3.0, it animates by CSS3.0,
			 * not support CSS3.0, it animates by javaScript.
			 * </pre>
			 * @returns none.
			 */
			show : function () {
				if (this.isShown) {
					return;
				}
				this.isShown = true;

				if (urushi.hasTransitionSupport()) {
					this.rootNode.classList.add('in');
				} else {
					$(this.rootNode).animate({width : materialConfig.ALERT_WIDTH, opacity : materialConfig.ALERT_OPACITY_MAX}, this.duration);
				}
			},
			/**
			 * <pre>
			 * It closes alert with animation.
			 * The browser supports CSS3.0, it animates by CSS3.0,
			 * not support CSS3.0, it animates by javaScript.
			 * </pre>
			 * @returns none.
			 */
			close : function () {
				var node = this.rootNode;

				if (!this.isShown) {
					return;
				}
				this.isShown = false;

				if (urushi.hasTransitionSupport()) {
					node.classList.remove('in');
				} else {
					$(this.rootNode).animate({width : materialConfig.ALERT_WIDTH_NONE, opacity : materialConfig.ALERT_OPACITY_MIN}, this.duration);
				}

				setTimeout(function () {
					$(node).remove();
				}, this.duration);
			},
			/**
			 * <pre>
			 * Sets contents to header.
			 * </pre>
			 * @param {string|node|array} content Contents, is set in the header.
			 * @returns none.
			 */
			setHeader : function (/* string|node|array */ content) {
				if (!urushi.setDomContents(this.headerNode, content)) {
					urushi.clearDomContents(this.headerNode);
				}
			},
			/**
			 * <pre>
			 * Sets contents to content area.
			 * </pre>
			 * @param {string|node|array} content Contents, is set in the content area.
			 * @returns none.
			 */
			setContent : function (/* string|node|array */ content) {
				if (!urushi.setDomContents(this.contentNode, content)) {
					throw new Error('content is empty');
				}
			},
			/**
			 * <pre>
			 * Sets whether to display close icon or not.
			 * </pre>
			 * @param {boolean} is Whether to display close icon or not.
			 * @returns none.
			 */
			displayCloseIcon : function (/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return;
				}
				if (is) {
					this.buttonNode.classList.remove('hidden');
				} else {
					this.buttonNode.classList.add('hidden');
				}
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * buttonNode : Close icon button.
			 * headerNode ： Header.
			 * contentNode ： Content area.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode : function () {
				this.buttonNode = this.rootNode.getElementsByTagName('button')[0];
				this.headerNode = this.rootNode.getElementsByTagName('h4')[0];
				this.contentNode = this.rootNode.getElementsByTagName('p')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @protected
			 * @returns {string} Instance id.
			 */
			_getId : function () {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Remove callback function from element event.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			destroy : function () {
				urushi.removeEvent(this.buttonNode, 'click', this, 'close');

				this._super();
			}
		});
	}
);
