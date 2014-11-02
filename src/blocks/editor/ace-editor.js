module.exports = function() {
  'use strict';

  var $ = require('jquery');
  var ace = require('brace');
  require('brace/mode/javascript');
  require('brace/theme/solarized_dark');
  require('../../js/share/share');
  require('../../js/share/ace');
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

    var msg = {
      userId: 1,
      cursor: {
        row: 1,
        column: 5
      },
      color: 'blue'
    };
    updateCursorMarker(msg);
  }

  function updateCursorMarker(data) {
    removeMarker(data);

    Range = ace.acequire('ace/range').Range;
    var range = new Range(data.cursor.row, data.cursor.column, data.cursor.row, data.cursor.column + 1);

    var markerId = editor.session.addMarker(range, 'ace_selection', drawMarker, false);
    cursorMarkers[data.userId] = {
      markerId: markerId,
      cursor: data.cursor
    }

    function drawMarker(stringBuilder, range, left, top, config) {
      var color = 'background-color: ' + data.color;
      stringBuilder.push('<div class='ace_selection' style='', 'left:', left, 'px;', 'top:', top + 2, 'px;', 'height: 15px;', 'width:', 2, 'px;', color || '', ''></div>', '<div class='ace_selection' style='', 'left:', left - 2, 'px;', 'top:', top, 'px;', 'height:', 5, 'px;', 'width:', 6, 'px;', color || '', ''></div>');
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

    //send to server
  }

  return {
    init: init,
    updateCursorMarker: updateCursorMarker,
    removeMarker: removeMarker
  }
}
