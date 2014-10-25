module.exports = function() {
  'use strict';

  var editor = ace.edit('ace-editor');
  var sbLine = document.getElementById('statusbar__line');
  var sbColumn = document.getElementById('statusbar__column');

  editor.setTheme('ace/theme/solarized_dark');

  editor.getSession().setMode('ace/mode/javascript');
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setUseWrapMode(true);

  editor.setShowPrintMargin(true);
  editor.setShowInvisibles(true);

  editor.on('change', function(e) {
    // console.log(e);
  });
  editor.getSession().selection.on('changeCursor', function(e) {
    sbLine.innerHTML = editor.getCursorPosition().row + 1;
    sbColumn.innerHTML = editor.getCursorPosition().column + 1;
    console.log(editor.getCursorPosition());
  })
};
