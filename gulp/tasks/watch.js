var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
  gulp.watch(config.copyStatic.src, ['copyStatic']);
  gulp.watch(config.css.src, ['css']);
})