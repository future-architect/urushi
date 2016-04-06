/**
 * @fileOverView Grid object for project application base.
 * @author Yasuhiro Murata
 * @version 1.0
 */
/**
 * <pre>
 * urushi for material design のコンポーネントであるGridの定義。
 * Material DesignにおけるGridの挙動と見た目のデザインを提供する。
 *
 * constructor引数
 *	id
 *		type			: string
 *		specification	: 任意
 *		default value	: 自動採番されたID
 *		descriptoin		: Gridのroot nodeにアクセスするためのID。
 *	gridClass
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: urushi for material designで定義されたGridのスタイルを定義できる。
 *	additionalClass
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: urushi for material designで定義されたbehavior, もしくは任意のスタイルを定義するためのクラスを指定する。
 *	header
 *		type			: object
 *		specification	: 必須
 *		default value	: []
 *		descriptoin		: Gridに表示するヘッダを設定する。
 *	model
 *		type			: GridModel
 *		specification	: 必須
 *		default value	: N/A
 *		descriptoin		: Gridに表示するコンテンツを設定する。
 *	rowsPerPage
 *		type			: number
 *		specification	: 任意
 *		default value	: 50
 *		descriptoin		: 1ページ内に表示する行数を指定する。未指定の場合は50行とする。0が指定された場合は全件表示する。
 *	paginationArea
 *		type			: string
 *		specification	: 任意
 *		default value	: none
 *		descriptoin		: ページネーションの表示エリアを指定する。未指定の場合は非表示とする。
 *	selection
 *		type			: boolean
 *		specification	: 任意
 *		default value	: false
 *		descriptoin		: 選択行の管理を行うかどうかを指定する。未指定の場合はfalseとなり、選択行の管理は行われない。
 * </pre>
 * @example
 *	require(['Grid'], function (Grid) {
 *		var grid = new Grid({
 *			id : 'myGrid',
 *			gridClass : 'grid-primary',
 *			additionalClass : '',
 *			header : [
 *				'name1' : 'value1',
 *				'name2' : 'value2',
 *				'name3' : 'value3'
 *			],
 *			model : new GridModel(),
 *			rowsPerPage : 100,
 *			paginationArea : below
 *		});
 *		document.body.appendChild(grid.getRootNode());
 *	});
 *
 * @snippet-trigger urushi-grid
 * @snippet-content	<table id='' data-urushi-type='grid' data-urushi-options='{"rowsPerPage":50, "paginationArea":"above"}'>
 *			<tr>
 *				<th name='name1'>column1</th>
 *				<th name='name2'>column2</th>
 *				<th name='name3'>column3</th>
 *			</tr>
 *	</table>
 * @snippet-description urushi-grid
 *
 * @module Grid
 * @extends module:_CollectionWidgetBase
 * @requires underscore.js
 * @requires module:_CollectionWidgetBase
 * @requires module:Urushi
 * @requires module:_GridPagination
 * @requires module:_GridOption
 * @requires module:_GridColumnItem
 * @requires module:legacy
 * @requires grid.html
 */
