
var env = process.env.NODE_ENV || 'development'; //test || dev 
console.log('PROCESS.ENV: ', env);

if (env === 'development' || env === 'test') {
  // require statement automatically parses JSON to POJO
  var config = require('./config.json');

  // use bracket notation when using a variable as a property
  var envConfig = config[env];

  // Object.keys returns an array of the object's keys
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]; 
  });

}


// if (env === 'development') {
//     process.env.PORT = 3000; 
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'; 
// } else if (env === 'test') {
//     process.env.PORT = 3000; 
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }