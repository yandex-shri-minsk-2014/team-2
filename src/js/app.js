'use strict';

var connection = require('./socket')();
var guard = require('./guard')();
var editor = require('./editor')();

connection.init();
getUserName();

function getUserName() {
  var userName = localStorage.getItem('app_userName') || guard.askTheName();
  connection.verifyUserName(userName, function(ans) {
    if (!ans) {
      localStorage.removeItem('app_userName');
      getUserName();
    } else {
      localStorage.setItem('app_userName', userName);
      connection.connect(userName);
    }
  });
}
