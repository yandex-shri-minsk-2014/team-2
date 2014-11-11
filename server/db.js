/*jshint -W079 */
'use strict';

var Room = require('./room.js');
var colorize = require('./libs/colorize');
var Promise = require('es6-promise').Promise;
var mongoose = require('./libs/mongoose').mongoose;
var RoomModel = require('./libs/mongoose').RoomModel;
var UserModel = require('./libs/mongoose').UserModel;
var faker = require('Faker');

var rooms = {};

function clearRooms() {
  return new Promise(function(resolve) {
    rooms = {};
    resolve();
  });
}

function createRoom(roomId, userId) {
  return new Promise(function(resolve, reject) {
    RoomModel.findOne({roomId: roomId}, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        resolve(room);
      } else {
        var room = new RoomModel({roomId: roomId});
        room.save(function(err, room) {
          if (err) {
            reject(err);
          } else {
            resolve(room);
          }
        });
      }
    });
  });
}

function getRoom(roomId) {
  return new Promise(function(resolve, reject) {
    RoomModel.findOne({roomId: roomId}, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        resolve(room)
      } else {
        reject();
      }
    });
  });
}

function getUsersFromRoom(roomId) {
  return new Promise(function(resolve, reject) {
    RoomModel.findOne({roomId: roomId})
      .populate(users)
      .exec(function(err, users) {
        console.log(err);
        console.log(users);
      })
  });
}

function addUserToRoom(roomId, user) {
  return new Promise(function(resolve, reject) {
    // пока нет регистрации
    UserModel.findOne({_id: user.userId}, function(err, foundUser) {
      if (err) {
        reject(err);
      } else if (foundUser) {

      } else {
        var person = new UserModel({ userName: user.userName, userId: user.userId, password: faker.Lorem.words(1)[0], _id: user.userId});
        person.save(function(err, foundUser) {
          if (err) {
            reject(err);
          }
        });
      }
    });

    RoomModel.findOne({roomId: roomId}, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        room.addUser(user.userId, function(err, data) {
          console.log(err);
          console.log(data);
        });
      } else {
        reject();
      }
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

function userUpdateCursorPosition(roomId, userId, cursorPosition) {
  return new Promise(function(resolve, reject) {
    getRoom(roomId).then(function(room) {
      room.userSetCursor(userId, cursorPosition);
      resolve();
    }).catch(function() {
      reject();
    });
  });
}

function getUser(roomId, userId) {
  return new Promise(function(resolve, reject) {
    getRoom(roomId).then(function(room) {
      resolve(room.getUser(userId));
    }).catch(function() {
      reject();
    });
  });
}

module.exports = {
  __clearRooms: clearRooms,
  room: {
    create: createRoom,
    get: getRoom,
    getUsers: getUsersFromRoom,
    update: {
      addUser: addUserToRoom,
      removeUser: removeUserFromRoom,
    },
    user: {
      setCursor: userUpdateCursorPosition,
      get: getUser
    }
  }
};
