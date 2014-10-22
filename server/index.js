'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(__dirname + '/../build'));

app.get('/:id', function(req, res) {
  res.sendFile(path.resolve('build/index.html'));
});

var rooms = {};

io.on('connection', function(socket) {
  socket.on('userConnect', function(data) {
    data.roomId = data.roomId.substr(1);
    if (rooms[data.roomId] && data.roomId) {
      socket.roomId = data.roomId;

      rooms[data.roomId].colorHue = (rooms[data.roomId].colorHue >= 360) ?
        rooms[data.roomId].colorHue - 350 : rooms[data.roomId].colorHue + 30;

      rooms[data.roomId].users.push({
        userId: socket.id,
        userName: data.name,
        userColor: 'hsl(' + rooms[data.roomId].colorHue + ', 60%, 40%)'
      });

      socket.join(data.roomId);
      io.to(data.roomId).emit('usersUpdate', rooms[data.roomId].users);
    } else {
      var roomId = data.roomId || (Math.random() * 255).toString(32).replace('.', '');
      socket.roomId = roomId;

      rooms[roomId] = {
        users: [{
          userId: socket.id,
          userName: data.name,
          userColor: 'hsl(' + 30 + ', 60%, 40%)'
        }],
        colorHue: 30
      };

      socket.emit('changeRoom', {roomId: roomId});
      socket.join(roomId);
      io.to(roomId).emit('usersUpdate', rooms[roomId].users);
    }
  });

  socket.on('disconnect', function() {
    socket.leave(socket.roomId);
    rooms[socket.roomId].users = (rooms[socket.roomId].users || []).filter(function(value) {
      return value.userId !== socket.id;
    });
    io.to(socket.roomId).emit('usersUpdate', rooms[socket.roomId].users);
  });
});

var server = http.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
