var gulp = require('gulp');

gulp.task('default', ['watch', 'copyStatic', 'css', 'browserify', 'supervisor']);
