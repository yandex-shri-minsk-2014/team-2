'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var settings = require('./../package.json').settings;
var db = require('./db.js');
var sharejs = require('share');

app.use(express.static(__dirname + '/../build'));

app.get('/project', function(req, res) {
  res.sendFile(path.resolve('build/project.html'));
});

app.get('/:id', function(req, res) {
  res.sendFile(path.resolve('build/index.html'));
});

io.on('connection', function(socket) {

  socket.on('connectToRoom', function(roomId) {
    if (!roomId) {
      roomId = (Math.random() * 255).toString(32).replace('.', '');
      socket.emit('changeRoom', {roomId: roomId});
    }

    socket.roomId = roomId;
    db.room.create(roomId);
    socket.join(roomId);
  });

  socket.on('userConnect', function(userName) {
    var roomId = socket.roomId;
    var userId = socket.id;

    db.room.update.addUser(roomId, {
      userId: userId,
      userName: userName
    }).then(function() {
      return db.room.getUsers(roomId);
    }).then(function(users) {
      io.to(roomId).emit('usersUpdate', users);
    });
  });

  socket.on('disconnect', function() {
    var roomId = socket.roomId;
    var userId = socket.id;

    socket.leave(roomId);

    io.to(roomId).emit('markerRemove', {userId: userId});
    db.room.update.removeUser(roomId, userId).then(function() {
      return db.room.getUsers(roomId);
    }).then(function(users) {
      io.to(roomId).emit('usersUpdate', users);
    });
  });

  socket.on('verifyUserName', function(userName) {
    if (settings.debug) {
      socket.emit('verifyUserNameAnswer', true);
      return;
    }

    var roomId = socket.roomId;

    db.room.getUsers(roomId).then(function(users) {
      var founded = users.some(function(user) {
        return user.userName === userName;
      });
      socket.emit('verifyUserNameAnswer', !founded);
    }).catch(function() {
      socket.emit('verifyUserNameAnswer', true);
    });
  });

  socket.on('userCursorPosition', function(position) {
    var roomId = socket.roomId;
    var userId = socket.id;

    db.room.user.setCursor(roomId, userId, position).then(function() {
      return db.room.user.get(roomId, userId);
    }).then(function(user) {
      io.to(roomId).emit('markerUpdate', user);
    });
  });
});

var server = http.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    // This auth handler rejects any ops bound for docs starting with 'readonly'.
    if (action.name === 'submit op' && action.docName.match(/^readonly/)) {
      action.reject();
    } else {
      action.accept();
    }
  }
};

sharejs.server.attach(app, options);
