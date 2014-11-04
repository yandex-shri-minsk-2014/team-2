'use strict';

var chai = require('chai');
var should = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var db = require('../server/db.js');
var Room = require('../server/room.js');

chai.use(chaiAsPromised);

describe('db', function() {

  describe('room', function() {


    describe('create()', function() {

      beforeEach(function(done){
        db.__clearRooms().then(function() {
          done();
        });
      });

      it('should create room', function() {
        return should(db.room.create(1)).to.eventually.be.instanceof(Room);
      });

      it('should return early created room', function() {
        return db.room.create(1).then(function(room) {
          return should(db.room.create(1)).to.eventually.deep.equal(room);
        });
      });

    });


    describe('getRoom()', function() {

      beforeEach(function(done) {
        db.__clearRooms().then(function() {
          return db.room.create(1);
        }).then(function() {
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
      var user;

      beforeEach(function(done){
        user = { userId: 1 };
        db.__clearRooms().then(function() {
          return db.room.create(1);
        }).then(function() {
          done();
        });
      });

      it('should add user to room', function() {
        return db.room.update.addUser(1, user).then(function() {
          return should(db.room.getUsers(1)).to.eventually.have.length(1);
        });
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.update.addUser(2, user)).to.be.rejected;
      });

    });


    describe('update.removeUser()', function() {
      var userId;

      beforeEach(function(done){
        userId = 1;
        db.__clearRooms().then(function() {
          return db.room.create(1);
        }).then(function() {
          return db.room.update.addUser(1, {userId: userId});
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
      var user;

      beforeEach(function(done){
        user = { userId: 1 };
        db.__clearRooms().then(function() {
          return db.room.create(1);
        }).then(function() {
          done();
        });
      });

      it('should return users from room', function() {
        return db.room.update.addUser(1, user).then(function() {
          return should(db.room.getUsers(1)).to.eventually.deep.equal([user]);
        });
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.getUsers(2)).to.be.rejected;
      });

    });

    describe('user.setCursor()', function() {
      var roomId = 1;
      var userId = 1;
      var cursor = {row: 1, collumn: 1};

      beforeEach(function(done){
        db.__clearRooms().then(function() {
          return db.room.create(roomId);
        }).then(function() {
          return db.room.update.addUser(roomId, {userId: userId});
        }).then(function() {
          done();
        });
      });

      it('should set cursor user', function() {
        return db.room.user.setCursor(roomId, userId, cursor).then(function() {
          return should(db.room.user.get(roomId, userId)).to.eventually.deep.property('cursor', cursor);
        });
      });

      it('should be rejected if room doesnt exist', function() {
        return should(db.room.user.setCursor(2, userId, cursor)).to.be.rejected;
      });

    });

  });

});
