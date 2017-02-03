// require('./config/config');

const _ = require('lodash'); 
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); 

var {mongoose} = require('./db/mongoose'); 
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express(); 
const port = process.env.PORT; 

app.use(bodyParser.json()); 

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text, 
        completed: req.body.completed
    }); 

    todo.save().then((doc) => {
        res.send(doc); 
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', function(req, res) {
    Todo.find().then(function(todos) {
        res.send({todos}); 
    }, function(e) {
        res.status(400).send(e); 
    });
}); //get

app.get('/todos/:id', (req, res) => {
    var id = req.params.id; 

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid ID'); 
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send('todo not found');
        } 

        res.send({todo});     
    }).catch((e) => {
        res.status(400).send(); 
    })
}); 

app.delete('/todos/:id', function(req, res) {
    var id = req.params.id; 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send(); //must send to initiate response 
    }

    Todo.findByIdAndRemove(id).then(function(todo){
        if(!todo) {
            return res.status(404).send(); 
        }
        res.send({todo}); 

    }).catch(function(e){
        res.status(400).send(); 
    })
}); 

app.patch('/todos/:id', (req, res) => {
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
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send(); 
        }

        res.send({todo}); 
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app}; 