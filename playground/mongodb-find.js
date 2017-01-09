// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('587212ef8005792e6c35d7d8')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
        
    // }), (err) => {
    //     console.log('Unable to fetch todos', err);
    // }

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }), (err) => {
    //     console.log('Unable to fetch todos', err);
    // }
  

    db.collection('Users').find({name: 'John'}).toArray().then((docs) => {
        console.log('Search of users returned the following records:');
        console.log(JSON.stringify(docs, undefined, 2));
    }), (err) => {
            console.log('Unable to find record(s)');
    };

    // db.close(); 

}); //mongoconnect