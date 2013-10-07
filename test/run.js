var http = require('http');

//get config based on whether we're in test environment or not
var configFile ='../config.json';		//default

//check for test environment based on command line arguments
var args =process.argv.splice(2);
var argsObj ={};
var obj1, xx;
args.forEach(function (val, index, array) {
	if(val.indexOf('=') >-1) {
		obj1 =val.split('=');
		// console.log('yes'+obj1[0]+" "+obj1[1]);
		argsObj[obj1[0]] =obj1[1];
	}
	// console.log(index + ': ' + val);
});

//see if command line args for (test) config file
if(argsObj.config !==undefined) {
	if(argsObj.config =='test') {
		//insert a '.test' at the end of the config as the test config naming convention
		configFile =configFile.slice(0, configFile.lastIndexOf('.'))+'.test'+configFile.slice(configFile.lastIndexOf('.'), configFile.length);
		// configFile ='./app/test/config.json';
	}
}
console.log('configFile: '+configFile);
var cfg =require(configFile);

var port =cfg.server.port;

// http://nodejs.org/
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(cfg.server.port, '127.0.0.1');