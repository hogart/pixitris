define(
    [
        '_'
    ],

    function (_) {
    'use strict';

    var util = {};

    var getRandomFloat = util.getRandomFloat = function (min, max) {
      return Math.random() * (max - min) + min;
    };

    var getRandomInt = util.getRandomInt = function (min, max) {
        return Math.round(getRandomFloat(min, max));
    };

    var getRandomItem = util.getRandomItem = function (arr) {
        var index = getRandomInt(0, arr.length - 1);
        return arr[index];
    };

    util.renullPos = function (displayObj, options) {
        options || (options = {});

        displayObj.position.x = options.x || 0;
        displayObj.position.y = options.y || 0;

        if (displayObj.anchor) {
            displayObj.anchor.x = options.anchorX || 0;
            displayObj.anchor.y = options.anchorY || 0;
        }

        if ('alpha' in displayObj && 'alpha' in options) {
            displayObj.alpha = options.alpha;
        }
    };

    return util;
});