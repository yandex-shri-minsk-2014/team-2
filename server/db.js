/*jshint -W079 */
'use strict';

var Room = require('./room.js');
var colorize = require('./libs/colorize');
var Promise = require('es6-promise').Promise;

var rooms = { };

function createRoom(roomId) {
  rooms[roomId] || (rooms[roomId] = new Room(colorize()));
}

function getRoom(roomId) {
  return new Promise(function(resolve, reject) {
    var room = rooms[roomId];
    if (room) {
      resolve(room);
    } else {
      reject();
    }
  });
}

function getUsersFromRoom(roomId) {
  return new Promise(function(resolve, reject) {
    getRoom(roomId).then(function(room) {
      resolve(room.getUsers());
    }).catch(function() {
      reject();
    });
  });
}

function addUserToRoom(roomId, user) {
  return new Promise(function(resolve, reject) {
    getRoom(roomId).then(function(room) {
      room.addUser(user);
      resolve();
    }).catch(function() {
      reject();
    });
  });
}

function removeUserFromRoom(roomId, userId) {
  return new Promise(function(resolve, reject) {
    getRoom(roomId).then(function(room) {
      resolve(room.removeUser(userId));
    }).catch(function() {
      reject();
    });
  });
}

module.exports = {
  room: {
    create: createRoom,
    get: getRoom,
    getUsers: getUsersFromRoom,
    update: {
      addUser: addUserToRoom,
      removeUser: removeUserFromRoom
    }
  }
};
