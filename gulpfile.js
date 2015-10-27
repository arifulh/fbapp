var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    uglify     = require('gulp-uglify'),
    jshint     = require('gulp-jshint'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    copy     = require('gulp-copy'),
    sourcemaps = require('gulp-sourcemaps'),
    del        = require('del');
    clean      = require('gulp-clean'),
    replace      = require('gulp-replace'),
    inject      = require('gulp-inject'),
    input  = {
      'css': 'src/css/**/*.css',
      'js': 'src/js/**/*.js'
    },

    output = {
      'css': 'public/css',
      'js': 'public/js'
    },

    lib = {
      'js': 'src/js/lib',
      'css': 'src/css/lib'
    };

var flatten = require('gulp-flatten');

/* run the watch task when gulp is called without arguments */
gulp.task('default', ['watch']);

/* run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(input.javascript)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/* compile scss files */
gulp.task('build-css', function() {
  return gulp.src(input.css)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.css));
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', ['build-js-lib'], function() {
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      // only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
      .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.js));
});

gulp.task('build-js-lib', function() {
  return gulp.src('src/js/lib/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(concat('lib.js'))
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
      .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.js));

});

gulp.task('build-css-lib', function() {
  return gulp.src('src/css/lib/**/*.css')
    .pipe(copy('public/css/lib',{ prefix: 3 }))
});

gulp.task('clean-js', function () {
  return gulp.src(output.js+'/*', {read: false})
    .pipe(clean());
});

gulp.task('clean-css', function () {
  return gulp.src(output.css+'/*', {read: false})
    .pipe(clean());
});

gulp.task('bower-css', function () {
  return gulp.src('bower_components/**/*.css')
    .pipe(flatten())
    .pipe(gulp.dest('public/css/lib')) 
})  

gulp.task('bower-js', function () {
  return gulp.src('bower_components/**/*min.js')
    .pipe(flatten())
    .pipe(gulp.dest('src/js/lib')) 
})

gulp.task('inject', function(cb) {
  var target = gulp.src('public/index.html');
  var sources = gulp.src(['public/js/lib/*.js', 'public/js/*.js', 'public/css/lib/*.css'], { prefix: 1, read: false});
  return target.pipe(inject(sources))
        .pipe(replace('/public/', ''))
        .pipe(gulp.dest('./public'));
});

gulp.task('clean', ['clean-js', 'clean-css']);
gulp.task('bower', ['bower-js', 'bower-css']);
gulp.task('build', ['build-js', 'build-css']);

gulp.task('watch', function() {
  gulp.watch(input.js, ['build-js']);
  gulp.watch(input.css, ['build-css']);
});