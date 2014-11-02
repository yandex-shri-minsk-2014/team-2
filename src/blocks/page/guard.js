'use strict';

var Faker = require('Faker');

module.exports = function() {

  var ENTER_NAME = 'Введите имя:';
  var INVALID_NAME = 'Введено имя, которое уже используется, введите другое';

  var countQuestions = 0;

  function askTheName() {
    countQuestions++;
    var name = window.prompt(countQuestions === 1 ? ENTER_NAME : INVALID_NAME);
    return name || Faker.Internet.userName();
  }

  return {
    askTheName: askTheName
  };

};
