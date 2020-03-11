var bodyParser = require("body-parser");
var express=require("express");
var logger=require("morgan");
var mongoose=require('mongoose');
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var validator = require("express-validator");
var MongoStore = require("connect-mongo")(session);

var app=express();

// Cart
// User Sign IN
// Search
// Sort
// Payment Gateway





app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(validator());

app.use(logger("dev"));
app.use(session({
    secret: 'Randon stuff', 
    resave : false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 *1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
})

mongoose.connect('mongodb://localhost:27017/rainbow', {useNewUrlParser: true,useUnifiedTopology: true});
require('./config/passport');

var user=require('./routes/user.js');
var admin=require('./routes/admin.js');


app.use('/',user);
app.use('/admin',admin);


app.listen(3000,function(){
    console.log('server started');
});