'use strict';

var chalk   = require('chalk');
var prompt  = chalk.blue;
var error   = chalk.red;
var log     = chalk.gray;
var warn    = chalk.yellow;
var success = chalk.green;

var getArguments = function (args) {
  var __slice = [].slice;
  return 1 <= args.length ? __slice.call(args, 0) : []
}

var loggerFactory  = function loggerFactory(id) {
  var logger = function logger() {
    var args = getArguments(arguments);
    args.unshift(log(id));
    return console.log.apply(this, args);
  };
  logger.prompt  = function () {
    var args = getArguments(arguments);
    args.unshift(prompt(id));
    return console.log.apply(this, args);
  };
  logger.error   = function () {
    var args = getArguments(arguments);
    args.unshift(error(id));
    return console.log.apply(this, args);
  };
  logger.warn    = function () {
    var args = getArguments(arguments);
    args.unshift(warn(id));
    return console.log.apply(this, args);
  };
  logger.success = function () {
    var args = getArguments(arguments);
    args.unshift(success(id));
    return console.log.apply(this, args);
  };
  return logger;
};

loggerFactory.prompt  = prompt;
loggerFactory.error   = error;
loggerFactory.log     = log;
loggerFactory.warn    = warn;
loggerFactory.success = success;

module.exports        = loggerFactory;
