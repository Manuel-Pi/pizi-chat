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
		global.attributes = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(["./core", "./attributes/attr", "./attributes/prop", "./attributes/classes", "./attributes/val"], function (jQuery) {

		// Return jQuery for attributes-only inclusion
		return jQuery;
	});
});
