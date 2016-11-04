/**
 * @fileOverView Configurations for urushi classes.
 * @author Yuzo Hirakawa
 * @version b1.0
 */

 /**
 * <pre>
 * Defines urushi configurations.
 * </pre>
 * @module materialConfig
 */
define(
	'materialConfig',
	[],
	/**
	 * @alias module:materialConfig
	 * @returns {Object} materialConfig object.
	 */
	function() {
		'use strict';

		return {
			// generic constants.
			DEFAULT_VALUE_DURATION: 300,
			DEFAULT_VALUE_OPACITY_MIN: 0,
			DEFAULT_VALUE_OPACITY_MAX: 1,
			DEFAULT_VALUE_RIPPLE_OPACITY_MIN: 0,
			DEFAULT_VALUE_RIPPLE_OPACITY_MAX: 0.2,
			// alert constants.
			ALERT_WIDTH: 600,
			ALERT_WIDTH_NONE: 0,
			ALERT_OPACITY_MIN: 0,
			ALERT_OPACITY_MAX: 1,
			// dialog constants.
			DIALOG_ANIMATION_DURATION: 500,
			DIALOG_PARENT_NODE: document.body,
			DIALOG_ANIMATION_DELAY: 50,
			DIALOG_POINT_WAITING: 120,
			DIALOG_POINT_VIEW: 180,
			DIALOG_UNDERLAY_CLICK_CLOSE: true,
			// toast constants.
			TOAST_DISPLAY_TIME: 3000,
			TOAST_STYLE_BOTTOM: 40,
			// tooltip constants.
			TOOLTIP_DURATION: 200,
			TOOLTIP_DEFAULT_POSITION: 'right'
		};
	}
);
