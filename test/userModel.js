'use strict';

var should = require('chai').expect;
var userModel = require('../server/models/user.js');
var mongoose = require('mongoose');
var db;

describe('UserModel', function() {

  before(function() {
    mongoose.connect('mongodb://localhost/meepoTest');
    db = mongoose.connection;
  });

  after(function() {
    db.close();
  });
});
