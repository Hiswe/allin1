var express         = require('express');
var path            = require('path');
// Resource      = require 'express-resource'
var I18n            = require('i18n-2');
var methodOverride  = require('method-override');
var compression     = require('compression');
var favicon         = require('serve-favicon');
var bodyParser      = require('body-parser');
var errorhandler    = require('errorhandler');
var morgan          = require('morgan');

var conf            = require('./config');
var logger          = require('./logger')('[Boot]');

module.exports = function () {
  // Create Server
  var app = express();

  logger.prompt('Setup application');
  // set some variables
  app.set('appName', conf.APP_NAME);
  app.locals.appName  = conf.APP_NAME;
  app.locals.env      = conf.ENV;
  app.locals.blank    = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjREQUMzRUQxNzA2NDExRTE5MEFFOTdBMTMwMDkyNjcwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjREQUMzRUQyNzA2NDExRTE5MEFFOTdBMTMwMDkyNjcwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NERBQzNFQ0Y3MDY0MTFFMTkwQUU5N0ExMzAwOTI2NzAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NERBQzNFRDA3MDY0MTFFMTkwQUU5N0ExMzAwOTI2NzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAAAACwAAAAAAQABAAACAkQBADs=";
  // views
  app.set('views', path.join( __dirname, '/../views'));
  app.set('view engine', 'jade');

  // gzip
  app.use(compression());
  app.use(favicon(path.join(__dirname, '/../public/favicon.png')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // i18n
  // Attach the i18n property to the express request object
  // And attach helper methods for use in templates
  I18n.expressBind(app, {
    // setup some locales - other locales default to en silently
    // locales: ['en', 'fr', 'cn'],
    locales: ['en', 'fr'],
    // locales: ['fr'],
    // change the cookie name from 'lang' to 'locale'
    cookieName: 'locale'
  })

  // This is how you'd set a locale from req.cookies.
  // Don't forget to set the cookie either on the client or in your Express app.
  app.use( function (req, res, next) {
    req.i18n.setLocaleFromCookie();
    return next();
  });

  // // Slow assets on dev
  // if (app.get('env') === 'development') {
  //   app.use(function (req, res, next) {
  //     if (/\.(jpg||jpeg||png||svg)$/i.test(req.url)) {
  //       setTimeout(next, 250 + Math.round(1000 * Math.random()));
  //     } else {
  //       next();
  //     }
  //   });
  // }

  // max age a least 1 month
  var maxAge  = conf.isProd ? 2629800000 : 0;
  // look dev file in dev mode
  if (!conf.isProd) {
    app.use(express.static(path.join(__dirname, '/../.tmp'), {maxAge: 0}));
  }
  app.use(express.static(path.join(__dirname, '/../public'), {maxAge: maxAge}));

  // logs
  if (app.get('env') === 'production') {
    app.use(errorhandler());
  } else {
    app.use(errorhandler({ dumpExceptions: true, showStack: true }));
    app.use(morgan('tiny'));
  }

  // Load routes config
  logger.prompt('Setup routing');
  app.get('/', function (req, res, next) {
    db = {};
    // db.assets = assets
    res.render('_layout', db);
  });

  return app

};
