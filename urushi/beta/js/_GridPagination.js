/**
 * @fileOverView _GridPagination object for project application base.
 * @author Yasuhiro Murata
 * @version 1.0
 */
/**
 * <pre>
 * urushi for material design のコンポーネントである_GridPaginationの定義。
 * Material Designにおける_GridPaginationの挙動と見た目のデザインを提供する。
 *
 * constructor引数
 *	rowsPerPage
 *		type			: number
 *		specification	: 必須
 *		default value	: 50
 *		descriptoin		: ページあたりの表示行数を指定する。
 *	dataListLength
 *		type			: number
 *		specification	: 必須
 *		default value	: ''
 *		descriptoin		: Gridにて使用するmodelのデータ件数を指定する。
 *	grid
 *		type			: object
 *		specification	: 必須
 *		default value	: ''
 *		descriptoin		: Paginationのappend対象となるGridを指定する。
 * </pre>
 * @example
 *	require(['_GridPagination'], function (_GridPagination) {
 *		var gridPagination = new _GridPagination({
 *			rowsPerPage : 100,
 *			dataListLength : 1000,
 *			grid : new Grid()
 *		});
 *		document.body.appendChild(gridPagination.getRootNode());
 *	});
 *
 * @module _GridPagination
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:_Base
 * @requires grid.html
 */
