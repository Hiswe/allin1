'use strict';

var fs          = require('fs');
var args        = require('yargs').argv;
// gulp related
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var lazypipe    = require('lazypipe');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
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

//----- STYLUS TO CSS

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
});

//----- ICONS

gulp.task('icons', function() {
  return gulp
    .src('views/icons/*.svg')
    .pipe($.svgSymbols({
      templates: ['default-svg'],
      id:     'icon-%f',
      title:  false,
    }))
    .pipe(gulp.dest('./views'))
});

//----- all together

gulp.task('build', ['css', 'icons']);

////////
// DEV
////////

gulp.task('watch', function() {
  // $.livereload.listen();
  gulp.watch(['./css/**/*.styl'], ['css']);
  gulp.watch(['./views/icons/*.svg'], ['icons']);
  gulp
    .watch(['./views/**/*.jade', './views/*.svg'])
    .on('change', browserSync.reload);
});

// browser-sync + nodemon
// https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e

gulp.task('default', ['browser-sync', 'watch'], function () {});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: 'http://localhost:5000',
    files: ['.tmp/**/*.*', 'public/**/*.*', '!.tmp/**/*.map'],
    open: false,
    port: 7000,
  });
});

var init = true;
gulp.task('nodemon', function (cb) {
  return $.nodemon({
    script: 'index.js',
    ext: 'js json',
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
