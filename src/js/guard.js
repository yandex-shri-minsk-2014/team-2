module.exports = function() {
  'use strict';

  var ENTER_NAME = 'Введите имя:';
  var INVALID_NAME = 'Введено имя, которое уже используется, введите другое';

  var countQuestions = 0;

  function askTheName() {
    countQuestions++;
    var name = window.prompt(countQuestions === 1 ? ENTER_NAME : INVALID_NAME);
    while (!name) {
      name = window.prompt(ENTER_NAME);
    }
    return name;
  }

  return {
    askTheName: askTheName
  };

};
