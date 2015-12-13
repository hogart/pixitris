'use strict';

import Defaultable from './Defaultable';
import config from './config';
import PIXI from '../node_modules/pixi.js/bin/pixi';
import random from '../node_modules/rpg-tools/lib/random';
import reNullPos from './reNullPos';

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

    generateCube () {
        return random.item(config.playable);
    }

    generateColumn () {
        var pushColors = this.colors.push.bind(this.colors);
        var color;

        for (let i = 0; i < 3; i++) {
            color = this.generateCube();

            pushColors(color);
        }

        this.render();
    }

    render () {
        var addChild = this.container.addChild.bind(this.container);
        var sprite;

        for (let i = 0; i < 3; i++) {
            sprite = PIXI.Sprite.fromFrame(this.colors[i]);

            reNullPos(sprite, {y: 40 * i});

            addChild(sprite);
        }
    }

    shuffle () {
        this.colors.push(this.colors.shift());
        this.render();
    }
};