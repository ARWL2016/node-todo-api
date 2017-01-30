const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo').Todo; 
const User = require('./../server/models/user').User; 

//remove all - get nothing back
// Todo.remove({}).then((result) => {
//     console.log(result); 
// });

Todo.findOneAndRemove({_id: '588f2fd7362d6e98271babee'}).then(function(todo) {
   console.log(todo); 
});

Todo.findByIdAndRemove('588f2fd7362d6e98271babee').then(function (todo) {
    console.log(todo);
});