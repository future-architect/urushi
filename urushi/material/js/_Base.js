/**
 * @fileOverView _Base object definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Base class for all urushi web components.
 * If you are creating widget that has node, your class must inherit this class.
 * </pre>
 * @module _Base
 * @requires underscore.js
 * @requires extend.js
 */
define(
	'_Base',
	['legacy', 'extend', 'parser'],
	/**
	 * @class
	 * @alias module:_Base
	 * @returns {object} _Base instance.
	 */
	function(legacy, extend, parser) {
		'use strict';

		/**
		 * <pre>
		 * Cosntants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		const ID_PREFIX = 'urushi._base';
		const EMBEDDED = {};

		/**
		 * <pre>
		 * Identifier suffix number.
		 * </pre>
		 * @type number
		 */
		var idNo = 0;

		function template(str, args) {
			var key, regexp, remain, i, error;
			args = args || {};

			str = str.replace(/[\r\t\n]/g, ' ');

			for (key in args) {
				regexp = new RegExp('<%=[ ]*' + key + '[ ]*%>', 'g');
				str = str.replace(regexp, args[key]);
			}

			remain = str.match(/<%=[ a-zA-Z0-9]+%>/g);
			if (remain) {
				error = '';
				for (i = 0; i < remain.length; i++) {
					error += remain[i].replace(/<%=[ ]*/, '').replace(/[ ]*%>/, '') + ', ';
				}
				throw new Error('コンストラクタ引数エラー : ' + error);
			}

			return str;
		}

		return Class.extend(/** @lends module:_Base.prototype */ {
			/**
			 * <pre>
			 * Html string.
			 * </pre>
			 * @type string
			 * @private
			 */
			template: '',
			/**
			 * <pre>
			 * It's identifier.
			 * When it is set when instance is created.
			 * Don't change after instance is created.
			 * </pre>
			 * @type string
			 * @private
			 */
			id: '',
			/**
			 * <pre>
			 * Root element node that is created by template string
			 * </pre>
			 * @type node
			 * @private
			 */
			rootNode: null,
			/**
			 * <pre>
			 * Default variables there are binded to template string.
			 * There are used instead of the constructor arguments.
			 * </pre>
			 * @type object
			 * @private
			 */
			embedded: EMBEDDED,
			/**
			 * <pre>
			 * templateEngineによるインスタンス生成の際に、
			 * タグに記述しているAttributeのうち、インスタンスの先頭Nodeに継承しない要素
			 * コンポーネントで予約されている属性等は記載しておく
			 * </pre>
			 * @type object
			 * @private
			 */
			ignored: [
				'data-urushi-type',
				'data-u-type',
				'data-urushi-options',
				'data-u-options',
				'id',
				'class',
			],

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
					id: element.id || '',
					styleClass: parser.getClassName(parser.getStyleClass(element))
				};
			},
			/**
			 * <pre>
			 * 引数で指定された要素名がインスタンスの先頭タグにへ引き継ぐかどうかを返却する。
			 * 引き継ぐ場合はtrue
			 * 引き継がない場合はfalse
			 *
			 * templateEngineでのみ利用可能な関数。
			 * </pre>
			 * @protected
			 * @param {string} name 対象のAttribute名
			 * @returns 引き継ぐかどうかを返却する
			 */
			_isTakedOver: function(/* string */ name) {
				return -1 === this.ignored.indexOf(name || '');
			},
			/**
			 * <pre>
			 * It's' constructor of class.
			 * It consists of the following processes.
			 * 1.	_initProperties
			 *		It initializes instance properties.
			 *		If you define class, want initialize constructor arguments,
			 *		Inherit _initProperties.
			 * 2.	_render
			 *		It creates node by template string.
			 *		If you define class, want create node by javaScript,
			 *		Inherit _render.
			 * 3.	_attachNode
			 *		It sets access point to element node.
			 *		If you define class, want create access point to element node,
			 *		Inherit _attachNode.
			 * 4.	It is post process of after the above.
			 *		If you want run several process, inherit initOption.
			 * </pre>
			 * @param {object} args Constructor argumetns.
			 * @returns none.
			 */
			init: function(/* object */ args) {
				let _args = args || {};

				this._initProperties(_args);
				this._render(_args);
				this._attachNode();
				this.initOption(_args);
				this._setInitial(_args);
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * Initialize instance properties except id and rootNode.
			 * Properties are not initialize in constructor, will be shared all instances.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor argumetns.
			 * @returns none.
			 */
			_initProperties: function(/* object */ args) {
				this.id = '';
				this.rootNode = undefined;
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * It's post process of after the initialization.
			 * It's defiend for inheritance point.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor argumetns.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {},
			/**
			 * <pre>
			 * コンストラクタ引数から初期値を設定する。
			 * </pre>
			 * @protected
			 * @param {object} args コンストラクタ引数
			 * @returns none.
			 */
			_setInitial: function(/* object */ args) {},
			/**
			 * <pre>
			 * Returns identifier.
			 * Part of initialization functions.
			 * When identifier is not specified with constructor arguments, it will run.
			 * !! Caution !!
			 * You will create class,
			 * please override that function and copy process.
			 * </pre>
			 * @protected
			 * @returns {string} Instance's id.
			 */
			_getId: function() {
				return ID_PREFIX + idNo++;
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * Creates nodes using template string.
			 * </pre>
			 * @protected
			 * @param {object} args Constructor arguments.
			 * @returns none
			 */
			_render: function(/* object */ args) {
				let _args = args || {},
					tmp;

				_args = Object.assign(Object.assign({}, this.embedded), args);
				this.id = _args && _args.id || this._getId();
				_args.id = this.id;
				_args.styleClass = _args.styleClass || '';

				tmp = document.createElement('div');
				tmp.innerHTML = template(this.template, _args);
				this.rootNode = tmp.children[0];
			},
			/**
			 * <pre>
			 * Part of initialization functions.
			 * Sets access point to node except root node.
			 * </pre>
			 * @protected
			 * @returns none
			 */
			_attachNode: function() {
			},
			/**
			 * <pre>
			 * Returns root node that is created _render.
			 * </pre>
			 * @returns {node} Root node.
			 */
			getRootNode: function() {
				return this.rootNode;
			},
			/**
			 * <pre>
			 * Disable or enable instance.
			 * </pre>
			 * @param {boolean} is True is disabled, false is enabled.
			 * @returns {boolean} It finished normally, returns true.
			 */
			setDisabled: function(/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return false;
				}

				if (is) {
					this.rootNode.classList.add('disabled');
					this.rootNode.setAttribute('tabIndex', '-1');
				} else {
					this.rootNode.classList.remove('disabled');
					this.rootNode.removeAttribute('tabIndex');
				}

				return true;
			},
			/**
			 * <pre>
			 * Returns instance's able state.
			 * </pre>
			 * @returns {boolean} Able state. Instance is disabled, returns true.
			 */
			isDisabled: function() {
				return this.rootNode.classList.contains('disabled');
			},
			/**
			 * <pre>
			 * Hide and be unavailable the instance.
			 * or show and be available the instance.
			 * </pre>
			 * @param {boolean} is True is hidden, false is shown.
			 * @returns {boolean} It finished normally, returns true.
			 */
			setHidden: function(/* boolean */ is) {
				if ('boolean' !== typeof is) {
					return false;
				}

				if (is) {
					this.rootNode.classList.add('hidden');
				} else {
					this.rootNode.classList.remove('hidden');
				}

				return true;
			},
			/**
			 * <pre>
			 * Returns instance's active state.
			 * </pre>
			 * @returns {boolean} Avtive state. Instance is disabled, returns true.
			 */
			isHidden: function() {
				return this.rootNode.classList.contains('hidden');
			},
			/**
			 * <pre>
			 * Discarding of instance.
			 * Delete element nodes.
			 * </pre>
			 * @returns none
			 */
			destroy: function() {
				if (this.rootNode.parentNode) {
					this.rootNode.parentNode.removeChild(this.rootNode);
				}
				this.destroyOption();
			},
			/**
			 * <pre>
			 * It's post process of after the destroy.
			 * It's defiend for inheritance point.
			 * </pre>
			 * @protected
			 * @returns none
			 */
			destroyOption: function() {}
		});
	}
);
