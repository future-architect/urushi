/**
 * @fileOverView Integrated event listener for input tag.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Event listener for text input.
 * Thanks for following.
 * http://qiita.com/sounisi5011/items/767392c1f7736e2e5d4c
 * </pre>
 * @module addInputEventListener
 */
define('addInputEventListener', [], function () {
	'use strict';

	var documentElement = document.documentElement;
	var addInputEventListener;
	
	if (documentElement.addEventListener) {
		addInputEventListener = function (targetNode, listener) {
			var callbacks = {};
			/**
			 * @ignore
			 * @type number
			 */
			var timeoutID;
			/**
			 * @ignore
			 * @type string
			 * Input value.
			 * Several event are fired in change event.
			 * So I hold last input value.
			 */
			var lastValue = targetNode.value;
			/**
			 * @ignore
			 * If input value is chaned, hold input value.
			 */
			var onInput = function (event) {
				var nowValue = targetNode.value;

				if (lastValue !== nowValue) {
					lastValue = nowValue;
					listener.call(targetNode, event);
				}
			};
			/**
			 * @ignore
			 * If browser not support selectionchange.
			 * timerInput is called every 250ms.
			 */
			var timerInput = function () {
				var event = document.createEvent('HTMLEvents');

				event.initEvent('input', true, false);
				targetNode.dispatchEvent(event);
				if (!addInputEventListener.valid_selectionchange_event_) {
					timeoutID = setTimeout(timerInput, 250);
				}
			};
			/**
			 * @ignore
			 * Callback function called when selectionchange event fired.
			 * Call onInput.
			 */
			var onSelectionchange = function (event) {
				addInputEventListener.valid_selectionchange_event_ = true;
				onInput(event);
			};

			targetNode.addEventListener('input', onInput, false);
			callbacks.input = onInput;

			/**
			 * @ignore
			 * Callback function called when selectionchange event fired.
			 * Call onInput.
			 * If browser supports selectionchange event, add callback(onSelectionchange) to selectionchange listener,
			 * else set timeout function(timerInput) to the input.
			 */
			var onFocus = function () {
				document.addEventListener('selectionchange', onSelectionchange, false);
				callbacks.selectionchange = onSelectionchange;

				if (!addInputEventListener.valid_selectionchange_event_) {
					timerInput();
				}
			};
			targetNode.addEventListener('focus', onFocus, false);
			callbacks.focus = onFocus;

			/**
			 * @ignore
			 * Cleanup for onFocus.
			 */
			var onBlur = function () {
				document.removeEventListener('selectionchange', onSelectionchange, false);
				clearTimeout(timeoutID);
			};
			targetNode.addEventListener('blur', onBlur, false);
			callbacks.blur = onBlur;

			return callbacks;
		};
	} else {
		if (documentElement.attachEvent) {
			addInputEventListener = function (targetNode, listener) {
				var callbacks = {};

				var onpropertychange = function (event) {
					if (event.propertyName.toLowerCase() === 'value') {
						listener.call(targetNode, event);
					}
				};
				targetNode.attachEvent('onpropertychange', onpropertychange);
				return callbacks;
			};
		} else {
			addInputEventListener = function (targetNode, listener) {
				return {};
			};
		}
	}
	/**
	 * @ignore
	 * @type boolean
	 * If browser supports selectionchange, it's true.
	 */
	addInputEventListener.valid_selectionchange_event_ = false;

	return addInputEventListener;
});
