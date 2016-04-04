/**
 * @fileOverView urushi object for urushi.
 * @author Yuzo Hirakawa
 * @version 1.0
 */

/**
 * <pre>
 * Provides utilities related html element, dom node.
 * </pre>
 * @module node
 */
define(
	'node',
	[],
	/**
	 * @alias module:node
	 * @returns {object} node object.
	 */
	function () {
		'use strict';

		var node = {};

		/**
		 * <pre>
		 * Returns whether argument is node or not.
		 * </pre>
		 * @member module:node#isNode
		 * @function
		 * @param {node} node Check target.
		 * @returns {boolean} Whether argument is node or not.
		 */
		function isNode (/* node */ node) {
			return (node && !isNaN(node.nodeType));
		}
		/**
		 * <pre>
		 * Returns whether argument is element node or not.
		 * </pre>
		 * @member module:node#isElementNode
		 * @function
		 * @param {node} node Check target.
		 * @returns {boolean} Whether argument is element node or not.
		 */
		function isElementNode (/* node */ node) {
			return (isNode(node) && document.ELEMENT_NODE === node.nodeType);
		}
		/**
		 * <pre>
		 * Returns whether argument is text element node or not.
		 * </pre>
		 * @member module:node#isTextNode
		 * @function
		 * @param {node} node Check target.
		 * @returns {boolean} Whether argument is text element node or not.
		 */
		function isTextNode (/* node */ node) {
			return (isNode(node) && document.TEXT_NODE === node.nodeType);
		}
		/**
		 * <pre>
		 * Returns whether argument is comment element node or not.
		 * </pre>
		 * @member module:node#isCommentNode
		 * @function
		 * @param {node} node Check target.
		 * @returns {boolean} Whether argument is comment element node or not.
		 */
		function isCommentNode (/* node */ node) {
			return (isNode(node) && document.COMMENT_NODE === node.nodeType);
		}
		/**
		 * <pre>
		 * Returns whether argument is fragment element node or not.
		 * </pre>
		 * @member module:node#isFragmentNode
		 * @function
		 * @param {node} node Check target.
		 * @returns {boolean} Whether argument is fragment element node or not.
		 */
		function isFragmentNode (/* node */ node) {
			return (isNode(node) && document.DOCUMENT_FRAGMENT_NODE === node.nodeType);
		}
		/**
		 * <pre>
		 * Clear element from argument node.
		 * </pre>
		 * @member module:node#clearDomContents
		 * @function
		 * @param {node} node Target node.
		 * @returns none
		 */
		function clearDomContents (/* node */ dom) {
			while (dom.firstChild) {
				dom.removeChild(dom.firstChild);
			}
		}
		/**
		 * <pre>
		 * Replaces content.
		 * </pre>
		 * @member module:node#setDomContents
		 * @function
		 * @param {node} node Document element is replaced.
		 * @param {string|DomNode|Array|NodeList|DocumentFragment} newContents Content is replaced.
		 * @returns {boolean} Whether function succeeded or not.
		 */
		function setDomContents (/* node */ dom, /* string|DomNode|Array|NodeList|DocumentFragment */ newContents) {
			var index,
				length,
				content,
				jqIndex,
				jqLength;
			if (!isElementNode(dom)) {
				throw new Error('Not element node.');
			}
			if (newContents === undefined || newContents === null) {
				return false;
			}

			if (newContents instanceof Array || newContents instanceof jQuery) {
				if (!newContents.length) {
					return false;
				}
			} else if (newContents instanceof NodeList) {
				if (!newContents.length) {
					return false;
				}
				newContents = Array.prototype.slice.call(newContents);
			} else {
				if (newContents === '') {
					return false;
				}

				if (isFragmentNode(newContents)) {
					newContents = Array.prototype.slice.call(newContents.childNodes);
				} else {
					newContents = [newContents];
				}
			}

			clearDomContents(dom);

			for (index = 0, length = newContents.length; index < length; index++) {
				content = newContents[index];
				if (isElementNode(content) || isTextNode(content) || isCommentNode(content) || isFragmentNode(content)) {
					dom.appendChild(content);
				} else if (content instanceof jQuery) {
					for (jqIndex = 0, jqLength = content.length; jqIndex < jqLength; jqIndex++) {
						dom.appendChild(content[jqIndex]);
					}
				} else {
					dom.appendChild(document.createTextNode('' + content));
				}
			}
			return true;
		}
		node.isNode = isNode;
		node.isElementNode = isElementNode;
		node.isTextNode = isTextNode;
		node.isCommentNode = isCommentNode;
		node.isFragmentNode = isFragmentNode;
		node.setDomContents = setDomContents;
		node.clearDomContents = clearDomContents;

		return node;
	}
);
