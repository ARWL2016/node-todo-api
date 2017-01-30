const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo').Todo; 
const User = require('./../server/models/user').User; 

// var id = '588ebf6f3a65aaa00210843911';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({ //returns an array
//     _id: id //mongoose converts strings to objectsIDs
// }).then(function(todos) {
//     console.log('Todos', todos);
// });

// Todo.findOne({ //returns an object
//     _id: id 
// }).then(function(todo) {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then(function(todo) {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by ID', todo);
// }).catch(function(e) {
//     console.log(e);
// });

var id = '588e925d7104480025ff43ca';

//this validation method must be require from mongodb
if (!ObjectID.isValid(id)) { 
    console.log('ID not valid');
}

User.findById(id).then(function(user) {
    if(!user) {
        return console.log('User not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch(function(e) {
    console.log(e);
});