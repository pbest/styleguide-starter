
/* ========================================================================= */
// Add Dependencies
// -------------
var gulp        = require('gulp'),

    // Server and sync
    browserSync = require('browser-sync'),

    // Other plugins
    plumber     = require('gulp-plumber'),
    rimraf      = require('rimraf'),
    es          = require('event-stream'),
    sass        = require('gulp-sass'),
    jade        = require('gulp-jade'),
    marked      = require('marked'), // For :markdown filter in jade
    sourcemaps  = require('gulp-sourcemaps'),
    minifyCss   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    fs          = require('fs.extra');




/* ========================================================================= */
// Serve Web Files
// -------------

// Server initiation and livereload, opens server in browser
gulp.task('serve', function() {
  browserSync.init(null, {
    server: {
      baseDir: './build',
      index: 'index.html'
    },
    open: "external",
    logPrefix: "Gulp Style Guide Generator"
    });
});


/* ========================================================================= */
// Watch Assets for changes
// -------------
var assetConfig = {
  path: ['build/brand-files/**/*','build/brand-files/*'],
  watch: ['build/brand-files/**/*','build/brand-files/*']
};

gulp.task('watch-assets', function(){
 return gulp.src(assetConfig.path)
      .pipe(plumber())
      .pipe(browserSync.reload({
        stream: true,
        once: true
  }));
});



/* ========================================================================= */
// Style
// -------------

//
// Config
//
var styleConfig = {
  paths: {
    src: './build/app/scss/main.scss',
    dest: './build/app/css/'
  },
  watch: ['./build/app/scss/**/*.scss']
};

//
// SASS compiling & reloading
//
gulp.task('sass', function() {
    gulp.src(styleConfig.paths.src)
      .pipe(plumber())
      .pipe(sass({
        errLogToConsole: true
      }))
      .pipe(gulp.dest(styleConfig.paths.dest))
      .pipe(gulp.dest(styleConfig.paths.dest))
      .pipe(browserSync.reload({
        stream: true
      }));
});

//
// Minify sass
//
gulp.task('optimizeCSS', ['sass'], function() {
  return gulp.src(styleConfig.paths.src)
    .pipe(plumber())
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./dist/app/css'));
});




//
// Config
//
var jadeConfig = {
  paths: {
    src: './build/index.jade',
    dest: './build/'
  },
  watch: ['./build/index.jade', './build/guidelines/*.jade', './build/app/jade/*.jade']
};

//
// Compile Our HTML
//
gulp.task('jade', function() {
  gulp.src(jadeConfig.paths.src)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(jadeConfig.paths.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});



/* ========================================================================= */
// JADE - Email Signature
// -------------

//
// Config
//
var emailSigConfig = {
  paths: {
    src: './build/app/jade/email-signature.jade',
    dest: './build/brand-files/email-signature/'
  },
  watch: ['./build/brand-files/email-signature/variables.jade','./build/app/jade/email-signature.jade']
};

//
// Compile Email Signature
//
gulp.task('create-email-signature', function() {
  gulp.src(emailSigConfig.paths.src)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(emailSigConfig.paths.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});



/* ========================================================================= */
// Scripts
// -------------

//
// Config
//
var scriptConfig = {
  paths: {
    src: '*.scss',
    dest: '*.js'
  },
  watch: ['./build/app/js/**/*.js']
};

//
// Uglify js
//
gulp.task('scripts', function() {
    return gulp.src(scriptConfig.paths.src)
        .pipe(plumber())
        .pipe(gulp.dest(scriptConfig.paths.src))
        .pipe(browserSync.reload({
          stream: true,
          once: true
        }));
});

gulp.task('optimizeJS', ['scripts'], function() {
    return gulp.src(scriptConfig.paths.src)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(scriptConfig.paths.src))
});


/* ========================================================================= */
// Package for Distribution
// -------------

//
// Build functionality with cleaning, moving, compiling, etc.
//
gulp.task('build', ['remove'], function(){
  return gulp.start(
    'optimizeCSS',
    'optimizeJS',
    'move-files'
  );
});

//
// Remove 'dist' directory, then minifying, copying, processing, uglifying, etc for build
//
gulp.task('remove', function (cb) {
    rimraf('./dist/', cb);
});

//
// Move Files into dist
//
gulp.task('move-files', function(cb){
   fs.copyRecursive('./build', './dist', function (err) {
    if (err) {
      throw err;
    }
    });
 });



/* ========================================================================= */
// Default Task
// -------------

//
// Default functionality includes server with browser sync and watching
//
gulp.task('default', ['create-email-signature','sass', 'scripts', 'jade', 'serve'], function(){
  gulp.watch(jadeConfig.watch, ['jade']);
  gulp.watch(styleConfig.watch, ['sass']);
  gulp.watch(scriptConfig.watch, ['scripts']);
  gulp.watch(emailSigConfig.watch, ['create-email-signature']);
  gulp.watch(assetConfig.watch, ['watch-assets']);
});

