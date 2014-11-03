module.exports = function() {
  'use strict';

  var $ = require('jquery');
  var ace = require('brace');
  require('brace/mode/javascript');
  require('brace/theme/solarized_dark');
  require('../../js/share/share');
  require('../../js/share/ace');
  var sbPosition = $('#statusbar__position');
  var setting = {
    editor: 'ace-editor',
    useSoftTabs: '#useSoftTabs',
    setShowGutter: '#setShowGutter',
    setUseWrapMode: '#setUseWrapMode',
    setShowPrintMargin: '#setShowPrintMargin',
    setHighlightActiveLine: '#setHighlightActiveLine',
    setShowInvisibles: '#setShowInvisibles',
    setTabSize: '#setTabSize',
    setFontSize: '#setFontSize'
  };
  var editor = ace.edit(setting.editor);

  function init() {
    editor.setTheme('ace/theme/solarized_dark');

    editor.getSession().setMode('ace/mode/javascript');

    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);

    editor.setShowPrintMargin(true);
    editor.setShowInvisibles(true);

    editor.focus();
    editor.gotoLine(1, 5);

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

    Range = ace.acequire('ace/range').Range;
    console.log(Range);
    console.log(new Range(1, 2, 3, 4));
    var msg = {
      cursor: {
        row: 1,
        column: 5
      }
    };
    var range = new Range(msg.cursor.row, msg.cursor.column, msg.cursor.row, msg.cursor.column + 1);
    var markerId = editor.session.addMarker(range, "ace_selection", drawMarker, false);
    function drawMarker(stringBuilder, range, left, top, config) {
        console.log(stringBuilder, range, left, top, config);
        var color = "background-color: blue";
        stringBuilder.push("<div class='ace_selection' style='", "left:", left, "px;", "top:", top + 2, "px;", "height: 15px;", "width:", 2, "px;", color || "", "'></div>", "<div class='ace_selection' style='", "left:", left - 2, "px;", "top:", top, "px;", "height:", 5, "px;", "width:", 6, "px;", color || "", "'></div>");
      }

  }

  editor.getSession().selection.on('changeCursor', updateStatusBarPosition);

  function updateStatusBarPosition() {
    var cursorPosition = editor.getCursorPosition();

    sbPosition.text('Line: ' + (cursorPosition.row + 1).toString() +
     ', Column: ' + (cursorPosition.column + 1).toString());
  }

  $(setting.useSoftTabs).change(function() {
    editor.getSession().setUseSoftTabs(this.checked);
  });

  $(setting.setShowGutter).change(function() {
    editor.renderer.setShowGutter(this.checked);
  });

  $(setting.setUseWrapMode).change(function() {
    editor.getSession().setUseWrapMode(this.checked);
  });

  $(setting.setShowPrintMargin).change(function() {
    editor.setShowPrintMargin(this.checked);
  });

  $(setting.setHighlightActiveLine).change(function() {
    editor.setHighlightActiveLine(this.checked);
  });

  $(setting.setShowInvisibles).change(function() {
    editor.setShowInvisibles(this.checked);
  });

  $(setting.setTabSize).change(function() {
    editor.getSession().setTabSize(this.value);
  });

  $(setting.setFontSize).change(function() {
    $('#' + setting.editor).css('font-size', this.value);
  });


  return {
    init: init
  };
};
