'use strict';

var fs          = require('fs');
var args        = require('yargs').argv;
// gulp related
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var lazypipe    = require('lazypipe');
var browserSync = require('browser-sync');
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




////////
// DEV
////////

gulp.task('watch', function() {
  // $.livereload.listen();
  gulp.watch(['./css/**/*.styl'], ['css']);
  // gulp.watch(['./assets/js/**/*.coffee', './assets/js/**/*.js'], ['js']);
  // gulp.watch('./views/**/*.jade')
  // .on('change', function() {
  //   // $.notify(msg('reload html'));
  //   // $.livereload.changed('index.html');
  // });
});

// browser-sync + nodemon
// https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e

gulp.task('default', ['browser-sync', 'watch'], function () {});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: 'http://localhost:5000',
    files: ['.tmp/**/*.*', 'public/**/*.*'],
    open: false,
    port: 7000,
  });
});

var init = true;
gulp.task('nodemon', function (cb) {
  return $.nodemon({
    script: 'index.js',
    ext: 'js jade json',
    ignore: ['node_modules/*', 'gulpfile.js'],
    env:    { 'NODE_ENV': 'development' }
  }).on('start', function () {
    // https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e#comment-1457582
    if (init) {
      init = false;
      cb();
    }
  });
});
