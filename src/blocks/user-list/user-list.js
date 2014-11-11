'use strict';

var socket = require('../../js/socket');
var $ = require('jquery');

function onUsersUpdate(users) {
  var userList = $('.user-list');
  userList.empty();

  users.forEach(function(user) {
    userList.append(
      $('<li class="user">')
        .append(
          $('<figure class="user__color">').css('backgroundColor', user.userColor)
        )
        .append(user.userId.name)
    );
  });
}

socket.on('usersUpdate', onUsersUpdate);
