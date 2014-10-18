var express = require('express')
var app = express()
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

io.on('connection', function(socket){
  console.log('a user connected');
})


var server = http.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

