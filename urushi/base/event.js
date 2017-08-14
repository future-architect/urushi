/**
 * @fileOverView urushi object for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Event, EventTargetに関連するユーティリティ関数を提供する。
 * </pre>
 * @example
 *	require(['event', 'Button'], function(event, Button) {
 *		let button = new Button(),
 *			obj = {id: 'someId', fnc: function(event) {console.log('hello.' + this.id);}},
 *			callback = obj.fnc.bind(obj);
 *
 *		document.body.appendChild(button.getRootNode());
 *
 *		event.addEvent(button.getRootNode(), 'click', callback);
 *		// ...do anything.
 *		event.removeEvent(button.getRootNode(), 'click');
 *	});
 *
 * @module event
 */
define(
	'event',
	[],
	/**
	 * @alias module:event
	 * @returns {object} event object.
	 */
	function() {
		'use strict';

		const CALLBACKS = '_u_callbacks_';
		const TYPE_TOUCH_START = 'touchstart';
		const TYPE_TOUCH_END = 'touchend';
		const TYPE_TOUCH_MOVE = 'touchmove';
		const TYPE_TOUCH_CANCEL = 'touchcancel';
		/**
		 * <pre>
		 * 公開関数を保持したオブジェクト。
		 * </pre>
		 */
		let event = {};

		/**
		 * <pre>
		 * タッチイベントを判定する関数を生成する関数。
		 * 非公開関数。
		 * 公開関数は下記の通り。
		 * event.isTouchEvent
		 * </pre>
		 * @member module:event#_isTouchEventBuilder
		 * @function
		 * @private
		 * @returns {Function} 公開関数であるisTouchEventを返却する。
		 */
		function _isTouchEventBuilder() {
			let validMap = {};

			validMap[TYPE_TOUCH_START] = true;
			validMap[TYPE_TOUCH_END] = true;
			validMap[TYPE_TOUCH_MOVE] = true;
			validMap[TYPE_TOUCH_CANCEL] = true;

			return function isTouchEvent(/* object */ event) {
				let _event = event || {};

				return !!validMap[_event.type];
			};
		}

		/**
		 * <pre>
		 * addEvent, removeEvent関数で共通して行われるチェック処理。
		 * 上記関数の第1, 第2引数が正常かどうかをチェックする。
		 * </pre>
		 * @member module:event#_isInvalid
		 * @function
		 * @private
		 * @param {Element} EventTypeを継承しているクラス。IE11ではEventTargetがElementの親クラスではないため、Elementで判断する。
		 * @param {string} type イベントのタイプ。例）click
		 * @returns {boolean} 引数が指定された型出ない場合にtrueを返却する
		 */
		function _isInvalid(/* Element */ element, /* string */ type) {
			return !(element instanceof Element && 'string' === typeof type);
		}

		/**
		 * <pre>
		 * 登録したコールバック関数を登録されたElementのメンバに登録する。
		 * _u_callbacks_プロパティに保持している。
		 * Elementの上記プロパティは直接変更しないこと。
		 * </pre>
		 * @member module:event#_save
		 * @function
		 * @private
		 * @param {EventTarget} EventTypeを継承しているクラス。
		 * @param {string} type イベントのタイプ。例）click
		 * @returns {boolean} 引数が指定された型出ない場合にtrueを返却する
		 */
		function _save(/* Element */ element, /* string */ type, /* Function */ callback) {
			let callbacks = element[CALLBACKS] || {};

			if (!callbacks[type]) {
				callbacks[type] = [];
			}
			callbacks[type].push(callback);

			element[CALLBACKS] = callbacks;
		}

		function _delete(/* element */ element, /* string */ type, /* Function */ callback) {
			let callbacks = element[CALLBACKS],
				i;

			if (!callbacks || callbacks[type]) {
				return;
			}

			if (!callback) {
				callbacks[type] = undefined;
				delete callbacks[type];

				return;
			}

			for (i = 0; i < callbacks[type].length; i++) {
				if (callbacks[type][i] === callback) {
					callbacks[type].splice(i, 1);
				}
			}
		}

		function addEvent(/* element */ element, /* string */ type, /* function */ callback) {
			if (_isInvalid(element, type)) {
				return;
			}

			element.addEventListener(type, callback, false);
			_save(element, type, callback);
		}

		function removeEvent(/* element */ element, /* string */ type, /* function */callback) {
			let callbacksOfType, i;

			if (_isInvalid(element, type)) {
				return;
			}

			if (callback) {
				element.removeEventListener(type, callback);
				_delete(element, type, callback);

				return;
			}

			if (!element[CALLBACKS] || !element[CALLBACKS][type]) {
				return;
			}

			callbacksOfType = element[CALLBACKS][type];
			for (i = 0; i < callbacksOfType.length; i++) {
				element.removeEventListener(type, callbacksOfType[i]);
			}
			element[CALLBACKS][type] = undefined;
			delete element[CALLBACKS][type];

			_delete(element, type);
		}

		event.addEvent = addEvent;
		event.removeEvent = removeEvent;
		event.addEventListener = addEvent;
		event.removeEventListener = removeEvent;
		event.isTouchEvent = _isTouchEventBuilder();

		return event;
	}
);
