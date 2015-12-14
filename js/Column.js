'use strict';

import Defaultable from './Defaultable';
import config from './config';
import PIXI from '../node_modules/pixi.js/bin/pixi';
import random from '../node_modules/rpg-tools/lib/random';
import reNullPos from './reNullPos';

function generateCube () {
    return random.item(config.playable);
}

export default class Column extends Defaultable {
    defaults () {
        return {
            x: Math.round(config.stageSize.w / 2) * config.cubeSize,
            y: 0
        }
    }

    constructor (options) {
        super(options);

        this.colors = [];
        this.container = new PIXI.Container();

        this.container.position.x = this.params.x;
        this.container.position.y = this.params.y;

        this.generateColumn();
    }

    generateColumn () {
        for (let i = 0; i < 3; i++) {
            let color = generateCube();

            this.colors.push(color);
        }

        this.render();
    }

    render () {
        for (let i = 0; i < 3; i++) {
            let sprite = PIXI.Sprite.fromFrame(this.colors[i]);

            reNullPos(sprite, {y: 40 * i});

            this.container.addChild(sprite);
        }
    }

    shuffle () {
        this.colors.push(this.colors.shift());
        this.render();
    }
};