'use strict';

var me = require('../../js/me');

module.exports = function(a) {
  var ace = require('brace');
  var Range = ace.acequire('ace/range').Range;
  require('brace/mode/javascript');
  require('brace/theme/solarized_dark');
  require('../../js/share/ace');
  var cursorMarkers = {};

  var editor = ace.edit('editor');

  editor.setTheme('ace/theme/solarized_dark');
  editor.getSession().setMode('ace/mode/javascript');
  editor.setReadOnly(true);

  editor.getSession().selection.on('changeCursor', function() {
    var cursorPosition = editor.getCursorPosition();
    a.updateCursorPosition(cursorPosition);
  });

  function attachToDocument(doc) {
    doc.attach_ace(editor);
    editor.setReadOnly(false);
  }

  function updateCursorMarker(data) {
    if (me.id() === data.userId) {
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

  return {
    attachToDocument: attachToDocument,
    updateCursorMarker: updateCursorMarker,
    removeMarker: removeMarker
  };
};
