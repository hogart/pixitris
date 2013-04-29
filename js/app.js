require(
    [
        'Stage',
        'Column',
        'Field',
        'config',
        'jquery',
        'lib/mousetrap'
    ],
    function (Stage, Column, Field, config, $, Mousetrap) {
        'use strict';

        var stage;

        function initStage (callback) {
            new Stage({
                sprites: ['js/cubes.json'],
                w: config.cubeSize * config.stageSize.w,
                h: config.cubeSize * config.stageSize.h,

                onSprites: function (stageInstance) {
                    stage = stageInstance;

                    callback(stage);
                }
            })
        }

        $(function () {
            var renew = false,
                currentColumn,
                toLeft = false,
                toRight = false,
                speed = 1;

            var field = new Field();

            initStage(function () {
                stage.start();

                currentColumn = new Column();
                stage.stage.addChild(currentColumn.container);

                stage.registerAnimate(function () {
                    if (renew) {
                        currentColumn && stage.stage.removeChild(currentColumn.container);
                        currentColumn = new Column();
                        stage.stage.addChild(currentColumn.container);
                        renew = false;
                    } else {
                        currentColumn.fall(speed);
                        if (toLeft) {
                            currentColumn.toLeft();
                            toLeft = false;
                        }
                        if (toRight) {
                            currentColumn.toRight();
                            toRight = false;
                        }
                    }
                })
            });

            $(document).on('click', function () { renew = true });

            Mousetrap.bind('space', function () { speed = speed ? 0 : 1 });
            Mousetrap.bind('left', function () { toLeft = true; });
            Mousetrap.bind('right', function () { toRight = true; });
            Mousetrap.bind('down', function () { speed = 10; }, 'keydown');
            Mousetrap.bind('down', function () { speed = 1; }, 'keyup');
        })

    }
);
