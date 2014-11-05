module.exports = function(connection) {
  'use strict';

  var $ = require('jquery');
  var ace = require('brace');
  require('brace/mode/javascript');
  require('brace/theme/solarized_dark');
  require('../../js/share/share');
  require('../../js/share/ace');
  var Range = ace.acequire('ace/range').Range;
  var editor;
  var cursorMarkers = {};
  var sbPosition = $('#statusbar__position');

  function init() {
    editor = ace.edit('ace-editor');

    editor.setTheme('ace/theme/solarized_dark');
    editor.getSession().setMode('ace/mode/javascript');

    editor.setReadOnly(true);
    var docName = document.location.hash.slice(1);

    sharejs.open(docName, 'text', function(error, doc) {
      if (error) {
        console.error(error);
        return;
      }

      if (doc.created) {
        doc.insert(0, '(function() {\n  console.log(\'Hello, wolrd!\');\n})();\n');
      }
      doc.attach_ace(editor);
      editor.setReadOnly(false);
    });

    editor.getSession().selection.on('changeCursor', updateCursorPosition);
  }

  function updateCursorMarker(data) {
    if (connection.socket.id === data.userId) {
      return true;
    }

    removeMarker(data);

    var range = new Range(data.cursor.row, data.cursor.column, data.cursor.row, data.cursor.column + 1);

    var markerId = editor.session.addMarker(range, 'ace_selection', drawMarker, false);
    cursorMarkers[data.userId] = {
      markerId: markerId,
      cursor: data.cursor
    };

    function drawMarker(stringBuilder, range, left, top, config) {
      var color = 'background-color: ' + data.userColor + ';';
      var namePosTop = top - config.lineHeight + 1;
      namePosTop = (namePosTop >= 0) ? namePosTop : 0;

      stringBuilder.push('<div class="ace_selection ace_marker_caret" style="',
        'left:', left, 'px;', 'top:', top, 'px;',
        'height:', config.lineHeight, 'px;',
        color,
      '"></div>');

      stringBuilder.push('<div class="ace_selection ace_marker_top" style="',
        'left:', left, 'px;', 'top:', top, 'px;',
        color,
      '"></div>');

      stringBuilder.push('<div class="ace_selection ace_marker_showname" style="',
        'left:', left, 'px;', 'top:', top, 'px;',
        color,
      '"></div>');

      stringBuilder.push('<div class="ace_selection ace_marker_name" style="',
        'left:', left, 'px;', 'top:', namePosTop, 'px;',
        color,
      '">', data.userName, '</div>');
    }
  }

  function removeMarker(data) {
    if (cursorMarkers.hasOwnProperty(data.userId)) {
      editor.session.removeMarker(cursorMarkers[data.userId].markerId);
    }
  }

  function updateCursorPosition() {
    var cursorPosition = editor.getCursorPosition();

    sbPosition.text('Line: ' + (cursorPosition.row + 1).toString() +
     ', Column: ' + (cursorPosition.column + 1).toString());

    connection.sendMarker(cursorPosition);
  }

  return {
    init: init,
    updateCursorMarker: updateCursorMarker,
    removeMarker: removeMarker
  };
};
