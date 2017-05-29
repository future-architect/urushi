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
	function() {
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
		function isNode(/* node */ node) {
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
		function isElementNode(/* node */ node) {
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
		function isTextNode(/* node */ node) {
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
		function isCommentNode(/* node */ node) {
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
		function isFragmentNode(/* node */ node) {
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
		function clearDomContents(/* node */ dom) {
			while (dom.firstChild) {
				dom.removeChild(dom.firstChild);
			}
		}
		function getStyle(/* node */ dom) {
			return dom.currentStyle || document.defaultView.getComputedStyle(dom, '');
		}
		function remove(/* Element|Text|Comment */ node) {
			if (!node || !node.parentElement) {
				return;
			}
			node.parentElement.removeChild(node);
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
		function setDomContents(/* node */ dom, /* string|DomNode|Array|NodeList|DocumentFragment */ newContents) {
			var index,
				length,
				content;
			
			if (!isElementNode(dom)) {
				throw new Error('Not element node.');
			}
			if (undefined === newContents || null === newContents) {
				return false;
			}

			if (newContents instanceof Array) {
				if (!newContents.length) {
					return false;
				}
			} else if (newContents instanceof NodeList) {
				if (!newContents.length) {
					return false;
				}
				newContents = Array.prototype.slice.call(newContents);
			} else {
				if ('' === newContents) {
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
				if (isElementNode(content) ||
						isTextNode(content) ||
						isCommentNode(content) ||
						isFragmentNode(content)) {
					
					dom.appendChild(content);
				} else {
					dom.appendChild(document.createTextNode('' + content));
				}
			}
			return true;
		}
		/**
		 * <pre>
		 * NodeListを作成する。
		 * </pre>
		 * @member module:node#createNodes
		 * @function
		 * @param {string} nodes HTML構造を文字列にしたもの
		 * @returns {NodeList} NodeListとして作成したElement, Text, Commentを返却する
		 */
		function createNodes(/* string */ nodes) {
			var d = document.createElement('div');
			d.innerHTML = nodes;

			return d.childNodes;
		}
		/**
		 * <pre>
		 * 単一のElement, Text, Commentを作成する。
		 * </pre>
		 * @member module:node#createNode
		 * @function
		 * @param {string} node HTML構造を文字列にしたもの
		 * @returns {Element|Text|Comment} 作成した単一のHTMLElement, Text等を返却する
		 */
		function createNode(/* string */ node) {
			let nodeList = createNodes(node);

			if (nodeList.length > 1) {
				throw new Error('引数エラー：Root要素が' + nodeList.length + 'つ作成されました。');
			}
			return nodeList[0];
		}

		node.isNode = isNode;
		node.isElementNode = isElementNode;
		node.isTextNode = isTextNode;
		node.isCommentNode = isCommentNode;
		node.isFragmentNode = isFragmentNode;
		node.setDomContents = setDomContents;
		node.getStyle = getStyle;
		node.remove = remove;
		node.clearDomContents = clearDomContents;
		node.createNodes = createNodes;
		node.createNode = createNode;

		return node;
	}
);
