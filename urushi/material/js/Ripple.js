/**
 * @fileOverView Ripple class definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides ripple animation.
 *
 * </pre>
 * @example
 *	require(['Ripple'], function (Ripple) {
 *		var Some = Ripple.extend({...});
 *	});
 *
 * @module Ripple
 * @extends module:_Base
 * @requires underscore.js
 * @requires jquery-2.1.1.js
 * @requires module:Urushi
 * @requires module:materialConfig
 * @requires module:_Base
 */
define(
	'Ripple',
	[
		'jquery',
		'Urushi',
		'materialConfig',
		'_Base'
	],
	/**
	 * @class
	 * @augments module:_Base
	 * @alias module:Ripple
	 * @returns {Class} Ripple object.
	*/
	function ($, urushi, materialConfig, _Base) {
		'use strict';

		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @type object
		 * @constant
		 */
		var CONSTANTS = {
			CLASS_NAME_RIPPLE_ON : 'ripple-on',
			CLASS_NAME_RIPPLE_OUT : 'ripple-out',
			ATTRIBUTE_RIPPLE_ANIMATE : 'data-ripple-animate',
			ATTRIBUTE_RIPPLE_ANIMATE_ON : 'on',
			ATTRIBUTE_RIPPLE_ANIMATE_OFF : 'off',
			ATTRIBUTE_RIPPLE_MOUSE_DOWN : 'data-ripple-mousedown',
			ATTRIBUTE_RIPPLE_MOUSE_DOWN_ON : 'on',
			ATTRIBUTE_RIPPLE_MOUSE_DOWN_OFF : 'off',
			ATTRIBUTE_RIPPLE_COLOR : 'data-ripple-color'
		};

		return _Base.extend(/** @lends module:Ripple.prototype */ {
			/**
			 * <pre>
			 * Append callback function to element node.
			 * </pre>
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption : function (/* object */ args) {
				urushi.addEvent(this._getRippleRootNode(), 'mousedown', this, '_onRippleStart');
				urushi.addEvent(this._getRippleRootNode(), 'touchstart', this, '_onRippleStart');
			},
			/**
			 * <pre>
			 * Returns element node that has ripple animation.
			 * </pre>
			 * @protected
			 * @returns {node} Element node that has ripple animation.
			 */
			_getRippleRootNode : function () {
				return this.rootNode;
			},
			/**
			 * <pre>
			 * Creates element node that is wrapper for element that has ripple animation.
			 * </pre>
			 * @protected
			 * @returns {node} Wrapper element node.
			 */
			_createRippleWrapperElement : function () {
				var children = this._getRippleRootNode().getElementsByClassName('ripple-wrapper'),
					div;

				if (children.length) {
					return children[0];
				}

				div = document.createElement('div');
				div.className = 'ripple-wrapper';
				this._getRippleRootNode().appendChild(div);

				return div;
			},
			/**
			 * <pre>
			 * Returns x axiz for ripple animation start point.
			 * </pre>
			 * @protected
			 * @param {node} wrapper Element node that is wrapper for element that has ripple animation.
			 * @param {event} event Event object.
			 * @returns {number} X axiz for ripple animation start point.
			 */
			_getX : function (/* node */ wrapper, /* event */ event) {
				//var offset = {top : wrapper.offsetTop, left : wrapper.offsetLeft};
				var offset = $(wrapper).offset();

				if (!urushi.isTouch()) {
					return event.pageX - offset.left;
				} else {
					event = event.originalEvent || event;
					if (1 === event.touches.length) {
						return event.touches[0].pageX - offset.left;
					}
					return NaN;
				}
			},
			/**
			 * <pre>
			 * Returns y axiz for ripple animation start point.
			 * </pre>
			 * @protected
			 * @param {node} wrapper Element node that is wrapper for element that has ripple animation.
			 * @param {event} event Event object.
			 * @returns {number} Y axiz for ripple animation start point.
			 */
			_getY : function (/* node */ wrapper, /* object */ event) {
				//var offset = {top : wrapper.offsetTop, left : wrapper.offsetLeft};
				var offset = $(wrapper).offset();

				if (!urushi.isTouch()) {
					return event.pageY - offset.top;
				} else {
					event = event.originalEvent || event;
					if (1 === event.touches.length) {
						return event.touches[0].pageY - offset.top;
					}
					return NaN;
				}
			},
			/**
			 * <pre>
			 * It returns ripple color.
			 * Ripple color is defined in ripple color node or color(css) of ripple node.
			 * </pre>
			 * @protected
			 * @returns {string} Ripple color.
			 */
			_getRippleColor : function () {
				return this._getRippleRootNode().getAttribute(CONSTANTS.ATTRIBUTE_RIPPLE_COLOR) || window.getComputedStyle(this._getRippleRootNode()).color;
			},
			/**
			 * <pre>
			 * Returns ripple size.
			 * </pre>
			 * @protected
			 * @param {node} ripple Element node that has ripple animation.
			 * @returns Max size of ripple animation.
			 */
			_getNewSize : function (/* node */ ripple) {
				return (Math.max($(this._getRippleRootNode()).outerWidth(), $(this._getRippleRootNode()).outerHeight()) / $(ripple).outerWidth()) * 2.5;
			},
			/**
			 * <pre>
			 * Creates  element node that animates ripple.
			 * </pre>
			 * @protected
			 * @param {number} relX Style left of created element node.
			 * @param {number} relY Style top of created element node.
			 * @param {string} rippleColor Ripple color.
			 * @returns Element node(div) that has ripple animation.
			 */
			_createRippleElement : function (/* number */ relX, /* number */ relY, /* string */ rippleColor) {
				var ripple = document.createElement('div');

				ripple.className = 'ripple';
				ripple.style.left = relX + 'px';
				ripple.style.top = relY + 'px';
				ripple.style.backgroundColor = rippleColor;

				return ripple;
			},
			/**
			 * <pre>
			 * It's callback function for mousedown/touchstart event.
			 * It starts ripple animation.
			 * </pre>
			 * @protected
			 * @param {object} event Event object.
			 * @returns Element node(div) that has ripple animation.
			 */
			_onRippleStart : function (/* object */ event) {
				var wrapper,
					relX, relY,
					rippleColor,
					ripple;

				if (urushi.isTouch() !== urushi.isTouchEvent(event)) {
					return false;
				}

				wrapper = this._createRippleWrapperElement();

				relX = this._getX(wrapper, event);
				relY = this._getY(wrapper, event);
				if (isNaN(relX) || isNaN(relY)) {
					return false;
				}

				rippleColor = this._getRippleColor();
				ripple = this._createRippleElement(relX, relY, rippleColor);
				wrapper.appendChild(ripple);

				(function() { return window.getComputedStyle(ripple).opacity; })();

				this._rippleOn(ripple);

				setTimeout(this._rippleAnimationEnd.bind(this, ripple, wrapper), materialConfig.DEFAULT_VALUE_DURATION);

				$(this._getRippleRootNode()).on('mouseup mouseleave touchend', this._onRippleMouseup.bind(this, {ripple : ripple, wrapper : wrapper}));

				return true;
			},
			/**
			 * <pre>
			 * It's callback function that is called when ripple animacion is finished.
			 * Mouse is up, then it calls cleanup function(_rippleOut).
			 * </pre>
			 * @protected
			 * @param {node} ripple Element node that has ripple animation.
			 * @param {node} wrapper Element node that is wrapper for element that has ripple animation.
			 * @returns none.
			 */
			_rippleAnimationEnd : function (/* node */ ripple, /* node */ wrapper) {
				ripple.setAttribute(CONSTANTS.ATTRIBUTE_RIPPLE_ANIMATE, CONSTANTS.ATTRIBUTE_RIPPLE_ANIMATE_OFF);

				if (CONSTANTS.ATTRIBUTE_RIPPLE_MOUSE_DOWN_OFF === ripple.getAttribute(CONSTANTS.ATTRIBUTE_RIPPLE_MOUSE_DOWN)) {
					this._rippleOut(ripple, wrapper);
				}
			},
			/**
			 * <pre>
			 * It's callback function for mouseup/touchend event.
			 * It change mouse down status to off.
			 * Ripple animation is finished, then it calls cleanup function(_rippleOut).
			 * </pre>
			 * @protected
			 * @param {object} args Element nodes there are formated below {ripple :ripple, wrapper : wrapper}.
			 * @param {object} event Event object.
			 * @returns none.
			 */
			_onRippleMouseup : function (/* object */ args, /* object */ event) {
				var ripple, wrapper;

				if (!args || !args.ripple || !args.wrapper) {
					return;
				}

				ripple = args.ripple;
				wrapper = args.wrapper;

				ripple.setAttribute(CONSTANTS.ATTRIBUTE_RIPPLE_MOUSE_DOWN, CONSTANTS.ATTRIBUTE_RIPPLE_MOUSE_DOWN_OFF);

				if (CONSTANTS.ATTRIBUTE_RIPPLE_ANIMATE_OFF === ripple.getAttribute(CONSTANTS.ATTRIBUTE_RIPPLE_ANIMATE)) {
					this._rippleOut(ripple, wrapper);
				}
			},
			/**
			 * <pre>
			 * It starts ripple animation.
			 * If browser not support CSS3 animation or transition, it animate ripple with javascript.
			 * </pre>
			 * @protected
			 * @param {node} ripple Element node that has ripple animation.
			 * @returns none.
			 */
			_rippleOn : function (/* node */ ripple) {
				var size = this._getNewSize(ripple),
					$rootNode = $(this._getRippleRootNode()),
					$ripple = $(ripple);

				if (urushi.hasTransitionSupport()) {
					$ripple.css({
						'-ms-transform' : 'scale(' + size + ')',
						'-moz-transform' : 'scale(' + size + ')',
						'-webkit-transform' : 'scale(' + size + ')',
						'transform' : 'scale(' + size + ')'
					}).addClass(CONSTANTS.CLASS_NAME_RIPPLE_ON);
					ripple.setAttribute(CONSTANTS.ATTRIBUTE_RIPPLE_ANIMATE, CONSTANTS.ATTRIBUTE_RIPPLE_ANIMATE_ON);
					ripple.setAttribute(CONSTANTS.ATTRIBUTE_RIPPLE_MOUSE_DOWN, CONSTANTS.ATTRIBUTE_RIPPLE_MOUSE_DOWN_ON);
				} else {
					// for not suport css3.
					$ripple.animate({
						'width' : Math.max($rootNode.outerWidth(), $rootNode.outerHeight()) * 2,
						'height' : Math.max($rootNode.outerWidth(), $rootNode.outerHeight()) * 2,
						'margin-left' : Math.max($rootNode.outerWidth(), $rootNode.outerHeight()) * (-1),
						'margin-top' : Math.max($rootNode.outerWidth(), $rootNode.outerHeight()) * (-1),
						'opacity' : materialConfig.DEFAULT_VALUE_RIPPLE_OPACITY_MAX
					}, materialConfig.DEFAULT_VALUE_DURATION, function () {
						$ripple.trigger('transitionend');
					});
				}
			},
			/**
			 * <pre>
			 * It's cleanup process of ripple animation.
			 * It is to fade out ripple, and remove element node that has ripple animation.
			 * </pre>
			 * @protected
			 * @param {node} ripple Element node that has ripple animation.
			 * @param {node} wrapper Element node that is wrapper for element that has ripple animation.
			 * @returns none.
			 */
			_rippleOut : function (/* node */ ripple, /* node */ wrapper) {

				$(ripple).off();

				if (urushi.hasTransitionSupport()) {
					$(ripple).addClass(CONSTANTS.CLASS_NAME_RIPPLE_OUT);
				} else {
					$(ripple).animate({opacity : materialConfig.DEFAULT_VALUE_RIPPLE_OPACITY_MIN}, 100, function () {
						$(ripple).trigger('transitionend');
					});
				}
				$(ripple).on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
					$(ripple).remove();
				});
			},
			/**
			 * <pre>
			 * Instance discarding process.
			 * </pre>
			 * @returns none.
			 */
			destroy : function () {
				urushi.removeEvent(this._getRippleRootNode(), 'mousedown', this, '_onRippleStart');
				urushi.removeEvent(this._getRippleRootNode(), 'touchstart', this, '_onRippleStart');

				this._super();
			}
		});
	}
);