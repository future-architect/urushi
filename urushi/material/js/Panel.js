/**
 * @fileOverView Panel class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides panel class as widget.
 *
 * constructor arguments
 *	id
 *		type			: string
 *		specification	: optional
 *		descriptoin		: Instance identifier.
 *	panelClass
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Style class of theme color of panel widget. For the theme color, read test/panel/index.html
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
 *		type			: string | node | NodeList | function
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Body contents.
 *	footer
 *		type			: string
 *		specification	: optional
 *		default value	: ''
 *		descriptoin		: Footer content.
 * </pre>
 * @example
 *	require(['Panel'], function(Panel) {
 *		var panel = new Panel({
 *			id: 'myPanel',
 *			inputClass: 'panel-info',
 *			additionalClass: '',
 *			header: 'Header title',
 *			content: 'main contents',
 *			footer: 'additional messsage.'
 *		});
 *		document.body.appendChild(panel.getRootNode());
 *	});
 *
 * @example
 *	<div id="myPanel" class="panel-info" data-urushi-type="panel" data-urushi-options='{"header": "Header title", "footer": "additional messsage."}'>
 *		<p>contens. test message.</p>
 *		<div>
 *			<span class="hoge">message 1</span>
 *			<span class="hoge">message 2</span>
 *		</div>
 *	</div>
 *
 * @snippet-trigger urushi-panel
 * @snippet-content <div id="" data-urushi-type="panel" data-urushi-options='{"header": "Header title"}'></div>
 * @snippet-description urushi-panel
 *
 * @module Panel
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:_Base
 * @requires panel.html
 */
define(
	'Panel',
	[
		'node',
		'parser',
		'_Base',
		'text!panelTemplate'
	],
	/**
	 * @class
	 * @augments module:_Base
	 * @alias module:Panel
	 * @returns {object} Panel instance.
	 */
	function(node, parser, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		const ID_PREFIX = 'urushi.Panel';
		const EMBEDDED = {header: '', content: '', footer: ''};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		return _Base.extend(/** @lends module:Panel.prototype */ {

			/**
			 * <pre>
			 * HTML template for Panel class.
			 * See ../template/panel.html.
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
				
				Object.assign(option, parser.getOption(element));
				option.content = parser.getChildNodesFunction(element);

				return option;
			},
			/**
			 * <pre>
			 * Sets contents to body, header and fotter.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				this.setContent(args.content);
				this.setHeader(args.header);
				this.setFooter(args.footer);
			},
			/**
			 * <pre>
			 * Sets content to the header.
			 * </pre>
			 * @param {string} header Content strings.
			 * @returns none.
			 */
			setHeader: function(/* string */ header) {
				if (node.setDomContents(this.headerNode, header)) {
					if (this.headerNode.textContent) {
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
			 * Sets contents to the body.
			 * </pre>
			 * @param {string|node|NodeList|function} content Body contents.
			 * @returns none.
			 */
			setContent: function(/* string|node|NodeList|function */ contents) {
				if ('function' === typeof contents) {
					contents = contents();
				}
				if (!node.setDomContents(this.contentNode, contents)) {
					node.clearDomContents(this.contentNode);
				}
			},
			/**
			 * <pre>
			 * Sets content to the footer.
			 * </pre>
			 * @param {string} footer Content strings.
			 * @returns none.
			 */
			setFooter: function(/* string */ footer) {
				if (node.setDomContents(this.footerNode, footer)) {
					if (this.footerNode.textContent) {
						this.footerNode.classList.remove('hidden');
					} else {
						this.footerNode.classList.add('hidden');
					}
				} else {
					this.footerNode.classList.add('hidden');
				}
			},
			/**
			 * <pre>
			 * Creates access points of alert element nodes.
			 *
			 * headerNode : Header.
			 * contentNode : Body.
			 * footerNode : Footer.
			 * </pre>
			 * @protected
			 * @returns none.
			 */
			_attachNode: function() {
				this.headerNode = this.rootNode.getElementsByClassName('panel-header')[0];
				this.contentNode = this.rootNode.getElementsByClassName('panel-body')[0];
				this.footerNode = this.rootNode.getElementsByClassName('panel-footer')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @protected
			 * @returns {string} Instance id.
			 */
			_getId: function() {
				return ID_PREFIX + idNo++;
			}
		});
	}
);
