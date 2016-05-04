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

    isCoordsValid (x, y) {
        return (x >= 0) && (x < this.params.w) && (y >= 0) && (y < this.params.h)
    }

    compareCells (x, y, [dx, dy]) {
        if (this.isCoordsValid(x + dx, y + dy)) {
            return this.field[x][y].color === this.field[x + dx][y + dy].color;
        } else {
            return false;
        }
    }

    shouldDie (x, y) {
        const field = this.field;

        if (!field[x][y].color) {
            return
        }

        const deleteOffsets = [];

        var offsets = {
            right: [1, 0],
            right2: [2, 0],
            right3: [3, 0],

            left: [-1, 0],
            left2: [-2, 0],
            left3: [-3, 0],

            down: [0, 1],
            down2: [0, 2],
            down3: [0, 3],

            up: [0, -1],
            up2: [0, -2],
            up3: [0, -3],

            downRight: [1, 1],
            downRight2: [2, 2],
            downRight3: [3, 3],

            downLeft: [-1, 1],
            downLeft2: [-2, 2],
            downLeft3: [-3, 3],

            upRight: [1, -1],
            upRight2: [2, -2],
            upRight3: [3, -3],

            upLeft: [-1, -1],
            upLeft2: [-2, -2],
            upLeft3: [-3, -3]
        };

        const check = this.compareCells.bind(this, x, y);

        // horizontal check - right
        if (check(offsets.right)) {
            if (check(offsets.right2)) {
                deleteOffsets.push([0, 0], offsets.right, offsets.right2);

                if (check(offsets.right3)) {
                    deleteOffsets.push(offsets.right3)
                }

                if (check(offsets.left)) {
                    deleteOffsets.push(offsets.left)
                }

                if (check(offsets.left2)) {
                    deleteOffsets.push(offsets.left2)
                }
            }

            if (check(offsets.left)) {
                deleteOffsets.push(offsets.left);

                if (check(offsets.left2)) {
                    deleteOffsets.push(offsets.left2);

                    if (check(offsets.left3)) {
                        deleteOffsets.push(offsets.left3)
                    }

                    if (check(offsets.right)) {
                        deleteOffsets.push(offsets.right)
                    }

                    if (check(offsets.right2)) {
                        deleteOffsets.push(offsets.right2)
                    }
                }
            }
        }

        // horizontal check - left
        if (check(offsets.left)) {
            if (check(offsets.left2)) {
                deleteOffsets.push([0, 0], offsets.left, offsets.left2);

                if (check(offsets.left3)) {
                    deleteOffsets.push(offsets.left3)
                }

                if (check(offsets.right)) {
                    deleteOffsets.push(offsets.right)
                }

                if (check(offsets.right2)) {
                    deleteOffsets.push(offsets.right2)
                }
            }

            if (check(offsets.right)) {
                deleteOffsets.push(offsets.right);

                if (check(offsets.right2)) {
                    deleteOffsets.push(offsets.right2);

                    if (check(offsets.right3)) {
                        deleteOffsets.push(offsets.right3)
                    }

                    if (check(offsets.left)) {
                        deleteOffsets.push(offsets.left)
                    }

                    if (check(offsets.left2)) {
                        deleteOffsets.push(offsets.left2)
                    }
                }
            }
        }

        // vertical check - down
        if (check(offsets.down)) {
            if (check(offsets.down2)) {
                deleteOffsets.push([0, 0], offsets.down, offsets.down2);

                if (check(offsets.down3)) {
                    deleteOffsets.push(offsets.down3)
                }

                if (check(offsets.up)) {
                    deleteOffsets.push(offsets.up)
                }

                if (check(offsets.up2)) {
                    deleteOffsets.push(offsets.up2)
                }
            }

            if (check(offsets.up)) {
                deleteOffsets.push(offsets.up);

                if (check(offsets.up2)) {
                    deleteOffsets.push(offsets.left2);

                    if (check(offsets.left3)) {
                        deleteOffsets.push(offsets.left3)
                    }

                    if (check(offsets.down)) {
                        deleteOffsets.push(offsets.right)
                    }

                    if (check(offsets.right2)) {
                        deleteOffsets.push(offsets.right2)
                    }
                }
            }
        }

        // horizontal check - up
        if (check(offsets.up)) {
            if (check(offsets.up2)) {
                deleteOffsets.push([0, 0], offsets.up, offsets.up2);

                if (check(offsets.up3)) {
                    deleteOffsets.push(offsets.up3)
                }

                if (check(offsets.down)) {
                    deleteOffsets.push(offsets.down)
                }

                if (check(offsets.down2)) {
                    deleteOffsets.push(offsets.down2)
                }
            }

            if (check(offsets.down)) {
                deleteOffsets.push(offsets.down);

                if (check(offsets.down2)) {
                    deleteOffsets.push(offsets.down2);

                    if (check(offsets.down3)) {
                        deleteOffsets.push(offsets.down3)
                    }

                    if (check(offsets.up)) {
                        deleteOffsets.push(offsets.up)
                    }

                    if (check(offsets.up2)) {
                        deleteOffsets.push(offsets.up2)
                    }
                }
            }
        }

        // diagonal check - downRight
        if (check(offsets.downRight)) {
            if (check(offsets.downRight2)) {
                deleteOffsets.push([0, 0], offsets.downRight, offsets.downRight2);

                if (check(offsets.downRight3)) {
                    deleteOffsets.push(offsets.downRight3)
                }

                if (check(offsets.upLeft)) {
                    deleteOffsets.push(offsets.upLeft)
                }

                if (check(offsets.upLeft2)) {
                    deleteOffsets.push(offsets.upLeft2)
                }
            }

            if (check(offsets.upLeft)) {
                deleteOffsets.push(offsets.upLeft);

                if (check(offsets.upLeft2)) {
                    deleteOffsets.push(offsets.upLeft2);

                    if (check(offsets.upLeft3)) {
                        deleteOffsets.push(offsets.upLeft3)
                    }

                    if (check(offsets.downRight)) {
                        deleteOffsets.push(offsets.downRight)
                    }

                    if (check(offsets.downRight2)) {
                        deleteOffsets.push(offsets.downRight2)
                    }
                }
            }
        }

        // horizontal check - upLeft \
        if (check(offsets.upLeft)) {
            if (check(offsets.upLeft2)) {
                deleteOffsets.push([0, 0], offsets.upLeft, offsets.upLeft2);

                if (check(offsets.upLeft3)) {
                    deleteOffsets.push(offsets.upLeft3)
                }

                if (check(offsets.downRight)) {
                    deleteOffsets.push(offsets.downRight)
                }

                if (check(offsets.downRight2)) {
                    deleteOffsets.push(offsets.downRight2)
                }
            }

            if (check(offsets.downRight)) {
                deleteOffsets.push(offsets.downRight);

                if (check(offsets.downRight2)) {
                    deleteOffsets.push(offsets.downRight2);

                    if (check(offsets.downRight3)) {
                        deleteOffsets.push(offsets.downRight3)
                    }

                    if (check(offsets.upLeft)) {
                        deleteOffsets.push(offsets.upLeft)
                    }

                    if (check(offsets.upLeft2)) {
                        deleteOffsets.push(offsets.upLeft2)
                    }
                }
            }
        }
        
        if (deleteOffsets.length) {
            this.clearRender = true;

            this.addScores(deleteOffsets.length);

            for (let offset of deleteOffsets) {
                field[x + offset[0]][y + offset[1]].color = undefined;
            }
        }
    }

    addScores (gemsAmount) {
        console.log(100 + 70 * (gemsAmount - 3));
    }

    removeDead () {
        for (let x = this.params.w - 1; x >= 0; x--) { // slightly faster loop
            const maxY = this.getFreeHeight(x);
            if (maxY + 1 === this.params.h) { // column is empty, skip to next one
                continue;
            }

            const currentCol = this.field[x];
            const hasHoles = this.hasHoles(x);

            if (hasHoles) {
                const newCol = [];

                for (let cube of currentCol) {
                    if (cube.color) {
                        newCol.push(cube);
                    } else {
                        newCol.unshift(cube);
                    }
                }

                this.field[x] = newCol;
            }
        }
    }

    /**
     * Find how much empty cells in this column
     * @param {Number} columnNumber
     * @returns {Number}
     */
    getFreeHeight (columnNumber) {
        let height = this.params.h;
        let column = this.field[columnNumber];

        for (let i = 0; i < this.params.h; i++) {
            if (column[i].color !== undefined) {
                height = i;
                break;
            }
        }

        return height;
    }

	/**
	 * Does this column has holes
     * @param {Number} columnNumber
     */
    hasHoles (columnNumber) {
        let hasFilled = false;
        let hasHoles = false;
        const column = this.field[columnNumber];
        for (let i = 0; i < this.params.h; i++) {
            if (column[i].color !== undefined) {
                hasFilled = true;
            } else if (hasFilled) {
                hasHoles = true;
                break;
            }
        }

        return hasHoles;
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
        if (this.pause) {
            return;
        }

        this.column.shuffle();
    }

    dropColumn (x) {
        const items = this.column.colors;
        const start = this.getFreeHeight(x) - 1;

        if (start < 0) {
            this.pause = true;
            this.gameOver = true;
            return;
        }

        for (let i = 0; i < 3; i++) {
            this.field[x][start - i].color = items[2 - i];
            this.shouldDie(x, start - i);
        }

        this.removeDead();
        this.render();

        this.removeColumn();
    }

    speedUp () {
        if (this.pause) {
            return;
        }

        this.currentSpeed = 10;
    }

    speedDown () {
        if (this.pause) {
            return;
        }

        this.currentSpeed = 1;
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
        const bg = new PIXI.Sprite.fromImage('img/field.png');
        bg.blendMode = PIXI.BLEND_MODES.ADD;

        reNullPos(bg);

        this.container.addChild(bg);
    }

    printDebug () {
        let field = '';
        for (var y = 0; y < this.params.h; y++) {
            let row = [];
            for (let x = 0; x < this.params.w; x++) {
                row.push(this.field[x][y].color ? '■' : '·')
            }
            field += row.join(' ') + '\n';
        }

        $('pre').html(field);

        return field;
    }
}