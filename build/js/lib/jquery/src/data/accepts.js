(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.accepts = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(["../core"], function (jQuery) {

		/**
   * Determines whether an object can have data
   */
		jQuery.acceptData = function (owner) {
			// Accepts only:
			//  - Node
			//    - Node.ELEMENT_NODE
			//    - Node.DOCUMENT_NODE
			//  - Object
			//    - Any
			/* jshint -W018 */
			return owner.nodeType === 1 || owner.nodeType === 9 || ! +owner.nodeType;
		};

		return jQuery.acceptData;
	});
});
