var dest = 'build';

module.exports = {
  copyStatic: {
    src: 'client/static/**',
    dst: dest + '/static/'
  },
  css: {
    src: 'blocks/**/*.css',
    concatSrc: 'index.css',
    browsers: ['last 2 versions'],
    cascade: false,
    dest: dest + '/css'
  },
  browserify: {
    debug: true,
    extensions: ['.js'],
    bundleConfigs: [{
      entries: __dirname + '/../client/js/app.js',
      dest: dest,
      outputName: 'js/app.min.js'
    }]
  }
}