/**
 * @fileOverView Deferred object definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides Defererd.
 * Impletemed CommonJS Promise/A.
 * http://wiki.commonjs.org.mirrors.page.ca/articles/p/r/o/Promises_A_4825.html
 * </pre>
 *
 * @example
 *	require(['Deferred'], function (Deferred) {
 *
 *		function timeout () {
 *			var deferred = new Deferred();
 *
 *			setTimeout(function () {
 *				// ...
 *				deferred.resolve(true);
 *			}, 1000);
 *
 *			return deferred;
 *		}
 *
 *		timeout().then(function (result) {
 *			console.log(result);
 *		});
 *	});
 *
 * @module Deferred
 * @requires module:Promise
 */
define(
	'Deferred',
	['Promise'],
	/**
	 * @alias module:Deferred
	 * @returns {Class} Deferred class.
	 */
	function (Promise) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:Deferred#CONSTANTS
		 * @type object
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
				CLASS_NAME : 'Deferred',
				STATUS_PROGRESS : 0,
				STATUS_RESOLVED : 1,
				STATUS_REJECTED : 2,
				MESSAGE_FULLFILED : 'Process was already finished.'
			},
			/**
			 * <pre>
			 * Call calback function of ashnchronous process.
			 * </pre>
			 * @member module:Deferred#signalDeferred
			 * @function
			 * @param {object} deferred
			 * @param {number} status
			 * @param {any} result
			 * @returns none.
			 */
			signalDeferred = function (/* object */ deferred, /* number */ status, /* any */ result) {
				var validStatus = {
					'0' : 'progress',
					'1' : 'resolve',
					'2' : 'reject'
				};

				if (!deferred || deferred.isCanceled() || !validStatus[status]) {
					return;
				}
				deferred[validStatus[status]](result);
			},
			/**
			 * <pre>
			 * Create function to call a callback function.
			 * </pre>
			 * @member module:Deferred#createDeferredSignaler
			 * @function
			 * @param {object} deferred
			 * @param {number} status
			 * @returns function to call a callback function.
			 */
			createDeferredSignaler = function (/* object */ deferred, /* number */ status) {
				return function(/* any */ result) {
					signalDeferred(deferred, status, result);
				};
			},
			/**
			 * <pre>
			 * Call calback function that registered in the respective status.
			 * </pre>
			 * @member module:Deferred#signalListener
			 * @function
			 * @param {Array} listeners Callback functions.
			 * @param {number} status Asynchronous process status.
			 * @param {any} result Asynchronous function's returns.
			 * @returns none.
			 */
			signalListener = function (/* Array */ listeners, /* number */ status, /* any */ result) {
				var func = listeners && listeners[status],
					deferred = listeners && listeners.deferred,
					newResult;

				if (!func) {
					signalDeferred(deferred, status, result);
					return;
				}

				try {
					newResult = func(result);
					if (CONSTANTS.STATUS_PROGRESS === status) {
						if (!newResult) {
							return;
						}
						signalDeferred(deferred, CONSTANTS.STATUS_PROGRESS, newResult);
						return;
					}

					if (!newResult || 'function' !== typeof newResult.then) {
						signalDeferred(deferred, CONSTANTS.STATUS_RESOLVED, newResult);
						return;
					}

					listeners.cancel = newResult.cancel;
					newResult.then(
						createDeferredSignaler(deferred, CONSTANTS.STATUS_RESOLVED),
						createDeferredSignaler(deferred, CONSTANTS.STATUS_REJECTED),
						createDeferredSignaler(deferred, CONSTANTS.STATUS_PROGRESS)
					);
				} catch (error) {
					signalDeferred(deferred, CONSTANTS.STATUS_REJECTED, error);
				}
			},
			/**
			 * <pre>
			 * Complete acceptance of asynchronous process.
			 * </pre>
			 * @member module:Deferred#signalWaiting
			 * @function
			 * @param {Array} waiting
			 * @param {number} status
			 * @param {any} result
			 * @param {object} deferred
			 * @returns none.
			 */
			signalWaiting = function (/* Array */ waiting, /* number */ status, /* any */ result) {
				var index;

				for (index = 0; index < waiting.length; index++) {
					signalListener(waiting[index], status, result);
				}
			},
			Deferred;

		Deferred = function (canceler) {
			var promise,
				status = CONSTANTS.STATUS_PROGRESS,
				result,
				canceled = false,
				waiting = [],
				/**
				 * <pre>
				 * common process of normal, error and halfway process.
				 * </pre>
				 * @function
				 * @private
				 * @param {function} fnc actual process.
				 * @param {boolean} strict
				 * @returns {object} promise object.
				 */
				_inner = function (/* function */ fnc, /* boolean */ strict) {
					if (strict) {
						throw new Error(CONSTANTS.MESSAGE_FULLFILED);
					}

					fnc = fnc || function () {};
					if (!status) {
						fnc();
					}

					return promise;
				},
				reject,
				then;

			/**
			 * <pre>
			 * Promise instance that used to connect asynchronous functions.
			 * </pre>
			 * @type object
			 */
			this.promise = promise = new Promise();

			/**
			 * <pre>
			 * Returns whether asynchronous process resolved or not.
			 * The process is managed by deferred instance.
			 * </pre>
			 * @function
			 * @returns {boolean} Whether asynchronous process resolved or not.
			 */
			this.isResolved = function () {
				return CONSTANTS.STATUS_RESOLVED === status;
			};
			/**
			 * <pre>
			 * Returns whether asynchronous process rejected or not.
			 * The process is managed by deferred instance.
			 * </pre>
			 * @function
			 * @returns {boolean} Whether asynchronous process rejected or not.
			 */
			this.isRejected = function () {
				return CONSTANTS.STATUS_REJECTED === status;
			};
			/**
			 * <pre>
			 * Returns whether asynchronous process canceled or not.
			 * The process is managed by deferred instance.
			 * </pre>
			 * @function
			 * @returns {boolean} Whether asynchronous process canceled or not.
			 */
			this.isCanceled = function () {
				return canceled;
			};
			/**
			 * <pre>
			 * Returns whether asynchronous process finished or not.
			 * The process is managed by deferred instance.
			 * </pre>
			 * @function
			 * @returns {boolean} Whether asynchronous process finished or not.
			 */
			this.isFulfilled = function () {
				return !!status;
			};
			/**
			 * <pre>
			 * Notifys asynchronous process is being.
			 * </pre>
			 * @function
			 * @poaram {any} update Information from process is being.
			 * @poaram {boolean} strict
			 * @returns {object} Promise object.
			 */
			this.progress = function (/* any */ update, /* boolean */ strict) {
				return _inner(function () {
					signalWaiting(waiting, CONSTANTS.STATUS_PROGRESS, update, null);
				}, strict);
			};
			/**
			 * <pre>
			 * Notifys asynchronous process resolved.
			 * </pre>
			 * @function
			 * @poaram {any} value Result of asynchronous process.
			 * @poaram {boolean} strict
			 * @returns {object} Promise object.
			 */
			this.resolve = function (/* any */ value, /* boolean */ strict) {
				return _inner(function () {
					status = CONSTANTS.STATUS_RESOLVED;
					result = value;
					signalWaiting(waiting, CONSTANTS.STATUS_RESOLVED, value, null);

					waiting = null;
				}, strict);
			};
			/**
			 * <pre>
			 * Notifys asynchronous process rejected.
			 * </pre>
			 * @function
			 * @poaram {any} error Error of asynchronous process.
			 * @poaram {boolean} strict
			 * @returns {object} Promise object.
			 */
			this.reject = reject = function (/* any */ error, /* boolean */ strict) {
				return _inner(function () {
					status = CONSTANTS.STATUS_REJECTED;
					result = error;
					signalWaiting(waiting, CONSTANTS.STATUS_REJECTED, error, null);

					waiting = null;
				}, strict);
			};
			/**
			 * <pre>
			 * Registers callback functions are called when asynchronous process is being and finished.
			 * </pre>
			 * @function
			 * @param {function} callback Callback function is called when asynchronous process resolved.
			 * @param {function} errorback Callback function is called when asynchronous process rejected.
			 * @param {function} progressback Callback function is called when asynchronous process is being.
			 * @returns {object} Promise object.
			 */
			this.then = then = function (/* function */ callback, /* function */ errorback, /* function */ progressback) {
				var listener = [progressback, callback, errorback];
				
				listener.cancel = promise.cancel;
				listener.deferred = new Deferred(function (reason) {
					return listener.cancel(reason);
				});
				if (status && !waiting) {
					signalListener(listener, status, result);
				} else {
					waiting.push(listener);
				}
				return listener.deferred.promise;
			};
			/**
			 * <pre>
			 * Registers function is called asynchronous process finished.
			 * </pre>
			 * @function
			 * @paraam {function} callback Callback function is called when asynchronous process finished.
			 * @returns {object} Promise object.
			 */
			this.always = function (/* function */ callback) {
				return then(callback, callback);
			};
			/**
			 * <pre>
			 * Registers function is caled asynchronous process rejected.
			 * </pre>
			 * @function
			 * @paraam {function} errorback Callback function is called whe nasynchronous process rejected.
			 * @returns {object} Promise object.
			 */
			this.otherwise = function (/* function */ errorback) {
				return then(null, errorback);
			};
			/**
			 * <pre>
			 * It calcels monitoring of asynchronous process.
			 * If status is progress, promise object is freezed.
			 * </pre>
			 * @function
			 * @param {any} reason Reason of cancel monitoring.
			 * @param {boolean} strict
			 * @returns {object} Promise object.
			 */
			this.cancel = function (/* any */ reason, /* boolean */ strict) {
				var returns;

				if (strict) {
					throw new Error(CONSTANTS.MESSAGE_FULLFILED);
				}
				if (status) {
					return null;
				}
				if (canceler) {
					returns = canceler(reason);
					reason = (returns) ? returns : reason;
				}
				canceled = true;

				if (status) {
					if ('undefined' === typeof reason) {
						reason = new Error('非同期処理がキャンセルされました。 理由は不明です。');
					}
					reject(reason);

					return reason;
				}
				if (status === CONSTANTS.STATUS_REJECTED && result === reason) {
					return reason;
				}

				if (!promise.freeze) {
					return null;
				}
				promise.freeze();
				
				return null;
			};
			// initialize Promise object.
			promise.isResolved = this.isResolved;
			promise.isRejected = this.isRejected;
			promise.isFulfilled = this.isFulfilled;
			promise.isCanceled = this.isCanceled;
			promise.then = this.then;
			promise.always = this.always;
			promise.otherwise = this.otherwise;
			promise.cancel = this.cancel;
		};

		return Deferred;
	}
);
