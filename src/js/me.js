'use strict';

var socket = require('./socket');
var $ = require('jquery');

module.exports = {

  id: function() {
    return socket.io.engine.id;
  },

  name: function() {
    if (arguments.length) {
      var userName = arguments[0];
      localStorage.setItem('app_userName', userName);
      $('.head .user__name').text(userName);
      return;
    }

    return localStorage.getItem('app_userName');
  }

};
