/**
 * @fileOverView _UploadManagerListItem Object for material design definition.
 * @author ota
 * @version b1.0
 */

/**
 * <pre>
 * UploadManagerで利用する内部用クラス。
 * UploadManager以外から_UploadManagerListItemをCreateしてはいけない。
 *
 * constructor引数
 *	$data
 *		type			: Object
 *		specification	: 必須
 *		default value	: null
 *		descriptoin		: jquery.uploadのdata
 *	fileName
 *		type			: string
 *		specification	: 必須
 *		default value	: null
 *		descriptoin		: ファイル名
 *	uploadStartCallback
 *		type			: Function
 *		specification	: 必須
 *		default value	: null
 *		descriptoin		: アップロード処理開始時のコールバック
 *	destroyCallback
 *		type			: Function
 *		specification	: 必須
 *		default value	: null
 *		descriptoin		: 破棄処理時のコールバック
 * </pre>
 *
 * @module _UploadManagerListItem
 * @extends module:Input
 * @requires module:jquery
 * @requires module:Urushi
 * @requires module:Input
 * @requires module:Button
 * @requires uploadManagerListItem.html
 */
define(
	'_UploadManagerListItem',
	[
		'jquery',
		'Urushi',
		'Input',
		'Button',
		'text!uploadManagerListItemTemplate'
	],
	/**
	 * @alias module:_UploadManagerListItem
	 * @returns {Object} _UploadManagerListItem object.
	 */
	function ($, urushi, Input, Button, template) {
		'use strict';

		/**
		 * <pre>
		 * _UploadManagerListItem objectで利用する定数定義。
		 * Objectで保持しており、階層構造を持っている。
		 * </pre>
		 * @member module:_UploadManagerListItem#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
			ID_PREFIX : 'urushi._UploadManagerListItem',
			EMBEDDED : {fileName : ''},
			LABEL_UPLOAD : 'アップロード',
			LABEL_CANCEL : 'キャンセル',
			LABEL_CLOSE : '閉じる',
			MESSAGE_UPLOADING_STATUS : 'アップロード中',
			MESSAGE_UPLOADDONE_STATUS : 'アップロード完了',
		};

		/**
		 * <pre>
		 * 自動付与されるIDの接尾語。
		 * IDが自動生成される毎にインクリメントされる。
		 * </pre>
		 * @member module:_UploadManagerListItem#idNo
		 * @type number
		 * @private
		 */
		var idNo = 0,
			_UploadManagerListItem;


		_UploadManagerListItem = Input.extend({
			/**
			 * <pre>
			 * タグ構造はuploadManagerListItem.htmlを参照すること。
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
			 * アップロード完了ステータスtrueなら完了
			 * @type boolean
			 * @public
			 */
			isDone : null,
			/**
			 * jquery.uploadから渡されたdata
			 * @type Object
			 * @private
			 */
			$data : null,
			/**
			 * アップロード処理開始時のコールバック
			 * @type Function
			 * @private
			 */
			uploadStartCallback : null,
			/**
			 * キャンセル時のコールバック
			 * @type Function
			 * @private
			 */
			cancelCallback : null,
			/**
			 * クローズ時のコールバック
			 * @type Function
			 * @private
			 */
			closeCallback : null,
			/**
			 * 破棄処理のコールバック
			 * @type Function
			 * @private
			 */
			destroyCallback : null,
			/**
			 * メッセージ表示用のDomNode
			 * @type DomNode
			 * @private
			 */
			messageNode : null,
			/**
			 * input領域のDomNode
			 * @type DomNode
			 * @private
			 */
			inputNode : null,
			/**
			 * アップロードボタン
			 * @type Button
			 * @private
			 */
			buttonUpload : null,
			/**
			 * キャンセルボタン
			 * @type Button
			 * @private
			 */
			buttonCancel : null,
			/**
			 * 閉じるボタン
			 * @type Button
			 * @private
			 */
			buttonClose : null,
			/**
			 * <pre>
			 * 初期化処理。
			 * </pre>
			 * @function
			 * @param {Object} args 初期化時引数。 not nullable.
			 * @returns none.
			 */
			init : function (/* Object */ args) {
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
				this.$data = args.$data;
				this.destroyCallback = args.destroyCallback;
				this.cancelCallback = args.cancelCallback;
				this.closeCallback = args.closeCallback;
				this.uploadStartCallback = args.uploadStartCallback;
				this.isDone = false;
			},
			/**
			 * @function
			 * @private
			 * @param {Object} args
			 * @returns none
			 */
			_render : function (/* Object */ args) {
				var buttonsRoot,
					doneButtonsRoot;
				this._super(args);

				buttonsRoot = this.rootNode.getElementsByClassName('upload-manager-li-buttons')[0];
				doneButtonsRoot = this.rootNode.getElementsByClassName('upload-manager-li-done-buttons')[0];

				this.buttonUpload = this._createUploadButton();
				this.buttonCancel = this._createCancelButton();
				this.buttonClose = this._createCloseButton();

				buttonsRoot.appendChild(this.buttonCancel.getRootNode());
				buttonsRoot.appendChild(this.buttonUpload.getRootNode());
				doneButtonsRoot.appendChild(this.buttonClose.getRootNode());
			},
			/**
			 * <pre>
			 * アップロードボタンの生成
			 * </pre>
			 * @function
			 * @protected
			 * @returns none
			 */
			_createUploadButton : function () {
				return new Button({
					label : CONSTANTS.LABEL_UPLOAD,
					buttonClass : 'button-raised button-info',
				});
			},
			/**
			 * <pre>
			 * キャンセルボタンの生成
			 * </pre>
			 * @function
			 * @protected
			 * @returns none
			 */
			_createCancelButton : function () {
				return new Button({
					label : CONSTANTS.LABEL_CANCEL,
					buttonClass : 'button-raised button-default',
				});
			},
			/**
			 * <pre>
			 * 閉じるボタンの生成
			 * </pre>
			 * @function
			 * @protected
			 * @returns none
			 */
			_createCloseButton : function () {
				return new Button({
					label : CONSTANTS.LABEL_CLOSE,
					buttonClass : 'button-raised button-accent',
				});
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

				this.inputNode = this.rootNode.getElementsByClassName('upload-manager-li-filename-input')[0];
				this.messageNode = this.rootNode.getElementsByClassName('message')[0];
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
			 * イベント登録
			 * @function
			 * @private
			 * @returns none
			 */
			_bindHandler : function () {
				urushi.addEvent(this.buttonUpload.getRootNode(), 'click', this, 'upload');
				urushi.addEvent(this.buttonCancel.getRootNode(), 'click', this, 'cancel');
				urushi.addEvent(this.buttonClose.getRootNode(), 'click', this, 'close');
			},
			/**
			 * <pre>
			 * アップロードを押下した際のリスナ
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			upload : function() {
				this.buttonUpload.setDisabled(true);
				this.buttonCancel.setDisabled(true);
				this.messageNode.textContent = CONSTANTS.MESSAGE_UPLOADING_STATUS;
				this.$data.submit();
				this.uploadStartCallback(this.$data);
			},
			/**
			 * <pre>
			 * キャンセルを押下した際のリスナ
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			cancel : function() {
				this.cancelCallback();
				this.destroy();
			},
			/**
			 * <pre>
			 * クローズを押下した際のリスナ
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			close : function() {
				this.closeCallback();
				this.destroy();
			},
			/**
			 * <pre>
			 * アップロード成功ステータスに変更する
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			done : function() {
				this.messageNode.textContent = CONSTANTS.MESSAGE_UPLOADDONE_STATUS;
				this.rootNode.classList.add('done');
				this.isDone = true;
			},
			/**
			 * <pre>
			 * アップロード失敗ステータスに変更する
			 * </pre>
			 * @function
			 * @private
			 * @returns none.
			 */
			fail : function() {
				this.buttonUpload.setDisabled(false);
				this.buttonCancel.setDisabled(false);
				this.messageNode.textContent = '';
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
				urushi.removeEvent(this.buttonUpload.getRootNode(), 'click', this, 'upload');
				this.buttonUpload.destroy();
				this.buttonUpload = null;

				urushi.removeEvent(this.buttonCancel.getRootNode(), 'click', this, 'cancel');
				this.buttonCancel.destroy();
				this.buttonCancel = null;

				urushi.removeEvent(this.buttonClose.getRootNode(), 'click', this, 'close');
				this.buttonClose.destroy();
				this.buttonClose = null;

				this._super();

				this.destroyCallback(this);
			}
		});

		return _UploadManagerListItem;
	}
);
