/**
 * @fileOverView urushi object for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides utility to generate urushi modules from html element.
 * </pre>
 * @module templateEngine
 */
define('parser', ['node'], function(node) {
	'use strict';

	const TEMPLATE_NAME_OPTIONS = 'data-urushi-options';

	return {
		getStyleClass: function getStyleClass(/* Element */ element) {
			let classList = [], i;

			if (!(element instanceof Element) || !element.classList) {
				return [];
			}

			for (i = 0; i < element.classList.length; i++) {
				classList.push(element.classList[i]);
			}

			return classList;
		},
		getClassName: function getClassName(/* Array */ classList) {
			return (classList || []).join(' ');
		},
		getOption: function getOption(/* Element */element) {
			let options = element.getAttribute(TEMPLATE_NAME_OPTIONS);
			try {
				options = JSON.parse(options) || {};
			} catch (e) {
				throw new Error('It\'s wrong syntax in ' +
					TEMPLATE_NAME_OPTIONS +
					': ID = ' +
					element.id);
			}

			return options;
		},
		getChildNodes: function getChildNodes(/* Element */element) {
			let nodes = [],
				childNodes = element.childNodes,
				childNode,
				index,
				length;

			for (index = 0, length = childNodes.length; index < length; index++) {
				childNode = childNodes[index];
				if (!node.isNode(childNode)) {
					continue;
				}
				if (node.isTextNode(childNode) && !childNode.wholeText.trim()) {
					continue;
				}
				nodes.push(childNode);
			}
			return nodes;
		},
		getPreviousText: function getPreviousText(/* Element */ element) {
			var textNode = element.previousSibling || {};
			return (textNode.wholeText || '').trim();
		},
		getNextText: function getNextText(/* Element */ element) {
			var textNode = element.nextSibling || {};
			return (textNode.wholeText || '').trim();
		},
		removePreviousNode: function removePreviousNode(/* Element */ element) {
			if (!element || !element.previousSibling || !element.previousSibling.wholeText.trim()) {
				return;
			}
			if (element.nextSibling.remove) {
				element.previousSibling.remove();
			} else {
				element.previousSibling.parentNode.removeChild(element.previousSibling);
			}
		},
		removeNextNode: function removeNextNode(/* Element */ element) {
			if (!element || !element.nextSibling || !element.nextSibling) {
				return;
			}
			if (element.nextSibling.remove) {
				element.nextSibling.remove();
			} else {
				element.nextSibling.parentNode.removeChild(element.nextSibling);
			}
		},
		getChildNodesFunction: function getChildNodesFunction(/* node */ element) {
			return function() {
				let nodes = [],
					childNodes = element.childNodes,
					childNode,
					index,
					length;

				for (index = 0, length = childNodes.length; index < length; index++) {
					childNode = childNodes[index];
					if (!node.isNode(childNode)) {
						continue;
					}
					if (node.isTextNode(childNode) && !childNode.wholeText.trim()) {
						continue;
					}
					nodes.push(childNode);
				}
				return nodes;
			};
		}
	};
});
