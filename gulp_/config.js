var dest = 'pages/'

module.exports = {
  css: {
    src: 'blocks/**/*.css',
    concatSrc: 'index/index.css',
    browsers: ['last 2 versions'],
    cascade: false,
    dest: dest
  },
}