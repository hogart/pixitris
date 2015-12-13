'use strict';

export default function reNullPos (displayObj, options) {
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
}