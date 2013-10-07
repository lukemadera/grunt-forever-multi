/**

@toc
0. setup
	0.1. warn
	0.2. error
	0.3. log
1. init
	1.1. finish
2. list
3. start
4. stop
5. restart
*/

var forever =require('forever');

var done;		//for async handling
var self;

module.exports = function(grunt) {
	grunt.registerMultiTask("foreverMulti", "Run and manage one or more forever scripts/commands", function() {
		/**
		Setup - Pull in grunt config for this task/target and extend from defaults.
		@toc 0.
		*/
		
		self =this;
		
		// grunt.log.writeln(this.target + ': ' + this.data);
		var defaults ={
			action: 'restart',
			options: []
		};
		var xx;
		for(xx in defaults) {
			if(this.data[xx] ===undefined) {
				this.data[xx] =defaults[xx];
			}
		}
		//allow overriding action with command line args/options
		if(grunt.option('action')) {
			this.data.action =grunt.option('action');
		}
		// grunt.log.writeln(JSON.stringify(this.data));
		
		/**
		@toc 0.1.
		@method warn
		*/
		function warn(message) {
			grunt.warn( message );
		}
		
		/**
		@toc 0.2.
		@method error
		*/
		function error(message) {
			grunt.log.error( message ).error();
		}
		
		/**
		@toc 0.3.
		@method log
		*/
		function log(message) {
			grunt.log.writeln( message );
		}
		
		/**
		@toc 1.
		@method init
		*/
		function init(conf, params) {
			var actionMap ={
				start: start,
				restart: restart,
				stop: stop
			};
			var xx;
			try {
				if(actionMap.hasOwnProperty(conf.action)) {
					actionMap[conf.action].call(self, conf, params);
				}
				else {
					var validActions ='';
					for(xx in actionMap) {
						validActions +=xx+' ';
					}
					warn('Action ' + action + ' is not supported currently. Please choose one of: '+validActions+'.');
				}
			}
			catch(err) {
				error('Exception thrown in attempt to ' + action + ' on ' + conf.file + ': ' + err);
			}
		}
		
		/**
		@toc 1.1.
		@method finish
		*/
		function finish(conf, params) {
			grunt.log.writeln('foreverMulti:'+self.target+' done');
		}
		
		/**
		@toc 2.
		@method list
		*/
		function list(conf, params, callback) {
			var ii, jj, kk, process, uid =false, found =false;
			try {
				forever.list(false, function(context, list) {
					ii = list ? list.length : 0;
					while( --ii > -1 ) {
						process = list[ii];
						if(process.hasOwnProperty('file') && process.file === conf.file ) {
							if(conf.options !==undefined) {
								if(process.hasOwnProperty('options')) {
									for(jj =0; jj<process.options.length; jj++) {
										for(kk =0; kk<conf.options.length; kk++) {
											// log(process.options[jj]+' | '+conf.options[kk]);
											if(process.options[jj].indexOf(conf.options[kk]) >-1) {
												if(process.hasOwnProperty('uid')) {
													uid =process.uid;
												}
												found =true;
												log('match! '+process.options[jj]+' | '+conf.options[kk]);
												break;
											}
										}
										if(found) {
											break;
										}
									}
								}
								if(found) {
									break;
								}
							}
							else {	//if no options to check, match on file is good enough
								if(process.hasOwnProperty('uid')) {
									uid =process.uid;
								}
								break;
							}
						}
						
						process = undefined;
					}

					callback.call(null, process, uid);
				});
			}
			catch( e ) {
				error( 'Error in trying to find process ' + conf.file + ' in forever. [REASON] :: ' + e.message );
				callback.call(null, undefined, uid);
			}
		}
		
		/**
		@toc 3.
		@method start
		*/
		function start(conf, params, callback) {
			grunt.log.writeln( 'Attempting to start ' + conf.file + ' as daemon.');
			
			done = self.async();
			list(conf, params, function(process, uid) {
				// if found, be on our way without failing.
				if(typeof process !== 'undefined') {
					log( conf.file + ' is already running.');		//not necessarily an error so don't want to abort
					log( forever.format(true, [process]) );
					if(callback) {
						callback({});
					}
					else {
						done();
					}
				}
				else {
					forever.startDaemon( conf.file, {
						append: true,
						max: 3,
						options: conf.options
					})
					.on('start', function() {
						if(callback) {
							callback({});
						}
						else {
							done();
						}
					})
					.on('error', function(message) {
						error( 'Error starting ' + conf.file + '. [REASON] :: ' + message );
						if(callback) {
							callback(false);
						}
						else {
							done(false);
						}
					})
					;
				}
			});
		}
		
		/**
		@toc 4.
		@method stop
		*/
		function stop(conf, params, callback) {
			log( 'Attempting to stop ' + conf.file + '...' );
			
			done = self.async();
			list(conf, params, function(process, uid) {
				if( typeof process !== 'undefined' && uid ) {
					log( forever.format(true,[process]) );

					forever.stop( uid )		//more specific
					.on('stop', function() {
						if(callback) {
							callback({});
						}
						else {
							done();
						}
					})
					.on('error', function(message) {
						error( 'Error stopping uid: ' + uid + 'file: ' + conf.file + '. [REASON] :: ' + message );
						if(callback) {
							callback(false);
						}
						else {
							done(false);
						}
					});
				}
				else {
					if(typeof process !== 'undefined') {
						log( forever.format(true, [process]) );
					}
					else {
						log('forever process undefined');
					}
					warn( conf.file + ' not found in list of processes in forever.' );
					if(callback) {
						callback({});
					}
					else {
						done();
					}
				}
			});
		}
		
		/**
		@toc 5.
		@method restart
		*/
		function restart(conf, params, callback) {
			log( 'Attempting to restart ' + conf.file + '...' );
			
			done = self.async();
			list(conf, params, function(process, uid) {
				if(typeof process !== 'undefined' && uid) {
					log(forever.format(true,[process]));
					forever.restart(uid)		//more specific
					.on('error', function(message) {
						error('Error restarting uid: '+uid+' file: ' + conf.file + '. [REASON] :: ' + message);
						if(callback) {
							callback(false);
						}
						else {
							done(false);
						}
					})
					.on('restart', function() {
						if(callback) {
							callback({});
						}
						else {
							done();
						}
					})
					;
				}
				else {
					if(typeof process !== 'undefined') {
						log( forever.format(true, [process]) );
					}
					else {
						log('forever process undefined');
					}
					log(conf.file + ' not found in list of processes in forever. Starting new instance...');
					start(conf, params, function(ret) {
						if(callback) {
							callback({});
						}
						else {
							done();
						}
					});
				}
			});
		}

		init(this.data, {});		//start everything
	});
};