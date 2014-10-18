var gulp = require('gulp');
var config = require('../config.js').copyStatic;

gulp.task('copyStatic', function() {
  console.log('Coping static...')
  return gulp.src(config.src).pipe(gulp.dest(config.dst));
})