/**
 * @fileOverView urushi object for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides to delete function is registerd by addEventListener.
 * </pre>
 * @module removeInputEventListener
 */
define(
	'removeInputEventListener',
	[],
	/**
	 * @alias module:removeInputEventListener
	 * @returns {object} removeInputEventListener object.
	 */
	function () {
		'use strict';

		return (function () {
			if (document.addEventListener) {
				return function (/* object */ input, /* object */ callbacks) {
					var eventName;

					callbacks = callbacks || {};
					if (!input || !input.removeEventListener) {
						return;
					}

					for (eventName in callbacks) {
						input.removeEventListener(eventName, callbacks[eventName]);
					}
				};
			} else {
				return function (/* object */ input, /* object */ callbacks) {
					var eventName;

					callbacks = callbacks || {};
					if (!input || !input.removeEventListener) {
						return;
					}

					for (eventName in callbacks) {
						input.detachEvent(eventName, callbacks[eventName]);
					}
				};
			}
		})();
	}
);
