const mongoose = require('mongoose');
const validator = require('validator'); 
const jwt = require('jsonwebtoken');
const _ = require('lodash'); 
const bcrypt = require('bcryptjs');

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
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString(); 

    user.tokens.push({access, token}); 

    return user.save().then(() => {
        return token; 
    });
    // here we return a promise so the server can call then() with the success value of token
}; 

UserSchema.methods.removeToken = function (token) {
  var user = this; 

  // return this mongo call so we can chain then() to the function call
  return user.update({
    // pull removes items from an array that match the criteria
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

// statics is similar to methods but creates MODEL methods, NOT INSTANCE METHODS
UserSchema.statics.findByToken = function (token) {
    var User = this; 
    var decoded; 

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (e) {
        return Promise.reject(); // triggers catch on findByToken
    }
    
    // returning here allows us to chain then() onto findByToken
    // quotes are required to access nested values (and id just for consistency)
    return User.findOne({
        '_id': decoded._id, 
        'tokens.token': token, 
        'tokens.access': 'auth'
    }) 
}; 

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this; 

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject(); 
    }
    
    // bcrypt uses callback, so we need to wrap the bcrypt function in our own promise 
    // but since 2.4 can use promises
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user); 
        } else {
          reject(); 
        }
      });
    })


  });
};

UserSchema.pre('save', function(next) {
  var user = this; 

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash; 
        next();
      });
    });
  } else {
    next(); 
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User};