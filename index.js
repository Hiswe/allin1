'use strict';

var http    = require('http');
var chalk   = require('chalk');

var pack    = require('./package.json');

// var conf    = require('./server/settings.coffee')
// console.log(conf)

//  Load boot file and fire away!
var app     = require('./server')();
// // var port    = conf.PORT;
var port    = 3000;

var server  = http.createServer(app)

if (!port) {
  throw 'no port defined for the application'
}

server.listen(port);

// console.log(chalk.blue('[APP]'), 'Express server', conf.version, 'listening on port', port, 'on', conf.ENV, 'mode');

return false;
