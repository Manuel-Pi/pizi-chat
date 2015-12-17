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
		global.support = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(["../var/support"], function (support) {

		support.focusinBubbles = "onfocusin" in window;

		return support;
	});
});
