'use strict';

import {extend, result} from '../node_modules/lodash/index';

export default class Defaultable {
	constructor (options) {
		this.params = extend({}, result(this, 'defaults') || {}, options || {});
	}
}