var require = {
    baseUrl: 'js',

    paths: {
        _: 'lib/lodash',
        jquery: 'lib/jquery',
        pixi: 'lib/pixi',
        'lib/mousetrap': 'lib/mousetrap.min'
    },

    shim: {
        'pixi': {
            deps: [],
            exports: 'PIXI',
            init: function (PIXI) {
                return window.PIXI;
            }
        },
        'lib/mousetrap': {
            exports: 'Mousetrap'
        }
    }
};