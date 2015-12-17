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
		global.deprecated = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(["./core", "./traversing"], function (jQuery) {

		// The number of elements contained in the matched element set
		jQuery.fn.size = function () {
			return this.length;
		};

		jQuery.fn.andSelf = jQuery.fn.addBack;
	});
});
