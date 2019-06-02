var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

// use port 3000 unless there exists a preconfigured port
var port = process.env.port || 3000;

app.get("/", function(req, res){
    res.render("home");
});

app.get("/fallinlovewith/:thing", function(req, res){
    var thing = req.params.thing;
    res.render("love", {thingVar: thing});
});

app.get("/posts", function(req, res){
    var posts = [
        {title: "Post 1", author: "Susie"},
        {title: "Post 2", author: "Andre"},
        {title: "Post 3", author: "Jorge"},
        {title: "Post 4", author: "Minh"},
        {title: "Post 5", author: "Nhat"}
    ];

    res.render("posts", {posts: posts});
});

app.listen(port, function(){       
    console.log("Server is listening at port: " + port);
});
