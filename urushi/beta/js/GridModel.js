/**
 * @fileOverView GridModel object for project application base.
 * @author Yasuhiro Murata
 * @version 1.0
 */
/**
 * <pre>
 * urushi for material design のコンポーネントであるGridModelの定義。
 *
 * constructor引数
 *	dataList
 *		type			: array
 *		specification	: 必須
 *		descriptoin		: Gridに表示させるmodel。
 * </pre>
 *
 * @example
 *	require(['GridModel'], function(GridModel) {
 *		var model = new GridModel({
 *			dataList: []
 *		});
 *	});
 *
 * @module GridModel
 * @requires module:extend
 */
define(
	'GridModel', [
		'extend'
	],
	/**
	 * @alias module:GridModel
	 * @returns {Object} GridModel object.
	 */
	function(extend) {
		'use strict';

		return Class.extend({
			/**
			 * <pre>
			 * Gridにて表示するデータを保持する配列要素
			 * </pre>
			 * @type array
			 */
			dataList: undefined,

			/**
			 * <pre>
			 * GridModel初期化処理
			 * </pre>
			 * @function
			 * @param {Object} args 初期化時に必要な引数
			 * @returns none.
			 */
			init: function(/* Object */ args) {
				var _args = args || {};
				this._initProperties(_args);
				if (!Array.isArray(_args.dataList)) {
					return;
				}
				this.dataList = _args.dataList;
			},
			/**
			 * <pre>
			 * GridModel内で使用する変数の初期化
			 * </pre>
			 * @function
			 * @param {Object} args 初期化時に必要な引数
			 * @private
			 * @returns none.
			 */
			_initProperties: function(/* Object */ args) {
				this.dataList = [];
			},
			/**
			 * <pre>
			 * Gridが保持するdataListの要素数を返す関数
			 * </pre>
			 * @function
			 * @returns {number} dataListの要素数
			 */
			getItemsLength: function() {
				return this.dataList.length;
			},
			/**
			 * <pre>
			 * Gridが保持する全件データを返す関数。
			 * </pre>
			 * @function
			 * @returns {array} dataList全件
			 */
			getFullData: function() {
				return this.dataList;
			},
			/**
			 * <pre>
			 * Gridの一行分のデータを返す関数。
			 * </pre>
			 * @function
			 * @param {number} index dataListにおけるindex値
			 * @returns {object} data
			 */
			getItem: function(/* number */ index) {
				return this.dataList[index];
			},
			/**
			 * <pre>
			 * 引数にて受け取る始点と表示項目数に従い、
			 * dataListから該当データを切り出し返却する。
			 * 始点は配列の添え字の概念に従い、0始まりとする。
			 * </pre>
			 * @function
			 * @param {number} start dataListの始点
			 * @param {number} end dataListの終点
			 * @returns {array} 切り出されたdataList
			 */
			getItems: function(/* number */ start, /* number */ end) {
				var _end;
				start = 0 === start ? start : start || undefined;
				_end = (start || 0 === start) && end && start + end || undefined;
				return this.dataList.slice(start, _end);
			},
			/**
			 * <pre>
			 * dataListに複数要素を追加する関数
			 * </pre>
			 * @function
			 * @param {array} dataList 追加する要素配列
			 * @returns none.
			 */
			addItems: function(/* array */ dataList) {
				var index,
					_dataList = dataList || [],
					length = _dataList.length;

				for (index = 0; index < length; index++) {
					this.addItem(_dataList[index]);
				}
			},
			/**
			 * <pre>
			 * dataListに要素を追加する関数。
			 * </pre>
			 * @function
			 * @param {Object} data dataListに追加する要素
			 * @returns none.
			 */
			addItem: function(/* Object */ data) {
				if (null === data || undefined === data || 0 === Object.keys(data).length) {
					return;
				}
				this.dataList.push(data);
			},
			/**
			 * <pre>
			 * modelの特定データを書き換える関数。
			 * </pre>
			 * @function
			 * @param {string} name カラムのname
			 * @param {number} index dataListにおけるindex値
			 * @param {string|number|boolean} value セットする値
			 * @returns none.
			 */
			setValue: function(/* string */ name, /* number */ index, /* string or number or boolean */ value) {
				this.dataList[index][name] = value;
			},
			/**
			 * <pre>
			 * modelをクリアする関数。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			clear: function() {
				this.dataList = [];
			},
			/**
			 * <pre>
			 * modelの複数要素を削除する関数。
			 * </pre>
			 * @function
			 * @param {number} index 削除する対象要素のindex値。可変長引数で受け取る。
			 * @returns none.
			 */
			removeItems: function() {
				// var indexes,
				// 	index,
				// 	length;
				// indexes = arguments;
				// for (index = 0, length = indexes.length; index < length; index++) {
				// 	this.removeItem(indexes[index]);
				// }
				// TODO indexがずれてしまうため、その対応が必要。複数行一括削除がありそうであれば実装する。
			},
			/**
			 * <pre>
			 * modelの要素を削除する関数。
			 * </pre>
			 * @function
			 * @param {number} index 削除する対象要素のindex値
			 * @returns none.
			 */
			removeItem: function(/* number */ index) {
				this.dataList.splice(index, 1);
			},
			//trim
			/**
			 * <pre>
			 * modelの任意の2か所のデータを入れ替える関数。
			 * </pre>
			 * @function
			 * @param {number} index1 入れ替え対象の値
			 * @param {number} index2 入れ替え対象の値
			 * @returns none.
			 */
			exchange: function(/* number */ index1, /* number */ index2) {
				var temp;
				if ('number' !== typeof index1 || 'number' !== typeof index2) {
					return;
				}
				if (index1 < 0 ||
						index2 < 0 ||
						index1 > this.dataList.length - 1 ||
						index2 > this.dataList.length - 1) {

					return;
				}
				temp = this.dataList[index1];
				this.dataList[index1] = this.dataList[index2];
				this.dataList[index2] = temp;
			},
		});
	}
);
