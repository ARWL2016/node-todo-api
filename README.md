### Complete Node Developer's Course - Node Todo API (Udemy: Mead, Section 7)

https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/content  
https://github.com/ARWL2016/node-todo-app 
https://gentle-caverns-89208.herokuapp.com/  
  
#### Featured Libraries  
- Express 4.14.0  
- Mongodb / Mongoose   
- Mocha / Expect / Supertest  
- Robomongo
- Postman  
- body-parser   
- Heroku     
- Lodash

#### Mongo Database Startup
Navigate to C:\Program Files\MongoDB\Server\3.4\bin> or set this path in environment variables and run in separate command lines:
1. `mongod.exe --dbpath /Users/Alistair/mongo-data`| `npm run mongod`
2. `mongo.exe`

#### Mongoose Setup 
1. In *db/mongoose.js*, connect to the mongodb server. Set promises to use JS built ins. For deployment, we can define a databse URI on the process.env object.  
2. Create a model for each collection and define the documents. The model() method returns an object with which we can write to the collection and create a new document. 
3. Inside the routes in *server.js* we can define the API 

#### Dynamic URLs 
1. Use `app.get('/path/:id')` to collect a parameter
2. Use `req.params.id` to reference it

#### Body Parsing 
- By default, the req.body object is undefined. 
- Use body parsing middleware such as body-parser or multer (for forms) 
- for application/json (ie in most cases) use body-parser.json(). 

#### Postman 
1. Save requests for convenient testing 
2. Set up local and web host environments with a variable url switch 

#### Notes
After adding the config.js file - which should set process.env.MONGODB_URI and the PORT to different values for testing and development, the app does not run in Heroku. The error message includes: 
`failed to connect to server [localhost:27017] on first connect` and 
`Started on port 3000`
which seems to indicate a local start?? 
- github repo was renamed - try recreating heroku app 
- breaking changes occurred after lecture 86
- also check npm log
