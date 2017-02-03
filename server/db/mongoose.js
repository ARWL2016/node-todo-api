var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // sets Mongoose to use built-in JS promises
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose}