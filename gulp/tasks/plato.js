var gulp = require('gulp');
var plato = require('gulp-plato');
var config = require('../config').js;
var cjson = require('cjson');
var jshintOptions = cjson.load('./.jshintrc');

gulp.task('plato', function () {
  return gulp.src([
    config.clientSrc,
    config.serverSrc
  ].concat(config.ignoreSrc))
  .pipe(plato('report/analysis', {
    jshint: {
      options: jshintOptions
    }
  }));
});
