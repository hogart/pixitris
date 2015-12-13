System.config({
	defaultJSExtensions: true,
	transpiler: 'babel',
	map: {
		'babel': 'node_modules/babel-core/browser',
		'babel/external-helpers': 'node_modules/babel-core/external-helpers',
		'systemjs': 'node_modules/systemjs/dist/system.src.js',
		'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.src.js',
		'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.src.js'
	}
});
