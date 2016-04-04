/**
 * @fileOverView broser tutilities for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides utilities related browsers.
 * </pre>
 * @module browser
 */
define(
	'browser',
	[],
	/**
	 * @alias module:browser
	 * @returns {object} browser object.
	 */
	function () {
		'use strict';

		return {
			/**
			 * <pre>
			 * Key codes.
			 * </pre>
			 * @type object
			 * @constant
			 */
			KEYCODE : {
				BACKSPACE : 8,
				COMMA : 188,
				DELETE : 46,
				DOWN : 40,
				END : 35,
				ENTER : 13,
				ESCAPE : 27,
				HOME : 36,
				LEFT : 37,
				PAGE_DOWN : 34,
				PAGE_UP : 33,
				PERIOD : 190,
				RIGHT : 39,
				SPACE : 32,
				TAB : 9,
				UP : 38
			},
			/**
			 * <pre>
			 * Returns whether terminal supports touch interface.
			 * </pre>
			 * @function
			 * @returns {boolean} Whether touch terminal or not.
			 */
			isTouch : function () {
				return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			},
			/**
			 * <pre>
			 * Returns whether browther supports CSS3 transition.
			 * </pre>
			 * @function
			 * @returns {boolean} Whethr browser supports CSS3 transition or not.
			 */
			hasTransitionSupport : function () {
				var style = (document.body || document.documentElement).style;

				return (
					style.transition !== undefined ||
					style.WebkitTransition !== undefined ||
					style.MozTransition !== undefined ||
					style.MsTransition !== undefined ||
					style.OTransition !== undefined
				);
			},
			/**
			 * <pre>
			 * Returns keyCode from KeyEvent.
			 * </pre>
			 * @function
			 * @param {KeyEvent} event KeyEvent
			 * @returns {number} KeyCode
			 */
			getKeyCode : function (/* KeyEvent */ event) {
				if (document.all) {
					return event.keyCode;
				} else if (document.getElementById) {
					return (event.keyCode) ? event.keyCode : event.charCode;
				} else if (document.layers) {
					return event.which;
				}
			}
		};
	}
);
