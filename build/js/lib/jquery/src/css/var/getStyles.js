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
		global.getStyles = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(function () {
		return function (elem) {
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			if (elem.ownerDocument.defaultView.opener) {
				return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			}

			return window.getComputedStyle(elem, null);
		};
	});
});
