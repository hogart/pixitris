define(
    [
        'lib/Chitin',
        'config',
        '_'
    ],
    function (Chitin, config, _) {
        var Stage = Chitin.Abstract.extend({
            defaults: {
                container: document.body,
                w: 640,
                h: 480,
                view: null,
                transparent: true,

                stageBG: 0x000000
            },

            initialize: function (options) {
                Stage.__super__.initialize.call(this, options);

                this.animateHandlers = {};

                this.setRenderer();
                this.setStage();

                _.bindAll(this, ['animate', 'start']);

                if (this.params.sprites) {
                    this.loadSprites(this.params.sprites, this.params.onSprites || this.start);
                }
            },

            start: function () {
                this.params.container.appendChild(this.renderer.view);
                this.animate();
            },

            registerAnimate: function (handler, context) {
                var id = _.uniqueId('animate');

                this.animateHandlers[id] = handler.bind(context);

                return id;
            },

            unregisterAnimate: function (id) {
                delete this.animateHandlers[id];
            },

            animate: function () {
                requestAnimFrame(this.animate);

                for (var handler in this.animateHandlers) {
                    this.animateHandlers[handler](this);
                }

                // render the stage
                this.renderer.render(this.stage);
            },

            setStage: function () {
                this.stage = new PIXI.Stage(this.params.bg)
            },

            setRenderer: function () {
                this.renderer = PIXI.autoDetectRenderer(this.params.w, this.params.h, this.params.view, this.params.transparent)
            },

            loadSprites: function (sprites, callback) {
                var that = this,
                    assetLoader = new PIXI.AssetLoader(sprites);

                assetLoader.onComplete = function () {
                    callback(that);
                };

                assetLoader.load();
            }
        });

        return Stage;
    }
);