const expect = require('expect');
const request = require('supertest'); 

const {app} = require('./../server');
const {Todo} = require('./../models/todo'); 

//dummy database data
const todos = [{
    text: 'first test todo'
}, {
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