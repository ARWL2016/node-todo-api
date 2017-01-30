var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // sets Mongoose to use built-in JS promises
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose}