var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var config=require('../config').css;

gulp.task('css', function() {
  return gulp.src(config.src)
    .pipe(concatCss(config.concatSrc))
    .pipe(autoprefixer({
      browsers: config.browsers,
      cascade: config.cascade
    }))
    .pipe(csscomb())
    .pipe(gulp.dest(config.dest));
});