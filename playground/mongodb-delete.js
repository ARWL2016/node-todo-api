// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
        console.log(result);
    });

    db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
        console.log(result.result);
    });

    db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log(result);
    });
    
    var id = new ObjectID("587214740dbeaf20c841a1cf"); 
    db.collection('Users').findOneAndDelete({_id: id}).then((result) => {
        console.log(result);
    });


    // db.close();
}); //mongoconnect