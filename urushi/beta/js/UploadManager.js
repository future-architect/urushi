/**
 * @fileOverView UploadManager Object for material design definition.
 * @author ota
 * @version b1.0
 */

/**
 * <pre>
 * urushi for material design のコンポーネントであるUploadManagerの定義。
 * Material DesignにおけるUploadManagerの挙動と見た目のデザインを提供する。
 *
 * constructor引数
 *	id
 *		type			: string
 *		specification	: 任意
 *		default value	: 自動採番されたID
 *		descriptoin		: UploadManagerのroot nodeにアクセスするためのID。
 *	uploadManagerClass
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: urushi for material designで定義されたbehavior, もしくは任意のスタイルを定義するためのクラスを指定する。
 *	url
 *		type			: string
 *		specification	: 必須
 *		default value	: ''
 *		descriptoin		: ファイルをPOSTする先のURL
 *	allowedTypes
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: 受け入れる拡張子。複数の場合カンマ区切り。空白またはnullの場合すべてのファイルを受け入れる。
 * </pre>
 * @example
 *	require(['UploadManager'], function (UploadManager) {
 *		var uploadManager = new UploadManager({
 *			id : 'myFileInput',
 *			url : '/upload/url.json',
 *			allowedTypes : 'jpeg,jpg,png,gif',
 *		});
 *		document.body.appendChild(uploadManager.getRootNode());
 *	});
 *
 * @example
 *		<input
 *			id="myUploadManager"
 *			class="optional-class"
 *			data-urushi-type="UploadManager"
 *			data-urushi-options='{"url" : "/upload/url.json", "allowedTypes" : "jpeg,jpg,png,gif"}'
 *		/>
 *
 * @snippet-trigger urushi-uploadmanager
 * @snippet-content <input id="" data-urushi-type="uploadmanager" data-urushi-options='{"url" : "/...", "allowedTypes" : "csv,xls,xlsx"}'></input>
 * @snippet-description urushi-uploadmanager
 *
 * @module UploadManager
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:_Base
 * @requires module:FileInput
 * @requires module:_UploadManagerListItem
 * @requires uploadManager.html
 */
