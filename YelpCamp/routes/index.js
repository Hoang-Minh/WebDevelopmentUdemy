var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

// root route
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle signup logic
router.post("/register", function(req, res){    
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emmail,
        avatar: req.body.avatar,
        isAdmin: req.body.adminCode === process.env.ADMIN_CODE
    });
    

    User.register(newUser, req.body.password, function(err, user){
        if(err || !user){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle login  logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) , function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

router.get("/forgot", function(req, res){
    res.render("forgot");
});

router.post("/forgot", function(req, res){
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString("hex");
                done(err, token);
            });
        },
        function(token, done){
            User.findOne({email: req.body.email}, function(err, user){
                if(!user){
                    req.flash("error", "No account associated with that email !!!");
                    return res.redirect("/forot");
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1hr

                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "taolaobidaomail@gmail.com",
                    pass: process.env.GMAILPW
                }
            });

            var mailOptions = {
                to: user.email,
                from: "taolaobidaomail@gmail.com",
                subject: "YelpCamp Password Reset",
                text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                "http://' + req.headers.host + '/reset/' + token + '\n\n" +
                "If you did not request this, please ignore this email and your password will remain unchanged.\n"
            };

            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
              });
        }
    ], function(err){
        if(err) return next(err);
        res.redirect("/forgot");
    });
});

module.exports = router;