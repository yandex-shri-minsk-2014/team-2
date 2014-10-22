var colors = [
  '#d41730', '#69e019', '#2b3054', '#7a0d39', '#7a650d', '#3e6e7a', '#2e0515', '#eda71a', '#54512b', '#e0199e',
  '#6e400c', '#e0ad72', '#b819e0', '#c75d16', '#ad6f58', '#4f0f87', '#6e190c', '#ba849a', '#1a36ed', '#120e2e',
  '#b2a8ed', '#165dc7', '#3aba7e', '#96b7d4', '#199ee0', '#3c7a26', '#7bad9d', '#14afba', '#bec73e', '#d4d096',
  '#06373b', '#3b1d12', '#543f3c', '#09543b', '#ed7988', '#052e0a', '#6e3863'
];

var getColor = function(room) {
  if (room.colors) {
    return room.colors.pop();
  } else {
    var randColor = colors[Math.round(Math.random() * 37)];
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(randColor);
    var r = Math.round((parseInt(result[1], 16) + Math.random() * 255) / 2);
    var g = Math.round((parseInt(result[2], 16) + Math.random() * 255) / 2);
    var b = Math.round((parseInt(result[3], 16) + Math.random() * 255) / 2);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
};

module.exports.colors = colors;
module.exports.getColor = getColor;
