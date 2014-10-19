var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/**/*.{css,styl}', ['css']);
  gulp.watch('src/**/*.jade', ['html']);
});
