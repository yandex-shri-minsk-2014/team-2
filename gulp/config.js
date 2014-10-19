var dest = 'build';

module.exports = {
  copyStatic: {
    src: 'src/index.html',
    dst: dest
  },
  css: {
    browsers: ['last 2 versions'],
    cascade: false,
    dest: dest + '/css'
  },
  js: {
    clientSrc: 'src/js/**/*.js',
    serverSrc: 'server/**/*.js'
    dest: dest + '/js'
  },
  html: {
    dest: dest
  },
  browserify: {
    debug: true,
    extensions: ['.js'],
    bundleConfigs: [{
      entries: __dirname + '/../src/js/app.js',
      dest: dest,
      outputName: 'js/app.min.js'
    }]
  },
  supervisor: {
    path: 'server/index.js',
    opts: {
      watch: ['server']
    }
  },
  tree: {
    blocks_path: 'src/blocks',
    pages_path: 'src/pages'
  }
};
