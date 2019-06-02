var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");
//mongoose.connect('mongodb://localhost:27017/cat_app', { useNewUrlParser: true });
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundScheme = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundScheme);
// Campground.create(
//     {
//         name: "Silent Hill", 
//         image: "https://www.campsitephotos.com/photo/camp/11630/Lakeshore_East_002.jpg"
//     },    
//     function(err, campground)
//     {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("New campground is created");
//             console.log(campground);
//         }
//     }
// );

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // get from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    })
    
});

app.get("/campgrounds/new", function(req, res){
    res.render("newCampground");
})

var port = process.env.Port || 3000;

app.listen(port, function(){
    console.log("Server is listening");
})