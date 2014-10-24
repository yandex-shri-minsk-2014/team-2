'use strict';

function Room(colorGenerator) {
  this._colorGenerator = colorGenerator;
  this._users = [];
}

Room.prototype.addUser = function(user) {
  user.userColor = this._colorGenerator.getColor();
  this._users.push(user);
};

Room.prototype.removeUser = function(userId) {
  var self = this;
  this._users = this._users.filter(function(user) {
    if (user.userId === userId) {
      self._colorGenerator.restoreColor(user.userColor);
      return false;
    } else {
      return true;
    }
  });
};

Room.prototype.getUsers = function() {
  return this._users.slice();
};

module.exports = Room;
