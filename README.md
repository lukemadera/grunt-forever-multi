# grunt-forever-multi

Credit to @bustardcelly and grunt-forever, which this plugin is forked from / based on. This is just that but as a multi task, with a bug or two fixed, and some added features.
https://github.com/bustardcelly/grunt-forever

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-forever-multi --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-forever-multi');
```


## Forever Multi task

### Usage Examples
```js
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
```

## Development
(see https://npmjs.org/doc/developers.html for notes on publishing npm modules in general)
- run grunt to ensure no issues
- bump version number in package.json
- update CHANGELOG (and potentially this README) file
- git commit changes
- npm publish
- push to github (to update there as well)