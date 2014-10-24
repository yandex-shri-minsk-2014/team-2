'use strict';

var colors = [
  '#8a0606', '#f5870a', '#035439', '#0960e3', '#782367', '#ad5e5e', '#423824', '#0af5c6', '#5e68ad', '#f547a4',
  '#e30909', '#8a7d4a', '#32ada5', '#0909e3', '#780533', '#f5a284', '#bfb308', '#033e42', '#0b0342', '#f50a48',
  '#421c03', '#395403', '#0ac6f5', '#420578', '#9c682d', '#8ed108', '#0776ad', '#ad42e3', '#f5c084', '#37bf5c',
  '#375066', '#42243c'
];

module.exports = function() {
  var availableColors = colors.slice();

  var getColor = function() {
    if (availableColors.length) {
      return availableColors.pop();
    } else {
      var randColor = colors[Math.round(Math.random() * 37)];
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(randColor);
      var r = Math.round((parseInt(result[1], 16) + Math.random() * 255) / 2);
      var g = Math.round((parseInt(result[2], 16) + Math.random() * 255) / 2);
      var b = Math.round((parseInt(result[3], 16) + Math.random() * 255) / 2);
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  };

  var restoreColor = function(color) {
    availableColors.push(color);
  };

  return {
    getColor: getColor,
    restoreColor: restoreColor
  };
};
