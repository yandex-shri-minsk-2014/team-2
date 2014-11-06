var gulp = require('gulp');
var buddyjs = require('gulp-buddy.js');
var config = require('../config').js;

gulp.task('buddy', function () {
  return gulp.src([
    config.clientSrc,
    config.serverSrc
  ].concat(config.ignoreSrc).concat('!server/libs/**'))
    .pipe(buddyjs({
      reporter: 'detailed'
    }));
});
