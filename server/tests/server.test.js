const expect = require('expect');
const request = require('supertest'); 
const {ObjectID} = require('mongodb'); 

const {app} = require('./../server');
const {Todo} = require('./../models/todo'); 
const {User} = require('./../models/user'); 
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) =>{
        var text = 'test todo text';

        request(app) //http request test by SUPERTEST
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(function(res) {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done); 
    });
});

describe('GET /todos/:id', function(){
    it('should get a todo doc', function(done) {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done); 
    });

    it('should return 404 for non-object ids', function(done) {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString(); 

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString(); 
        var text = 'updated text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true, 
                text    
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number'); 
            })
            .end(done); 
    }); 

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString(); 
        var text = 'updated text 2';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false, 
                text    
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist(); 
            })
            .end(done); 
    });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'c@example.com'; 
    var password = '123sdf';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist(); 
        expect(res.body._id).toExist(); 
        expect(res.body.email).toBe(email); 
      })
      .end((err) => {
        if (err) {
          return done(err); 
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done(); 
        })
      }); 
      
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'v', 
        password: 'x'
      })
      .expect(400)
      .end(done);

  });

  it('should not create a user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email, 
        password: 'jgadsf'
      })
      .expect(400)
      .end(done);

  });
});