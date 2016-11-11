/**
 * @fileOverView urushi object for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides utilities are related event.
 * </pre>
 * @example
 *	require(['event', 'Button'], function(event, Button) {
 *		var button = new Button(),
 *			obj = {id: 'someId', fnc: function(event, args) {console.log(args.message);}},
 *			args = {message: 'test message'};
 *		document.body.appendChild(button.getRootNode());
 *
 *		event.addEvent(button.getRootNode(), 'click', obj, 'fnc', args);
 *		// ...
 *		event.removeEvent(button.getRootNode(), 'click', obj, 'fnc');
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
		/**
		 * <pre>
		 * Manage event callback functions.
		 * It's format such as the following.
		 *	{
		 *		context.id: {
		 *			element.id: {
		 *				eventName: function
		 *			}
		 *		}
		 *	}
		 * </pre>
		 * @member module:event#callbacks
		 * @type Obejct
		 * @private
		 */
		var callbacks = {},
			/**
			 * <pre>
			 * Touch event names.
			 * </pre>
			 * @type object
			 * @constant
			 * @public
			 */
			EVENT_TYPE = {
				TOUCH_START: 'touchstart',
				TOUCH_END: 'touchend',
				TOUCH_MOVE: 'touchmove',
				TOUCH_CANCEL: 'touchcancel'
			},
			event = {
				/**
				 * <pre>
				 * Register callback function to html event lestener.
				 * </pre>
				 * @function module:event#addEvent
				 * @param {node} element Element has event listener.
				 * @param {string} eventName Event listener name.
				 * @param {object} scope Execution context of callback function.
				 * @param {string|function} callback Callback function(name).
				 * @param {object} preArgs Preset arguments of callback function.
				 * @returns none.
				 */
				addEvent: function(
						/* node */ element,
						/* string */ eventName,
						/* object */ scope,
						/* string|function */ callback,
						/* object */ preArgs) {
					console.error('event is not initialized.');
				},
				/**
				 * <pre>
				 * Remove callback function from html event listener.
				 * </pre>
				 * @function module:event#removeEvent
				 * @param {node} element Element has event listener.
				 * @param {string} eventName Event listener name.
				 * @param {object} scope Execution context of callback function.
				 * @param {string|function} callback Callback function name.
				 * @returns none.
				 */
				removeEvent: function(
						/* node */ element,
						/* string */ eventName,
						/* object */ scope,
						/* string */ callbackName) {
					console.error('event is not initialized.');
				},
				/**
				 * <pre>
				 * Returns whether event is touch event or not.
				 * </pre>
				 * @function module:event#isTouchEvent
				 * @param {object} event Event object.
				 * @returns {boolean} Whether event is touch event or not.
				 */
				isTouchEvent: (function() {
					var validMap = {};
					validMap[EVENT_TYPE.TOUCH_START] = true;
					validMap[EVENT_TYPE.TOUCH_END] = true;
					validMap[EVENT_TYPE.TOUCH_MOVE] = true;
					validMap[EVENT_TYPE.TOUCH_CANCEL] = true;

					return function(/* object */ event) {
						var _event = event || {};

						return !!validMap[_event.type];
					};
				})()
			};
		
		event.addEvent = (function() {
			if (document.addEventListener) {
				return function(
						/* node */ element,
						/* string */ eventName,
						/* object */ scope,
						/* string|function */ callback,
						/* object */ preArgs) {
					var fnc;

					if (!element || !eventName || !callback) {
						console.log(
							'Callback function registration error.',
							element && element.id || undefined,
							eventName,
							scope,
							callback,
							preArgs);

						return;
					}
					if (scope &&
						scope.id &&
						'string' === typeof callback &&
						eventName &&
						element.id &&
						callbacks[scope.id] &&
						callbacks[scope.id][element.id] &&
						callbacks[scope.id][element.id][eventName] &&
						callbacks[scope.id][element.id][eventName][callback]) {

						console.log(
							'Duplicate registration error.',
							element && element.id || undefined,
							eventName,
							scope,
							callback,
							preArgs);

						return;
					}

					if ('string' === typeof callback) {
						if (undefined !== preArgs) {
							fnc = scope[callback].bind(scope, preArgs);
						} else {
							fnc = scope[callback].bind(scope);
						}
					} else {
						if (undefined !== preArgs) {
							fnc = callback.bind(scope, preArgs);
						} else {
							fnc = callback.bind(scope);
						}
					}
					element.addEventListener(eventName, fnc, false);

					if (scope && scope.id && element.id && 'string' === typeof callback && eventName) {
						callbacks[scope.id] = callbacks[scope.id] || {};
						callbacks[scope.id][element.id] = callbacks[scope.id][element.id] || {};
						callbacks[scope.id][element.id][eventName] = callbacks[scope.id][element.id][eventName] || {};
						callbacks[scope.id][element.id][eventName][callback] = fnc;
					} else {
						console.log(
							'Regsiterd function can\'t be deleted.',
							element && element.id || undefined,
							eventName,
							scope,
							callback,
							preArgs);
					}
				};
			} else {
				return function(
						/* node */ element,
						/* string */ eventName,
						/* object */ scope,
						/* string|function */ callback,
						/* object */ preArgs) {

					var fnc;

					if (!element || !eventName || !callback) {
						console.log(
							'Callback function registration error.',
							element && element.id || undefined,
							eventName,
							scope,
							callback,
							preArgs);
						return;
					}
					if (scope &&
						scope.id &&
						'string' === typeof callback &&
						eventName &&
						element.id &&
						callbacks[scope.id] &&
						callbacks[scope.id][element.id] &&
						callbacks[scope.id][element.id][eventName] &&
						callbacks[scope.id][element.id][eventName][callback]) {

						console.log(
							'Duplicate registration error.',
							element && element.id || undefined,
							eventName,
							scope,
							callback,
							preArgs);
						return;
					}
					if ('string' === typeof callback) {
						if (undefined !== preArgs) {
							fnc = scope[callback].bind(scope, preArgs);
						} else {
							fnc = scope[callback].bind(scope);
						}
					} else {
						if (undefined !== preArgs) {
							fnc = callback.bind(scope, preArgs);
						} else {
							fnc = callback.bind(scope);
						}
					}
					element.attachEvent('on' + eventName, fnc);

					if (scope && scope.id && element.id && 'string' === typeof callback && eventName) {
						callbacks[scope.id] = callbacks[scope.id] || {};
						callbacks[scope.id][element.id] = callbacks[scope.id][element.id] || {};
						callbacks[scope.id][element.id][eventName] = callbacks[scope.id][element.id][eventName] || {};
						callbacks[scope.id][element.id][eventName][callback] = fnc;
					} else {
						console.log(
							'Regsiterd function can\'t be deleted.',
							element && element.id || undefined,
							eventName,
							scope,
							callback,
							preArgs);
					}
				};
			}
		})();

		event.removeEvent = (function() {
			if (document.addEventListener) {
				return function(
						/* node */ element,
						/* string */ eventName,
						/* object */ scope,
						/* string */ callbackName) {
					if (!scope ||
							!element ||
							!callbacks[scope.id] ||
							!callbacks[scope.id][element.id] ||
							!callbacks[scope.id][element.id][eventName] ||
							!callbacks[scope.id][element.id][eventName][callbackName]) {
						return;
					}

					element.removeEventListener(eventName, callbacks[scope.id][element.id][eventName][callbackName]);
					callbacks[scope.id][element.id][eventName][callbackName] = null;
					delete callbacks[scope.id][element.id][eventName][callbackName];
				};
			} else {
				return function(
						/* node */ element,
						/* string */ eventName,
						/* object */ scope,
						/* string */ callbackName) {
					if (!scope ||
							!element ||
							!callbacks[scope.id] ||
							!callbacks[scope.id][element.id] ||
							!callbacks[scope.id][element.id][eventName] ||
							!callbacks[scope.id][element.id][eventName][callbackName]) {
						return;
					}
					
					element.detachEvent('on' + eventName, callbacks[scope.id][eventName][callbackName]);
					callbacks[scope.id][element.id][eventName][callbackName] = null;
					delete callbacks[scope.id][element.id][eventName][callbackName];
				};
			}
		})();

		return event;
	}
);