define(
	'Grid', [
		'underscore',
		'_CollectionWidgetBase',
		'Urushi',
		'_GridPagination',
		'_GridOption',
		'_GridColumnItem',
		'legacy',
		'text!gridTemplate'
	],
	/**
	 * @alias module:Grid
	 * @returns {Object} Grid object.
	 */
	function (_, _CollectionWidgetBase, Urushi, Pagination, Option, ColumnItem, legacy, template) {
		'use strict';

		/**
		 * <pre>
		 * Grid objectで利用する定数定義。
		 * Objectで保持しており、階層構造を持っている。
		 * </pre>
		 * @member module:Grid#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi.grid',
			ROW_PREFIX : '.row-',
			EMBEDDED : {gridClass : '', additionalClass : ''},
			DEFAULT_ROWS_PER_PAGE : 50
		};
		/**
		 * <pre>
		 * 自動付与されるIDの接尾語。
		 * IDが自動生成される毎にインクリメントされる。
		 * </pre>
		 * @member module:Grid#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0;

		return _CollectionWidgetBase.extend({
			/**
			 * <pre>
			 * 1ページあたりに表示する行数を定義する。
			 * </pre>
			 * @type number
			 * @private
			 */
			rowsPerPage : undefined,
			/**
			 * <pre>
			 * ページナビゲーションの表示位置を指定する。
			 * </pre>
			 * @type string
			 * @private
			 */
			paginationArea : undefined,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type Object
			 * @constant
			 * @private
			 */
			embedded : undefined,
			/**
			 * <pre>
			 * タグ構造はgrid.htmlを参照すること。
			 * </pre>
			 * @see {@link module:_Base}#template
			 * @type string
			 * @private
			 */
			template : undefined,
			/**
			 * <pre>
			 * Gridにて使用するmodel情報を保持する
			 * </pre>
			 * @type Object
			 * @private
			 */
			model : undefined,
			/**
			 * <pre>
			 * Gridにて使用するpagination情報を保持する
			 * </pre>
			 * @type Object
			 * @private
			 */
			pagination : undefined,
			/**
			 * <pre>
			 * Gridにて使用するoptionのモジュールを管理する
			 * </pre>
			 * @type Object
			 * @private
			 */
			optionModule : undefined,
			/**
			 * <pre>
			 * Gridにて使用するoption情報を管理する
			 * </pre>
			 * @type Object
			 * @private
			 */
			option : undefined,
			/**
			 * <pre>
			 * Gridにて表示済みのDOMNodeを管理する
			 * </pre>
			 * @type Object
			 * @private
			 */
			cacheMap : undefined,
			/**
			 * <pre>
			 * Gridにて生成したmoduleのidと、modelのname、属するrowのidを管理する
			 * </pre>
			 * @type Object
			 * @private
			 */
			moduleMap : undefined,
			/**
			 * <pre>
			 * Gridにて選択された行のデータを保持する
			 * </pre>
			 * @type Object
			 * @private
			 */
			selected : undefined,
			/**
			 * <pre>
			 * Gridにて選択された行のDOMNodeを保持する
			 * </pre>
			 * @type DOMNode
			 * @private
			 */
			selectedNode : undefined,
			/**
			 * <pre>
			 * Gridにて選択された行のDOMNodeを保持する
			 * </pre>
			 * @type DOMNode
			 * @private
			 */
			selectionMode : undefined,
			/**
			 * <pre>
			 * Gridにて生成されるrowと、modelの紐づけを管理する
			 * </pre>
			 * @type Object
			 * @private
			 */
			rowMap : undefined,
			/**
			 * <pre>
			 * Gridにてmodelを保持しているか管理するフラグ
			 * </pre>
			 * @type boolean
			 * @private
			 */
			hasModel : undefined,
			/**
			 * <pre>
			 * Gridの表示情報が最新のmodelに基づいているかどうかを管理するフラグ
			 * </pre>
			 * @type boolean
			 * @private
			 */
			loaded : undefined,
			/**
			 * <pre>
			 * _adjustWidthのthisをスコープにしたもの
			 * 解放用に保持している
			 * </pre>
			 * @type function
			 * @private
			 */
			_selfScopeAdjustWidth : undefined,

			/**
			 * <pre>
			 * Gridの初期化処理
			 * 1. _setPaginationAreaにて、ページネーションエリアを設定
			 * 2. _setRowsPerpageにて、ページあたりの表示行数を設定
			 * 3. setModelに定義された処理を実行
			 * </pre>
			 * @function
			 * @param {Object} args 初期化に必要な引数
			 * @returns none.
			 */
			init : function (/* Object */ args) {
				var _args = args || {};
				this._super(_args);
				this._setSelectionMode(_args.selection);
				this._setPaginationArea(_args.paginationArea);
				this._setRowsPerPage(_args.rowsPerPage);
				this.setModel(_args.model);
				this._renderBody();
				this._selfScopeAdjustWidth = this._adjustWidth.bind(this);
				window.addEventListener('resize', this._selfScopeAdjustWidth, false);
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
				this._super(args);
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.model = undefined;
				this.pagination = undefined;
				this.rowsPerPage = undefined;
				this.paginationArea = undefined;
				this.option = undefined;
				this.optionModule = Option;
				this.cacheMap = {};
				this.moduleMap = {};
				this.selected = undefined;
				this.selectedNode = undefined;
				this.selectionMode = false;
				this.rowMap = {};
				this.hasModel = false;
				this.loaded = false;
			},
			/**
			 * <pre>
			 * 作成されたDomNodeへのアクセスポイントを設定する。
			 * アクセスポイントは下記の通り。
			 *
			 * gridNode : gridを表示するノード。gridWrapperからpaginationを除いた部分
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_attachNode : function () {
				this._super();
				this.gridNode = this.rootNode.getElementsByClassName('grid')[0];
			},
			/**
			 * @see {@link module:_Base}#_getId
			 * @function
			 * @private
			 * @returns {string} object's id.
			 */
			_getId : function () {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			/**
			 * @see {@link module:_Base}#_render
			 * @function
			 * @private
			 * @returns none.
			 */
			_render : function (/* Object */ args) {
				this._super(args);
				this.rootNode.classList.add(this.id.replace('.', '-'));
				this._renderHeader(args.header);
				this._adjustWidth();
			},
			/**
			 * <pre>
			 * Gridのヘッダ生成処理
			 * </pre>
			 * @function
			 * @private
			 * @param {array} header ヘッダ情報
			 * @returns none.
			 */
			_renderHeader : function (/* array */ header) {
				var index,
					length = header.length,
					ul,
					col,
					colArgs;

				if (null === header || undefined === header || 0 === length) {
					throw new Error('_renderHeader : Grid must need valid header');
				}

				ul = document.createElement('ul');
				ul.classList.add('row');

				for (index = 0; index < length; index++) {
					colArgs = _.clone(header[index]);
					colArgs.id = colArgs.name;
					colArgs.owner = this;
					col = new ColumnItem(colArgs);
					ul.appendChild(col.headerNode);
				}
				this.rootNode.getElementsByClassName('grid-header')[0].appendChild(ul);
			},
			/**
			 * <pre>
			 * barの幅を計算し、ヘッダとボディの表示差異を調整する
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_adjustWidth : function() {
				var outer = document.createElement('div'),
					style = outer.style,
					inner,
					barWidth;

				style.width = '500px';
				style.height = '500px';
				style.overflow = 'scroll';
				style.border = 'none';
				style.visibility = 'hidden';

				inner = outer.cloneNode(false);
				outer.appendChild(inner);
				document.body.appendChild(outer);
				outer.scrollTop = 1000;
				barWidth = outer.scrollTop;
				document.body.removeChild(outer);

				this.rootNode.getElementsByClassName('grid-header')[0].style.marginRight = barWidth + 'px';
			},
			/**
			 * <pre>
			 * セレクションモードの設定を行う。
			 * </pre>
			 * @function
			 * @private
			 * @param {boolean} is セレクションモードのON/OFF
			 * @returns none.
			 */
			_setSelectionMode : function (/* boolean */ is) {
				if (undefined === is || 'boolean' !== typeof is) {
					return;
				}
				this.selectionMode = is;
			},
			/**
			 * <pre>
			 * ページネーション表示箇所を設定する関数
			 * Grid生成後のページネーション表示箇所変更は許容しない
			 * </pre>
			 * @function
			 * @private
			 * @param {string} area ページネーション表示箇所
			 * @returns none.
			 */
			_setPaginationArea : function (/* string */ area) {
				area = ('none' === area || 'above' === area || 'below' === area) && area || 'none';
				this.paginationArea = area;
			},
			/**
			 * <pre>
			 * 1ページあたりの表示行数を設定する関数。
			 * 新たにに設定された行数にしたがい、ページネーションの再生成と表示データ更新が行われる
			 * </pre>
			 * @function
			 * @param {number} rowsPerPage ページあたりの表示行数
			 * @returns none.
			 */
			// setRowsPerPage : function (/* number */ rowsPerPage) {
			// 	this._setRowsPerPage(rowsPerPage);
			// 	this._updatePagination();
			// },
			/**
			 * <pre>
			 * 1ページあたりの表示行数を設定する内部関数。
			 * ページネーション未使用時には、自動的に全件表示に設定される。
			 * また、ページネーションの使用が設定されているにも関わらず、
			 * コンストラクタ引数にて全件表示が設定されている場合は、エラーとなる。
			 * ページネーション使用だが表示件数未指定の場合はデフォルト値が設定される。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} rowsPerPage ページあたりの表示行数
			 * @returns none.
			 */
			_setRowsPerPage : function (/* number */ rowsPerPage) {
				if ('none' === this.paginationArea) {
					this.rowsPerPage = 0;
					return;
				}
				if ('none' !== this.paginationArea && 0 === rowsPerPage) {
					throw new Error('_setRowsPerPage : Invalid Arguments');
				}
				this.rowsPerPage = rowsPerPage || CONSTANTS.DEFAULT_ROWS_PER_PAGE;
			},
			/**
			 * <pre>
			 * Gridのmodelをセットした際の処理を定義。
			 * 1. 現存するmodelをクリア
			 * 2. 新たなmodelをセット
			 * 3. 既存ページネーションを破棄・新規に生成
			 * 4. 既存表示データを破棄・新たに表示データを生成して表示
			 * </pre>
			 * @function
			 * @param {Object} model Gridにて使用するModel
			 * @returns none.
			 */
			setModel : function (/* Object */ model) {
				if (!model) {
					return;
				}
				this._clearModel();
				this._setModel(model);
				this._updatePagination();
				this.loaded = false;
			},
			/**
			 * <pre>
			 * Gridのクリア処理。
			 * setModelと真逆の処理を行う。
			 * 1. 表示されているデータを破棄
			 * 2. ページネーションを破棄
			 * 3. 保持するmodelを破棄
			 * </pre>
			 * @function
			 * @returns none.
			 */
			clear : function () {
				this._clearPage();
				this._clearPageCache();
				this._clearRowCache();
				this._destroyPagination();
				this._clearModel();
				this.loaded = false;
			},
			/**
			 * <pre>
			 * 表示データを削除する処理。
			 * データのappend対象であるBodyNodeを消し、
			 * もう一度BodyNodeを生成している。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_clearPage : function () {
				this._clearRows();
				this._renderBody();
			},
			/**
			 * <pre>
			 * BodyNodeを削除する。
			 * BodyNodeがなければデータのappendができないため、
			 * この関数は単体では呼ばず、_updatePageから呼ぶ、もしくは必ず直後に_renderBodyを呼ぶこと。
			 * </pre>
			 * @private
			 * @returns none.
			 */
			_clearRows : function () {
				if (!this.gridBodyNode) {
					return;
				}
				if (this.selectedNode) {
					this.selectedNode.classList.remove('selected');
					this.selectedNode = undefined;
					this.selected = undefined;
				}
				// this._removeEventOnRows(this.gridBodyNode.children);
				this.rootNode.getElementsByClassName('grid')[0].removeChild(this.gridBodyNode);
			},
			/**
			 * <pre>
			 * grid-body用のdivタグを生成し、append。
			 * さらにattach Nodeを行う。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_renderBody : function () {
				var gridBody = document.createElement('div');
				gridBody.classList.add('grid-body');
				this.rootNode.getElementsByClassName('grid')[0].appendChild(gridBody);
				this.gridBodyNode = this.rootNode.getElementsByClassName('grid-body')[0];
			},
			/**
			 * <pre>
			 * Grid全体にて保持する情報をクリアする。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_clearRowCache : function () {
				var id,
					row,
					index,
					colmuns = this.getColumns(),
					length;
				for (id in this.moduleMap) {
					if (this.moduleMap[id].module.destroy) {
						this.moduleMap[id].module.destroy();
					}
				}
				this.moduleMap = {};
				for (row in this.rowMap) {
					this._removeEventOnRow(this.rowMap[row].node);
				}
				this.rowMap = {};


				for (index = 0, length = colmuns.length; index < length; index++) {
					colmuns[index]._clearCells();
				}
			},
			/**
			 * <pre>
			 * rowに付与されているイベントを削除する関数。
			 * arrayを受け取る。
			 * </pre>
			 * @private
			 * @param {array} nodes イベント削除対象のDOMNode群
			 * @returns none.
			 */
			_removeEventOnRows : function (/* array */ nodes) {
				var index,
					length;
				for (index = 0, length = nodes.length; index < length; index++) {
					this._removeEventOnRow(nodes[index]);
				}
			},
			/**
			 * <pre>
			 * rowに付与されているイベントを削除する関数。
			 * 単体のDOMNodeを受け取る。
			 * </pre>
			 * @private
			 * @param {DOMNode} node イベント削除対象のDOMNode
			 * @returns none.
			 */
			_removeEventOnRow : function (/* array */ node) {
				Urushi.removeEvent(node, 'click', this, '_onSelect');
			},
			/**
			 * <pre>
			 * Grid全体にて保持する情報をクリアする。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_clearPageCache : function () {
				this.cacheMap = {};
			},
			/**
			 * <pre>
			 * 既存ページネーションを破棄する
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_destroyPagination : function () {
				if (!this.pagination) {
					return;
				}
				this.pagination.destroy();
				this.pagination = undefined;
			},
			/**
			 * <pre>
			 * Gridにて保持しているmodelをクリアする
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_clearModel : function () {
				this.model = undefined;
				this.hasModel = false;
			},
			/**
			 * <pre>
			 * modelを新たにセットする
			 * </pre>
			 * @function
			 * @private
			 * @param {Object} model Gridにて使用するmodel
			 * @returns none.
			 */
			_setModel : function (/* Object */ model) {
				if (!(model.hasOwnProperty('dataList'))) {
					throw new Error('_setModel : Invalid model.');
				}
				this.model = model;
				this.hasModel = true;
			},
			/**
			 * <pre>
			 * 既存ページネーションを破棄し、再生成を行う
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_updatePagination : function () {
				this._destroyPagination();
				this._createPagination();
			},
			/**
			 * <pre>
			 * 新たにページネーションを生成する
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_createPagination : function () {
				var dataListLength;
				if (!this.hasModel) {
					throw new Error('_createPagination : Please set model.');
				}
				if ('none' === this.paginationArea) {
					return;
				}
				dataListLength = this.model.getItemsLength();
				if (this.rowsPerPage >= dataListLength) {
					return;
				}
				this.pagination = new Pagination(
					{
						rowsPerPage : this.rowsPerPage,
						dataListLength : dataListLength,
						grid : this
					}
				);
			},
			/**
			 * <pre>
			 * 表示するページを変更する外部関数
			 * </pre>
			 * @function
			 * @param {number} pageNumber 遷移したいページ番号
			 * @returns none.
			 */
			setPage : function (/* number */ pageNumber) {
				if (!this.pagination) {
					throw new Error('No pagination is detected.');
				}
				this.pagination.setPage(pageNumber);
			},
			/**
			 * <pre>
			 * Gridをロードする関数。
			 * 保持するデータに対して、画面以外から更新がかかった際は、この関数を呼び反映させる。
			 * 引数でoptionを受け取る仕様となっているが、optionを設定する必要がない場合は省略して問題ない。
			 * </pre>
			 * @function
			 * @param {object} options gridに設定したいoption情報
			 * @returns none.
			 */
			load : function (options) {
				if (!this.hasModel) {
					throw new Error('load : Please set model.');
				}
				this._clearPageCache();
				this._clearRowCache();
				this.loaded = true;
				options = options || {};
				this._loadOption(options).then(function () {
					this._loadView();
				}.bind(this));
			},
			/**
			 * <pre>
			 * GridのOptionを設定する関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {object} options gridに設定したいoption情報
			 * @returns deferred モジュールのrequire完了を管理する
			 */
			_loadOption : function (/* Object */ options) {
				var deferred,
					name,
					moduleName,
					moduleNames = [];
				// 今後Optionが増えてきた際は、ここに記載する。
				if (0 === options.length || !(options instanceof Object)) {
					deferred = new Urushi.Deferred();
					deferred.resolve();
					return deferred;
				}

				for (name in options) {
					if (!this._isExistInColumn(name)) {
						throw new Error('_loadOption : Invalid name is detected.');
					}
					moduleName = options[name].module;
					if (-1 !== moduleNames.indexOf(moduleName)) {
						continue;
					}
					if ('icon' === moduleName) {
						continue;
					}
					moduleNames.push(moduleName);
				}

				if (!this.option) {
					this.option = new this.optionModule();
				}
				deferred = this.option.requireModules(moduleNames);

				deferred.then(function () {
					this.option.addOptions(options);
				}.bind(this));

				return deferred;
			},
			/**
			 * <pre>
			 * Gridのoptionは、カラムに付与されているnameをキーとして設定されるが、
			 * 引数で渡ってくるnameが、Gridに存在するものかどうかを判定する。
			 * </pre>
			 * @function
			 * @private
			 * @param {string} name カラムのname
			 * @returns 正常なnameを受け取っているか否か。
			 */
			_isExistInColumn : function (/* string */ name) {
				return !!this.getColumn(name);
			},
			/**
			 * <pre>
			 * GridのOptionをクリアする関数
			 * </pre>
			 * @function
			 * @returns none.
			 */
			clearOption : function () {
				if (!this.option) {
					return;
				}
				this.option = undefined;
				this.loaded = false;
			},
			/**
			 * <pre>
			 * Gridの見た目を最新化する。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_loadView : function () {
				this._renderPagination();
				this._loadBody();
			},
			/**
			 * <pre>
			 * 最新のページネーションを表示する
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_renderPagination : function () {
				if (!this.pagination) {
					return;
				}
				this.gridNode.classList.add('enablePagination');
				if ('above' === this.paginationArea) {
					this.rootNode.insertBefore(this.pagination.getRootNode(), this.rootNode.getElementsByClassName('grid')[0]);
				} else {
					this.rootNode.appendChild(this.pagination.getRootNode());
				}
				this.pagination.initEmphasize();
			},
			/**
			 * <pre>
			 * ページングの際にGridPaginationからキックされるのがこの関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} previousPageNumber 遷移前のページ番号
			 * @returns none.
			 */
			_loadBody : function (/* number */ previousPageNumber) {
				if (!this.loaded) {
					throw new Error('_loadView : Please load the Grid');
				}
				this._cachePage(previousPageNumber);
				this._clearPage();
				this._renderPage();
			},
			/**
			 * <pre>
			 * 画面の表示データをキャッシュする関数。
			 * 次のページへ遷移するタイミングで、前頁のデータがキャッシュされる。
			 * </pre>
			 * @function
			 * @private
			 * @param {number} previousPageNumber 遷移前のページ番号
			 * @returns none.
			 */
			_cachePage : function (/* number */ previousPageNumber) {
				var nodes,
					fragment,
					node;

				if (!this.gridBodyNode.children.length) {
					return;
				}
				if (!previousPageNumber) {
					return;
				}
				fragment = document.createDocumentFragment();
				nodes = this.gridBodyNode.childNodes;
				while (0 !== nodes.length) {
					node = nodes[0];
					fragment.appendChild(node);
				}
				this.cacheMap[previousPageNumber] = fragment;
			},
			/**
			 * <pre>
			 * データの表示処理。
			 * 現在のページとページあたりの表示行数をもとにmodelからデータを取得。
			 * _addRowsにデータを渡し表示を行っている。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			_renderPage : function () {
				var currentPage,
					rowsPerPage,
					start;

				if (!this.model) {
					return;
				}
				currentPage = 'none' === this.paginationArea ? 1 : this.pagination ? this.pagination.getCurrentPage() : 1;

				if (this.cacheMap[currentPage]) {
					this.gridBodyNode.appendChild(this.cacheMap[currentPage]);
				} else {
					rowsPerPage = 0 === this.rowsPerPage ? this.model.getItemsLength() : this.rowsPerPage;
					start = rowsPerPage * (currentPage - 1);
					this._addRows(this.model.getItems(start, rowsPerPage), currentPage, start);
				}
			},
			/**
			 * <pre>
			 * 複数行分のデータを追加する。
			 * 受け取ったデータを1個ずつ_addRowに渡している。
			 * </pre>
			 * @function
			 * @private
			 * @param {array} dataList Gridに追加するデータリスト
			 * @returns none.
			 */
			_addRows : function (/* array */ dataList, /* number */ pageNum, /* number */ start) {
				var index,
					_dataList = dataList || [],
					length = _dataList.length,
					fragment,
					ul;

				fragment = document.createDocumentFragment();
				for (index = 0; index < length; index++) {
					ul = this._addRow(_dataList[index], start + index);
					fragment.appendChild(ul);
				}
				this.gridBodyNode.appendChild(fragment);
			},
			/**
			 * <pre>
			 * 1行分のデータを追加する。
			 * データ情報からulを生成し、リターンしている。
			 * </pre>
			 * @function
			 * @private
			 * @param {Object} data Gridに追加する1個のデータ
			 * @returns データ情報から生成されたul.
			 */
			_addRow : function (/* Object */ data, /* number */ rowNumber) {
				var ul,
					_data = data || {},
					index,
					colmuns = this.getColumns(),
					length,
					column,
					cellNode,
					name;

				ul = document.createElement('ul');
				ul.id = this.id + CONSTANTS.ROW_PREFIX + rowNumber;
				ul.classList.add('row');
				ul.classList.add('data');
				if (this.selectionMode) {
					Urushi.addEvent(ul, 'click', this, '_onSelect', ul);
				}
				for (index = 0, length = colmuns.length; index < length; index++) {
					column = colmuns[index];
					name = column.id;
					cellNode = this._createCell(name, ul.id, _data);
					column._addCellNode(cellNode);
					ul.appendChild(cellNode);
				}
				this.rowMap[ul.id] = {
					rowNumber : rowNumber,
					node : ul
				};
				return ul;
			},
			/**
			 * <pre>
			 * cellに表示する値を取得する関数
			 * </pre>
			 * @function
			 * @private
			 * @param {string} name cellが属するcolumnのname
			 * @returns dataValue cellに表示する文字列
			 */
			_getDataValue : function (/* object */ data, /* string */ name) {
				var dataValue;
				dataValue = data[name];
				if (undefined === dataValue) {
					dataValue = '';
				}
				return dataValue;
			},
			/**
			 * <pre>
			 * cellを作成する関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {string} name cellが属するcolumnのname
			 * @param {string} id cellが属数rowのid
			 * @param {Object} data Gridに追加する1行分のデータ
			 * @returns li 生成されたcellのDOMNode
			 */
			_createCell : function (/* string */ name, /* string */ id, /* object */ data) {
				var li,
					module,
					additionalClass,
					dataValue;

				li = document.createElement('li');
				li.classList.add('column');
				li.setAttribute('name', name);

				dataValue = this._getDataValue(data, name);

				if (!this.option || !this.option.contains(name)) {
					Urushi.setDomContents(li, dataValue);
				} else if ('icon' === this.option.getModuleName(name)) {
					li.appendChild(this.option.createIcon(name, id));
				} else {
					module = this.option.createModule(name, id, dataValue);
					// ↓urushi部品にはaddOnChangeが実装されていない↓
					// if (module.addOnChangeCallback) {
					// 	module.addOnChangeCallback(function (value, index) {
					// 		this.updateItem(value, index);
					// 	}.bind(this));
					// }
					li.appendChild(module.rootNode);
					additionalClass = this.option.getAdditionalColumnStyle(name);
					if (additionalClass) {
						li.classList.add(additionalClass);
					}
					this.moduleMap[module.id] = {name : name, row : id, module : module};
				}
				return li;
			},
			/**
			 * <pre>
			 * 行が選択された際に呼ばれるコールバック関数。
			 * </pre>
			 * @function
			 * @private
			 * @param {DOMNode} node 選択された行のDOMNode
			 * @returns none.
			 */
			_onSelect : function (/* DOMNode */ node) {
				if (this.selectedNode === node) {
					return;
				}
				if (this.selectedNode) {
					this.selectedNode.classList.remove('selected');
				}
				node.classList.add('selected');
				this.selected = this.model.getItem(this.rowMap[node.id].rowNumber);
				this.selectedNode = node;
			},
			/**
			 * <pre>
			 * 選択中の行データを返す関数。
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			getSelected : function () {
				return this.selected;
			},
			/**
			 * <pre>
			 * InputやDropdownで変更された情報をmodelへ反映させる関数。
			 * urushi.gridでは未実装。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			updateItem : function (/* string or boolean */ value, /* object */ module) {
			},
			/**
			 * <pre>
			 * 複数データ追加時に呼ぶ外部関数
			 * </pre>
			 * @function
			 * @param {array} dataList 複数行データ
			 * @returns none.
			 */
			addRows : function (/* array */ dataList) {
				if (!this.hasModel) {
					throw new Error('addRows : Please set model.');
				}
				this.model.addItems(dataList);
				this._updatePagination();
				this.loaded = false;
			},
			/**
			 * <pre>
			 * データを一件追加する際に呼ぶ関数
			 * </pre>
			 * @function
			 * @param {Object} data Gridに追加する1個のデータ
			 * @returns none.
			 */
			addRow : function (/* Object */ data) {
				if (!this.hasModel) {
					throw new Error('addRow : Please set model.');
				}
				this.model.addItem(data);
				this._updatePagination();
				this.loaded = false;
			},
			/**
			 * <pre>
			 * Gridの複数行を削除する関数。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeRows : function () {
				if (!this.hasModel) {
					throw new Error('removeRows : Please set model.');
				}
				this.loaded = false;
			},
			/**
			 * <pre>
			 * Gridの行を削除する関数。
			 * </pre>
			 * @function
			 * @param {string} id 削除する行のid
			 * @returns none.
			 */
			removeRow : function (/* string */ id) {
				if (!this.hasModel) {
					throw new Error('removeRows : Please set model.');
				}
				// loadを前提としているため、各キャッシュデータの破棄は行わない。
				this.gridBodyNode.removeChild(this.rowMap[id].node);
				this.model.removeItem(this.rowMap[id].rowNumber);
				this.loaded = false;
			},
			/**
			 * <pre>
			 * Gridの選択行を削除する関数。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeSelected : function () {
				if (!this.hasModel) {
					throw new Error('removeRows : Please set model.');
				}
				this.removeRow(this.selectedNode.id);
				this.loaded = false;
			},
			/**
			 * <pre>
			 * Gridの表示を最新化する。
			 * データの変更は伴わない。
			 * データの変更を伴う表示変更の際は、loadを先に実行する。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			render : function () {
				if (!this.loaded) {
					return;
				}
				if (!this.pagination) {
					return;
				}
				this.pagination.initEmphasize();
			},
			/**
			 * <pre>
			 * Gridを表示するための処理。
			 * 引数で受け取ったNodeに対しGridをappendする。
			 * </pre>
			 * @function
			 * @param {DOMNode} node Gridをappendする対象のDOMNode
			 * @returns none.
			 */
			show : function (node) {
				node.appendChild(this.getRootNode());
				this.render();
			},
			/**
			 * <pre>
			 * nameに対応するColumn(_GridColumnItem)を返却する。
			 * </pre>
			 * @function
			 * @params {string} name GridColumnItemのname
			 * @returns {_GridColumnItem}.
			 */
			getColumn : function (/* string */ name) {
				return this.getSubItem(name);
			},
			/**
			 * <pre>
			 * Column(_GridColumnItem)のListを返却する。
			 * </pre>
			 * @function
			 * @returns {Array<_GridColumnItem>}.
			 */
			getColumns : function () {
				return this.getSubItems();
			},
			/**
			 * <pre>
			 * Columnを非表示かつ利用不能状態にする。
			 * あるいは表示かつ利用可能状態にする。
			 * </pre>
			 * @function
			 * @param {boolean} is 非表示にする場合はtrue, 表示にする場合はfalseを指定する。
			 * @param {string} name 非表示にしたいカラムname。可変長引数対応のため、カンマ区切りでいくつでも記載可。記載しない場合すべてに適用
			 * @returns {boolean}
			 */
			setHiddenColumn : function (/* boolean */ is,/* string */ name) {
				var names = Array.prototype.slice.call(arguments, 1),
					index,
					col,
					length;

				if ('boolean' !== typeof is) {
					return false;
				}
				if (0 === names.length) {
					names = this.getSubItemIds();
				}
				for (index = 0, length = names.length; index < length; index++) {
					col = this.getColumn(names[index]);
					if (!col) {
						continue;
					}

					col.setHidden(is);
				}

				return true;
			},
			/**
			 * <pre>
			 * Columnが非表示かどうかを返却する。
			 * </pre>
			 * @function
			 * @param {string} name 非表示を検査したいname
			 * @returns {boolean} コンポーネントの非表示状態
			 */
			isHiddenColumn : function (/* string */ name) {
				var col = this.getColumn(name);
				if (!col) {
					return undefined;
				}
				return col.isHidden();
			},
			/**
			 * <pre>
			 * Gridが保持するmodelを返す関数
			 * </pre>
			 * @function
			 * @returns {object} model
			 */
			getModel : function () {
				return this.model;
			},
			/**
			 * <pre>
			 * Gridがページネーションを使用しているか否かを返す関数
			 * </pre>
			 * @function
			 * @returns {boolean} flag
			 */
			isUsePaginanion : function () {
				return 'none' !== this.paginatnionArea && true || false;
			},
			/**
			 * <pre>
			 * Grid削除する関数。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			destroy : function () {
				window.removeEventListener('resize', this._selfScopeAdjustWidth, false);
				this.clear();
				this._super();
			}
		});
	}
);
