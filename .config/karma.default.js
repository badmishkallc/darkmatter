module.exports = function(config) {
   /* global __dirname */
   
    var root = __dirname + "/../";
    var npm = __dirname + "/../node_modules/";
	config.set({
		basePath: root,
		frameworks: ['systemjs',"mocha", "chai"],
		browsers: ["PhantomJS"],
		reportSlowerThan: 30,
		autoWatch: true,
		reporters: ["progress", "junit"],
		runnerPort: 9100,
		plugins: [
			npm + 'karma-phantomjs-launcher',
			npm + 'karma-chrome-launcher',
			//'karma-edge-launcher',
			npm + 'karma-firefox-launcher',
			npm + 'karma-junit-reporter',
			npm + 'karma-mocha',
			npm + 'karma-chai',
			npm + 'karma-systemjs',
			npm + 'karma-html2js-preprocessor',
            npm + 'karma-babel-preprocessor'
		],
		captureTimeout: 5000,
		client: {
			mocha: {
				ui: "tdd"
			}
		},
        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                sourceMap: 'inline'
            }
        },
		files: [
			"test/**/*.html",
            "src/**/*.js",
            "test/**/*.js"
		],
		"preprocessors": {
			"**/*.html": ["html2js"],
            "src/**/*.js": ['babel'],
            "test/**/*.js": ['babel']
		},
		systemjs: {
			configFile: ".config/system.default.js",
			config: {
				transpiler: 'none',
				baseURL: "",
				paths: {
                    "phantomjs-polyfill": "node_modules/phantomjs-polyfill/bind-polyfill.js",
					"system-polyfills": "node_modules/systemjs/dist/system-polyfills.js",
					"es6-module-loader": "node_modules/es6-module-loader/dist/es6-module-loader.src.js",
					"systemjs": "node_modules/systemjs/dist/system.src.js",
                    "babel": "node_modules/babel-standalone/babel.js"
				}
			},
            
        
			files: [
               'node_modules/phantomjs-polyfill/bind-polyfill.js'
			],
			testFileSuffix: "-tests.js"
		}
	});
};