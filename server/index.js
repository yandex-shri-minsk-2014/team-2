'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var colorize = require('./libs/colorize.js');

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

      rooms[data.roomId].users.push({
        userId: socket.id,
        userName: data.name,
        userColor: colorize.getColor(rooms[data.roomId])
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
          userColor: '#e0b819'
        }],
        colors: colorize.colors
      };

      socket.emit('changeRoom', {roomId: roomId});
      socket.join(roomId);
      io.to(roomId).emit('usersUpdate', rooms[roomId].users);
    }
  });

  socket.on('disconnect', function() {
    socket.leave(socket.roomId);
    rooms[socket.roomId].users = (rooms[socket.roomId].users || []).filter(function(value) {
      if (value.userId === socket.id) {
        rooms[socket.roomId].colors.push(value.userColor);
        return false;
      } else {
        return true;
      }
    });
    io.to(socket.roomId).emit('usersUpdate', rooms[socket.roomId].users);
  });
});

var server = http.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
