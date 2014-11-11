'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/meepo');
mongoose.connection.on('error', function(err) {
    console.log('connection error:', err.message);
});

module.exports.mongoose = mongoose;
