module.exports = function() {
  'use strict';

  var editor = ace.edit('ace-editor');
  var sbPosition = document.querySelector('#statusbar__position');

  function init() {
    editor.setTheme('ace/theme/solarized_dark');

    editor.getSession().setMode('ace/mode/javascript');

    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);

    editor.setShowPrintMargin(true);
    editor.setShowInvisibles(true);

    editor.focus();
    editor.gotoLine(1, 5);
  }

  editor.on('change', function(e) {  });

  editor.getSession().selection.on('changeCursor', updateStatusBarPosition);

  function updateStatusBarPosition(data) {
    var cursorPosition = editor.getCursorPosition();

    sbPosition.innerHTML = 'Line: ' + (cursorPosition.row + 1).toString() +
     ', Column: ' + (cursorPosition.column + 1).toString();
  }

  return {
    init: init
  };
};
