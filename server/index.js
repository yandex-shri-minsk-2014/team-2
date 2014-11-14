'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var settings = require('./../package.json').settings;
var mongoose = require('./libs/mongoose')();
var db = require('./db.js');
var sharejs = require('share');
var id = require('./libs/idGenerator');
var passport = require('passport');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var SERVER_PORT = 3000;

// app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
var sessionMiddleware = session({secret: 'meepo', saveUninitialized: true, resave: true});
app.use(sessionMiddleware);
io.use(function(socket, next) {
  sessionMiddleware(socket.request, {}, next);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  var err = req.session.error;
  var msg = req.session.notice;
  var success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) {
    res.locals.error = err;
  }
  if (msg) {
    res.locals.notice = msg;
  }
  if (success) {
    res.locals.success = success;
  }

  next();
});
app.use(express.static(__dirname + '/../build'));
app.set('views', __dirname + '/../build');
app.set('view engine', 'jade');

require('./routes')(app, db);
require('./libs/passportLocal')(passport);

mongoose.connect();

io.on('connection', function(socket) {
  socket.userId = socket.request.session.passport.user._id;

  socket.on('connectToRoom', function(roomId) {
    if (!roomId) {
      roomId = id();
      socket.emit('changeRoom', {roomId: roomId});
    }

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

var server = http.listen(SERVER_PORT, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

var options = {
  db: {
    type: 'mongo',
    opsCollectionPerDoc: false
  },
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
