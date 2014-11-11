'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');

mongoose.connect('mongodb://localhost/meepo');
mongoose.connection.on('error', function (err) {
    console.log('connection error:', err.message);
});


var Schema = mongoose.Schema;

var User = new Schema({
  _id: String, // пока нет регистрации
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

User.methods = {
  encryptPassword: function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },

  checkPassword: function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
  }
};

User.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });

var UserModel = mongoose.model('User', User);

var Room = new Schema({
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
    user: {
      type: String,
      // type: Schema.ObjectId,
      ref : 'User'
    },
    userCursor: {
      type: Schema.Types.Mixed,
      default: {row: 0, collumn: 0}
    },
    userColor: {
      type: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

Room.methods = {
  addUser: function(userId, cb) {
    console.log(12312312);
    this.users.push({
      user: userId
    });

    this.save(cb);
  }
}

Room.statics = {

}

var RoomModel = mongoose.model('Room', Room);

module.exports.mongoose = mongoose;
module.exports.UserModel = UserModel;
module.exports.RoomModel = RoomModel;
