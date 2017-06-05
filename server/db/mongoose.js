var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // sets Mongoose to use built-in JS promises
mongoose.connect(process.env.MLAB_URI);

module.exports = {mongoose}; 