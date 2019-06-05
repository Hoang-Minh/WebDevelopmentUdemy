var mongoose = require("mongoose");
var Post = require("./models/post.js");
var User = require("./models/user.js");

mongoose.connect("mongodb://localhost/blog_demo", {useNewUrlParser: true, useFindAndModify: false});





// newUser.posts.push({
//     title: "How are you doing ?",
//     content: "I'm fine."
// });

// newUser.save(function(err, user){

//     if(err){
//         console.log(err);
//     }else{
//         console.log(user);
//     }
// });

// var newPost = new Post({
//     title: "Great Post",
//     content: "This is a great post"
// });

// newPost.save(function(err, post){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// });

// User.findOne({name: "Andy Brown"}, function(err, user){
//     if(err){
//         console.log(err);
//     } else {
//         user.posts.push({
//             title: "Another title",
//             content: "Another great content"
//         });

//         user.save(function(err, user){
//             if(err){
//                 console.log(err);
//             } else{
//                 console.log(user);
//             }
//         });
//     }
// });

// var userSchema = mongoose.Schema({
//     email: String,
//     name: String,
//     posts: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Post"
//         }
//     ]
// });

// var User = mongoose.model("User", userSchema);

// User.create({
//     email: "Bob@gmail.com",
//     name: "Bob Belcher"
// }, function(err, user){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(user);
//     }
// });

// Post.create({
//     title: "How to cook p.4",
//     content: "Bla bla bla"
// }, function(err, post){
//     User.findOne({email: "Bob@gmail.com"}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         }else{
//             foundUser.posts.push(post);
//             foundUser.save(function(err, data){
//                 if(err){
//                     console.log(err);
//                 }else{
//                     console.log(data);
//                 }
//             });
//         }
//     });
// });

User.findOne({email: "Bob@gmail.com"}).populate("posts").exec(function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});