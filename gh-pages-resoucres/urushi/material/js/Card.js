/**
 * @fileOverView Card class definition.
 * @author San Yamagami
 * @version 1.0
 */

/**
 * <pre>
 * Provides card class as widget.
 *
 * constructor arguments
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	cardClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of card widget. For the theme color, read test/card/index.html
 *	additionalClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Optional style class.
 *	title
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Title content.
  *	titleImg
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Title Image.
 *	content
 *		type			: string | node | NodeList | function
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Body contents.
 * </pre>
 * @example
 *	require(['Card'], function (Card) {
 *		var card = new Card({
 *			id : 'myCard',
 *			cardClass : 'card-info',
 *			additionalClass : '',
 *			title : 'Title title',
 *			content : 'main contents'
 *		});
 *		document.body.appendChild(card.getRootNode());
 *	});
 *
 * @example
 *	<div id="myCard" class="card-info" data-urushi-type="card" data-urushi-options='{"title" : "Title title"}'>
 *		<p>contens. test message.</p>
 *		<div>
 *			<span class="hoge">message 1</span>
 *			<span class="hoge">message 2</span>
 *		</div>
 *	</div>
 *
 * @snippet-trigger urushi-card
 * @snippet-content <div id="" data-urushi-type="card" data-urushi-options='{"title" : "Title title"}'></div>
 * @snippet-description urushi-card
 *
 * @module Card
 * @extends module:Base
 * @requires module:Urushi
 * @requires module:Base
 * @requires card.html
 */
define(
	'Card',
	[
		'Urushi',
		'Base',
		'text!cardTemplate'
	],
	/**
	 * @class
	 * @augments module:Base
	 * @alias module:Card
	 * @returns {object} Card instance.
	 */
	function (urushi, Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi.Card',
			EMBEDDED : {cardClass : '', additionalClass : '', title : '', content : '', titleImg : ''}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return Base.extend(/** @lends module:Card.prototype */ {

			/**
			 * <pre>
			 * HTML template for Card class.
			 * See ../template/card.html.
			 * </pre>
			 * @type string
			 * @private
			 */
			template : undefined,
			/**
			 * @see {@link module:Base}#embedded
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
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			/**
			 * <pre>
			 * Sets contents to body, title , title image
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption : function (/* object */ args) {
				this.setContent(args.content);
			},
			/**
			 * <pre>
			 * Sets contents to the body.
			 * </pre>
			 * @param {string|node|NodeList|function} content Body contents.
			 * @returns none.
			 */
			setContent : function (/* string|node|NodeList|function */ contents) {
				if ('function' === typeof contents) {
					contents = contents();
				}
				if (!urushi.setDomContents(this.contentNode, contents)) {
					urushi.clearDomContents(this.contentNode);
				}
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * titleNode : Title.
			 * titleNode : Title Image.
			 * titleSpanNode : Title Span.
			 * contentNode : Body.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode : function () {
				this.imgNode = this.rootNode.getElementsByClassName('card-img')[0];
				this.titleNode = this.rootNode.getElementsByClassName('card-title')[0];
				this.contentNode = this.rootNode.getElementsByClassName('card-content')[0];
			},
			/**
			 * @see {@link module:Base}#_getId
			 * @protected
			 * @returns {string} Instance id.
			 */
			_getId : function () {
				return CONSTANTS.ID_PREFIX + idNo++;
			}
		});
	}
);
