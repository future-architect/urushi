/**
 * @fileOverView xhr object definition.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * XML Http request utilities.
 * </pre>
 * @module xhr
 */
define(
	'xhr',
	['underscore', 'Deferred'],
	/**
	 * @alias module:xhr
	 * @returns {object} xhr object.
	 */
	function(_, Deferred) {
		'use strict';
		/**
		 * <pre>
		 * Constants.
		 * </pre>
		 * @member module:xhr#CONSTANTS
		 * @type Obejct
		 * @constant
		 * @private
		 */
		var CONSTANTS = {
				HTTP_METHOD_GET: 'GET',
				HTTP_METHOD_POST: 'POST',
				HTTP_METHOD_PUT: 'PUT',
				HTTP_METHOD_DELETE: 'DELETE',
				READY_STATE_UNINITIALIZED: 0,
				READY_STATE_CONNECTED: 1,
				READY_STATE_REQUESTED: 2,
				READY_STATE_PROCESSING: 3,
				READY_STATE_FINISHED: 4,
				OPTION_DEFAULT_TIMEOUT: 300000
			},
			/**
			 * <pre>
			 * Default values for xml http request.
			 * </pre>
			 * @member module:xhr#defaultOptions
			 * @type Obejct
			 * @constant
			 * @private
			 */
			defaultOptions = {
				data: null,
				query: null,
				async: true,
				responseType: 'text',
				timeout: CONSTANTS.DEFAULT_TIMEOUT,
				ioArgs: null,
				withCredentials: false,
				user: undefined,
				password: undefined,
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'X-Requested-With': 'XMLHttpRequest'
				}
			},
			/**
			 * <pre>
			 * Returns true.
			 * </pre>
			 * @member module:xhr#defaultOptions
			 * @function
			 * @private
			 * @returns {boolean} true.
			 */
			isTrue = function() {
				return true;
			},
			/**
			 * <pre>
			 * Returns false.
			 * </pre>
			 * @member module:xhr#defaultOptions
			 * @function
			 * @private
			 * @returns {boolean} false.
			 */
			isFalse = function() {
				return false;
			},
			/**
			 * <pre>
			 * Returns whether window object has XMLHttpRequest or not.
			 * </pre>
			 * @member module:xhr#hasXMLHttpRequest
			 * @function
			 * @private
			 * @returns {boolean} Whether window object has XMLHttpRequest or not.
			 */
			hasXMLHttpRequest = (function() {
				return window.XMLHttpRequest ? isTrue : isFalse;
			})(),
			/**
			 * <pre>
			 * Returns whether XMLHttpRequest has responceType or not.
			 * </pre>
			 * @member module:xhr#hasResponseType
			 * @function
			 * @private
			 * @returns {boolean} Whether XMLHttpRequest has responceType or not.
			 */
			hasResponseType = (function() {
				var httpRequest;

				if (!hasXMLHttpRequest()) {
					return isFalse;
				}
				httpRequest = new XMLHttpRequest();
				return typeof httpRequest.responseType !== 'undefined' ? isTrue : isFalse;
			})(),
			/**
			 * <pre>
			 * Returns xml http request object.
			 * </pre>
			 * @member module:xhr#hasResponseType
			 * @function
			 * @private
			 * @returns {object} Xml http request object.
			 */
			getHttpRequest = (function() {
				if (window.XMLHttpRequest) {
					return function() {
						return new XMLHttpRequest();
					};
				} else if (window.ActiveXObject) {
					return function() {
						var httpRequest;
						try {
							httpRequest = new window.ActiveXObject('Msxml2.XMLHTTP');
						} catch (e) {
							httpRequest = new window.ActiveXObject('Microsoft.XMLHTTP');
						}
						return httpRequest;
					};
				} else {
					return function() {
						return null;
					};
				}
			})(),
			/**
			 * <pre>
			 * It monitors xml http request.
			 * Xml http request's redeayState is finished(4), then it resolve deferred object.
			 * </pre>
			 * @member module:xhr#response
			 * @function
			 * @private
			 * @returns none.
			 */
			response = function(/* object */ httpRequest, /* object */ deferred) {
				var validStatus = [200, 201];
				return function() {
					if (CONSTANTS.READY_STATE_FINISHED === httpRequest.readyState) {
						if (-1 !== validStatus.indexOf(httpRequest.status)) {
							deferred.resolve(httpRequest.responseText);
						} else {
							deferred.reject(httpRequest.responseText);
						}
					}
				};
			},
			/**
			 * <pre>
			 * Actual process of xml http request.
			 * Supports get, post, put and deelte.
			 * </pre>
			 * @member module:xhr#_xhr
			 * @function
			 * @private
			 * @param {string} method Xhr method name.
			 * @param {string} uri Request URI.
			 * @param {object} options Xhr optoins.
			 * @returns {object} Deferred.
			 */
			_xhr = function(/* string */ method, /* string */ uri, /* object */ options) {
				var deferred = new Deferred(),
					httpRequest,
					xhrOptions,
					header;
				
				try {
					httpRequest = getHttpRequest();
					xhrOptions = _.extend(defaultOptions, options);

					httpRequest.open(method, uri, xhrOptions.async, xhrOptions.user, xhrOptions.password);
					httpRequest.withCredentials = xhrOptions.withCredentials;
					httpRequest.onreadystatechange = xhrOptions.response
						? xhrOptions.response(httpRequest, deferred)
						: response(httpRequest, deferred);
					
					if (hasResponseType()) {
						httpRequest.responseType = xhrOptions.responseType;
					}
					for (header in xhrOptions.headers) {
						httpRequest.setRequestHeader(header, xhrOptions.headers[header]);
					}

					httpRequest.send(xhrOptions.data);
				} catch (e) {
					deferred.reject(e);
				}
				return deferred;
			},
			xhr;

		xhr = {
			/**
			 * <pre>
			 * Get method.
			 * </pre>
			 * @example
			 *	require(['xhr'], function(xhr) {
			 *		xhr.get('http://localhost/urshi/Something?id=1').then(function(result) {
			 *			console.log(result);
			 *		});
			 *	});
			 * @function
			 * @param {string} uri Request URI.
			 * @param {object} options Xhr optoins.
			 * @returns {object} Deferred object.
			 */
			get: function(/* string */ uri, /* object */ options) {
				return _xhr(CONSTANTS.HTTP_METHOD_GET, uri, options);
			},
			/**
			 * <pre>
			 * Post method.
			 * </pre>
			 * @example
			 *	require(['xhr'], function(xhr) {
			 *		xhr.post('http://localhost/urshi/Something', {data: {name: 'urushi'}}).then(function(result) {
			 *			console.log(result);
			 *		});
			 *	});
			 * @function
			 * @param {string} uri Request URI.
			 * @param {object} options Xhr optoins.
			 * @returns {object} Deferred object.
			 */
			post: function(/* string */ uri, /* object */ options) {
				return _xhr(CONSTANTS.HTTP_METHOD_POST, uri, options);
			},
			/**
			 * <pre>
			 * Put method.
			 * </pre>
			 * @example
			 *	require(['xhr'], function(xhr) {
			 *		xhr.put('http://localhost/urshi/Something', {data: {id: 1, name: 'urushi changed.'}}).then(function(result) {
			 *			console.log(result);
			 *		});
			 *	});
			 * @function
			 * @param {string} uri Request URI.
			 * @param {object} options Xhr optoins.
			 * @returns {object} Deferred object.
			 */
			put: function(/* string */ uri, /* object */ options) {
				return _xhr(CONSTANTS.HTTP_METHOD_PUT, uri, options);
			},
			/**
			 * <pre>
			 * Delete method.
			 * </pre>
			 * @example
			 *	require(['xhr'], function(xhr) {
			 *		xhr.delete('http://localhost/urshi/Something', {data: {id: 1}).then(function(result) {
			 *			console.log(result);
			 *		});
			 *	});
			 * @function
			 * @param {string} uri Request URI.
			 * @param {object} options Xhr optoins.
			 * @returns {object} Deferred object.
			 */
			delete: function(/* string */ uri, /* object */ options) {
				return _xhr(CONSTANTS.HTTP_METHOD_DELETE, uri, options);
			}
		};

		return xhr;
	}
);
