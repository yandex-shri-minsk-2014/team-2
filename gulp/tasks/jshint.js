var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var config = require('../config').js;

gulp.task('jshint', function() {
  return gulp.src([
    config.clientSrc,
    config.serverSrc
  ].join(config.ignoreSrc))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});
