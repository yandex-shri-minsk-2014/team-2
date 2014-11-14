var gulp = require('gulp');
var bem = require('gulp-bem');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var config = require('../config');

gulp.task('html', ['tree'], function () {
  function buildHtml(page) {
    return global.tree.deps(config.tree.pagesPath + '/' + page.id)
      .pipe(bem.src('{bem}.jade'))
      .pipe(concat({
          path: page.path + '/' + page.id + '.jade',
          base: page.path
      }))
      // .pipe(jade({pretty: true}))
      .pipe(gulp.dest(config.html.dest));
  }

  return bem.objects(config.tree.pagesPath).map(buildHtml);
});
