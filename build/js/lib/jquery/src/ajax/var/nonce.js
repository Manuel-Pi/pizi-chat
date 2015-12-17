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
		global.nonce = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(["../../core"], function (jQuery) {
		return jQuery.now();
	});
});
