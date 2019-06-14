var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    seedDb      = require("./seed.js"),
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index"),
    methodOverride = require("method-override"),
    flash           = require("connect-flash");

//seedDb();
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useFindAndModify: false});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.use(flash());

//Passport configuration
app.use(require("express-session")({
    secret: "I am Minh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.message = req.flash("error");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);

var port = process.env.Port || 3000;

app.listen(port, function(){
    console.log("Server is listening....");
})