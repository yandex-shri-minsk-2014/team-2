var gulp = require('gulp');
var config = require('../config');

gulp.task('default', function() {
  if (config.isDebug) {
    gulp.start('watch', 'supervisor');
  } else {
    gulp.start('build');
  }
});
