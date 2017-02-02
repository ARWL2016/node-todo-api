const expect = require('expect');
const request = require('supertest'); 
const {ObjectID} = require('mongodb'); 

const {app} = require('./../server');
const {Todo} = require('./../models/todo'); 

//dummy database data
const todos = [{
    _id: new ObjectID(), //generated here so we can access it in the test
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(function() {
        return Todo.insertMany(todos); //creates dummy collection
    }).then(function(){
        done();
    }); 
});

describe('POST /todos', () => {
    it('should create a new todo', (done) =>{
        var text = 'test todo text';

        request(app) //http request test by SUPERTEST
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => { //find now ignore the dummy data
                    expect(todos.length).toBe(1); 
                    expect(todos[0].text).toBe(text); 
                    done();                 
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2); 
                done();
            }).catch((e) => done(e)); 
        });

    });
});//describe1 

describe('GET /todos', function() {
    it('should get all todos', function(done) {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(function(res) {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done); 
    });
});

describe('GET /todos/:id', function(){
    it('should get a todo doc', function(done) {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(function(res) {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done); 
    });

    it('should return 404 if todo not found', function(done) {
        var hexId = new ObjectID().toHexString; 
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done); 
    });

    it('should return 404 for non-object ids', function(done) {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString(); 

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId); 
            })
            .end((err, res) => {
                if (err) {
                    return done(err); 
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist(); 
                    done(); 
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString; 

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done); 
    });

    it('should return 404 if object id is invalid', (done) => {
        var hexId = new ObjectID().toHexString; 
        
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done); 
    })
});