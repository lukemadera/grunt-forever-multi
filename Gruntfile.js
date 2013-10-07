/**
Lint files
*/

//get configs
//regular config
var configFile ='./config.json';
var cfgJson =require(configFile);
//test config
var configTestFile ='./config.test.json';
var cfgTestJson =require(configTestFile);

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		cfgJson: cfgJson,
		cfgTestJson: cfgTestJson,
			
		jshint: {
			options:{
				force: true
				//globalstrict: true
				//sub:true,
			},
			all: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js']
		},
		foreverMulti: {
			appServer: {
				action: 'restart',
				file: 'test/run.js',
				options: ["-m '"+cfgJson.app.name+" port "+cfgJson.server.port+"'"]
			},
			testServer: {
				// action: 'restart',		//default is restart if none specified
				file: 'test/run.js',
				options: ["config=test", "-m '"+cfgTestJson.app.name+" port "+cfgTestJson.server.port+"'"]
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.loadTasks('tasks');		//load our forever-multi plugin

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'foreverMulti']);
};