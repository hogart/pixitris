'use strict';

import Defaultable from './Defaultable';
import config from './config';
import PIXI from '../node_modules/pixi.js/bin/pixi';
import reNullPos from './reNullPos';
import {bindAll, uniqueId} from '../node_modules/lodash/index';

export default class Stage extends Defaultable {
    defaults () {
        return {
            container: document.body,
            w: 640,
            h: 480,
            view: null,
            transparent: true,

            stageBG: 0x000000
        }
    }

    constructor (options) {
        super(options);

        this.animateHandlers = {};

        this.setRenderer();
        this.setStage();

        _.bindAll(this, ['animate', 'start']);

        if (this.params.sprites) {
            this.loadSprites(this.params.sprites, this.params.onSprites || this.start);
        }
    }

    start () {
        this.params.container.appendChild(this.renderer.view);
        this.animate();
    }

    registerAnimate (handler, context) {
        var id = _.uniqueId('animate');

        this.animateHandlers[id] = handler.bind(context);

        return id;
    }

    unregisterAnimate (id) {
        delete this.animateHandlers[id];
    }

    animate () {
        requestAnimationFrame(this.animate);

        for (var handler in this.animateHandlers) {
            this.animateHandlers[handler](this);
        }

        // render the stage
        this.renderer.render(this.stage);
    }

    setStage () {
        this.stage = new PIXI.Stage(this.params.bg)
    }

    setRenderer () {
        this.renderer = PIXI.autoDetectRenderer(this.params.w, this.params.h, this.params.view, this.params.transparent);
    }

    loadSprites (sprites, callback) {
        const assetLoader = PIXI.loader;

        sprites.forEach((sprite) => {
            assetLoader.add(sprite);
        });

        assetLoader.once('complete', () => {
            callback(this);
        });

        assetLoader.load();
    }

    addField (field) {
        this.field = field;
        this.stage.addChild(this.field.container);
        reNullPos(this.field.container);
    }
}

