require.config({
    baseUrl: "js/modules/",
    paths: {
        views: '../views',
        models: '../models',
        html: '../../html'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ]
        },
        app: {
            deps: [
                'backbone'
            ],
            exports: 'App'
        },
        foundation: ['jquery', 'modernizr']
    }
});
require(['backbone',
        '../pizi-chat'
    ],
    (Backbone) => {
        Backbone.history.start();
    });