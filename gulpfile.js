'use strict';

var fs          = require('fs');
var args        = require('yargs').argv;
// gulp related
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var lazypipe    = require('lazypipe');
// “Global” variables
var env         = args.prod ? 'prod' : 'dev';
var dest        = {
  prod: 'public',
  dev:  '.tmp',
};

////////
// MISC
////////

function onError(err) {
  $.util.beep();
  if (err.annotated) {
    return $.util.log(err.annotated);
  }
  if (err.message) {
    return $.util.log(err.message);
  }
  return $.util.log(err);
};

function msg(message) {
  return {
    title: 'MDT',
    message: message,
    onLast: true
  };
};

////////
// BUILD
////////

// stylus to css
var cssProd = lazypipe()
  .pipe($.stylus, { compress: true})
  .pipe($.autoprefixer);

var cssDev = lazypipe()
  .pipe($.sourcemaps.init)
    .pipe($.stylus, { compress: false})
    .pipe($.autoprefixer)
  .pipe($.sourcemaps.write, '.');

gulp.task('css', function() {
  return gulp
    .src('css/index.styl')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.if(args.prod, cssProd(), cssDev()))
    .pipe(gulp.dest(dest[env]))
    .pipe($.filter(['*', '!*.map']))
    // .pipe(reload({stream:true}));
});
