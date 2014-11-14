'use strict';

var chai = require('chai');
var should = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var db = require('../server/db.js');
var mongoose = require('mongoose');
var Room = require('../server/models/room');
var User = require('../server/models/user');
var connection;

chai.use(chaiAsPromised);

describe('db', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/testMeepo');
    connection = mongoose.connection;
  });

  beforeEach(function(done) {
    connection.db.dropDatabase();
    done();
  });

  after(function(done) {
    connection.close();
    done();
  })

  describe('room', function() {


    describe('create()', function() {

      it('should create room', function() {
        return should(db.room.create(1)).to.eventually.an.instanceof(Room)
          .that.eventually.have.property('roomId', '1');
      });

      it('should return early created room', function() {
        return db.room.create(1).then(function(room) {
          return should(db.room.create(1)).to.eventually.an.instanceof(Room)
            .that.eventually.have.property('roomId', '1');
        });
      });

    });


    describe('getRoom()', function() {

      beforeEach(function(done) {
        db.room.create(1).then(function() {
          done();
        });
      });

      it('should return exist room', function() {
        return should(db.room.get(1)).to.eventually.be.instanceof(Room);
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.get(2)).to.be.rejected;
      });

    });


    describe('update.addUser()', function() {
      var user = {userId: 1, userName: 'Vasya'};

      beforeEach(function(done){
        connection.db.dropDatabase();
        db.room.create(1).then(function() {
          done();
        });
      });

      it('should add user to room', function() {
        return db.room.update.addUser(1, user).then(function() {
          return should(db.room.getUsers(1)).to.eventually.have.length(1);
        });
      });

      it('shoild be rejected If no field name', function() {
        return should(db.room.update.addUser(1, {id: 2})).to.be.rejected;
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.update.addUser(2, user)).to.be.rejected;
      });

    });


    describe('update.removeUser()', function() {
      var userId = '1';
      var user = {userId: userId, userName: 'Vasya'};

      beforeEach(function(done){
        connection.db.dropDatabase();
        db.room.create(1).then(function() {
          return db.room.update.addUser(1, user);
        }).then(function() {
          done();
        });
      });

      it('should remove user from room', function() {
        return db.room.update.removeUser(1, userId).then(function() {
          return should(db.room.getUsers(1)).to.eventually.be.empty;
        });
      });

      it('should return True if user removed', function() {
        return should(db.room.update.removeUser(1, userId)).to.eventually.be.true;
      });

      it('should return False if user not exist in room', function() {
        return should(db.room.update.removeUser(1, 42)).to.eventually.be.false;
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.update.removeUser(2, userId)).to.be.rejected;
      });

    });


    describe('getUsers()', function() {
      var userId = '1';
      var userName = 'Vasya';
      var user = {userId: userId, userName: userName};

      beforeEach(function(done){
        connection.db.dropDatabase();
        db.room.create(1).then(function() {
          done();
        });
      });

      it('should return users from room', function() {
        return db.room.update.addUser(1, user).then(function() {
          return should(db.room.getUsers(1)).to.eventually.deep.property('[0].userId', userId);
        }).then(function() {
          return should(db.room.getUsers(1)).to.eventually.deep.property('[0].userName', userName);
        });
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.getUsers(2)).to.be.rejected;
      });

    });

    describe('user.setCursor()', function() {
      var roomId = 1;
      var userId = '1';
      var userName = 'Vasya';
      var user = {userId: userId, userName: userName};
      var cursor = {row: 1, collumn: 1};

      beforeEach(function(done) {
        connection.db.dropDatabase();
        db.room.create(roomId).then(function() {
          return db.room.update.addUser(roomId, user);
        }).then(function() {
          done();
        });
      });

      it('should set cursor user', function() {
        return db.room.user.setCursor(roomId, userId, cursor).then(function() {
          return should(db.room.user.get(roomId, userId)).to.eventually.deep.property('userCursor.row', cursor.row);
        }).then(function() {
          return should(db.room.user.get(roomId, userId)).to.eventually.deep.property('userCursor.collumn', cursor.collumn);
        });
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.user.setCursor(2, userId, cursor)).to.be.rejected;
      });

    });

    describe('user.get()', function() {
      var userId = '1';
      var userName = 'Vasya';
      var user = {userId: userId, userName: userName};

      beforeEach(function(done){
        connection.db.dropDatabase();
        db.room.create(1).then(function() {
          done();
        });
      });

      it('should return user from room', function() {
        return db.room.update.addUser(1, user).then(function() {
          return should(db.room.user.get(1, userId)).to.eventually.deep.property('userId', userId);
        }).then(function() {
          return should(db.room.user.get(1, userId)).to.eventually.deep.property('userName', userName);
        });
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.user.get(2)).to.be.rejected;
      });
    });

  });

});
