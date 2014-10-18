var COLORS = ['#E8716B','#47B39D','#FFAB89','#FDBF53','#70425E'];

var socket = io();
var $users = $('.users-list');

var users = [{name: 'Вася'}, {name: 'Петя'}];

// socket.on('usersUpdate', function(data) {
var update = function(data) {
  $users.empty();
  data.forEach(function(user, index) {
    $users.append(
      $('<li class="user">')
        .text(user.name)
        .css('backgroudColor', COLORS[index % COLORS.length])
    );
  })
});

update(users);