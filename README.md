### Complete Node Developer's Course - Node Todo API

https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/content  
https://github.com/ARWL2016/node-todo-app 

- Udemy   
- Andrew Mead   
- Section 7   

####Technology  
- express 4.14.0  
- mongodb / mongoose 
- postman  
- mocha / expect / supertest  
- body-parser   
- git / heroku   
- ES6 promises  
- lodash

####Mongo Database Startup
Navigate to C:\Program Files\MongoDB\Server\3.4\bin> or set this path in environment variables and run in separate command lines:
1. `mongod.exe --dbpath /Users/Alistair/mongo-data`| `npm run mongod`
2. `mongo.exe`

####Mongoose Setup 
1. In *mongoose.js*, connect to the mongodb server (set promises) 
2. Create a model for each collection and define the documents. The model() method returns an object with which we can write to the collection and create a new document.
3. Inside the routes in *server.js* we can define the API 

####Dynamic URLs 
1. Use `app.get('/path/:id')` to collect a parameter
2. Use `req.params.id` to reference it