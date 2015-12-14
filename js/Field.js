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

        this.initField();

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

    initField () {
        const field = [];
        for (let x = 0; x < this.params.w; x++) {
            field[x] = [];
            for (let y = 0; y < this.params.h; y++) {
                field[x].push({color: undefined});
            }
        }

        this.field = field;
    }

    render () {
        if (this.clearRender) {
            for (let i = 0; i < this.cubesChildren.length; i++) {
                this.container.removeChild(this.cubesChildren[i]);
            }
            this.cubesChildren.length = 0;
        }

        for (let x = this.params.w - 1; x >= 0; x--) {
            let col = this.field[x];
            for (let y = this.params.h - 1; y >= 0; y--) {
                let color = col[y].color;
                if (color) {
                    let sprite = PIXI.Sprite.fromFrame(color);
                    this.cubesChildren.push(sprite);
                    this.container.addChild(sprite);
                    reNullPos(sprite, {x: x * config.cubeSize, y: y * config.cubeSize});
                }
            }
        }
    }

    shouldDie (x, y) {
        const field = this.field;
        const curColor = field[x][y].color;

        if (!field[x][y].color) {
            return
        }

        const toDelete = [];
        const maxX = this.params.w - 1;
        const maxY = this.params.h - 1;

        // horizontal right
        if (x + 1 <= maxX && curColor === field[x + 1][y].color) {
            if (x + 2 <= maxX && curColor === field[x + 2][y].color) {
                toDelete.push(field[x][y], field[x + 1][y], field[x + 2][y]);
                if (x + 3 <= maxX && curColor === field[x + 3][y].color) {
                    toDelete.push(field[x + 3][y]);
                }
                if (x - 1 >= 0 && curColor === field[x - 1][y].color) {
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

            for (let i = toDelete.length - 1; i >= 0; i--) {
                toDelete[i].color = undefined;
            }
        }
    }

    removeDead () {
        for (let x = this.params.w - 1; x >= 0; x--) { // slightly faster loop
            const maxY = this.getFreeHeight(x);
            if (maxY + 1 === this.params.h) { // column is empty, skip to next one
                continue;
            }

            const currentCol = this.field[x];
            const newCol = currentCol.filter((cube) => {
                return cube.color !== undefined;
            });

            if (newCol.length !== currentCol.length) { // something changed
                if (currentCol.length < this.params.h) {
                    for (let i = 0; i < this.params.h; i++) {
                        currentCol[i] = {color: undefined};
                    }
                }
            }
        }

        this.printDebug();
    }

    /**
     * Find how much non-empty cells in this column
     * @param {Number} column
     * @returns {Number}
     */
    getFreeHeight (column) {
        let height = 0;
        for (let i = this.params.h - 1; i >= 0; i--) {
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
        const physicalY = this.column.container.position.y + 3 * config.cubeSize;
        const logicalY = Math.floor(physicalY / config.cubeSize);

        return {phys: physicalY, log: logicalY}
    }

    getColumnLogicalX () {
        return Math.round(this.column.container.position.x / config.cubeSize);
    }

    moveDown () {
        if (this.pause) {
            return;
        }
        const current = this.getColumnLowEnd();
        const maxAvail = this.getFreeHeightPhys(this.getColumnLogicalX());
        const next = current.phys + this.currentSpeed;

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

        const logX = this.getColumnLogicalX();

        if (logX === 0) {
            return;
        }

        const current = this.getColumnLowEnd().phys;
        const leftMax = this.getFreeHeightPhys(logX - 1);

        if (current <= leftMax) {
            this.column.container.position.x -= config.cubeSize;
        }
    }

    moveRight () {
        if (this.pause) {
            return;
        }

        const logX = this.getColumnLogicalX();

        if (logX === config.stageSize.w - 1) {
            return;
        }

        const current = this.getColumnLowEnd().phys;
        const rightMax = this.getFreeHeightPhys(logX + 1);

        if (current <= rightMax) {
            this.column.container.position.x += config.cubeSize;
        }
    }

    shuffleColumn () {
        this.column.shuffle();
    }

    dropColumn (x) {
        const items = this.column.colors;
        const start = this.getFreeHeight(x) - 1;

        if (start < 0) {
            alert('game over!');
        }

        for (let i = 0; i < 3; i++) {
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
        const bgTexture = PIXI.Texture.fromImage('img/field.png');
        const bg = new PIXI.Sprite(bgTexture);

        reNullPos(bg, {alpha: 0.2});

        this.container.addChild(bg);
    }

    printDebug () {
        let field = '';
        for (var y = 0; y < this.params.h; y++) {
            let row = [];
            for (let x = 0; x < this.params.w; x++) {
                row.push(this.field[x][y].color ? '*' : '-')
            }
            field += row.join(' ') + '\n';
        }

        $('pre').html(field);

        return field;
    }
}