define(
	'UploadManager',
	[
		'Urushi',
		'_Base',
		'FileInput',
		'_UploadManagerListItem',
		'text!uploadManagerTemplate',
	],
	/**
	 * @alias module:UploadManager
	 * @returns {Object} UploadManager object.
	 */
	function (urushi, _Base, FileInput, UploadManagerListItem, template) {
		'use strict';

		/**
		 * <pre>
		 * UploadManager objectで利用する定数定義。
		 * Objectで保持しており、階層構造を持っている。
		 * </pre>
		 * @member module:UploadManager#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi.UploadManager',
			EMBEDDED : {uploadManagerClass : '', url : ''},
			CALLBACKID_ADD_FILE : 'add',
			CALLBACKID_NOT_ALLOWEDTYPE_ADD_FILE : 'not-allowed-type',
			CALLBACKID_UPLOAD_START : 'upload-start',
			CALLBACKID_UPLOAD_DONE : 'done',
			CALLBACKID_UPLOAD_FAIL : 'fail',
			CALLBACKID_CLOSE_UPLOADED : 'close-uploaded',
			CALLBACKID_CHANGE : 'change',
			ACTIONID_ADD_FILE : 'add',
			ACTIONID_CANCEL : 'cancel',
			ACTIONID_UPLOAD_DONE : 'done',
			LABEL_FILE_ADD : 'ファイル追加',
		};

		/**
		 * <pre>
		 * 自動付与されるIDの接尾語。
		 * IDが自動生成される毎にインクリメントされる。
		 * </pre>
		 * @member module:UploadManager#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0,
			UploadManager;

		UploadManager = _Base.extend({
			/**
			 * <pre>
			 * タグ構造はuploadManager.htmlを参照すること。
			 * </pre>
			 * @see {@link module:_Base}#template
			 * @type string
			 * @private
			 */
			template : template,
			/**
			 * @see {@link module:_Base}#embedded
			 * @type Object
			 * @constant
			 * @private
			 */
			embedded : CONSTANTS.EMBEDDED,
			/**
			 * <pre>
			 * FileInputのインスタンス
			 * </pre>
			 * @type FileInput
			 * @private
			 */
			fileinput : null,
			/**
			 * <pre>
			 * ListのDomNode
			 * </pre>
			 * @type DomNode
			 * @private
			 */
			listNode : null,
			/**
			 * <pre>
			 * POSTするurl。コンストラクタのオプションから取得
			 * </pre>
			 * @type string
			 * @private
			 */
			url : '',
			/**
			 * <pre>
			 * 受け入れる拡張子。コンストラクタのオプションから取得
			 * </pre>
			 * @type string
			 * @default ''
			 * @private
			 */
			allowedTypes : '',
			/**
			 * <pre>
			 * uploadファイルリスト
			 * </pre>
			 * @type Array
			 * @private
			 */
			items : undefined,
			/**
			 * <pre>
			 * コールバックリスナの保持用変数
			 * </pre>
			 * @type Object
			 * @private
			 */
			callbackMap : null,
			/**
			 * <pre>
			 * 初期化処理。
			 * </pre>
			 * @function
			 * @param {Object} args 初期化時引数。 not nullable.
			 * @returns none.
			 */
			init : function (/* Object */ args) {
				args = args || {};
				this._super(args);

				this._bindHandler();
			},
			/**
			 * <pre>
			 * instanceのpropertyを初期化する。
			 * </pre>
			 * @function
			 * @param {Object} args 初期化時に必要な引数。
			 * @returns none.
			 */
			_initProperties : function (/* Object */ args) {
				this._super(args);
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
				this.allowedTypes = args.allowedTypes || '';
				this.url = args.url || '';
				this.fileinput = null;//renderでセット
				this.items = [];
				this.callbackMap = {};
			},
			/**
			 * @see {@link module:_Base}#_render
			 * @function
			 * @private
			 * @param {Object} args
			 * @returns none
			 */
			_render : function (/* Object */ args) {
				var fileinputElement;
				this._super(args);

				fileinputElement = this.rootNode.getElementsByClassName('upload-manager-fileinput')[0];
				this.fileinput = new FileInput({
					url : this.url,
					label : CONSTANTS.LABEL_FILE_ADD,
					allowedTypes : this.allowedTypes,
					dropZone : this.rootNode,
				});
				fileinputElement.appendChild(this.fileinput.getRootNode());
			},
			/**
			 * <pre>
			 * _renderで作成されたDomNodeへのアクセスポイントを設定する。
			 * </pre>
			 * @function
			 * @private
			 * @returns none
			 */
			_attachNode : function () {
				this._super();

				this.listNode = this.rootNode.getElementsByClassName('upload-manager-list')[0];
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
			 * <pre>
			 * イベント登録
			 * </pre>
			 * @function
			 * @private
			 * @returns none
			 */
			_bindHandler : function () {
				this.fileinput.setOnAdd(this._onAddFileAction.bind(this));
				this.fileinput.setOnUploadDone(this._onUploadDone.bind(this));
				this.fileinput.setOnUploadFail(this._onUploadFail.bind(this));

				this.fileinput.setOnDragEnter(this._onDragEnter.bind(this));
				this.fileinput.setOnDragLeave(this._onDragLeave.bind(this));

				this.fileinput.setOnNotAllowedtypeAdd(this._onAddNotAllowedTypeFileAction.bind(this));
			},

			/**
			 * <pre>
			 * ファイル追加操作イベント
			 * </pre>
			 * @function
			 * @private
			 * @param {Object} $data jquery.uploadのdata
			 * @param {string} fileName ファイル名
			 * @returns none
			 */
			_onAddFileAction : function (/* Object */ $data, /* string */ fileName) {
				var listItem = this._createUploadManagerListItem({
					$data : $data,
					fileName : fileName,
					uploadStartCallback : (function($data) {
						this._onFileUploadStart($data.context);
					}).bind(this),
					cancelCallback : (function() {
						this._onChange(CONSTANTS.ACTIONID_CANCEL);
					}).bind(this),
					closeCallback : (function() {
						this._onCloseUploadedFile($data.context);
					}).bind(this),
					destroyCallback : this._removeItems.bind(this),
				});

				this.listNode.appendChild(listItem.getRootNode());

				$data.context = listItem;
				this.items.push(listItem);

				this._onAddFile(fileName);
			},
			/**
			 * <pre>
			 * 選択ファイルリスト管理用クラスUploadManagerListItemのインスタンス生成。
			 * </pre>
			 * @function
			 * @protected
			 * @param {Object} param インスタンス生成用のパラメータ
			 * @returns {UploadManagerListItem}
			 */
			_createUploadManagerListItem : function (/* Object */ param) {
				return new UploadManagerListItem(param);
			},
			/**
			 * <pre>
			 * 拡張子不正ファイル選択操作イベント
			 * </pre>
			 * @function
			 * @private
			 * @param {string} fileName ファイル名
			 * @returns none
			 */
			_onAddNotAllowedTypeFileAction : function (/* string */ fileName) {
				this._onAddNotAllowedTypeFile(fileName);
			},
			/**
			 * <pre>
			 * ファイル追加
			 * </pre>
			 * @function
			 * @protected
			 * @param {string} fileName ファイル名
			 * @returns none
			 */
			_onAddFile : function (/* string */ fileName) {
				this._fireCallback(CONSTANTS.CALLBACKID_ADD_FILE, fileName);
				this._onChange(CONSTANTS.ACTIONID_ADD_FILE);
			},
			/**
			 * <pre>
			 * 拡張子不正ファイル選択
			 * </pre>
			 * @function
			 * @protected
			 * @param {string} fileName ファイル名
			 * @returns none
			 */
			_onAddNotAllowedTypeFile : function (/* string */ fileName) {
				this._fireCallback(CONSTANTS.CALLBACKID_NOT_ALLOWEDTYPE_ADD_FILE, fileName);
			},
			/**
			 * <pre>
			 * ファイルUpload完了イベント
			 * </pre>
			 * @function
			 * @private
			 * @param {Object} result リクエストの返り値
			 * @param {Object} $data jquery.uploadのdata
			 * @returns none
			 */
			_onUploadDone : function (/* Object */ result, /* Object */ $data) {
				$data.context.done();
				this._onFileUploadDone(result, $data.context);
			},
			/**
			 * <pre>
			 * ファイルUpload開始
			 * </pre>
			 * @function
			 * @protected
			 * @param {UploadManagerListItem} listItem
			 * @returns none
			 */
			_onFileUploadStart : function (/* UploadManagerListItem */ listItem) {
				this._fireCallback(CONSTANTS.CALLBACKID_UPLOAD_START, listItem.getRootNode());
			},
			/**
			 * <pre>
			 * ファイルUpload完了
			 * </pre>
			 * @function
			 * @protected
			 * @param {Object} result リクエストの返り値
			 * @param {UploadManagerListItem} listItem
			 * @returns none
			 */
			_onFileUploadDone : function (/* Object */ result, /* UploadManagerListItem */ listItem) {
				this._fireCallback(CONSTANTS.CALLBACKID_UPLOAD_DONE, result, listItem.getRootNode());
				this._onChange(CONSTANTS.ACTIONID_UPLOAD_DONE);
			},
			/**
			 * <pre>
			 * ファイルUpload失敗イベント
			 * </pre>
			 * @function
			 * @private
			 * @param {string} error エラー
			 * @param {Object} $data jquery.uploadのdata
			 * @returns none
			 */
			_onUploadFail : function (/* string */ error, /* Object */ $data) {
				$data.context.fail();
				this._onFileUploadFail(error, $data.context);
			},
			/**
			 * <pre>
			 * ファイルUpload後のクローズイベント
			 * </pre>
			 * @function
			 * @protected
			 * @param {UploadManagerListItem} listItem
			 * @returns none
			 */
			_onCloseUploadedFile : function (/* UploadManagerListItem */ listItem) {
				this._fireCallback(CONSTANTS.CALLBACKID_CLOSE_UPLOADED, listItem.getRootNode());
			},

			/**
			 * <pre>
			 * ファイルUpload失敗
			 * </pre>
			 * @function
			 * @protected
			 * @param {string} error エラー
			 * @param {UploadManagerListItem} listItem
			 * @returns none
			 */
			_onFileUploadFail : function (/* string */ error, /* UploadManagerListItem */ listItem) {
				this._fireCallback(CONSTANTS.CALLBACKID_UPLOAD_FAIL, error, listItem.getRootNode());
			},
			/**
			 * <pre>
			 * 変更
			 * </pre>
			 * @function
			 * @protected
			 * @param {string} actionId
			 * @returns none
			 */
			_onChange : function (/* string */ actionId) {
				this._fireCallback(CONSTANTS.CALLBACKID_CHANGE, actionId);
			},
			/**
			 * <pre>
			 * DragEnterイベント
			 * </pre>
			 * @function
			 * @private
			 * @returns none
			 */
			_onDragEnter : function () {
				this.rootNode.classList.add('upload-manager-dragenter');
			},
			/**
			 * <pre>
			 * DragLeaveイベント
			 * </pre>
			 * @function
			 * @private
			 * @returns none
			 */
			_onDragLeave : function () {
				this.rootNode.classList.remove('upload-manager-dragenter');
			},
			/**
			 * <pre>
			 * Uploadファイルリストから削除
			 * </pre>
			 * @function
			 * @private
			 * @param {UploadManagerListItem} listItem
			 * @returns none.
			 */
			_removeItems : function(/* Object */ listItem) {
				var index,
					length;
				for (index = 0, length = this.items.length; index < length; index++) {
					if (this.items[index] === listItem) {
						//spliceメソッドで要素を削除
						this.items.splice(index, 1);
						break;
					}
				}
			},
			/**
			 * <pre>
			 * コールバック発火
			 * </pre>
			 * @function
			 * @private
			 * @param {string} id
			 * @returns none.
			 */
			_fireCallback : function(/* string */ id) {
				var callback = this.callbackMap[id];
				if (callback) {
					callback.apply(this, Array.prototype.slice.call(arguments, 1));
				}
			},
			/**
			 * <pre>
			 * アップロード開始コールバック関数の登録
			 * </pre>
			 * @function
			 * @param {function} callback アップロード開始コールバック関数 引数 1:ListItemのrootNode
			 * @returns none.
			 */
			setOnFileUploadStart : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_START] = callback;
			},
			/**
			 * <pre>
			 * アップロード開始コールバック関数を削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnFileUploadStart : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_START] = null;
			},
			/**
			 * <pre>
			 * アップロード成功コールバック関数の登録
			 * </pre>
			 * @function
			 * @param {function} callback アップロード成功コールバック関数 引数 1:リクエストの返り値  2:ListItemのrootNode
			 * @returns none.
			 */
			setOnFileUploadDone : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_DONE] = callback;
			},
			/**
			 * <pre>
			 * アップロード成功コールバック関数を削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnFileUploadDone : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_DONE] = null;
			},
			/**
			 * <pre>
			 * アップロード失敗コールバック関数の登録
			 * </pre>
			 * @function
			 * @param {function} callback アップロード失敗コールバック関数 1:jquery.uploadエラー 2:ListItemのrootNode
			 * @returns none.
			 */
			setOnFileUploadFail : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_FAIL] = callback;
			},
			/**
			 * <pre>
			 * アップロード失敗コールバック関数を削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnFileUploadFail : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_FAIL] = null;
			},
			/**
			 * <pre>
			 * ファイル選択イベントリスナ登録
			 * </pre>
			 * @function
			 * @param {function} callback 引数 1:ファイル名
			 * @returns none
			 */
			setOnAddFile : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_ADD_FILE] = callback;
			},
			/**
			 * <pre>
			 * ファイル選択イベントリスナを削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnAddFile : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_ADD_FILE] = null;
			},
			/**
			 * <pre>
			 * 不正ファイル（拡張子）選択イベントリスナ登録
			 * </pre>
			 * @function
			 * @param {function} callback 引数 1:ファイル名
			 * @returns none
			 */
			setOnNotAllowedtypeAdd : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_NOT_ALLOWEDTYPE_ADD_FILE] = callback;
			},
			/**
			 * <pre>
			 * 不正ファイル（拡張子）選択イベントリスナを削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnNotAllowedtypeAdd : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_NOT_ALLOWEDTYPE_ADD_FILE] = null;
			},
			/**
			 * <pre>
			 * 変更イベントリスナ登録
			 * ファイル選択時、ファイルアップロード成功時、キャンセル時に発火される
			 * </pre>
			 * @function
			 * @param {function} callback 引数 1:アクションID
			 * @returns none
			 */
			setOnChange : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_CHANGE] = callback;
			},
			/**
			 * <pre>
			 * 変更イベントリスナを削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnChange : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_CHANGE] = null;
			},
			/**
			 * <pre>
			 * Upload待ち件数
			 * </pre>
			 * @function
			 * @returns {number} uploadが完了していない件数
			 * @public
			 */
			countWaitFiles : function () {
				var index,
					length,
					count = 0;
				for (index = 0, length = this.items.length; index < length; index++) {
					if (!this.items[index].isDone) {
						count++;
					}
				}
				return count;
			},
			/**
			 * @see {@link module:_Base}#setDisabled
			 * @function
			 * @param {boolean} is 非活性にする場合はtrue, 活性にする場合はfalseを指定する。
			 * @returns none
			 */
			setDisabled : function (/* boolean */ is) {
				var index,
					length,
					item;
				if (!this._super(is)) {
					return false;
				}
				this.fileinput.setDisabled(is);

				if (is) {
					for (index = 0, length = this.items.length; index < length; index++) {
						item = this.items[index];
						item.buttonUpload.setDisabled(true);
						item.buttonCancel.setDisabled(true);
						item.buttonClose.setDisabled(true);
					}
				} else {
					for (index = 0, length = this.items.length; index < length; index++) {
						item = this.items[index];
						item.buttonUpload.setDisabled(false);
						item.buttonCancel.setDisabled(false);
						item.buttonClose.setDisabled(false);
					}
				}
				return true;
			},
			/**
			 * <pre>
			 * 破棄処理
			 * addしたEventの破棄処理を追加
			 * 最後にsuper.destroyをcall
			 * </pre>
			 * @function
			 * @returns none
			 * @override
			 */
			destroy : function () {
				var items = this.items.slice(0),
					index,
					length = items.length;

				for (index = 0, length = items.length; index < length; index++) {
					items[index].destroy();
				}
				this.items = [];
				if (this.fileinput) {
					this.fileinput.destroy();
					this.fileinput = null;
				}
				this._super();
			}
		});

		return UploadManager;
	}
);
