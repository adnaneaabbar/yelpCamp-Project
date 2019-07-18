// all the middleware goes here

var middlewareObj = {}; //empty so we can be able to define every method separately
//we need Campground and Comment schemas
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkOwnershipCampground = function(req, res, next){  //next == permission
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.creator.id.equals(req.user._id)) { //way to compare ObjectId with a String id
                    next(); //permission
                } else {
                    req.flash("error", "Sorry, you don't have permission to do that.");
                    res.redirect("back"); //no permission
                }
            }
        });
    } else {
        req.flash("error", "Sorry, you need to be logged in to do that.")
        res.redirect("back"); //takes u back from where u came
    }
};

middlewareObj.checkOwnershipComment = function(req, res, next){  //next == permission
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                console.log(err);
            } else {
                if (foundComment.author.id.equals(req.user._id)) { //way to compare ObjectId with a String id
                    next(); //permission
                } else {
                    req.flash("error", "Sorry, you don't have permission to do that.");
                    res.redirect("back"); //no permission
                }
            }
        });
    } else {
        req.flash("error", "Sorry, you need to be logged in to do that.");
        res.redirect("back"); //takes u back from where u came
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();  //means that the user is allowed to do the action and the route gets to the callback
    }
    req.flash("error", "Sorry, you need to be logged in to do that.");
    res.redirect("/login");  
};

module.exports = middlewareObj;

