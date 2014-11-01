module.exports = function() {
  'use strict';

  var $ = require('jquery');
  var ace = require('brace');
  require('brace/mode/javascript');
  require('brace/theme/solarized_dark');

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
  }

  editor.on('change', function(e) {
    console.log(e);
  });

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
