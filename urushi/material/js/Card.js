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
 *  buttonClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of button widget.
 *  buttonLabel
 *		type			: string
 *		specification	: optional
 *		default value	: 'Button Name'
 *		descriptoin		: Label of button.
 *	buttonClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of button widget. For the theme color, read test/button/index.html.
 *	isActionButton
 *		type			: boolean
 *		specification	: optional
 *		default value	: false
 *		descriptoin		: Specify to display button on action area.
 * </pre>
 * @example
 *	require(['Card'], function (Card) {
 *		var card = new Card({
 *			id : 'myCard',
 *			inputClass : 'card-info',
 *			additionalClass : '',
 *			title : 'Title title',
 *			content : 'main contents',
 *			action : 'additional messsage.'
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
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:_Base
 * @requires module:Button
 * @requires card.html
 */
define(
	'Card',
	[
		'Urushi',
		'_Base',
		'Button',
		'text!cardTemplate'
	],
	/**
	 * @class
	 * @augments module:_Base
	 * @alias module:Card
	 * @returns {object} Card instance.
	 */
	function (urushi, _Base, Button, template) {
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
			EMBEDDED : {cardClass : '', additionalClass : '', title : '', content : '', buttonClass : '', buttonLabel : 'Button Name', titleImg : ''}
		};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return _Base.extend(/** @lends module:Card.prototype */ {

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
			 * @see {@link module:_Base}#embedded
			 * @type object
			 * @private
			 */
			embedded : undefined,
			/**
             * <pre>
             * アクションボタン
             * </pre>
             * @type Button
             * @private
             */
            actionButton : null,
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
			 * Sets contents to body, title and actionButton.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption : function (/* object */ args) {
				this.setContent(args.content);
				this.setTitle(args.title);
				this.setTitleImg(args.titleImg);
				this.setActionButton(args);
			},
			/**
			 * <pre>
			 * Sets content to the title.
			 * </pre>
			 * @param {string} title Content strings.
			 * @returns none.
			 */
			setTitle : function (/* string */ title) {
				if (urushi.setDomContents(this.titleSpanNode, title)) {
					if (this.titleSpanNode.textContent) {
						this.titleSpanNode.classList.remove('hidden');
					} else {
						this.titleSpanNode.classList.add('hidden');
					}
				} else {
				}
			},
			/**
			 * <pre>
			 * Sets image to the title.
			 * </pre>
			 * @param {string} titleImg ImagePath.
			 * @returns none.
			 */
			setTitleImg : function (/* string */ titleImg) {
				if(titleImg){
					this.titleSpanNode.classList.add('card-title-span-img');
					this.titleImgNode.classList.remove('hidden');
				} else {
					this.titleImgNode.classList.add('hidden');
				}
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
			 * Sets whether to display action button or not.
			 * </pre>
			 * @param {args} is Whether to display action button or not.
			 * @returns none.
			 */
			setActionButton : function (/* object */ args) {
				if ('boolean' !== typeof  args.isActionButton) {
					this.actionNode.classList.add('hidden');
					return;
				}
				if (args.isActionButton) {
					this.actionNode.classList.remove('hidden');
					this.actionButton = new Button({label : args.buttonLabel, buttonClass : args.buttonClass});
					this.actionNode.appendChild(this.actionButton.rootNode);
				} else {
					this.actionNode.classList.add('hidden');
				}
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * titleNode : Title.
			 * contentNode : Body.
			 * actionNode : Action.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode : function () {
				this.titleNode = this.rootNode.getElementsByClassName('card-title')[0];
				this.titleImgNode = this.rootNode.getElementsByClassName('card-title-img')[0];
				this.titleSpanNode = this.rootNode.getElementsByClassName('card-title-span')[0];
				this.contentNode = this.rootNode.getElementsByClassName('card-content')[0];
				this.actionNode = this.rootNode.getElementsByClassName('card-action')[0];
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
