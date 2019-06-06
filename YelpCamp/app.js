var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    Campground  = require("./models/campground.js"),
    Comment     = require("./models/comment.js")
    seedDb      = require("./seed.js");

//seedDb();
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Campground.create(
//     {
//         name: "Sunset Canyon",
//         image: "https://images.unsplash.com/photo-1558837655-96260255edaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
//         description: "Fusce venenatis nunc molestie, vehicula risus vel, varius lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut venenatis varius erat, quis ornare lacus. Quisque at purus sit amet ex faucibus faucibus. Integer fringilla purus et odio tempus, non egestas nunc commodo. Curabitur eleifend consectetur turpis in scelerisque. Vivamus viverra feugiat laoreet. Vivamus ornare ultrices elementum. Nullam tincidunt vehicula ante eget mattis. Aenean a elit ac turpis sodales volutpat at dignissim enim. Nam sagittis pharetra mi, quis faucibus tellus placerat eu. Etiam volutpat sem lacus, sed porttitor mi gravida vitae."
//     }, 
//     function(err, campground)
//     {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("new campground created");
//             console.log(campground);
//         }
//     });

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){    
    // get from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
    
});

// CREATE - create new campground
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    var newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });

});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/newCampground");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//COMMENT ROUTES
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("comments/new", {campground: foundCampground});
        }
    });    
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            
            Comment.create(req.body.comment, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(newlyCreated);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    
});

var port = process.env.Port || 3000;

app.listen(port, function(){
    console.log("Server is listening....");
})