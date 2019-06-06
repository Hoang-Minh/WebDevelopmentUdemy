var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");


var data = [
    {
        name: "Silent Hill", 
        image: "https://images.unsplash.com/photo-1484886738597-d2e20a5320e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80", 
        description: "Falling Leaves"
    },
    {
        name: "Grand Canyon", 
        image: "https://images.unsplash.com/photo-1487750404521-0bc4682c48c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80", 
        description: "Fire Pit"
    },
    {
        name: "Irvine Trail", 
        image: "https://images.unsplash.com/photo-1466220549276-aef9ce186540?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80", 
        description: "BBQ Place"
    }
];

function seedDb(){
    // remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("campgrounds removed");

            // add a new campground
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Add campground");
                        //Create a comment
                        Comment.create({
                            text: "This place is great",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                console.log(comment);
                                campground.comments.push(comment);
                                campground.save(function(err){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log("'comment is added");
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDb;