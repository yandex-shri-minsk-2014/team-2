var gulp = require('gulp');

gulp.task('default', ['jshint', 'jscs', 'watch', 'copyStatic', 'css', 'browserify', 'supervisor']);
