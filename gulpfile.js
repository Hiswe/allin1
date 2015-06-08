'use strict';

var fs          = require('fs');
var args        = require('yargs').argv;
// gulp related
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var lazypipe    = require('lazypipe');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var merge       = require('merge-stream');
// Browserify dependencies
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
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

//----- JAVASCRIPT

var compress = lazypipe()
  .pipe($.streamify, $.uglify)
  .pipe($.streamify, $.stripDebug);
  // .pipe($.gzip, { append: false });

var sourcemaps = lazypipe()
  .pipe(function () {
    return $.streamify($.sourcemaps.init({loadMaps: true}))
  })
  .pipe(function () {
    return  $.streamify($.sourcemaps.write('.'))
  });

//----- JAVASCRIPT

var libs = [
  'fastclick',
  'dominus',
  'debounce',
  'velocity-animate',
  'imagesloaded',
];
var basedir = __dirname + '/js';

gulp.task('lib', function() {
  var browserifyLib = browserify({
    basedir:  basedir,
    noParse:  libs,
    debug:    true,
  })
  .require(libs)
  .bundle()
  .pipe(source('lib.js'))
  .pipe($.if(args.prod, compress(), sourcemaps()))
  .pipe(gulp.dest(dest[env]));
});

// usefull packages for after

gulp.task('app', function () {
  browserify({
    basedir:  basedir,
    debug:    true,
  })
  .external(libs)
  .require(basedir + '/index.js', {expose: 'allin1'})
  .bundle()
  .on('error', onError)
  .pipe(source('index.js'))
  .pipe($.if(args.prod, compress(), sourcemaps()))
  .pipe(gulp.dest(dest[env]));
});

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

//----- IMAGES

var x2 = lazypipe().pipe($.rename, {suffix: '@2x'});
var x1 = lazypipe().pipe($.rename, function (path){ path.basename = path.basename.replace('@2x', '')});

var getSizes = function (width, height) {
  return {
    x1: {
      width: width,
      height: height,
      crop : true,
    },
    x2: {
      width: width * 2,
      height: height * 2,
      crop : true,
    },
  };
};

gulp.task('home', function() {
  var sizes = getSizes(960, 360);
  return gulp
    .src('img-src/home*.jpg')
    .pipe($.imageResize(sizes.x2))
    .pipe(x2())
    .pipe(gulp.dest(dest.prod))
    .pipe($.imageResize(sizes.x1))
    .pipe(x1())
    .pipe(gulp.dest(dest.prod));
});

gulp.task('rooms', function() {
  var sizes = getSizes(480, 320);
  var small = gulp
    .src(['img-src/room*.jpg', 'img-src/activity-{1,2}.jpg'])
    .pipe($.imageResize(sizes.x1))
  var big   = gulp
    .src(['img-src/room*.jpg', 'img-src/activity-{1,2}.jpg'])
    .pipe($.imageResize(sizes.x2))
    .pipe(x2())

  return merge(small, big)
  .pipe(gulp.dest(dest.prod));
});

gulp.task('activity', function() {
  var sizes = getSizes(480, 320);
  var small = gulp
    .src(['img-src/activity-{3,4}.jpg'])
    .pipe($.imageResize({height: 320}))
  var big   = gulp
    .src(['img-src/activity-{3,4}.jpg'])
    .pipe($.imageResize({height: 320 * 2}))
    .pipe(x2())

  return merge(small, big)
  .pipe(gulp.dest(dest.prod));
});

gulp.task('images', ['home', 'rooms', 'activity']);

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

//----- HTML

// gulp.task('html', ['icons'], function() {
gulp.task('html', function() {

  function getParams(lang) {
    return {
      pretty: false,
      locals: {
        isStatic: true,
        getLocale: function () { return lang; },
        __: function (key) { return dico[lang][key]; }
      },
    };
  }

  var dico = {
    en: JSON.parse(fs.readFileSync(__dirname + '/locales/en.js')),
    fr: JSON.parse(fs.readFileSync(__dirname + '/locales/fr.js')),
  };

  var en =  gulp
    .src('views/_layout.jade')
    .pipe($.jade(getParams('en')))
    .pipe($.rename('index.html'))

  var fr =  gulp
    .src('views/_layout.jade')
    .pipe($.jade(getParams('fr')))
    .pipe($.rename('index-fr.html'))

  merge(en, fr)
    .pipe(gulp.dest(dest['prod']))
});


//----- all together

gulp.task('build', ['app', 'lib', 'css', 'icons']);

////////
// DEV
////////

gulp.task('watch', function() {
  gulp.watch(['./css/**/*.styl'], ['css']);
  gulp.watch(['./js/**/*.js'], ['app']);
  gulp.watch(['./views/icons/*.svg'], ['icons']);
  gulp
    .watch(['./views/**/*.jade', './views/*.svg', './locales/*.js'])
    .on('change', browserSync.reload);
});

// browser-sync + nodemon
// https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e

gulp.task('default', ['browser-sync', 'watch'], function () {});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: 'http://localhost:5000',
    files: ['.tmp/**/*.*', '!.tmp/**/*.map'],
    open: false,
    port: 7000,
  });
});

var init = true;
gulp.task('nodemon', function (cb) {
  return $.nodemon({
    script: 'index.js',
    ext: 'js json',
    ignore: ['node_modules/*', 'gulpfile.js', '.tmp/*', 'js/*', 'public/*', 'locales/*'],
    env:    { 'NODE_ENV': 'development' }
  }).on('start', function () {
    // https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e#comment-1457582
    if (init) {
      init = false;
      cb();
    }
  });
});
