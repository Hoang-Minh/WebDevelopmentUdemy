var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app", {useNewUrlParser: true, useFindAndModify: false});

app.use(require("express-session")({
    secret: "I am Minh",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========================
//ROUTES
//========================
app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn ,function(req, res){
    res.render("secret");
});

//Autho Routes
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    // console.log(req.body.user);
    // res.send("This is a post register");
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });

});

//Login Routes
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Server is listen");
});