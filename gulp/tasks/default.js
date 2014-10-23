var gulp = require('gulp');

gulp.task('default', ['plato', 'watch', 'copyStatic', 'css', 'browserify', 'supervisor']);
