module.exports = function() {
  'use strict';

  var $ = require('jquery');
  var io = require('socket.io-client');
  var socket = io();
  var userList;

  function init(editor) {
    userList = $('.user-list');

    socket.on('usersUpdate', onUsersUpdate);
    socket.on('changeRoom', onChangeRoom);
    socket.on('markerUpdate', editor.updateCursorMarker);
    socket.on('connect', function() {
      socket.emit('connectToRoom', window.location.pathname.slice(1));
    });
  }

  function verifyUserName(userName, verifyCallback) {
    socket.emit('verifyUserName', userName);
    socket.off('verifyUserNameAnswer');
    socket.on('verifyUserNameAnswer', verifyCallback);
  }

  function onUsersUpdate(data) {
    userList.empty();

    data.forEach(function(user) {
      userList.append(
        $('<li class="user">')
          .append(
            $('<figure class="user__color">').css('backgroundColor', user.userColor)
          )
          .append(user.userName)
        );
      });
    }

  function onChangeRoom(data) {
    window.history.pushState(1, document.title, data.roomId);
  }

  function connect(userName) {
    socket.emit('userConnect', userName);
  }

  function sendMarker(data) {
    socket.emit('userCursorPosition', data);
  }

  return {
    init: init,
    connect: connect,
    verifyUserName: verifyUserName,
    sendMarker: sendMarker,
    socket: socket.io.engine
  };
};
