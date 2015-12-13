'use strict';

import Defaultable from './Defaultable';
import Column from './Column';
import config from './config';
import PIXI from '../node_modules/pixi.js/bin/pixi';
import reNullPos from './reNullPos';

export default class Field extends Defaultable {
    defaults () {
        return {
            w: 8,
            h: 12
        }
    }

    constructor (options) {
        super(options);

        this.clearField();

        this.container = new PIXI.Container();
        reNullPos(this.container);

        this.ensureBG();

        if (this.params.column) {
            this.setColumn(this.params.column);
        }

        this.currentSpeed = 1;
        this.pause = false;

        this.cubesChildren = [];
        this.clearRender = false;
//                this.field[0][11].color = 'green';
//                this.field[1][11].color = 'blue';
//                this.field[1][10].color = 'red';
//
//                this.printDebug();
    }

    clearField () {
        var field = [];
        for (var x = 0; x < this.params.w; x++) {
            field[x] = [];
            for (var y = 0; y < this.params.h; y++) {
                field[x].push({color: undefined});
            }
        }

        this.field = field;
    }

    render () {
        var field = this.field,
            col,
            color,
            sprite;

        if (this.clearRender) {
            for (var i = 0; i < this.cubesChildren.length; i++) {
                this.container.removeChild(this.cubesChildren[i]);
            }
            this.cubesChildren = [];
        }

        for (var x = this.params.w - 1; x >= 0; x--) {
            col = field[x];
            for (var y = this.params.h - 1; y >= 0; y--) {
                color = col[y].color;
                if (color) {
                    sprite = PIXI.Sprite.fromFrame(color);
                    this.cubesChildren.push(sprite);
                    this.container.addChild(sprite);
                    reNullPos(sprite, {x: x * config.cubeSize, y: y * config.cubeSize});
                }
            }
        }
    }

    shouldDie (x, y) {
        var field = this.field,
            curColor = field[x][y].color;

        if (!field[x][y].color) {
            return
        }

        var toDelete = [],
            maxX = this.params.w - 1,
            maxY = this.params.h - 1;

        // horizontal right
        if (x + 1 <= maxX && curColor == field[x + 1][y].color) {
            if (x + 2 <= maxY && curColor == field[x + 2][y].color) {
                toDelete.push(field[x][y], field[x + 1][y], field[x + 2][y]);
                if (x + 3 <= maxX && curColor == field[x + 3][y].color) {
                    toDelete.push(field[x + 3][y]);
                }
                if (x - 1 >= 0 && curColor == field[x - 1][y].color) {
                    toDelete.push(field[x - 1][y]);
                }
            }
        }

        // vertical down
        if (y + 1 <= maxY && curColor == field[x][y + 1].color) {
            if (y + 2 <= maxY && curColor == field[x][y + 2].color) {
                toDelete.push(field[x][y], field[x][y + 1], field[x][y + 2]);
                if (y + 3 <= maxY && curColor == field[x][y + 3].color) {
                    toDelete.push(field[x][y + 3]);
                }
                if (y - 1 >= 0 && curColor == field[x][y - 1].color) {
                    toDelete.push(field[x][y - 1]);
                }
            }
        }

        // diagonal down-right \
        if ((x + 1 <= maxX) && (y + 1 <= maxY) && curColor == field[x + 1][y + 1].color) {
            if ((x + 2 <= maxX) && (y + 2 <= maxY) && curColor == field[x + 2][y + 2].color) {
                toDelete.push(field[x][y], field[x + 1][y + 1], field[x + 2][y + 2]);
            }
            if ((x + 3 <= maxX) && (y + 3 <= maxY) && curColor == field[x + 3][y + 3].color) {
                toDelete.push(field[x + 3][y + 3]);
            }
            if ((x - 1 >= 0) && (y - 1 >= 0) && curColor == field[x - 1][y - 1].color) {
                toDelete.push(field[x - 1][y - 1]);
            }
        }

        // diagonal down-left /
        if ((x - 1 <= 0) && (y - 1 <= 0) && curColor == field[x - 1][y - 1].color) {
            if ((x - 2 >= 0) && (y - 2 >= 0) && curColor == field[x - 2][y - 2].color) {
                toDelete.push(field[x][y], field[x - 1][y - 1], field[x - 2][y - 2]);
            }
            if ((x - 3 >= 0) && (y - 3 >= 0) && curColor == field[x - 3][y - 3].color) {
                toDelete.push(field[x - 3][y - 3]);
            }
            if ((x + 1 <= maxX) && (y + 1 <= maxY) && curColor == field[x + 1][y + 1].color) {
                toDelete.push(field[x + 1][y + 1]);
            }
        }

        if (toDelete.length) {
            this.clearRender = true;

            for (var i = toDelete.length - 1; i >= 0; i--) {
                toDelete[i].color = undefined;
            }
        }
    }

