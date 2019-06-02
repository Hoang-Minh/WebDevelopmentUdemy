var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
var port = process.env.port || 3000;
var friends = ["Tony", "Amanda", "Justin", "Andre"];

app.get("/", function(req, res){
    res.render("home");
});

app.post("/addfriend", function(req, res){
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    res.redirect("/friends");
});

app.get("/friends", function(req, res){
    
    res.render("friends", {friends: friends});
});



app.listen(port, function(){
    console.log("Server is listening");
});