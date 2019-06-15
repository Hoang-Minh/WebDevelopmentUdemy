var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res){    
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
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;

    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "A new campground cannot be created");
            console.log(err);
        } else {
            req.flash("success", "A new campground has been created");
            res.redirect("/campgrounds");
        }
    });

});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/newCampground");
});

//SHOW - show more info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Cannot find campground");
            console.log("Edit Campground error: " + err);
        }        
        res.render("campgrounds/edit", {campground: foundCampground});
    });
        
});

//Update Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Cannot find campground");
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Campground has been updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log("Delete route: " + err);
            req.flash("error", "Cannot find campground");            
            res.redirect("/campgrounds");
        } else {
            campground.remove();
            req.flash("success", "Campground has been deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;