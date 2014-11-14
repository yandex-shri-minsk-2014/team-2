/*jshint -W079 */
'use strict';

var Promise = require('es6-promise').Promise;
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
        resolve(foundUsers);
      } else {
        reject();
      }
    });
  });
}

function addUserToRoom(roomId, user) {
  return new Promise(function(resolve, reject) {
    // пока нет регистрации
    UserModel.findOne({id: user.userId}, function(err, foundUser) {
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

function userLocalRegister(userName, userPassword) {
  return new Promise(function(resolve, reject) {
    UserModel.findUserByName(userName, function(err, user) {
      if (err) {
        reject(err);
      } else if (user) {
        resolve(false);
      } else {
        user = new UserModel({name: userName, password: userPassword});
        user.save(function(err, user) {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      }
    });
  });
}

function userLocalAuth(userName, userPassword) {
  return new Promise(function(resolve, reject) {
    UserModel.findUserByName(userName, function(err, user) {
      if (err) {
        reject(err);
      } else if (user) {
        if (user.checkPassword(userPassword)) {
          resolve(user);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
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
  },
  user: {
    localReg: userLocalRegister,
    localAuth: userLocalAuth
  }
};
