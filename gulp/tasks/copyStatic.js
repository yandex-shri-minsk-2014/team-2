var gulp = require('gulp');
var config = require('../config.js').copyStatic;

gulp.task('copyStatic', function() {
  return gulp.src(config.src).pipe(gulp.dest(config.dst));
})