const {SHA256, SHA512, md5} = require('crypto-js');
const jwt = require('jsonwebtoken'); 

var data = {
  id: 10
};

var token = jwt.sign(data, 'abc123'); 
console.log(token); 

var decoded = jwt.verify(token, 'abc123'); 
console.log('decoded', decoded); 


// var message = 'I am user number 10'; 
// var hash = SHA256(message).toString(); 
// var hash2 = SHA512(message).toString(); 

// console.log(`message`);
// console.log(hash2);

// var data = {
//   id: 4
// }; 
// // a token consists of a user id + a hashed version of that id 
// // this prevents the user manipulating the id to access other data
// var token = {
//   data, 
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString() // converts object to hashed string
// }

// // Client attempts to manipulate data
// token.data.id; 
// token.hash = SHA256(JSON.stringify(token.data)).toString(); 

// // check the returning token
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString(); 

// // validate 
// if (resultHash === token.hash) {
//   console.log('Data unchanged'); 
// } else {
//   console.log('data changed - do not trust');
// }