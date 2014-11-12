'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomSchema = new Schema({
  roomId: {
    type: String,
    require: true,
    unique: true
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  users: [{
    userId: {
      type: String,
      // type: Schema.ObjectId,
      ref: 'User'
    },
    userCursor: {
      type: Schema.Types.Mixed,
      default: {row: 0, collumn: 0}
    },
    userColor: {
      type: String,
      default: 'rgb(55, 191, 92);'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

RoomSchema.methods = {
  addUser: function(userId, cb) {
    this.users.push({
      userId: userId
    });

    this.save(cb);
  },
  removeUser: function(userId, cb) {
    var _this = this;

    this.users.some(function(user, pos) {
      if (user.userId === userId) {
        _this.users.splice(pos, 1);
      }
    });

    this.save(cb);
  },
  userSetCursor: function(userId, position, cb) {
    this.users.some(function(user) {
      if (user.userId === userId) {
        user.userCursor = position;
      }
    });

    this.save(cb);
  }
};

RoomSchema.statics = {
  getRoom: function(roomId, cb) {
    this.findOne({roomId: roomId}, cb);
  },
  getUsers: function(roomId, cb) {
    this.findOne({roomId: roomId})
      .populate('users.userId', 'name')
      .exec(cb);
  },
  getUser: function(roomId, userId, cb) {
    this.findOne({roomId: roomId, 'users.userId': userId})
      .populate('users.userId', 'name')
      .exec(function(err, data) {
        if (err || !data) {
          cb(err, null);
        } else {
          data.users.some(function(user) {
            if (user.userId._id === userId) {
              cb(null, user);
            }
          });
        }
      });
  }
};

var RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;
