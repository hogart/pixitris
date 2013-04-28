function prepareStage(options) {
    var p = PIXI,
        stage = new p.Stage(options.bg || 0x000000),
        renderer = p.autoDetectRenderer(options.w || 640, options.h || 480, null, true);

    (options.container || document.body).appendChild(renderer.view);

    var animate = function () {
        requestAnimFrame(animate);

        options.animate && options.animate();

        // render the stage
        renderer.render(stage);
    };

    requestAnimFrame(animate);

    return {
        stage: stage,
        renderer: renderer
    }
}

function prepareEntity(options) {
    if (!('fileName' in options)) {
        throw new Error('Cannot instantiate texture without fileName');
    }

    var p = PIXI,
        texture = p.Texture.fromImage(options.fileName),
        entity = new p.Sprite(texture);

    entity.anchor.x = options.anchorX || 0.5;
    entity.anchor.y = options.anchorY || 0.5;

    entity.position.x = options.positionX || (640 / 2);
    entity.position.y = options.positionY || (480 / 2);

    options.addTo && options.addTo.addChild(entity);

    return entity;
}

function getRandomArbitrary (min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomItem (arr) {
    var index = Math.round(getRandomArbitrary(0, arr.length - 1));
    return arr[index];
}

var PIECE_SIZE = 40,
    STAGE_DIM = {
        w: PIECE_SIZE * 12,
        h: PIECE_SIZE * 16
    },
    options = {
        bg: 0xffffff,
        w: STAGE_DIM.w,
        h: STAGE_DIM.h,
        container: document.body.querySelector('.js-f')
    };

var assetsToLoad = ['js/SpriteSheet.json'],
    loader = new PIXI.AssetLoader(assetsToLoad),
    blocks = [],
    blockContainer = new PIXI.DisplayObjectContainer(),
    blockFrames = ['bronze', 'violet', 'grey', 'cyan', 'purple', 'golden', 'blue', 'red', 'green', 'yellow', 'pink', 'sky'],
    playable = 'blue red green cyan purple golden'.split(' ');

blockContainer.position.x = 0;
blockContainer.position.y = 0;

loader.load();


function prepareSprites () {
    var sprites = {};

    playable.forEach(function (frameName, index) {
        sprites[frameName] = PIXI.Sprite.fromFrame(frameName);
    });

    return sprites;
}

function createRandomCube (playable) {
    var name = getRandomItem(playable);

    return PIXI.Sprite.fromFrame(name);
}

function createColumn (playable) {
    var container = new PIXI.DisplayObjectContainer(),
        sprite;

    for (var i = 0; i < 3; i++) {
        sprite = createRandomCube(playable);
        sprite.position.y = 40 * i;
        sprite.position.x = 0;
        sprite.anchor.x = 0;
        sprite.anchor.x = 0;

        container.addChild(sprite);
    }

    return container;
}

var sprites;

loader.onComplete = function () {
    sprites = prepareSprites();

    currentColumn = createColumn(playable);
    stage.stage.addChild(currentColumn);

    options.animate = function () {
        var s = stage.stage;
        if (renew) {
            currentColumn && s.removeChild(currentColumn);
            currentColumn = createColumn(playable);
            s.addChild(currentColumn);
            renew = false;
        }
    }
};

var stage = prepareStage(options);
stage.stage.addChild(blockContainer);

var renew = false,
    currentColumn;

document.onclick = function () {
    renew = true;
};