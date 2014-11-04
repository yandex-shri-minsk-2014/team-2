'use strict';

function Room(colorGenerator) {
  this._colorGenerator = colorGenerator;
  this._users = [];
}

Room.prototype.addUser = function(user) {
  var founded = this._users.some(function(u) {
    return u.userId === user.userId;
  });
  if (founded) {
    throw new Error('Пользователь с таким id уже есть в комнате!');
  }

  user.cursor = {row: 0, collumn: 0};
  user.userColor = this._colorGenerator.getColor();
  this._users.push(user);
};

Room.prototype.removeUser = function(userId) {
  var _this = this;

  return this._users.some(function(user, pos) {
    if (user.userId === userId) {
      _this._colorGenerator.restoreColor(user.userColor);
      _this._users.splice(pos, 1);
      return true;
    }
  });
};

Room.prototype.userSetCursor = function(userId, position) {
  return this._users.some(function(user, pos) {    if (user.userId === userId) {
      user.cursor = position;
      return true;
    }
  });
};

Room.prototype.getUser = function(userId) {
  var founded = false;
  this._users.some(function(u) {
    if (u.userId === userId) {
      founded = u;
    }
  });
  return founded;
};

Room.prototype.getUsers = function() {
  return this._users.slice();
};

module.exports = Room;
