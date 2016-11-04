/**
 * @fileOverView Hamburger class definition.
 * @author Yasuhiro Murata
 * @version 1.0
 */

/**
 * <pre>
 * Provides Hamburger class as widget.
 *
 * constructor arguments.
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	hamburgerClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of hamburger widget. For the theme color, read test/hamburger/index.html.
 *	callback
 *		type			: function
 *		specification	: optional
 *		descriptoin		: Callback function for hamburger click event.
 * </pre>
 * @example
 *	require(['Hamburger'], function(Hamburger) {
 *		var hamburger = new Hamburger({callback: function() {}});
 *		document.body.appendChild(hamburger.getRootNode());
 *	});
 *
 * @example
 * <span id="myHamburger" data-urushi-type="hamburger"></span>
 *
 * @snippet-trigger urushi-hamburger
 * @snippet-content <span id="" data-urushi-type="hamburger"></span>
 * @snippet-description urushi-hamburger
 *
 * @module Hamburger
 * @extends module:_Base
 * @requires jquery-2.1.1.js
 * @requires module:Urushi
 * @requires module:_Base
 * @requires module:legacy
 * @requires hamburger.html
 */
define(
	'Hamburger',
	[
		'jquery',
		'Urushi',
		'_Base',
		'legacy',
		'text!hamburgerTemplate'
	],
	/**
	 * @class
	 * @auguments module:_Base
	 * @alias module:Hamburger
	 * @returns {object} Hamburger instance.
	 */
	function($, urushi, _Base, legacy, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX: 'urushi.hamburger',
			EMBEDDED: {hamburgerClass: '', additionalClass: ''}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;
		
		return _Base.extend(/** @lends module:Hamburger.prototype */ {

			/**
			 * <pre>
			 * HTML template for Panel class.
			 * See ../template/panel.html.
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
			 * Callback function for hamburger click event.
			 * </pre>
			 * @type function
			 * @private
			 */
			callback: undefined,
			/**
			 * <pre>
			 * Initialzed instance properties.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.setCallback(args.callback);
			},
			/**
			 * <pre>
			 + Attachees callback function to hamburger click event.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				urushi.addEvent(this.hamburgerNode, 'click', this, '_onClickHamburger');
			},
			/**
			 * <pre>
			 * Deforms.
			 * </pre>
			 * @param {boolean} is Open or close.
			 * @returns none.
			 */
			transform: function(/* boolean */ is) {
				if (this.isDisabled() || 'boolean' !== typeof is) {
					return;
				}

				if (is) {
					this.hamburgerLineNode.classList.add('hamburger-transformed');
				} else {
					this.hamburgerLineNode.classList.remove('hamburger-transformed');
				}
			},
			/**
			 * <pre>
			 * Deforms alternately.
			 * </pre>
			 * @returns none.
			 */
			toggle: function() {
				this.transform(!this.hamburgerLineNode.classList.contains('hamburger-transformed'));
			},
			/**
			 * <pre>
			 * Set callback function to hamburger click event.
			 * </pre>
			 * @param {function} callback Calback function.
			 * @returns none.
			 */
			setCallback: function(/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callback = callback;
			},
			/**
			 * <pre>
			 * Callback function for hamburger click event.
			 * Deforms alternately.
			 * Calls user callback function.
			 * </pre>
			 * @protected
			 * @param {object} Event object.
			 * @returns none.
			 */
			_onClickHamburger: function(/* object */ event) {
				if (event) {
					event.stopPropagation();
				}
				if (this.isDisabled()) {
					return;
				}
				this.toggle();

				setTimeout(function() {
					this.callback(this.hamburgerLineNode.classList.contains('hamburger-transformed'));
				}.bind(this), 50);
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * hamburgerNode : Hamburger element node.
			 * hamburgerLineNode ： Hamburger line element node.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode: function() {
				this.hamburgerNode = this.rootNode;
				this.hamburgerLineNode = this.rootNode.getElementsByClassName('hamburger-line')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @protected
			 * @returns {string} Instance id.
			 */
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete callback functions.
			 * </pre>
			 * @returns none.
			 */
			destroy: function() {
				urushi.removeEvent(this.hamburgerNode, 'click', this, '_onClickHamburger');

				this._super();
			}
		});
	}
);
