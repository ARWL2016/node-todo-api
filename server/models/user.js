const mongoose = require('mongoose');
const validator = require('validator'); 
const jwt = require('jsonwebtoken');
const _ = require('lodash'); 

var UserSchema  = new mongoose.Schema({
    email: {
        required: true, 
        trim: true, 
        type: String, 
        minlength: 1, 
        unique: true, // cannot have two users with same email
        validate: {
            validator: validator.isEmail, //returns true is email value is valid
            message: '{VALUE} is not a valid email'
        }
    }, 
    password: {
        type: String, 
        required: true, 
        minlength: 6
    }, 
    tokens: [{
        access: {
            type: String, 
            required: true
        }, 
        token: {
            type: String, 
            required: true
        }
    }]
}); 

// this method limits what is sent back to the user from the post req. 
// This is overriding a mongoose method
UserSchema.methods.toJSON = function () {
    var user = this; 
    var userObject = user.toObject(); 

    return _.pick(userObject, ['_id', 'email']); 
}

// instance methods (don't use an arrow func here)
UserSchema.methods.generateAuthToken = function () {
    var user = this; 
    var access = 'auth'; 
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); 

    user.tokens.push({access, token}); 

    return user.save().then(() => {
        return token; 
    });
    // here we return a promise so the server can call then() with the success value of token
}; 

var User = mongoose.model('User', UserSchema);

module.exports = {User};