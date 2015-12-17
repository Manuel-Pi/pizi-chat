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
		global.rnumnonpx = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(["../../var/pnum"], function (pnum) {
		return new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
	});
});
