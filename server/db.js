/*jshint -W079 */
'use strict';

var Promise = require('es6-promise').Promise;
// var mongoose = require('./libs/mongoose');
var RoomModel = require('./models/room');
var UserModel = require('./models/user');
var faker = require('Faker');

function createRoom(roomId) {
  return new Promise(function(resolve, reject) {
    RoomModel.getRoom(roomId, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        resolve(room);
      } else {
        room = new RoomModel({roomId: roomId});
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
    RoomModel.getRoom(roomId, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        resolve(room);
      } else {
        reject();
      }
    });
  });
}

function getUsersFromRoom(roomId) {
  return new Promise(function(resolve, reject) {
    RoomModel.getUsers(roomId, function(err, foundUsers) {
      if (err) {
        reject(err);
      } else if (foundUsers) {
        resolve(foundUsers.users);
      } else {
        reject();
      }
    });
  });
}

function addUserToRoom(roomId, user) {
  return new Promise(function(resolve, reject) {
    // пока нет регистрации
    UserModel.findOne({_id: user.userId}, function(err, foundUser) {
      if (err) {
        reject(err);
      } else if (foundUser) {
        resolve();
      } else {
        var person = new UserModel({
          name: user.userName,
          id: user.userId,
          password: faker.Lorem.words(1)[0],
          // _id: user.userId
        });
        person.save(function(err) {
          if (err) {
            reject(err);
          }
        });
      }
    });

    RoomModel.getRoom(roomId, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        room.addUser(user.userId, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        reject();
      }
    });
  });
}

function removeUserFromRoom(roomId, userId) {
  return new Promise(function(resolve, reject) {
    RoomModel.getRoom(roomId, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        room.removeUser(userId, function(found) {
          resolve(found);
        });
      } else {
        reject();
      }
    });
  });
}

function userUpdateCursorPosition(roomId, userId, cursorPosition) {
  return new Promise(function(resolve, reject) {
    RoomModel.getRoom(roomId, function(err, room) {
      if (err) {
        reject(err);
      } else if (room) {
        room.userSetCursor(userId, cursorPosition, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        reject();
      }
    });
  });
}

function getUser(roomId, userId) {
  return new Promise(function(resolve, reject) {
    RoomModel.getUser(roomId, userId, function(err, user) {
      if (err) {
        reject(err);
      } else if (user) {
        resolve(user);
      } else {
        reject();
      }
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
      removeUser: removeUserFromRoom,
    },
    user: {
      setCursor: userUpdateCursorPosition,
      get: getUser
    }
  }
};
