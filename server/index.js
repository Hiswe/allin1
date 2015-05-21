var express         = require('express');
var path            = require('path');
// # Resource      = require 'express-resource'
// var configApp     = require('./config-app')
var methodOverride  = require('method-override');
var compression     = require('compression');
var favicon         = require('serve-favicon');
var bodyParser      = require('body-parser');
var errorhandler    = require('errorhandler');
var morgan          = require('morgan');

// log     =
var logger          = require('./logger')('[Boot]');

module.exports = function () {
  // # Create Server
  var app = express();

  // # Load Expressjs config
  logger.prompt('Setup application');
  // configApp(app)

  app.set('views', path.join( __dirname, '/../views'));
  app.set('view engine', 'jade');


  app.use(compression()); // gzip
  // app.use(favicon(path.join(__dirname, '/../public/media/favicon.png')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());


  // // i18n
  // // Attach the i18n property to the express request object
  // // And attach helper methods for use in templates
  // I18n.expressBind(app, {
  //   // setup some locales - other locales default to en silently
  //   locales: ['en', 'fr', 'cn'],
  //   // change the cookie name from 'lang' to 'locale'
  //   cookieName: 'locale'
  // })
  //
  // // This is how you'd set a locale from req.cookies.
  // // Don't forget to set the cookie either on the client or in your Express app.
  // app.use( function (req, res, next) {
  //   req.i18n.setLocaleFromCookie();
  //   return next();
  // });

  // max age a least 1 month
  var maxAge = (app.get('env') === 'production') ? 2629800000 : 0;
  var assets  = path.join(__dirname, '/../public');


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

  app.use(express.static(assets, {maxAge: maxAge}));

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
    res.render('layout', db);
  });

  return app

};
