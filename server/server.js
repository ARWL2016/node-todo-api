var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // sets Mongoose to use built-in JS promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String 
    }, 
    completed: {
        type: Boolean
    },
    completedAt: {
        type: String
    }
});

var newTodo = new Todo({
    text: 'Cook dinner'
});

newTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Unable to save todo');
});


var anotherTodo = new Todo({
    text: 'Take a crap', 
    completed: true, 
    completedAt: new Date()
}); 

anotherTodo.save().then((doc) => {
     console.log('Saved todo', doc);
    }, (e) => {
        console.log('Unable to save todo');
});