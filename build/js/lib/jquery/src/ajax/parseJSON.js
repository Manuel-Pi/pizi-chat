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
		global.parseJSON = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	define(["../core"], function (jQuery) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		jQuery.parseJSON = function (data) {
			return JSON.parse(data + "");
		};

		return jQuery.parseJSON;
	});
});
