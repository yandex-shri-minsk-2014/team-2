var dest = 'build';

module.exports = {
  css: {
    browsers: ['last 2 versions'],
    cascade: false,
    dest: dest + '/css'
  },
  js: {
    clientSrc: 'src/js/**/*.js',
    ignoreSrc: ['!src/js/share/**/*.js'],
    serverSrc: 'server/**/*.js',
    dest: dest + '/js'
  },
  html: {
    dest: dest
  },
  supervisor: {
    path: 'server/index.js',
    opts: {
      watch: ['server']
    }
  },
  tree: {
    blocksPath: 'src/blocks',
    pagesPath: 'src/pages'
  }
};
