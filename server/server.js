var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb'); 

var {mongoose} = require('./db/mongoose'); 
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express(); 

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






app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app}; 