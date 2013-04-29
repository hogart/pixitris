define(
    [
        'lib/Chitin',
        '_'
    ],
    function (Chitin, _) {
        'use strict';

        var Field = Chitin.Abstract.extend({
            defaults: {
                w: 8,
                h: 12
            },

            initialize: function (options) {
                Field.__super__.initialize.call(this, options);

                this.clearField();

                this.field[0][11].color = 'green';
                this.field[1][11].color = 'blue';
                this.field[1][10].color = 'red';

                this.printDebug();
            },

            clearField: function () {
                var field = [];
                for (var x = 0; x < this.params.w; x++) {
                    field[x] = [];
                    for (var y = 0; y < this.params.h; y++) {
                        field[x].push({color: undefined});
                    }
                }

                this.field = field;
            },

            /**
             * Find how much non-empty cells in this column
             * @param {Number} column
             * @returns {Number}
             */
            getColumnHeight: function (column) {
                var height = 0;
                for (var i = this.params.h - 1; i >= 0; i--) {
                    if (!this.field[column][i].color) {
                        height = i + 1;
                        break
                    }
                }

                return height;
            },

            dropColumn: function (column, x) {
                var items = column.colors,
                    start = this.getColumnHeight(x);

                for (var i = start; i > items.count; i--) {
                    this.field[x][i].color = items[i];
                }
            },

            printDebug: function () {
                var field = '',
                    row;
                for (var y = 0; y < this.params.h; y++) {
                    row = [];
                    for (var x = 0; x < this.params.w; x++) {
                        row.push(this.field[x][y].color ? '*' : '-')
                    }
                    field += row.join(' ') + '\n';
                }

                console.log(field)
            }
        });

        return Field;
    }
);