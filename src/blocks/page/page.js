'use strict';

require('../../js/voiceCommander');
var connection = require('../../js/connection');
var guard = require('./guard');
var me = require('../../js/me');

var editor = require('../editor/editor')('ace');

editor.init();
getUserName();

function getUserName() {
  var userName = me.name() || guard.askTheName();
  connection.verifyUserName(userName, function(ans) {
    if (!ans) {
      getUserName();
    } else {
      me.name(userName);
      connection.connect(userName);
    }
  });
}
