var requireDir = require('require-dir');
var del = require('del');

del.sync(['build/**']);
requireDir('./gulp/tasks/', {recurse: true});
