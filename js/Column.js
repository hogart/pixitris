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
                x: 0,
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
                var name = util.getRandomItem(config.playable);

                return [name, PIXI.Sprite.fromFrame(name)];
            },

            generateColumn: function () {
                var pushColors = this.colors.push.bind(this.colors),
                    addChild = this.container.addChild.bind(this.container),
                    cube,
                    sprite;

                for (var  i = 0; i < 3; i++) {
                    cube = this.generateCube();

                    pushColors(cube[0]);

                    sprite = cube[1];

                    sprite.position.y = 40 * i;
                    sprite.position.x = 0;
                    sprite.anchor.x = 0;
                    sprite.anchor.x = 0;

                    addChild(sprite);
                }
            },

            fall: function (distance) {
                var expectedPos = this.container.position.y + distance + 3 * config.cubeSize;
                if (expectedPos > config.cubeSize * config.stageSize.h) {
                    this.container.position.y = config.cubeSize * (config.stageSize.h - 3)
                } else {
                    this.container.position.y += distance;
                }
            },

            toLeft: function () {
                if (this.container.position.x > 0) {
                    this.container.position.x -= config.cubeSize;
                }
            },

            toRight: function () {
                if (this.container.position.x + config.cubeSize < config.cubeSize * config.stageSize.w) {
                    this.container.position.x += config.cubeSize;
                }
            }
        });

        return Column;
    }
);