var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/../build'));

app.post('/api/rooms',function(req, res, next) {
    var hash = (Math.random()*255).toString(32).replace('.','');
    var room = { 'id': hash};
    res.send(JSON.stringify(room));
})

var storage = [];

io.on('connection', function(socket) {
    socket.on('userConnect', function(data) {
        if (storage[data.roomId]) {
            var hashUser = (Math.random()*255).toString(32).replace('.','');
            socket.roomId = data.roomId;
            socket.userId = hashUser;

            storage[data.roomId].push({
                'userId': hashUser,
                'name': data.name,
                'roomId' : data.roomId
            });

            socket.join(data.roomId);
            io.to(data.roomId).emit('usersUpdate', storage[data.roomId]);
        }
        else {
            var hashRoom = data.roomId || (Math.random()*255).toString(32).replace('.',''),
                hashUser = (Math.random()*255).toString(32).replace('.','');
            socket.roomId = hashRoom;
            socket.userId = hashUser;

            storage[hashRoom] = [];
            storage[hashRoom].push({
                'userId': hashUser,
                'name': data.name,
                'roomId' : hashRoom
            });

            socket.join(hashRoom);
            io.to(hashRoom).emit('usersUpdate', storage[hashRoom]);
        }
    });

    socket.on('disconnect', function() {
        socket.leave(socket.roomId);
        storage[socket.roomId] = storage[socket.roomId].filter(function(value){
            return value.userId !== socket.userId;
        });
        io.to(socket.roomId).emit('usersUpdate', storage[socket.roomId]);
    });
});

var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

