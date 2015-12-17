(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.app = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    require.config({
        paths: {
            app: 'app',
            jquery: 'lib/jquery/dist/jquery',
            underscore: 'lib/underscore/underscore',
            backbone: 'lib/backbone/backbone',
            foundation: 'lib/foundation/js/foundation',
            moment: 'lib/moment/moment',
            text: 'lib/text/text',
            modernizr: 'lib/modernizr/modernizr'
        },
        shim: {
            jquery: {
                exports: '$'
            },
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ['underscore', 'jquery']
            },
            app: {
                deps: ['backbone'],
                exports: 'App'
            },
            foundation: ['jquery', 'modernizr']
        },
        packages: []
    });
    require(['backbone', 'pizi-chat'], function (Backbone) {
        Backbone.history.start();
    });
});
