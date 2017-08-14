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
 *	require(['Ripple'], function(Ripple) {
 *		let Some = Ripple.extend({...});
 *	});
 *
 * @module Ripple
 * @extends module:_Base
 * @requires module:Urushi
 * @requires module:materialConfig
 * @requires module:_Base
 */
define(
	'Ripple',
	[
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
	function(urushi, materialConfig, _Base) {
		'use strict';

		const CLASS_NAME_RIPPLE_ON = 'ripple-on',
			CLASS_NAME_RIPPLE_OUT = 'ripple-out',
			ATTRIBUTE_RIPPLE_ANIMATE = 'data-ripple-animate',
			ATTRIBUTE_RIPPLE_ANIMATE_ON = 'on',
			ATTRIBUTE_RIPPLE_ANIMATE_OFF = 'off',
			ATTRIBUTE_RIPPLE_MOUSE_DOWN = 'data-ripple-mousedown',
			ATTRIBUTE_RIPPLE_MOUSE_DOWN_ON = 'on',
			ATTRIBUTE_RIPPLE_MOUSE_DOWN_OFF = 'off',
			ATTRIBUTE_RIPPLE_COLOR = 'data-ripple-color';

		let rippleIdSuffix = 0;

		function getRippleId() {
			return 'ripple' + rippleIdSuffix++;
		}

		return _Base.extend(/** @lends module:Ripple.prototype */ {
			/**
			 * <pre>
			 * Append callback function to element node.
			 * </pre>
			 * @param {object} args Constructor arguments.
			 * @returns none.
			 */
			initOption: function(/* object */ args) {
				this._super(args);
				urushi.addEvent(this._getRippleRootNode(), 'mousedown', this._onRippleStart.bind(this));
				urushi.addEvent(this._getRippleRootNode(), 'touchstart', this._onRippleStart.bind(this));
			},
			/**
			 * <pre>
			 * Returns element node that has ripple animation.
			 * </pre>
			 * @protected
			 * @returns {node} Element node that has ripple animation.
			 */
			_getRippleRootNode: function() {
				return this.rootNode;
			},
			/**
			 * <pre>
			 * Creates element node that is wrapper for element that has ripple animation.
			 * </pre>
			 * @protected
			 * @returns {node} Wrapper element node.
			 */
			_createRippleWrapperElement: function() {
				let children = this._getRippleRootNode().getElementsByClassName('ripple-wrapper'),
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
			 * Returns x, y axiz for ripple animation start point.
			 * </pre>
			 * @protected
			 * @param {event} event Event object.
			 * @returns {Object} x, y axiz for ripple animation start point.
			 */
			_getRect: function(/* Event */ event) {
				let rootNode = this._getRippleRootNode(),
					rect = {x: NaN, y: NaN},
					offset = urushi.getOffset(rootNode);

				if ('none' === urushi.getStyle(rootNode).display) {
					return rect;
				}

				if (!urushi.isTouch()) {
					rect.x = event.pageX - offset.x;
					rect.y = event.pageY - offset.y;
				} else {
					event = event.originalEvent || event;
					if (1 === event.touches.length) {
						rect.x = event.touches[0].pageX - offset.x;
						rect.y = event.touches[0].pageY - offset.y;
					}
				}
				return rect;
			},
			/**
			 * <pre>
			 * It returns ripple color.
			 * Ripple color is defined in ripple color node or color(css) of ripple node.
			 * </pre>
			 * @protected
			 * @returns {string} Ripple color.
			 */
			_getRippleColor: function() {
				return this._getRippleRootNode().getAttribute(
						ATTRIBUTE_RIPPLE_COLOR
					) || window.getComputedStyle(this._getRippleRootNode()).color;
			},
			/**
			 * <pre>
			 * Returns ripple size.
			 * </pre>
			 * @protected
			 * @param {node} ripple Element node that has ripple animation.
			 * @returns Max size of ripple animation.
			 */
			_getNewSize: function(/* node */ ripple) {
				let width = this._getRippleRootNode().clientWidth,
					height = this._getRippleRootNode().clientHeight;

				if (!width || !height) {
					return 0;
				}

				return (Math.max(width, height) / ripple.clientWidth) * 2.1;
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
			_createRippleElement: function(/* number */ relX, /* number */ relY, /* string */ rippleColor) {
				let ripple = document.createElement('div');

				ripple.id = this.id + '-' + getRippleId();
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
			_onRippleStart: function(/* object */ event) {
				let wrapper,
					rel,
					rippleColor,
					ripple;

				if (urushi.isTouch() !== urushi.isTouchEvent(event)) {
					return false;
				}

				wrapper = this._createRippleWrapperElement();

				rel = this._getRect(event);
				if (isNaN(rel.x) || isNaN(rel.y)) {
					return false;
				}

				rippleColor = this._getRippleColor();
				ripple = this._createRippleElement(rel.x, rel.y, rippleColor);
				wrapper.appendChild(ripple);

				this._rippleOn(ripple);

				setTimeout(this._rippleAnimationEnd.bind(this, ripple, wrapper), 400);

				urushi.addEvent(
					this._getRippleRootNode(),
					'mouseup',
					this._onRippleMouseup.bind(this, {ripple: ripple, wrapper: wrapper}));
				urushi.addEvent(
					this._getRippleRootNode(),
					'mouseleave',
					this._onRippleMouseup.bind(this, {ripple: ripple, wrapper: wrapper}));
				urushi.addEvent(
					this._getRippleRootNode(),
					'touchend',
					this._onRippleMouseup.bind(this, {ripple: ripple, wrapper: wrapper}));

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
			_rippleAnimationEnd: function(/* node */ ripple, /* node */ wrapper) {
				ripple.setAttribute(ATTRIBUTE_RIPPLE_ANIMATE, ATTRIBUTE_RIPPLE_ANIMATE_OFF);

				if (ATTRIBUTE_RIPPLE_MOUSE_DOWN_OFF === ripple.getAttribute(ATTRIBUTE_RIPPLE_MOUSE_DOWN)) {
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
			 * @param {object} args Element nodes there are formated below {ripple:ripple, wrapper: wrapper}.
			 * @param {object} event Event object.
			 * @returns none.
			 */
			_onRippleMouseup: function(/* object */ args, /* object */ event) {
				let ripple, wrapper;

				urushi.removeEvent(this._getRippleRootNode(), 'mouseup');
				urushi.removeEvent(this._getRippleRootNode(), 'mouseleave');
				urushi.removeEvent(this._getRippleRootNode(), 'touchend');

				if (!args || !args.ripple || !args.wrapper) {
					return;
				}

				ripple = args.ripple;
				wrapper = args.wrapper;

				ripple.setAttribute(ATTRIBUTE_RIPPLE_MOUSE_DOWN, ATTRIBUTE_RIPPLE_MOUSE_DOWN_OFF);

				if (ATTRIBUTE_RIPPLE_ANIMATE_OFF === ripple.getAttribute(ATTRIBUTE_RIPPLE_ANIMATE)) {
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
			_rippleOn: function(/* node */ ripple) {
				let size = this._getNewSize(ripple);

				ripple.style['-ms-transform'] = 'scale(' + size + ')';
				ripple.style['-moz-transform'] = 'scale(' + size + ')';
				ripple.style['-webkit-transform'] = 'scale(' + size + ')';
				ripple.style.transform = 'scale(' + size + ')';

				ripple.classList.add(CLASS_NAME_RIPPLE_ON);
				
				ripple.setAttribute(ATTRIBUTE_RIPPLE_ANIMATE, ATTRIBUTE_RIPPLE_ANIMATE_ON);
				ripple.setAttribute(ATTRIBUTE_RIPPLE_MOUSE_DOWN, ATTRIBUTE_RIPPLE_MOUSE_DOWN_ON);
			},
			/**
			 * <pre>
			 * 波紋アニメーションの後処理
			 * divタグを消去する。
			 * </pre>
			 * @private
			 * @param {node} ripple Element node that has ripple animation.
			 * @returns none.
			 */
			_rippleEnd: function(/* node */ ripple) {
				urushi.removeEvent(ripple, 'transitionend');

				if (ripple.parentElement) {
					ripple.parentElement.removeChild(ripple);
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
			_rippleOut: function(/* node */ ripple, /* node */ wrapper) {
				ripple.classList.add(CLASS_NAME_RIPPLE_OUT);

				urushi.addEvent(ripple, 'transitionend', this._rippleEnd.bind(this, ripple));
			},
			/**
			 * <pre>
			 * Instance discarding process.
			 * </pre>
			 * @returns none.
			 */
			destroy: function() {
				urushi.removeEvent(this._getRippleRootNode(), 'mousedown');
				urushi.removeEvent(this._getRippleRootNode(), 'touchstart');

				this._super();
			}
		});
	}
);