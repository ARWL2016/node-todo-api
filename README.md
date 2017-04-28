### Complete Node Developer's Course - Node Todo API (Udemy: Mead, Section 7)

https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/content  
https://github.com/ARWL2016/node-todo-app 
  
#### Featured Libraries  
- Express 4.14.0  
- mongodb / mongoose   
- Mocha / Expect / Supertest  
- body-parser   
- git / heroku   
- ES6 promises  

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