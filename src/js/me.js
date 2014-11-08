'use strict';

var socket = require('./socket');

module.exports = {
  id: function() {
    return socket.io.engine.id;
  }
};