define(
	'_GridPagination', [
		'_Base',
		'Urushi',
		'text!gridPaginationTemplate'
	],
	/**
	 * @alias module:_GridPagination
	 * @returns {Object} _GridPagination object.
	 */
	function (_Base, Urushi, template) {
		'use strict';

		/**
		 * <pre>
		 * Grid objectで利用する定数定義。
		 * Objectで保持しており、階層構造を持っている。
		 * </pre>
		 * @member module:_GridPagination#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX : 'Pagination',
			ID_PREFIX_OF_LINKS : 'Link',
			EMBEDDED : {gridClass : '', additionalClass : ''},
			NUMBER_OF_LINKS : 5
		};

		return _Base.extend({
			/**
			 * <pre>
			 * タグ構造はgridPagination.htmlを参照すること。
			 * </pre>
			 * @see {@link module:_Base}#template
			 * @type string
			 * @private
			 */
			template : undefined,
			/**
			 * <pre>
			 * 現在のページ番号を保持する
			 * </pre>
			 * @member
			 * @type number
			 * @private
			 */
			currentPageNumber : undefined,
			/**
			 * <pre>
			 * ページの総数を保持する
			 * </pre>
			 * @member
			 * @type number
			 * @private
			 */
			numberOfPages : undefined,
			/**
			 * <pre>
			 * ページネーションのLINK数を保持する
			 * </pre>
			 * @member
			 * @type number
			 * @private
			 */
			numberOfLinks : undefined,
			/**
			 * <pre>
			 * ページネーションのappend対象となるGridを保持する
			 * </pre>
			 * @member
			 * @type Object
			 * @private
			 */
			grid : undefined,
			/**
			 * <pre>
			 * 自動付与されるIDの接尾語。
			 * linksが生成される毎にインクリメントされる。
			 * </pre>
			 * @type number
			 * @private
			 */
			linksIdNo : undefined,

			/**
			 * <pre>
			 * _GridPaginationの初期化処理
			 * </pre>
			 * @function
			 * @param {Object} options 初期化に必要な情報
			 * @returns none.
			 */
			init : function (/* Object */ args) {
				var _args = args || {};
				this._super(_args);
				this._setCallbackToArrows();
			},
			/**
			 * <pre>
			 * instanceのpropertyを初期化する。
			 * </pre>
			 * @function
			 * @private
			 * @param {Object} args 初期化時に必要な引数。
			 * @returns none.
			 */
			_initProperties : function (/* Object */ args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.currentPageNumber = 1;
				this.grid = args.grid;
				this.linksIdNo = 0;
			},
			/**
			 * <pre>
			 * _GridPaginationの生成処理。
			 * 総ページ数の計算と、linksを作成を行う。
			 * またNodeへのアクセスポイントも設定している。
			 * linksNode : linksのDOMNode
			 * </pre>
			 * @function
			 * @private
			 * @param {Object} args 初期化時に必要な引数。
			 * @returns none.
			 */
			_render : function (/* Object */ args) {
				var span,
					fragment = document.createDocumentFragment(),
					index,
					length,
					_compiled = _.template(this.template);

				args = _.extend(_.clone(this.embedded), args);
				this.id = this.grid.id + CONSTANTS.ID_PREFIX;
				args = _.extend(args, {id : this.id});
				this.rootNode = $(_compiled(args))[0];


				if ('number' !== typeof args.dataListLength || 'number' !== typeof args.rowsPerPage) {
					return;
				}

				this.numberOfPages = Math.ceil(args.dataListLength / args.rowsPerPage);
				
				length = this.numberOfLinks = (this.numberOfPages < CONSTANTS.NUMBER_OF_LINKS) ? this.numberOfPages : CONSTANTS.NUMBER_OF_LINKS;
				for (index = 0; index < length; index++) {
					var pageNum = 1 + index;
					span = document.createElement('span');
					span.id = this.id + this._getLinkId();
					span.classList.add('link');
					span.textContent = pageNum;
					Urushi.addEvent(span, 'click', this, '_onClickLinks', index);
					fragment.appendChild(span);
				}
				this.linksNode = this.rootNode.getElementsByClassName('links')[0];
				this.linksNode.appendChild(fragment);
			},
			/**
			 * <pre>
			 * 作成されたDomNodeへのアクセスポイントを設定する。
			 * アクセスポイントは下記の通り。
			 *
			 * beforeNode : 戻るアイコン
			 * nextNode ： 進むアイコン
			 * currentNode ： 現在地を表示するノード
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_attachNode : function () {
				this._super();
				this.beforeNode = this.rootNode.getElementsByClassName('before')[0];
				this.nextNode = this.rootNode.getElementsByClassName('next')[0];
				this.currentNode = this.rootNode.getElementsByClassName('current')[0];
			},
			/**
			 * <pre>
			 * LINKSに対して振る連番IDを返す。
			 * </pre>
			 * @function
			 * @private
			 * @returns {string} object's id.
			 */
			_getLinkId : function () {
				return CONSTANTS.ID_PREFIX_OF_LINKS + this.linksIdNo++;
			},
			/**
			 * <pre>
			 * 矢印押下時のコールバックを設定する。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_setCallbackToArrows : function () {
				Urushi.addEvent(this.beforeNode, 'click', this, '_onClickArrows', 'before');
				Urushi.addEvent(this.nextNode, 'click', this, '_onClickArrows', 'next');
			},
			/**
			 * <pre>
			 * 初期化時に、現在値を表示するspanタグの位置を調整する。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			initEmphasize : function () {
				// this.currentNode.style.left = this.linksNode.childNodes[0].offsetLeft + 'px';
				this._emphasizeLink(this.currentPageNumber);
			},
			/**
			 * <pre>
			 * 矢印押下時のコールバック処理を定義する。
			 * </pre>
			 * @function
			 * @param {string} direction 矢印の向きを指定した文字列
			 * @returns none.
			 */
			_onClickArrows : function (/* string */ direction) {
				var pageNumber;
				if ('before' === direction) {
					pageNumber = this.currentPageNumber - 1;
					if (pageNumber < 1) {
						return;
					}
				}
				if ('next' === direction) {
					pageNumber = this.currentPageNumber + 1;
					if (pageNumber > this.numberOfPages) {
						return;
					}
				}

				this.setPage(pageNumber);
			},
			/**
			 * <pre>
			 * LINKS押下時のコールバック処理を定義する。
			 * </pre>
			 * @function
			 * @param {number} linkIndex LINKSの位置を表すindex値
			 * @returns none.
			 */
			_onClickLinks : function (/* number */ linkIndex) {
				var pageNumber;
				pageNumber = this._calculateAlignFirst(this.currentPageNumber) + linkIndex;
				this.setPage(pageNumber);
			},
			/**
			 * <pre>
			 * 受け取った数字に従い、ページ遷移を行う。
			 * </pre>
			 * @function
			 * @param {number} pageNumber ページ番号
			 * @returns none.
			 */
			setPage : function (/* number */ pageNumber) {
				var previousPageNumber = this.currentPageNumber;

				if ('number' !== typeof pageNumber) {
					return;
				}
				if (pageNumber < 1 || this.numberOfPages < pageNumber) {
					return;
				}

				this.currentPageNumber = pageNumber;

				if (previousPageNumber === this.currentPageNumber) {
					return;
				}

				this.grid._loadBody(previousPageNumber);
				this._paging(previousPageNumber, this.currentPageNumber);
			},
			/**
			 * <pre>
			 * 現在のページ番号を返す。
			 * </pre>
			 * @function
			 * @returns {number} 現在のページ番号
			 */
			getCurrentPage : function () {
				return this.currentPageNumber;
			},
			/**
			 * <pre>
			 * ページネーションを、現在値に合わせて変形する処理。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} previousPageNumber 移動前のページ番号
			 * @param {number} currentPageNumber 移動先のページ番号
			 * @returns none
			 */
			_paging : function (/* number */ previousPageNumber, /* number */ currentPageNumber) {
				if (1 === currentPageNumber) {
					this._enableArrow(false, this.beforeNode);
				} else {
					this._enableArrow(true, this.beforeNode);
				}

				if (this.numberOfPages === currentPageNumber) {
					this._enableArrow(false, this.nextNode);
				} else {
					this._enableArrow(true, this.nextNode);
				}

				this._alterLinks(previousPageNumber, currentPageNumber);
				this._emphasizeLink(currentPageNumber);
			},
			/**
			 * <pre>
			 * 矢印が有効か無効化判定し、クラスの付与・除去を行う。
			 * </pre>
			 * @function
			 * @private
			 * @param {boolean} is 有効かどうかを示す真偽値。有効の場合はtrue、無効の場合はfalse
			 * @param {object} node 矢印のnode
			 * @returns none
			 */
			_enableArrow : function (/* boolean */ is, /* Object */ node) {
				if ('boolean' !== typeof is) {
					return;
				}

				if (false === is) {
					node.classList.add('disable');
				} else {
					node.classList.remove('disable');
				}
			},
			/**
			 * <pre>
			 * LINKSの表示変更の起点となる関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} previousPageNumber 移動前のページ番号
			 * @param {number} currentPageNumber 移動先のページ番号
			 * @returns none
			 */
			_alterLinks : function (/* number */ previousPageNumber, /* number */ currentPageNumber) {
				var alignFirstOfPrevious = this._calculateAlignFirst(previousPageNumber),
					alignFirstOfCurrent = this._calculateAlignFirst(currentPageNumber);

				if (alignFirstOfPrevious === alignFirstOfCurrent) {
					return;
				}
				if (previousPageNumber < currentPageNumber) {
					this._linksAnimation(alignFirstOfCurrent, 'increase');
				} else {
					this._linksAnimation(alignFirstOfCurrent, 'decrease');
				}
			},
			/**
			 * <pre>
			 * 受け取ったページ番号に応じて、LINKSの先頭値（一番左の値）を計算する。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} pageNumber ページ番号
			 * @returns {number} LINKSの先頭値（一番左の値）
			 */
			_calculateAlignFirst : function (/* number */ pageNumber) {
				var alignFirst;

				if (this._isFormer(pageNumber)) {
					alignFirst = 1;
				} else if (this._isLatter(pageNumber)) {
					alignFirst = this.numberOfPages - this.numberOfLinks + 1;
				} else {
					alignFirst = pageNumber - Math.floor(this.numberOfLinks / 2);
				}

				return alignFirst;
			},
			/**
			 * <pre>
			 * LINKSのinnnerHTMLを書き換え、クラス付与によりアニメーションを行う関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} alignFirst LINKSの先頭値（一番左の値）
			 * @param {string} direction LINKSの移動向き
			 * @returns none
			 */
			_linksAnimation : function (/* number */ alignFirst, /* string */ direction) {
				var links = this.linksNode.childNodes,
					index,
					length = links.length,
					move1Class,
					move2,
					move2Class,
					move3;

				if ('increase' === direction) {
					move1Class = 'move1-increase';
					move2Class = 'move2-increase';
				} else {
					move1Class = 'move1-decrease';
					move2Class = 'move2-decrease';
				}

				for (index = 0; index < length; index++) {
					links[index].classList.add('invisible');
					links[index].classList.add(move1Class);
				}

				move2 = function () {
					for (index = 0; index < length; index++) {
						links[index].classList.remove(move1Class);
						links[index].classList.add(move2Class);
						links[index].textContent = alignFirst + index;
					}
				};
				setTimeout(move2, 200);

				move3 = function () {
					for (index = 0; index < length; index++) {
						links[index].classList.remove('invisible');
						links[index].classList.remove(move2Class);
					}
				};
				setTimeout(move3, 225);
			},
			/**
			 * <pre>
			 * 現在値を示すspanタグの位置を計算する。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} pageNumber ページ番号
			 * @returns none
			 */
			_emphasizeLink : function (/* number */ pageNumber) {
				var areaIndex;

				if (this._isFormer(pageNumber)) {
					areaIndex = pageNumber - 1;
				} else if (this._isLatter(pageNumber)) {
					areaIndex = this.numberOfLinks - (this.numberOfPages - pageNumber) - 1;
				} else {
					areaIndex = Math.floor(this.numberOfLinks / 2);
				}
				this.currentNode.style.left = this.linksNode.childNodes[areaIndex].offsetLeft + 'px';
			},
			/**
			 * <pre>
			 * 受け取ったページ番号が、「数値が小さいためLINKSの数値移動が発生しない範囲」
			 * に属するか判定を行う関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} pageNumber ページ番号
			 * @returns {boolean} 所属を表す真偽値
			 */
			_isFormer : function (/* number */ pageNumber) {
				return pageNumber <= Math.floor(this.numberOfLinks / 2);
			},
			/**
			 * <pre>
			 * 受け取ったページ番号が、「数値が大きいためLINKSの数値移動が発生しない範囲」
			 * に属するか判定を行う関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} pageNumber ページ番号
			 * @returns {boolean} 所属を表す真偽値
			 */
			_isLatter : function (/* number */ pageNumber) {
				return pageNumber >= this.numberOfPages - Math.floor(this.numberOfLinks / 2);
			},
			/**
			 * <pre>
			 * ページネーションを削除する関数。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			destroy : function () {
				var nodes = this.linksNode.childNodes,
					index,
					length = nodes.length;
				Urushi.removeEvent(this.beforeNode, 'click', this, '_onClickArrows');
				Urushi.removeEvent(this.nextNode, 'click', this, '_onClickArrows');
				for (index = 0; index < length; index++) {
					Urushi.removeEvent(nodes[index], 'click', this, '_onClickLinks');
				}
				this._super();
			}
		});
	}
);
