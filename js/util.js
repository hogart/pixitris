define(function () {
    'use strict';

    function getRandomFloat (min, max) {
      return Math.random() * (max - min) + min;
    }

    function getRandomInt(min, max) {
        return Math.round(getRandomFloat(min, max));
    }

    function getRandomItem (arr) {
        var index = getRandomInt(0, arr.length - 1);
        return arr[index];
    }

    return {
        getRandomFloat: getRandomFloat,
        getRandomInt: getRandomInt,
        getRandomItem: getRandomItem
    }
});