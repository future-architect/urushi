/**
 * @fileOverView FileInput Object for material design definition.
 * @author ota
 * @version b1.0
 */

/**
 * <pre>
 * urushi for material design のコンポーネントであるFileInputの定義。
 * Material DesignにおけるFileInputの挙動と見た目のデザインを提供する。
 *
 * constructor引数
 *	id
 *		type			: string
 *		specification	: 任意
 *		default value	: 自動採番されたID
 *		descriptoin		: FileInputのroot nodeにアクセスするためのID。
 *	buttonClass
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: urushi for material designで定義されたButtonのスタイルを定義できる。
 *	additionalClass
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: urushi for material designで定義されたbehavior, もしくは任意のスタイルを定義するためのクラスを指定する。
 *	label
 *		type			: string
 *		specification	: 必須
 *		default value	: 'FileInput Name'
 *		descriptoin		: Buttonに表示するラベルを設定する。
 *	allowedTypes
 *		type			: string
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: 受け入れる拡張子。複数の場合カンマ区切り。空白またはnullの場合すべてのファイルを受け入れる。
 *	url
 *		type			: string
 *		specification	: 必須
 *		default value	: ''
 *		descriptoin		: ファイルpost先のurl
 *	dropZone
 *		type			: DomNode
 *		specification	: 任意
 *		default value	: ''
 *		descriptoin		: Drag&Dropを受け入れるDom
 *
 * </pre>
 * @example
 *	require(['FileInput'], function (FileInput) {
 *		var fileInput = new FileInput({
 *			id : 'myFileInput',
 *			buttonClass : 'button-raised button-primary',
 *			additionalClass : 'disabled',
 *			label : 'File',
 *			allowedTypes : 'jpeg,jpg,png,gif',
 *		});
 *		document.body.appendChild(fileInput.getRootNode());
 *	});
 *
 * @example
 *	<input
 *		id="myFileInput"
 *		class="button-raised button-primary disabled"
 *		data-urushi-type="fileinput"
 *		data-urushi-options='{"allowedTypes" : "jpeg,jpg,png,gif", "label" : "label"}'
 *	></input>
 *
 * @snippet-trigger urushi-fileinput
 * @snippet-content <input id="" data-urushi-type="fileinput", data-urushi-options='{"allowedTypes" : "", "label" : "ボタンラベル"}'></input>
 * @snippet-description urushi-fileinput
 *
 * @module FileInput
 * @extends module:Input
 * @requires module:Urushi
 * @requires module:Input
 * @requires module:jquery
 * @requires module:jqueryUi
 * @requires module:jqueryFileupload
 * @requires module:jqueryIframeTransport
 * @requires fileInput.html
 */
