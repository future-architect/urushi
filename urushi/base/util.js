/**
 * @fileOverView ユーティリティAPI群
 * @author Yuzo Hirakawa
 * @version 1.0.0
 */

/**
 * @module util
 */
define(
	'util',
	[],
	/**
	 * @alias module:util
	 * @returns {object} util object.
	 */
	function() {
		'use strict';

		let util = {};

		/**
		 * <pre>
		 * ObjectをDeepCopyする。
		 * 内部関数。
		 * </pre>
		 */
		function _deepCopy(/* Object */dst, /* Object */src) {
			let key,
				procs = {};

			function copyPrimitive(dst, src, key) {
				dst[key] = src[key];
			}
			function copyObject(dst, src, key) {
				if (src[key] instanceof Array) {
					dst[key] = src[key].slice();
				} else {
					if (!dst[key]) {
						dst[key] = {};
					}
					dst[key] = _deepCopy(dst[key], src[key]);
				}
			}
			function copyFunction(dst, src, key) {
				dst[key] = src[key];
			}

			procs.undefined = copyPrimitive;
			procs.boolean = copyPrimitive;
			procs.string = copyPrimitive;
			procs.number = copyPrimitive;
			procs.function = copyFunction;
			procs.object = copyObject;

			for (key in src) {
				if (src.hasOwnProperty(key)) {
					console.log(typeof src[key], dst, src, key);
					procs[typeof src[key]](dst, src, key);
				}
			}

			return dst;
		}

		/**
		 * <pre>
		 * ObjectをDeepCopyする。
		 * </pre>
		 * @member module:util#copy
		 * @function
		 * @param {Object} dst コピー先のオブジェクト
		 * @param {Object...} src コピー元のオブジェクト。可変長引数。
		 * @returns {boolean} コピー後の第1引数
		 */
		function deepCopy(/* Object */ dst) {
			let i, src;

			if ('object' !== typeof dst) {
				return dst;
			}
			if (dst instanceof Array) {
				return dst;
			}

			for (i = 1; i < arguments.length; i++) {
				src = arguments[i];
				dst = _deepCopy(dst, src);
			}

			return dst;
		}
		/**
		 * <pre>
		 * 引数のObjectをコピーする
		 * 同一キーが存在する場合はコピー元のオブジェクトの値で上書きする。
		 * </pre>
		 * @member module:util#copy
		 * @function
		 * @param {Object} dst コピー先のオブジェクト
		 * @param {Object...} src コピー元のオブジェクト。可変長引数。
		 * @param {boolean} deap ディープコピーの場合はtrueを指定する
		 * @returns {boolean} コピー後の第1引数
		 */
		function copy(/* Object */ dst) {
			let srcs = Array.slice(arguments, 1),
				deep,
				i;

			if ('object' !== typeof dst) {
				return dst;
			}
			if (dst instanceof Array) {
				return dst;
			}

			if ('boolean' === typeof srcs[srcs.length - 1]) {
				deep = srcs.pop();
			} else {
				deep = false;
			}

			if (!deep) {
				for (i = 0; i < srcs.length; i++) {
					dst = Object.assign(dst, srcs[i]);
				}
				return dst;
			}

			return deepCopy.apply([dst].concat(srcs));
		}

		util.deepCopy = deepCopy;
		util.cope = copy;

		window.uu = util;

		return util;
	}
);
