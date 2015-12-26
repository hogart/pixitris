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

var currentColumn;

const field = new Field();

initStage(() => {
    stage.addField(field);

    stage.start();

    currentColumn = new Column();
    field.setColumn(currentColumn);

    stage.registerAnimate(() => {
        field.moveDown();
    })
});

Mousetrap.bind('space', function () { field.pause = !field.pause });
Mousetrap.bind(['left', 'a'], function () { field.moveLeft() });
Mousetrap.bind(['right', 'd'], function () { field.moveRight() });
Mousetrap.bind(['down', 's'], function () { field.speedUp() }, 'keydown');
Mousetrap.bind(['down', 's'], function () { field.speedDown() }, 'keyup');
Mousetrap.bind(['up', 'w'], function () { field.shuffleColumn() });