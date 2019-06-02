var mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost/cat_app");
mongoose.connect('mongodb://localhost:27017/cat_app', { useNewUrlParser: true });

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// // adding a new cat from db
// var george = new Cat({
//     name: "George",
//     age: 11,
//     temperament: "Grouchy"
// });

// george.save(function(err, cat){
//     if(err){
//         console.log("something went wrong");
//     }else{
//         console.log("just saved a cat to the database");
//         console.log(cat);
//     }
// });

Cat.create({
    name: "Snow",
    age: 11,
    temperament: "Bland"
}, function(err, cat){
    if(err){
        console.log("Error");
        console.log(err);
    }else{
        console.log(cat);
    }
});

//retrieve cats from db
Cat.find({}, function(err, cats){
    if(err){
        console.log("Error");
        console.log(err);
    }else{
        console.log(cats);
    }
});