 /* global __dirname */
var gulp = require("gulp"),
    Karma = require('karma').Server;
 
 
 gulp.task('karma', function (done) {
 var once = false;
	new Karma({
		configFile: __dirname + "/.config/karma.default.js",
		basePath: __dirname,
		action: 'run',
		singleRun: true
	}, function() {
		if(!once) {
			done();
			once = true;
		}
	}).start();
});