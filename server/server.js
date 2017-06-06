require('./config/config');

const _ = require('lodash'); 
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); 

var {mongoose} = require('./db/mongoose'); 
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate'); 

var app = express(); 
const port = process.env.PORT; 

app.use(bodyParser.json()); 

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text, 
        _creator: req.user._id
    }); 

    todo.save().then((doc) => {
        res.send(doc); 
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, function(req, res) {
    Todo.find({
      _creator: req.user._id
    }).then(function(todos) {
        res.send({todos}); 
    }, function(e) {
        res.status(400).send(e); 
    });
}); //get

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id; 

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid ID'); 
    }

    Todo.findOne({
      _id: id, 
      _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send('todo not found');
        } 

        res.send({todo});     
    }).catch((e) => {
        res.status(400).send(); 
    })
}); 

app.delete('/todos/:id', authenticate, function(req, res) {
    var id = req.params.id; 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send(); //must send to initiate response 
    }

    Todo.findOneRemove({
      _id: id, 
      _creator: req.user._id
    }).then(function(todo){
        if(!todo) {
            return res.status(404).send(); 
        }
        res.send({todo}); 

    }).catch(function(e){
        res.status(400).send(); 
    })
}); 

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id; 
    var body = _.pick(req.body, ['text', 'completed']); //the pick method selects only certain items from an object - here, we only want the user to be able to change these picked properties

    if(!ObjectID.isValid(id)) {
        return res.status(404).send(); 
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); 
    } else {
        body.completed = false; 
        body.completedAt = null; //removes a value from the db
    }

    //compare following methods with mongodb-update.js (they are native mongo)
    Todo.findOneAndUpdate({
      _id: id, 
      _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send(); 
        }

        res.send({todo}); 
    }).catch((e) => {
        res.status(400).send();
    })
});

// Users routes 
// register new user with unique email
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken(); 

    }).then((token) => {
        res.header('x-auth', token).send(user); // x signifies a custom header
    }).catch((e) => {
        res.status(400).send(e); 
    })
});

// example private route - only for authenticated users 
// me signifies a private route
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user); 
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  
  User.findByCredentials(body.email, body.password).then((user) => {
    // returning the function call keeps the promise chain alive - errors will be caught
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(); 
  });
});

// logout 
app.delete('/users/me/token', authenticate, (req, res) => {
  // user added to req by authenticate 
  req.user.removeToken(req.token).then(() => {
    res.status(200).send(); 
  }, () => {
    res.status(400).send(); 
  });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app}; 