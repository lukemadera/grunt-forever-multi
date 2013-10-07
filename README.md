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
Gruntfile.js
```js
	foreverMulti: {
		basic: {
			file: 'test/run.js'
		},
		appServer: {
			action: 'restart',
			file: 'test/run.js',
			options: ["-m '"+cfgJson.app.name+" port "+cfgJson.server.port+"'"]
		},
		testServer: {
			// action: 'restart',		//default is restart if no action specified
			file: 'test/run.js',
			options: ["config=test", "-m '"+cfgTestJson.app.name+" port "+cfgTestJson.server.port+"'"]
		}
	}
```
Command Line
- command line arguments (grunt.option)
	- `action` to override the action (i.e. `--action=start` will run the forever start action even if the task config is set to `restart` or `stop` action)

```js
# run all tasks in this multiTask with their defaults / standard config
grunt foreverMulti
# force a forever restart irregardless of what the config action is
grunt foreverMulti --action=restart
# run just one of the tasks
grunt foreverMulti:appServer
```

### Options
The options / keys for each task mimic forever-monitor/forever: https://github.com/nodejitsu/forever-monitor including `file` and `action` keys. The only supported options currently are:
- `file` The file/script to run (i.e. `index.js` or `server.js`)
- `action` What to run forever with - see: https://npmjs.org/package/forever. Only `start`, `restart`, `stop` are supported currently.
- `options` Command line arguments to pass to forever

Other options including, but not limited to, `silent`, `uid`, `max`, `command`, `sourceDir`, `watch`, `logFile`, `outFile`, `errFile` are NOT currently supported.

## Why? (Use Cases)
- For Continuous Integration - to restart your server(s) after a git push/webhook to get the file changes.
	- i.e.: Use grunt to: 1. build new files/assets with the new code, 2. restart forever to update the running server/processes with the new code, 3. wait/timeout (sometimes necessary to allow the server time to fully restart), 4. run automated tests on the new code

## Development
See https://npmjs.org/doc/developers.html for notes on publishing npm modules in general.
- run `grunt` to ensure no issues
- bump version number in `package.json`
- update `CHANGELOG.md` (and potentially this `README.md`) file
- `git commit` changes
- `npm publish`
- push to github (to update there as well)

## TODO
- async / forever issues intermittently.. sometimes `forever.startDaemon` is called but grunt finishes WITHOUT `done()` being called (from `this.async()`) - this causes the script to exit - sometimes before the forever process is started and it stops future execution of any other tasks in the multi-task.. I'm not sure what's going on here or how to fix..
- add support for more (all?) forever options - i.e. `uid`, `command`, `watch`