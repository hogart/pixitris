define(
    [
        'lib/Chitin',
        'config',
        'util'
    ],

    function (Chitin, config, util) {
        'use strict';

        var Column = Chitin.Abstract.extend({
            defaults: {
                x: Math.round(config.stageSize.w / 2) * config.cubeSize,
                y: 0
            },

            initialize: function (options) {
                Column.__super__.initialize.call(this, options);

                this.colors = [];
                this.container = new PIXI.DisplayObjectContainer();

                this.container.position.x = this.params.x;
                this.container.position.y = this.params.y;

                this.generateColumn();
            },

            generateCube: function () {
                return util.getRandomItem(config.playable);
            },

            generateColumn: function () {
                var pushColors = this.colors.push.bind(this.colors),
                    color;

                for (var  i = 0; i < 3; i++) {
                    color = this.generateCube();

                    pushColors(color);
                }

                this.render();
            },

            render: function () {
                var addChild = this.container.addChild.bind(this.container),
                    sprite;

                for (var i = 0; i < 3; i++) {
                    sprite = PIXI.Sprite.fromFrame(this.colors[i]);

                    util.renullPos(sprite, {y: 40 * i});

                    addChild(sprite);
                }
            },

            shuffle: function () {
                this.colors.push(this.colors.shift());
                this.render();
            }
        });

        return Column;
    }
);