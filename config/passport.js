var passport = require("passport");
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id);

});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err,user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req, email, password, done){
    User.findOne({'email':email},function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use. Please try with another email or try to login.'})
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.address = req.body.address;
        newUser.name = req.body.name;
        newUser.number = req.body.number;
        // newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    // req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    // req,checkBody('password', 'Invalid Passport').notEmpty();
    // var error = req.validationErrors();
    // if(errors){
    //     var messages = [];
    //     error.forEach(function(error){
    //         messages.push(error.msg);
    //     });
    //     return done(null, false, req,flash('error', messages));

    // }
    User.findOne({'email':email},function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'User not found. Please check the Email or try to Sign Up.'});
        }
        if(!(user.password==password)){
            console.log(password);
            return done(null, false, {message: 'Password is incorrect.'});
            
        }
        console.log(!(user.password==password));

        return done(null ,user);
    });
}));