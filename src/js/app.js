var socket    = io();
var colors    = ['#E8716B','#47B39D','#FFAB89','#FDBF53','#70425E'];
var userList = $('.user-list');

var users = [{name: 'Вася'}, {name: 'Петя'}];

var usersUpdate = function(data) {
  userList.empty();

  data.forEach(function(user, index) {
    userList.append(
      $('<li class="user">')
        .text(user.name)
        .css('backgroundColor', colors[index % colors.length])
    );
  });
};

var changeRoom = function(data) {
  window.history.pushState(null, null, data.roomId);
};

socket.on('usersUpdate', usersUpdate);
socket.on('changeRoom', changeRoom);

socket.on('connect', function(){
  var roomId = window.location.pathname;
  socket.emit('userConnect', {
    roomId: roomId,
    name: 'Вася'
  });
  window.socket = socket;
});