define(
	'FileInput',
	[
		'Urushi',
		'Input',
		'jquery',
		'jqueryUi',
		'jqueryFileupload',
		'jqueryIframeTransport',
		'text!fileInputTemplate',
	],
	/**
	 * @alias module:Button
	 * @returns {Object} Button object.
	 */
	function (urushi, Input, $, $ui, $Fileupload, $IframeTransport, template) {
		'use strict';

		/**
		 * <pre>
		 * FileInput objectで利用する定数定義。
		 * Objectで保持しており、階層構造を持っている。
		 * </pre>
		 * @member module:FileInput#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi.FileInput',
			EMBEDDED : {buttonClass : '', additionalClass : '', label : 'FileInput Name', url : ''},
			CALLBACKID_FILE_ADD : 'add',
			CALLBACKID_FILE_NOT_ALLOWEDTYPE_ADD : 'not_allowedtype_add',
			CALLBACKID_FILE_DRAGENTER : 'dragenter',
			CALLBACKID_FILE_DRAGLEAVE : 'dragleave',
			CALLBACKID_UPLOAD_DONE : 'done',
			CALLBACKID_UPLOAD_FAIL : 'fail',
		};

		/**
		 * <pre>
		 * 自動付与されるIDの接尾語。
		 * IDが自動生成される毎にインクリメントされる。
		 * </pre>
		 * @member module:FileInput#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0,
			FileInput;

		FileInput = Input.extend({
			/**
			 * <pre>
			 * タグ構造はfileInput.htmlを参照すること。
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
			 * 受け入れる拡張子。コンストラクタのオプションから取得
			 * </pre>
			 * @type string
			 * @default ''
			 * @private
			 */
			allowedTypes : '',
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
				this.allowedTypes = args && args.allowedTypes || '';
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
				var fileInputNode;
				args = args || {};
				this._super(args);

				fileInputNode = this.getFileInputNode();
				$(fileInputNode).fileupload({
					dropZone : args.dropZone || this.rootNode,
					dataType : 'json',
					//url
					add : this._add.bind(this),
					done : this._done.bind(this),
					fail : this._fail.bind(this),
					dragenter : this._dragenter.bind(this),
					dragover : this._dragover.bind(this),
					dragleave : this._dragleave.bind(this),
				});
			},
			/**
			 * <pre>
			 * ファイル選択イベント
			 * </pre>
			 * @function
			 * @param {Object} $data Jquery.uploadからくるデータ
			 * @returns none
			 */
			_add : function (/* Object */ e, /* Object */ $data) {
				var fileName = $data.files[0].name,
					fileType = fileName.split('.').pop();

				this._fireCallback(CONSTANTS.CALLBACKID_FILE_DRAGLEAVE);
				//拡張子のチェック
				if (this.allowedTypes && this.allowedTypes.indexOf(fileType) < 0) {
					this.setValue(fileName);
					this._fireCallback(CONSTANTS.CALLBACKID_FILE_NOT_ALLOWEDTYPE_ADD, fileName);
					return;
				}
				this.setValue('');
				this._fireCallback(CONSTANTS.CALLBACKID_FILE_ADD, $data, fileName);
			},
			/**
			 * <pre>
			 * UPLOAD成功イベント
			 * </pre>
			 * @function
			 * @param {Object} $data Jquery.uploadからくるデータ
			 * @returns none
			 */
			_done : function (/* Object */ e, /* Object */ $data) {
				this._fireCallback(CONSTANTS.CALLBACKID_UPLOAD_DONE, $data.response().result, $data);
			},
			/**
			 * <pre>
			 * UPLOAD失敗イベント
			 * </pre>
			 * @function
			 * @param {Object} $data Jquery.uploadからくるデータ
			 * @returns none
			 */
			_fail : function (/* Object */ e, /* Object */ $data) {
				if ($data.errorThrown === 'abort') {
					return;
				}
				this._fireCallback(CONSTANTS.CALLBACKID_UPLOAD_FAIL, $data.errorThrown, $data);
			},
			/**
			 * <pre>
			 * dragEnterイベント
			 * </pre>
			 * @function
			 * @param {Object} e Jquery.uploadからくるイベント
			 * @returns none
			 */
			_dragenter : function(/* Object */ e) {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
					this.timeoutId = null;
				}
				if (!this.dragenter) {
					this._fireCallback(CONSTANTS.CALLBACKID_FILE_DRAGENTER);
					this.dragenter = true;
				}
			},
			/**
			 * <pre>
			 * dragOverイベント
			 * </pre>
			 * @function
			 * @param {Object} e Jquery.uploadからくるイベント
			 * @returns none
			 */
			_dragover : function(/* Object */ e) {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
					this.timeoutId = null;
				}
			},
			/**
			 * <pre>
			 * dragLeaveイベント
			 * </pre>
			 * @function
			 * @param {Object} e Jquery.uploadからくるイベント
			 * @returns none
			 */
			_dragleave : function(/* Object */ e) {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
					this.timeoutId = null;
				}
				if (this.dragenter) {
					this.timeoutId = setTimeout((function() {
						this._fireCallback(CONSTANTS.CALLBACKID_FILE_DRAGLEAVE);
						this.timeoutId = null;
						this.dragenter = false;
					}).bind(this), 100);
				}
			},
			/**
			 * <pre>
			 * ファイル選択イベントリスナ登録
			 * </pre>
			 * @function
			 * @param {function} callback 引数 1:jquery.uploadのデータ 2:ファイル名
			 * @returns none
			 */
			setOnAdd : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_FILE_ADD] = callback;
			},
			/**
			 * <pre>
			 * ファイル選択イベントリスナを削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnAdd : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_FILE_ADD] = null;
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
				this.callbackMap[CONSTANTS.CALLBACKID_FILE_NOT_ALLOWEDTYPE_ADD] = callback;
			},
			/**
			 * <pre>
			 * 不正ファイル（拡張子）選択イベントリスナを削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnNotAllowedtypeAdd : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_FILE_NOT_ALLOWEDTYPE_ADD] = null;
			},
			/**
			 * <pre>
			 * アップロード成功イベントリスナ登録
			 * </pre>
			 * @function
			 * @param {function} callback 引数 1:レスポンス返り値 2:jquery.uploadのデータ
			 * @returns none
			 */
			setOnUploadDone : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_DONE] = callback;
			},
			/**
			 * <pre>
			 * アップロード成功イベントリスナを削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnUploadDone : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_DONE] = null;
			},
			/**
			 * <pre>
			 * アップロード失敗イベントリスナ登録
			 * </pre>
			 * @function
			 * @param {function} callback 引数 1:errorThrown 2:jquery.uploadのデータ
			 * @returns none
			 */
			setOnUploadFail : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_FAIL] = callback;
			},
			/**
			 * <pre>
			 * アップロード失敗イベントリスナを削除。
			 * </pre>
			 * @function
			 * @returns none.
			 */
			removeOnUploadFail : function () {
				this.callbackMap[CONSTANTS.CALLBACKID_UPLOAD_FAIL] = null;
			},
			/**
			 * <pre>
			 * ドラッグEnterイベントリスナ登録
			 * </pre>
			 * @function
			 * @param {function} callback 引数なし
			 * @returns none
			 */
			setOnDragEnter : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_FILE_DRAGENTER] = callback;
			},
			/**
			 * <pre>
			 * ドラッグLeaveイベントリスナ登録
			 * </pre>
			 * @function
			 * @param {function} callback 引数なし
			 * @returns none
			 */
			setOnDragLeave : function (/* function */ callback) {
				if (!callback || 'function' !== typeof callback) {
					return;
				}
				this.callbackMap[CONSTANTS.CALLBACKID_FILE_DRAGLEAVE] = callback;
			},
			/**
			 * <pre>
			 * input[type=file]のDomNodeの取得。
			 * オペレーションでファイルを選択するたびにdom上に表示されるinput[type=file]は変わっていくので
			 * アクセスしたい際は毎度findする必要がある。
			 * </pre>
			 * @function
			 * @public
			 * @returns DomNode
			 */
			getFileInputNode : function () {
				return this.rootNode.getElementsByClassName('fileinput')[0];
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
			 * @see {@link module:_Base}#setDisabled
			 * @function
			 * @param {boolean} is 非活性にする場合はtrue, 活性にする場合はfalseを指定する。
			 * @returns none
			 */
			setDisabled : function (/* boolean */ is) {
				var fileInputNode;
				if (!this._super(is)) {
					return false;
				}
				this.inputNode.setAttribute('tabIndex', -1);
				fileInputNode = this.getFileInputNode();

				if (is) {
					fileInputNode.setAttribute('tabIndex', -1);
					fileInputNode.setAttribute('disabled', true);
				} else {
					fileInputNode.removeAttribute('tabIndex');
					fileInputNode.removeAttribute('disabled');
				}
				return true;
			},
		});

		return FileInput;
	}
);
