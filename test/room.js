'use strict';

var should = require('chai').expect,
    Room = require('../server/room.js');

describe('Room', function() {

  var fakeColorGenerator = {
    getColor: function() { return 'black'; },
    restoreColor: function() { }
  };


  describe('addUser', function() {

    it('should add the user', function() {
      var room = new Room(fakeColorGenerator);
      room.addUser({ userId: 0 });
      should(room.getUsers().length).to.eq(1);
    });

    it('should throw an exception if trying to add the user who is already in the room', function() {
      var room = new Room(fakeColorGenerator);
      should(function() {
        room.addUser({ userId: 0 });
      }).to.not.throw(Error);
      should(function() {
        room.addUser({ userId: 0 });
      }).to.throw(Error);
    });

    it('at the user added to the room must be some color', function() {
      var room = new Room(fakeColorGenerator);
      room.addUser({ userId: 0 });
      should(false, room.getUsers()[0].userColor).to.exist;
    });

  });


  describe('removeUser', function() {

    it('should remove the user', function() {
      var room = new Room(fakeColorGenerator);
      room.addUser({ userId: 0 });
      room.removeUser(0);
      should(room.getUsers().length).to.be.empty;
    });

    it('should return true/false if the user you want to delete, there is a room/no in room', function() {
      var room = new Room(fakeColorGenerator);
      room.addUser({ userId: 0 });
      should(room.removeUser(0)).to.be.true;
      should(room.removeUser(1)).to.be.false;
    });

  });


  describe('getUsers', function() {

    it('change the returned array should not affect the users in the room', function() {
      var room = new Room(fakeColorGenerator);
      room.addUser({ userId: 0 });
      room.getUsers().push(42);
      should(room.getUsers().length).to.eq(1);
    });

  });

});
