'use strict';

var path    = require('path');

var pack    = require('../package.json');
var log     = '[CONF]';
var conf    = {
  version:  pack.version,
  path:     path.join( __dirname, '/../'),
  PORT:     process.env.PORT || 5000,
  ENV:      process.env.NODE_ENV || 'development',
  APP_NAME: 'All in 1 GuestHouse',
};

conf.isProd     = conf.ENV === 'production';

module.exports  = conf;
