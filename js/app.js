'use strict';

import Stage from './Stage';
import Column from './Column';
import Field from './Field';
import config from './config';
import Mousetrap from '../node_modules/mousetrap/mousetrap';

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

(function () {
    var renew = false,
        currentColumn,
        toLeft = false,
        toRight = false,
        speed = 1;

    const field = new Field();

    initStage(() => {
        stage.addField(field);

        stage.start();

        currentColumn = new Column();
        field.setColumn(currentColumn);

        stage.registerAnimate(() => {
            if (renew) {
                field.removeColumn();
                renew = false;
            } else {
                field.moveDown();
            }
        })
    });

    //$(document).on('click', function () { renew = true });

    Mousetrap.bind('space', function () { field.pause = !field.pause });
    Mousetrap.bind(['left', 'a'], function () { field.moveLeft() });
    Mousetrap.bind(['right', 'd'], function () { field.moveRight() });
    Mousetrap.bind(['down', 's'], function () { field.currentSpeed = 10; }, 'keydown');
    Mousetrap.bind(['down', 's'], function () { field.currentSpeed = 1; }, 'keyup');
    Mousetrap.bind(['up', 'w'], function () { field.shuffleColumn() });
}());