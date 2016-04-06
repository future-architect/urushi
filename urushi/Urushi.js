/**
 * @fileOverView Urushi object for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides urushi utilities.
 * </pre>
 * @module Urushi
 * @requires module:legacy
 * @requires module:browser
 * @requires module:event
 * @requires module:Deferred
 * @requires module:xhr
 * @requires module:node
 */
define(
	'Urushi',
	['legacy', 'browser', 'event', 'Deferred', 'xhr', 'node'],
	/**
	 * @alias module:Urushi
	 * @returns {object} Urushi object.
	 */
	function (legacy, browser, event, Deferred, xhr, node) {
		'use strict';

		var Urushi = {},
			mixinObjects = [browser, event, node],
			mixinObject,
			index,
			length,
			key;

		// mixin utilities.
		for (index = 0, length = mixinObjects.length; index < length; index++) {
			mixinObject = mixinObjects[index];
			for (key in mixinObject) {
				Urushi[key] = mixinObject[key];
			}
		}

		// mixin Deferred Class.
		Urushi.Deferred = Deferred;

		// create xhr and register xhr method.
		Urushi.xhr = {};
		for (key in xhr) {
			Urushi.xhr[key] = xhr[key];
		}

		return Urushi;
	}
);
