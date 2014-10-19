var gulp = require('gulp');
var supervisor = require('gulp-supervisor');
var config = require('../config').supervisor;

gulp.task('supervisor', function() {
  supervisor(config.path, config.opts);
});
