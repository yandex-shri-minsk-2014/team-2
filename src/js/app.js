'use strict';

var socket = require('./socket')();
var guard = require('./guard')();

socket.init();
getUserName();

function getUserName() {
  var userName = guard.askTheName();
  socket.verifyUserName(userName, function(ans) {
    if (!ans) {
      getUserName();
    } else {
      socket.connect(userName);
    }
  });
}
