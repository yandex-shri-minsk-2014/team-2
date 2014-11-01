var gulp = require('gulp');
var jscs = require('gulp-jscs');
var config = require('../config').js;

gulp.task('jscs', function () {
  return gulp.src([
    config.clientSrc,
    config.serverSrc
  ].join(config.ignoreSrc))
    .pipe(jscs());
});
