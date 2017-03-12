####Useful Links  
http://mongoosejs.com/docs/validation.html 
https://jwt.io/ 

####General Notes 
- token authorization is available in MongoDB but not in SQL databases
- **hashing**:  This process uses a one way algo so that the same input always produces the same output string, but the input cannot be calculated from the output.  
- **salting** - adding a secret value to an id before hashing. This prevents the user from performing their own hashing operation.  

####Jsonwebtoken (library)
- `jwtsign` - transforms a user object into a hashed token  
- `jwtverify` - verifies a token 