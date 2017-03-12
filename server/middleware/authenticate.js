var {User} = require('./../models/user'); 

// middleware function for private routes 
var authenticate = (req, res, next) => {
    var token = req.header('x-auth'); 

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject(); // goto catch
        }

        req.user = user; 
        req.token = token; 
        next(); 
    }).catch((e) => {
        res.status(401).send(); 
    });
}; 

module.exports = {authenticate}