    removeDead () {
        var field = this.field,
            col,
            newCol,
            maxY;

        for (var x = this.params.w - 1; x >= 0; x--) {
            maxY = this.getFreeHeight(x);
            if (this.params.h - 1 == maxY) {
                continue;
            }

            col = field[x];
            newCol = col.filter((cube) => {
                return !!cube.color
            });

            if (newCol.length != col.length) {
                if (col.length < this.params.h) {
                    for (var i = 0; i < this.params.h; i++) {
                        col[i] = {color: undefined};
                    }
                }
            }

        }
    }

    /**
     * Find how much non-empty cells in this column
     * @param {Number} column
     * @returns {Number}
     */
    getFreeHeight (column) {
        var height = 0;
        for (var i = this.params.h - 1; i >= 0; i--) {
            if (!this.field[column][i].color) {
                height = i + 1;
                break
            }
        }

        return height;
    }

    getFreeHeightPhys (column) {
        return this.getFreeHeight(column) * config.cubeSize;
    }

    getColumnLowEnd () {
        var physicalY = this.column.container.position.y + 3 * config.cubeSize,
            logicalY = Math.floor(physicalY / config.cubeSize);

        return {phys: physicalY, log: logicalY}
    }

    getColumnLogicalX () {
        return Math.round(this.column.container.position.x / config.cubeSize);
    }

    moveDown () {
        if (this.pause) {
            return;
        }
        var current = this.getColumnLowEnd(),
            maxAvail = this.getFreeHeightPhys(this.getColumnLogicalX()),
            next = current.phys + this.currentSpeed;

        if (next >= maxAvail) {
            this.column.container.position.y = maxAvail;
            this.dropColumn(this.getColumnLogicalX());
            // do the check
        } else {
            this.column.container.position.y = next - config.cubeSize * 3;
        }
    }

    moveLeft () {
        if (this.pause) {
            return;
        }

        var logX = this.getColumnLogicalX();

        if (logX == 0) {
            return;
        }

        var current = this.getColumnLowEnd().phys,
            leftMax = this.getFreeHeightPhys(logX - 1);

        if (current <= leftMax) {
            this.column.container.position.x -= config.cubeSize;
        }
    }

    moveRight () {
        if (this.pause) {
            return;
        }

        var logX = this.getColumnLogicalX();

        if (logX == config.stageSize.w - 1) {
            return;
        }

        var current = this.getColumnLowEnd().phys,
            rightMax = this.getFreeHeightPhys(logX + 1);

        if (current <= rightMax) {
            this.column.container.position.x += config.cubeSize;
        }
    }

    shuffleColumn () {
        this.column.shuffle();
    }

    dropColumn (x) {
        var items = this.column.colors,
            start = this.getFreeHeight(x) - 1;

        for (var i = 0; i < 3; i++) {
            this.field[x][start - i].color = items[2 - i];
            this.shouldDie(x, start - i);
        }

        this.removeDead();
        this.render();

        this.removeColumn();
    }

    setColumn (column) {
        this.column = column;
        this.container.addChild(this.column.container);
    }

    removeColumn () {
        this.container.removeChild(this.column.container);
        this.setColumn(new Column());
    }

    ensureBG () {
        var bgTexture = PIXI.Texture.fromImage('img/field.png');
        var bg = new PIXI.Sprite(bgTexture);

        reNullPos(bg, {alpha: 0.2});

        this.container.addChild(bg);
    }

    printDebug () {
        var field = '',
            row;
        for (var y = 0; y < this.params.h; y++) {
            row = [];
            for (var x = 0; x < this.params.w; x++) {
                row.push(this.field[x][y].color ? '*' : '-')
            }
            field += row.join(' ') + '\n';
        }

        console.log(field);
        return field;
    }
}