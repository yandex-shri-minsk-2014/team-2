var gulp = require('gulp');

gulp.task('default', ['jshint', 'watch', 'copyStatic', 'css', 'browserify', 'supervisor']);
