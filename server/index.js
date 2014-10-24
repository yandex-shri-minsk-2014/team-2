'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var settings = require('./../package.json').settings;
var colorize = require('./libs/colorize');
var Room = require('./room.js');

app.use(express.static(__dirname + '/../build'));

app.get('/:id', function(req, res) {
  res.sendFile(path.resolve('build/index.html'));
});

var rooms = {};

io.on('connection', function(socket) {

  socket.on('connectToRoom', function(roomId) {
    if (!roomId) {
      roomId = (Math.random() * 255).toString(32).replace('.', '');
      socket.emit('changeRoom', {roomId: roomId});
    }

    socket.roomId = roomId;
    if (!rooms[roomId]) {
      rooms[roomId] = new Room(colorize());
    }

    socket.join(roomId);
  });

  socket.on('userConnect', function(userName) {
    var roomId = socket.roomId;
    var room = rooms[roomId];

    room.addUser({
      userId: socket.id,
      userName: userName
    });

    io.to(roomId).emit('usersUpdate', room.getUsers());
  });

  socket.on('disconnect', function() {
    var roomId = socket.roomId;
    var room = rooms[roomId];

    socket.leave(socket.roomId);
    room.removeUser(socket.id);

    io.to(roomId).emit('usersUpdate', room.getUsers());
  });

  socket.on('verifyUserName', function(userName) {
    if (settings.debug) {
      socket.emit('verifyUserNameAnswer', true);
      return;
    }

    var roomId = socket.roomId;
    var room = rooms[roomId];

    if (!room) {
      socket.emit('verifyUserNameAnswer', true);
      return;
    }

    var founded = room.getUsers().some(function(user) {
      return user.userName === userName;
    });

    socket.emit('verifyUserNameAnswer', !founded);
  });

});

var server = http.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
