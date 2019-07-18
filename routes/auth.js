var express = require("express");
var router = express.Router();
var passport = require("passport");

//require middleware
var middleware = require("../middleware");

var User = require("../models/user");


//landing page
router.get("/", function(req, res){
    res.render("landing");
});

//++++++++++++++++++++++++++++ SIGN UP +++++++++++++++++++++++++++++++++
//Show register form
router.get("/register", function(req, res){
    res.render("register");
});

//Sign Up logic
router.post("/register", function(req, res){
    //newUser
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, registeredUser){
        if (err) {
            req.flash("error", err.message); //customized message commin from passport-local-mongoose
            return res.redirect("register"); //the return to short circuit the whole callback if there an error
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Successfully signed up, welcome to yelpCamp " + registeredUser.username +".");
                res.redirect("/campgrounds");
            });
        }
    });
});

//++++++++++++++++++++++++++++ LOGIN +++++++++++++++++++++++++++++++++

//Show login form
router.get("/login", function(req, res){
    res.render("login");
});

//Login logic using a middleware( function that is executed before callback )
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){/*no callback*/});

//++++++++++++++++++++++++++++ LOGOUT +++++++++++++++++++++++++++++++++
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out.");
    res.redirect("/campgrounds");
})


module.exports = router;