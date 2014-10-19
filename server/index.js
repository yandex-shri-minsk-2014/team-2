var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(__dirname + '/../build'));

app.post('/api/rooms',function(req, res, next) {
  var hash = (Math.random()*255).toString(32).replace('.','');
  var room = { 'id': hash};
  res.send(JSON.stringify(room));
})

app.get('/:id', function(req, res) {
  res.sendFile(path.resolve('build/index.html'));
});

var rooms = {};

io.on('connection', function(socket) {
  socket.on('userConnect', function(data) {
    if (rooms[data.roomId] && data.roomId !== '/') {
      socket.roomId = data.roomId;

      rooms[data.roomId].push({
        'userId': socket.id,
        'name': data.name
      });

      socket.join(data.roomId);
      io.to(data.roomId).emit('usersUpdate', rooms[data.roomId]);
    } else {
      var roomId = (data.roomId !== '/') ? data.roomId : (Math.random()*255).toString(32).replace('.','');
      socket.roomId = roomId;

      rooms[roomId] = [];
      rooms[roomId].push({
        'userId': socket.id,
        'name': data.name
      });

      socket.emit('changeRoom', roomId)
      socket.join(roomId);
      io.to(roomId).emit('usersUpdate', rooms[roomId]);
    }
  });

  socket.on('disconnect', function() {
    socket.leave(socket.roomId);
    rooms[socket.roomId] = (rooms[socket.roomId] || []).filter(function(value){
      return value.userId !== socket.userId;
    });
    io.to(socket.roomId).emit('usersUpdate', rooms[socket.roomId]);
  });
});

var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

