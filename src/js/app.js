'use strict';
var socket = io();
var userList = $('.user-list');

var usersUpdate = function(data) {
  userList.empty();

  data.forEach(function(user) {
    userList.append(
      $('<li class="user">')
        .text(user.userName)
        .css('backgroundColor', user.userColor)
    );
  });
};

var changeRoom = function(data) {
  window.history.pushState(1, document.title, data.roomId);
};

socket.on('usersUpdate', usersUpdate);
socket.on('changeRoom', changeRoom);

socket.on('connect', function() {
  var roomId = window.location.pathname;
  socket.emit('userConnect', {
    roomId: roomId,
    name: 'Вася'
  });
  window.socket = socket;
});
