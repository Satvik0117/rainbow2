var express=require("express");
var app=express();
var bodyParser = require("body-parser");
var logger=require("morgan");
var mongoose=require('mongoose');

app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger("dev"));

mongoose.connect('mongodb://localhost:27017/rainbow', {useNewUrlParser: true});

var user=require('./routes/user.js');
var admin=require('./routes/admin.js');


app.use('/',user);
app.use('/admin',admin);


app.listen(3000,function(){
    console.log('server started');
});