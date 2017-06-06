const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID(); 
const userTwoId = new ObjectID();
const users = [{
  // use ObjectID to create an ID manually 
  _id: userOneId,
  email: 'a@example.com', 
  password: 'userOnePass', 
  tokens: [{
    access: 'auth', 
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId, 
  email: 'b@example.com', 
  password: 'userTwoPass', 
  tokens: [{
    access: 'auth', 
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

//dummy database data
const todos = [{
    _id: new ObjectID(), //generated here so we can access it in the test
    text: 'first test todo', 
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'second test todo', 
    completed: true, 
    completedAt: 333, 
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(function() {
        return Todo.insertMany(todos); //creates dummy collection
    }).then(function(){
        done();
    }); 
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // use save to run the middleware and hash the passwords
    var userOne = new User(users[0]).save(); 
    var userTwo = new User(users[1]).save(); 

    // wait until all promises are resolved and call then
    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

module.exports = { todos, populateTodos, users, populateUsers };