
var env = process.env.NODE_ENV || 'development'; //test || dev 
console.log('env ***', env);

if (env === 'development') {
    process.env.PORT = 3000; 
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'; 
    process.env.MLAB_URI = 'mongodb://arwl:87654321@ds163181.mlab.com:63181/mead-todo'
} else if (env === 'test') {
    process.env.PORT = 3000; 
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}