/**
 * @fileOverView Tooltip Object for material design definition.
 * @author Yuzo Hirakawa
 * @version b1.0
 */

/**
 * <pre>
 * urushi for material design のコンポーネントであるTooltipの定義。
 * Material DesignにおけるTooltipの挙動と見た目のデザインを提供する。
 *
 * constructor引数
 *	id
 *		type			: string
 *		specification	: 任意
 *		default value	: 自動採番されたID
 *		descriptoin		: Tooltipのroot nodeにアクセスするためのID。
 *	tooltipClass
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: urushi for material designで定義されたTooltipのスタイルを定義する。 Tooltipに拡張クラスは無い。
 *	additionalClass
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: urushi for material designで定義されたbehavior, もしくは任意のスタイルを定義するためのクラスを指定する。
 *	position
 *		type			: string
 *		specification	: 任意
 *		default value	: 'right'
 *		descriptoin		: ツールチップを親ノードに対して表示する位置を指定する。 top, left, right, bottomを指定可能。
 *	content
 *		type			: string
 *		specification	: 必須
 *		default value	: N/A
 *		descriptoin		: Tooltipに表示するコンテンツを設定する。
 *	parentNode
 *		type			: Element
 *		specification	: 必須
 *		default value	: N/A
 *		descriptoin		: Tooltipを表示する親ノードを指定する。
 *	on
 *		type			: string
 *		specification	: 任意
 *		default value	: 'mouseover'
 *		descriptoin		: Tooltipが表示するイベントを指定する。
 *	off
 *		type			: string
 *		specification	: 任意
 *		default value	: 'mouseout'
 *		descriptoin		: Tooltipが非表示になるイベントを指定する。
 * </pre>
 * @example
 *	require(['Tooltip'], function(Tooltip) {
 *		let tooltip = new Tooltip({
 *			id: 'myTooltip',
 *			tooltipClass: '',
 *			additionalClass: '',
 *			position: 'top',
 *			content: 'please press the buttton.',
 *			parentNode: someButtonNode,
 *			on: 'mouseover',
 *			off: 'mouseout'
 *		});
 *	});
 *
 * @example
 *	<button id="tooltipOnButton" class="buttonClass" data-urushi-type="button" data-urushi-addition-type="tooltip" data-urushi-addition-options='{"content": "tooltip message."}'>button name</button>
 *
 * @module Tooltip
 * @extends module:_Base
 * @requires module:event
 * @requires module:node
 * @requires module:materialConfig
 * @requires module:_Base
 * @requires tooltip.html
 */
define(
	'Tooltip',
	[
		'event',
		'node',
		'materialConfig',
		'_Base',
		'text!tooltipTemplate'
	],
	/**
	 * @alias module:Tooltip
	 * @returns {Object} Tooltip object.
	 */
	function(event, node, materialConfig, _Base, template) {
		'use strict';

		/**
		 * <pre>
		 * Tooltip objectで利用する定数定義。
		 * Objectで保持しており、階層構造を持っている。
		 * </pre>
		 * @member module:tooltip#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		const ATTR_URUSHI_TITLE = 'data-u-title',
			ATTR_URUSHI_POSITION = 'data-u-position',
			ID_PREFIX = 'urushi.Tooltip',
			EMBEDDED = {position: ''},
			POSITION_VALID = {'left': true, 'right': true, 'top': true, 'bottom': true},
			MARGIN = 2,
			EVENT_ON = 'mouseover',
			EVENT_OFF = 'mouseout',
			TOOLTIP_DEFAULT_DURATIOM = 200;

		/**
		 * <pre>
		 * 自動付与されるIDの接尾語。
		 * IDが自動生成される毎にインクリメントされる。
		 * </pre>
		 * @member module:tooltip#idNo
		 * @type number
		 * @private
		 */
		let idNo = 0;

		return _Base.extend({

			/**
			 * <pre>
			 * タグ構造はtooltip.htmlを参照すること。
			 * </pre>
			 * @see {@link module:_Base}#template
			 * @type string
			 * @private
			 */
			template: template,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type Object
			 * @constant
			 * @private
			 */
			embedded: EMBEDDED,
			/**
			 * <pre>
			 * Tooltipが表示中かどうかのフラグ。
			 * </pre>
			 * @type boolean
			 * @default false
			 * @private
			 */
			isShown: undefined,
			/**
			 * <pre>
			 * 親となるノードに対するtooltipを表示する位置。
			 * 下記が指定可能。
			 * 'right', 'left', 'top', 'bottom'
			 * </pre>
			 * @type string
			 * @default 'right'
			 * @private
			 */
			position: undefined,
			/**
			 * <pre>
			 * tooltipを表示するイベント。
			 * </pre>
			 * @type string
			 * @default 'mouseover'
			 * @private
			 */
			on: undefined,
			/**
			 * <pre>
			 * tooltipを非表示にするイベント。
			 * </pre>
			 * @type string
			 * @default 'mouseout'
			 * @private
			 */
			off: undefined,
			/**
			 * <pre>
			 * 作成済ノードに引き継がないAttribute
			 * </pre>
			 * @type Array
			 * @default 'mouseout'
			 * @private
			 */
			ignored: [ATTR_URUSHI_TITLE, ATTR_URUSHI_POSITION],

			/**
			 * <pre>
			 * TooltipをTemplateEngineで利用する際の属性名を返却する。
			 * </pre>
			 * @returns TemplateEngineで利用するTooltipの属性名。
			 */
			getTypeName: function() {
				return ATTR_URUSHI_TITLE;
			},
			/**
			 * <pre>
			 * TooltipをTemplateEngineで利用する際のTooltip表示位置を決定する属性名。
			 * </pre>
			 * @returns TemplateEngineで利用するTooltip表示位置を決定する属性名。
			 */
			getPositionName: function() {
				return ATTR_URUSHI_POSITION;
			},
			/**
			 * <pre>
			 * templateEngineで検出されたElementから、
			 * インスタンス化に必要な定義を抽出する。
			 * </pre>
			 * @protected
			 * @param {Element} element 置換対象のエレメント。
			 * @returns インスタンス化に必要な定義情報
			 */
			_parse: function(/* Element */ element) {
				return {
					parentNode: element,
					content: element.getAttribute('data-u-title'),
					position: element.getAttribute('data-u-position')
				};
			},
			/**
			 * <pre>
			 * Toastの初期化処理。
			 * 各パラメータをセットする。
			 * </pre>
			 * @function
			 * @param {Object} args 初期化時引数。 not nullable.
			 * @returns none.
			 */
			init: function(/* Object */ args) {
				args = args || {};
				this._super(args);

				this.setParent(args.parentNode);
				this.removeParentAttribute(args.parentNode);
				this.setContent(args.content);
				this.setPosition(args.position);
				this.setOn(args.on);
				this.setOff(args.off);
			},
			/**
			 * <pre>
			 * instanceのpropertyを初期化する。
			 * </pre>
			 * @function
			 * @param {Object} args 初期化時に必要な引数。
			 * @returns none.
			 */
			_initProperties: function(/* Object */ args) {
				this._super(args);

				this.isShown = false;
				this.position = materialConfig.TOOLTIP_DEFAULT_POSITION;
				this.on = EVENT_ON;
				this.off = EVENT_OFF;
			},
			/**
			 * <pre>
			 * 必要なElementへの参照を追加する。
			 *
			 * フィールドとしてアクセスできるノードは下記の通り。
			 * inputNode : checkedの値を保持しているinputタグ
			 * </pre>
			 * @function
			 * @returns none.
			 */
			_attachNode: function() {
				this.contentNode = this.rootNode.getElementsByClassName('popover-content')[0];
			},
			/**
			 * <pre>
			 *	ツールチップを表示する位置を指定する。
			 *	positionに指定可能な文字列は下記の通り。
			 *	'left', 'right', 'top', 'bottom'
			 *	引数を指定しなかった場合、もしくは無効な引数が指定された場合の挙動は下記の通り。
			 *	positionが設定されていなければデフォルト値をセットする。
			 *	有効なpositionが設定済であった場合は何もしない。
			 * </pre>
			 * @function
			 * @param {string} position 対象のノードにツールチップを表示する際、どこに表示するかを指定する。
			 * @returns none.
			 */
			setPosition: function(/* string */ position) {
				let _position = (('string' === typeof position) ? position : '').toLowerCase();

				if (!POSITION_VALID[_position]) {
					if (!this.rootNode.classList.contains(this.position)) {
						this.position = materialConfig.TOOLTIP_DEFAULT_POSITION;
						this.rootNode.classList.add(materialConfig.TOOLTIP_DEFAULT_POSITION);
					}
					return;
				}

				this.rootNode.classList.remove(this.position);
				this.position = _position;
				this.rootNode.classList.add(_position);
			},
			/**
			 * <pre>
			 * ツールチップを表示させる親となるノードを指定する。
			 * </pre>
			 * @function
			 * @param {Element} paarent 親ノード
			 * @returns none.
			 */
			setParent: function(/* Element */ parent) {
				if (!parent || parent.nodeType !== document.ELEMENT_NODE) {
					throw new Error('Element(ELEMENT_NODE)を指定してください。');
				}
				this.parentNode = parent;
			},
			/**
			 * <pre>
			 * Tooltipを表示する親ノードに指定されている下記属性を削除する。
			 * data-u-title
			 * data-u-position
			 * </pre>
			 * @function
			 * @param {string} off イベント名
			 * @returns none.
			 */
			removeParentAttribute: function(/* Element */ parent) {
				if (parent && parent.hasAttribute(ATTR_URUSHI_TITLE)) {
					parent.removeAttribute(ATTR_URUSHI_TITLE);
				}
				if (parent && parent.hasAttribute(ATTR_URUSHI_POSITION)) {
					parent.removeAttribute(ATTR_URUSHI_POSITION);
				}
			},
			/**
			 * <pre>
			 * tooltipを表示するイベントハンドラを設定する。
			 * </pre>
			 * @function
			 * @param {string} off イベント名
			 * @returns none.
			 */
			setOn: function(/* string */ on) {
				this._clearOn();

				this.on = 'string' === typeof on ? on : EVENT_ON;
				if (!this.on) {
					return;
				}

				event.addEvent(this.parentNode, this.on, this.show.bind(this));
			},
			/**
			 * <pre>
			 * tooltipを表示するイベントハンドラのコールバックを削除する。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			_clearOn: function() {
				event.removeEvent(this.parentNode, this.on);
			},
			/**
			 * <pre>
			 * tooltipを非表示にするイベントハンドラを設定する。
			 * </pre>
			 * @function
			 * @param {string} off イベント名
			 * @returns none.
			 */
			setOff: function(/* string */ off) {
				this._clearOff();

				this.off = 'string' === typeof off ? off : EVENT_OFF;
				if (!this.off) {
					return;
				}

				event.addEvent(this.parentNode, this.off, this.hide.bind(this));
			},
			/**
			 * <pre>
			 * tooltipを非表示にするイベントハンドラのコールバックを削除する。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			_clearOff: function() {
				event.removeEvent(this.parentNode, this.off);
			},
			/**
			 * <pre>
			 * Tooltipに表示するコンテンツを設定する。
			 * </pre>
			 * @function
			 * @param {string} content Tooltipに表示するコンテンツ
			 * @returns none.
			 */
			setContent: function(/* string */ content) {
				if (!node.setDomContents(this.contentNode, content)) {
					throw new Error('ツールチップに表示するコンテンツを指定してください。');
				}
			},
			/**
			 * <pre>
			 * tooltipを表示にする。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			show: function() {
				let viewPosition;

				if (this.isShown) {
					return;
				}
				this.isShown = true;
				if (this.parentNode.parentElement) {
					this.parentNode.parentElement.appendChild(this.rootNode);
				} else {
					document.body.appendChild(this.rootNode);
				}
				this.rootNode.style.display = 'block';

				viewPosition = this._calculatePosition();
				this.rootNode.style.top = viewPosition.top;
				this.rootNode.style.left = viewPosition.left;
				this.rootNode.classList.add('in');
			},
			/**
			 * <pre>
			 * tooltipを非表示にする。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			hide: function() {
				if (!this.isShown) {
					return;
				}
				this.isShown = false;

				this.rootNode.classList.remove('in');
				setTimeout(this.remove.bind(this), TOOLTIP_DEFAULT_DURATIOM);
			},
			/**
			 * <pre>
			 * tooltipをDOMTree上から削除する。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			remove: function() {
				this.rootNode.style.display = 'none';
				try {
					if (this.parentNode.parentElement) {
						this.parentNode.parentElement.removeChild(this.rootNode);
					} else {
						document.body.removeChild(this.rootNode);
					}
				} catch (e) {
					// do nothing.
				}
			},
			/**
			 * <pre>
			 * 指定されたポジションと親ノードの情報からツールチップの表示位置を計算する。
			 * </pre>
			 * @function
			 * @private
			 * @returns {Object} {top: 'position : absoluteで表示するtop[px]', left: 'position : absoluteで表示するleft[px]'}
			 */
			_calculatePosition: function() {
				let viewPosition = {top: '', left: ''},
					parentRects,
					parentOffset,
					parentTop,
					parentLeft,
					viewPositionCalculatorParent,
					rootNodeSize,
					arrow,
					viewPositionCalculator;

				if (!this.position) {
					return viewPosition;
				}
				parentRects = this._calculateParentRect();
				parentOffset = this._calculateParentOffsetPos();
				parentTop = parentOffset.top;
				parentLeft = parentOffset.left;

				viewPositionCalculatorParent = {
					left: {top: parentTop + parentRects.height / 2, left: parentLeft},
					right: {top: parentTop + parentRects.height / 2, left: parentLeft + parentRects.width},
					top: {top: parentTop, left: parentLeft + parentRects.width / 2},
					bottom: {top: parentTop + parentRects.height, left: parentLeft + parentRects.width / 2}
				};

				rootNodeSize = {
					height: this.rootNode.offsetHeight,
					width: this.rootNode.offsetWidth
				};
				arrow = {
					left: {where: 'width', size: 11},
					right: {where: 'width', size: 11},
					top: {where: 'height', size: 11},
					bottom: {where: 'height', size: 11}
				};
				rootNodeSize[arrow[this.position].where] += arrow[this.position].size;
				viewPositionCalculator = {
					left: {top: -(rootNodeSize.height / 2), left: -(rootNodeSize.width + MARGIN)},
					right: {top: -(rootNodeSize.height / 2), left: MARGIN},
					top: {top: -(rootNodeSize.height + MARGIN), left: -(rootNodeSize.width / 2)},
					bottom: {top: MARGIN, left: -(rootNodeSize.width / 2)}
				};

				viewPosition = {
					top: viewPositionCalculatorParent[this.position].top +
							viewPositionCalculator[this.position].top +
							'px',
					left: viewPositionCalculatorParent[this.position].left +
							viewPositionCalculator[this.position].left +
							'px'
				};

				return viewPosition;
			},

			/**
			 * <pre>
			 * ターゲットのRectを計算
			 * </pre>
			 * @function
			 * @protected
			 * @returns {Object}
			 */
			_calculateParentRect: function() {
				return this.parentNode.getClientRects().length ? this.parentNode.getClientRects()[0] : {
					top: 0,
					left: 0,
					height: 0,
					width: 0
				};
			},
			/**
			 * <pre>
			 * ツールチップの親ノードとターゲットの差分位置を計算
			 * </pre>
			 * @function
			 * @protected
			 * @returns {Object} {top: offsetTop位置, left: offsetLeft}
			 */
			_calculateParentOffsetPos: function() {
				return {
					top: this.parentNode.offsetTop,
					left: this.parentNode.offsetLeft
				};
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @private
			 * @returns {string} object's id.
			 */
			_getId: function() {
				return ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * インスタンス削除処理
			 * 親insutannsuに登録したコールバック関数を解除する。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			destroy: function() {
				this._clearOn();
				this._clearOff();

				this._super();
			}
		});
	}
);
