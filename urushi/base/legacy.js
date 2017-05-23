/**
 * @fileOverView using ES5 definition for leagcy browser.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Hack code for legacy browser not support ES5 and HTML5.
 * Thanks for following.
 * https://developer.mozilla.org/ja/docs/Web/API/Element/classList
 * </pre>
 * @module legacy
 */
define(
	'legacy',
	[],
	function() {
		'use strict';

		// polyfill : Array.indexOf
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(/* string */ target, /* number */ index) {
				var i,
					length;

				if (isNaN(index)) {
					index = 0;
				}
				for (i = index, length = target.length; i < length; i++) {
					if (this[i] === target) {
						return i;
					}
				}
				return -1;
			};
		}

		// polyfill : lement.classList
		if (typeof document !== 'undefined' && !('classList' in document.createElement('a'))) {

			(function(view) {
				if (!('HTMLElement' in view) && !('Element' in view)) {
					return;
				}

				var classListProp = 'classList',
					protoProp = 'prototype',
					elemCtrProto = (view.HTMLElement || view.Element)[protoProp],
					objCtr = Object,
					strTrim = String[protoProp].trim || function() {
						return this.replace(/^\s+|\s+$/g, '');
					},
					arrIndexOf = Array[protoProp].indexOf || function(item) {
						var i = 0,
							len = this.length;

						for (; i < len; i++) {
							if (i in this && this[i] === item) {
								return i;
							}
						}
						return -1;
					},
					// Vendors: please allow content code to instantiate DOMExceptions
					DOMEx = function(type, message) {
						this.name = type;
						this.code = DOMException[type];
						this.message = message;
					},
					checkTokenAndGetIndex = function(classList, token) {
						if ('' === token) {
							throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
						}
						if (/\s/.test(token)) {
							throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
						}
						return arrIndexOf.call(classList, token);
					},
					ClassList = function(elem) {
						var trimmedClasses = strTrim.call(elem.className),
							classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
							i = 0,
							len = classes.length;

						for (; i < len; i++) {
							this.push(classes[i]);
						}
						this._updateClassName = function() {
							elem.className = this.toString();
						};
					},
					classListProto = ClassList[protoProp] = [],
					classListGetter = function() {
						return new ClassList(this);
					};

				// Most DOMException implementations don't allow calling DOMException's toString()
				// on non-DOMExceptions. Error's toString() is sufficient here.
				DOMEx[protoProp] = Error[protoProp];
				classListProto.item = function(i) {
					return this[i] || null;
				};
				classListProto.contains = function(token) {
					token += '';
					return checkTokenAndGetIndex(this, token) !== -1;
				};
				classListProto.add = function() {
					var tokens = arguments,
						i = 0,
						l = tokens.length,
						token,
						updated = false;

					do {
						token = tokens[i] + '';
						if (-1 === checkTokenAndGetIndex(this, token)) {
							this.push(token);
							updated = true;
						}
					}
					while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.remove = function() {
					var tokens = arguments,
						i = 0,
						l = tokens.length,
						token,
						updated = false,
						index;

					do {
						token = tokens[i] + '';
						index = checkTokenAndGetIndex(this, token);
						if (index !== -1) {
							this.splice(index, 1);
							updated = true;
						}
					}
					while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.toggle = function(token, forse) {
					var result, method;

					token += '';
					result = this.contains(token);
					method = result ? forse !== true && 'remove' : forse !== false && 'add';

					if (method) {
						this[method](token);
					}

					return result;
				};
				classListProto.toString = function() {
					return this.join(' ');
				};

				if (objCtr.defineProperty) {
					var classListPropDesc = {
						get: classListGetter,
						enumerable: true,
						configurable: true
					};
					try {
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					} catch (ex) { // IE 8 doesn't support enumerable:true
						if (-0x7FF5EC54 === ex.number) {
							classListPropDesc.enumerable = false;
							objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
						}
					}
				} else if (objCtr[protoProp].__defineGetter__) {
					elemCtrProto.__defineGetter__(classListProp, classListGetter);
				}
			}(self));
		}

		// polyfill : Object.assign()
		if (typeof Object.assign !== 'function') {
			Object.assign = function(target) {
				var output, index, source, nextKey;
				if (undefined === target || null === target) {
					throw new TypeError('Cannot convert undefined or null to object');
				}

				output = Object(target);
				for (index = 1; index < arguments.length; index++) {
					source = arguments[index];
					if (source !== undefined && source !== null) {
						for (nextKey in source) {
							if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
								output[nextKey] = source[nextKey];
							}
						}
					}
				}
				return output;
			};
		}
	}
);
