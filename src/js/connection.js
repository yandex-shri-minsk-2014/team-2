'use strict';

var socket = require('./socket');

function onConnect() {
  socket.emit('connectToRoom', window.location.pathname.slice(1));
}

function verifyUserName(userName, verifyCallback) {
  socket.emit('verifyUserName', userName);
  socket.off('verifyUserNameAnswer');
  socket.on('verifyUserNameAnswer', verifyCallback);
}

function connect(userName) {
  socket.emit('userConnect', userName);
}

socket.on('connect', onConnect);

module.exports = {
  connect: connect,
  verifyUserName: verifyUserName,
  socket: socket.io.engine
};
