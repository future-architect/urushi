/**
 * @fileOverView animation object for urushi.
 * @author ota
 * @version 1.0
 */

/**
 * <pre>
 * Animation utilities.
 * for browsers that don't support css 3.0.
 * </pre>
 * @module animation
 * @requires module:Deferred
 */
define(
	'animation',
	['Deferred'],
	/**
	 * @alias module:animation
	 * @returns {object} animation object.
	 */
	function (Deferred) {
		'use strict';
		var EASINGS,
			STYLEKEYS,
			raf;
		/**
		 * <pre>
		 * Bezier curve calculation.
		 * </pre>
		 * @see http://d.hatena.ne.jp/babu_babu_baboo/20120618/1340004207
		 */
		function cubicBezier (x2, y2, x3, y3) {
			var step,
				err = 0.0001;

			x2 *= 3;
			y2 *= 3;
			x3 *= 3;
			y3 *= 3;
			
			return function (t) {
				var p,
					a,
					b,
					c,
					d,
					x,
					s;
				if (t < 0 || 1 < t) {
					throw new Error(t);
				}
				
				p = step || t;

				do {
					a = 1 - p;
					b = a * a;
					c = p * p;
					d = c * p;
					
					x = x2 * b * p + x3 * a * c + d;
					s = t - x;
					p += s * 0.5;
				} while (err < Math.abs(s));

				step = p;
				return	y2 * b * p + y3 * a * c + d;
			};
		}
		/**
		 * <pre>
		 * Returns style name that has vendor prefix.
		 * </pre>
		 * @function
		 * @param {string} Style name.
		 * @returns {string} Style name that has vendor prefix.
		 */
		function getStyleName (/* string */ property) {
			if (property in document.body.style) {
				return property;
			} else if ('-ms-' + property in document.body.style) {
				return '-ms-' + property;
			} else if ('-moz-' + property in document.body.style) {
				return '-moz-' + property;
			} else if ('-webkit-' + property in document.body.style) {
				return '-webkit-' + property;
			} else {
				return property;
			}
		}
		/**
		 * <pre>
		 * Easing functions.
		 * </pre>
		 * @type obejct
		 * @constant
		 */
		EASINGS = {
			linear : function (/* number */ p) {
				return p;
			},
			easeIn : cubicBezier(0.420, 0.000, 1.000, 1.000),
			easeOut : cubicBezier(0.000, 0.000, 0.580, 1.000),
			easeInOut : cubicBezier(0.420, 0.000, 0.580, 1.000),
		};
		/**
		 * <pre>
		 * Vendor prefix styles.
		 * </pre>
		 * @type node
		 * @constant
		 */
		STYLEKEYS = {
			transform : getStyleName('transform')
		};

		raf = window.requestAnimationFrame || setTimeout;

		return {
			/**
			 * <pre>
			 * Easing map.
			 * </pre>
			 * @type object
			 * @constant
			 */
			EASINGS : EASINGS,
			/**
			 * <pre>
			 * Vendor prefix styles.
			 * </pre>
			 * @type object
			 * @constant
			 */
			STYLEKEYS : STYLEKEYS,
			/**
			 * <pre>
			 * Animates.
			 * </pre>
			 * @function
			 * @param {number} duration animation time.
			 * @param {function} step
			 * @param {function|string} easing
			 * @returns {object} Deferred object.
			 */
			animate : function (/* number */ duration, /* function */ step, /* function|string */ easing) {
				var startedAt = Date.now(),
					anim,
					deferred = new Deferred();

				if (!easing) {
					easing = EASINGS.easeInOut;
				} else if ('string' === typeof easing) {
					easing = EASINGS[easing];
				}

				anim = function() {
					var pos = (Date.now() - startedAt);
					if (deferred.isCanceled()) {//cancel
						return;
					}
					if (pos >= duration) {//end
						step(1);
						deferred.resolve();
						return;
					}
					step(easing(pos / duration));

					raf(anim, 1);
				};
				step(0);
				anim();

				return deferred;
			},
			/**
			 * <pre>
			 * Animates forever.
			 * </pre>
			 * @function
			 * @param {number} duration
			 * @param {function} step
			 * @param {function|string} easing
			 * @returns {object} Deferred object.
			 */
			animateInfinite : function (/* number */ duration, /* function */ step, /* function|string */ easing) {
				var startedAt = Date.now(),
					anim,
					deferred = new Deferred();

				if (!easing) {
					easing = EASINGS.easeInOut;
				} else if ('string' === typeof easing) {
					easing = EASINGS[easing];
				}

				anim = function() {
					var pos = (Date.now() - startedAt);
					if (deferred.isCanceled()) {//cancel
						return;
					}
					if (pos >= duration) {//next
						pos = pos % duration;
						startedAt = startedAt + duration;
					}
					step(easing(pos / duration));

					raf(anim, 1);
				};
				step(0);
				anim();

				return deferred;
			},
			/**
			 * <pre>
			 * Calculates interval point.
			 * </pre>
			 * @function
			 * @param {number} from start point.
			 * @param {number} to end point.
			 * @param {number} p 0 to 1.
			 * @returns {number} interval point.
			 */
			calcPoint : function(/* number */ from, /* number */ to, /* number */ p) {
				from = from - 0;
				to = to - 0;
				return from + ((to - from) * p);
			},
			/**
			 * <pre>
			 * Calcurates color on interval point.
			 * </pre>
			 * @function
			 * @param {string} from start color. (formatted #FFFFFF)
			 * @param {string} to end color. (formatted #FFFFFF)
			 * @param {number} p 0 to 1
			 * @returns {string} Color.
			 */
			calcPointColor : function(/* string */ from, /* string */ to, /* number */ p) {
				
				/**
				 * returns neutral color.
				 */
				function getMedianColor(color1, color2) {
					// to decimal number.
					function getColorBase10(base16) {
						var rgb = [],
							color = '',
							i;

						base16 = base16.match(/\w/g).join('');

						for (i = 0; i < base16.length; i += 2) {
							color = base16.substr(i, 2);
							color = parseInt('0x' + color, 16);
							rgb.push(color);
						}

						return rgb;
					}

					color1 = getColorBase10(color1);
					color2 = getColorBase10(color2);


					/**
					 * Get average color of the arguments.
					 * Returns hexadecimal color.
					 */
					function getColor(color1, color2) {
						var rgb = [],
							i;

						for (i = 0; i < color1.length; i++) {
							rgb.push(Math.ceil(this.calcPoint(color1[i], color2[i], p)));
							rgb[i] = rgb[i].toString(16);
						}

						return '#' + rgb.join('');
					}

					return getColor.bind(this)(color1, color2);
				}
				return getMedianColor.bind(this)(from, to);
			}
		};
	}
);
