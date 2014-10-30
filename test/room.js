'use strict';

var should = require('chai').expect;
var Room = require('../server/room.js');

describe('Room', function() {
  var fakeColorGenerator,
      room;

  beforeEach(function(){
    fakeColorGenerator = {
      getColor: function() { return 'black'; },
      restoreColor: function() { }
    };
    room = new Room(fakeColorGenerator);
  });


  describe('addUser(user)', function() {

    it('should add the user', function() {
      room.addUser({ userId: 0 });
      should(room.getUsers()).have.length(1);
    });

    it('should throw an exception if trying to add the user who is already in the room', function() {
      should(function() {
        room.addUser({ userId: 0 });
      }).to.not.throw(Error);
      should(function() {
        room.addUser({ userId: 0 });
      }).to.throw(Error);
    });

    it('at the user added to the room must be some color', function() {
      room.addUser({ userId: 0 });
      should(room.getUsers()[0].userColor).to.exist;
    });

  });


  describe('removeUser(userId)', function() {

    beforeEach(function() {
      room.addUser({ userId: 0 });
    });

    it('should remove the user', function() {
      room.removeUser(0);
      should(room.getUsers().length).to.be.empty;
    });

    it('should return true/false if the user you want to delete, there is a room/no in room', function() {
      should(room.removeUser(0)).to.be.true;
      should(room.removeUser(1)).to.be.false;
    });

  });


  describe('getUsers()', function() {

    it('change the returned array should not affect the users in the room', function() {
      room.addUser({ userId: 0 });
      room.getUsers().push(42);
      should(room.getUsers()).have.length(1);
    });

  });

});
