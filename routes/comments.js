var express = require("express");
var expressSanitizer = require("express-sanitizer");
//merging comments and campgrounds params in order for req.params.id to be shared between the two 
var router = express.Router({mergeParams: true}); 

//require middleware
var middleware = require("../middleware");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

//form for adding comments  NEW RESTful Routing 
router.get("/new", middleware.isLoggedIn, function(req, res){ //middleware
    //find campground by id
    Campground.findById(req.params.id, function(err, found){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: found});
        }
    });
});

//add comments  CREATE RESTful Routing
router.post("/", middleware.isLoggedIn, function(req, res){

    //look for campground by id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //get data from the form
            var newComment = req.body.comment;

            // SANITIZE
            req.body.comment.text = req.sanitize(req.body.comment.text);

            //get author data
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            //add author username and id to comment
            newComment.author = author;
            //Create a new campground and add to the database
            Comment.create(newComment, function(err, createdComment){
                if (err) {
                    console.log(err);
                } else {
                    //save comment
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    //redirect to campgrounds page
                    req.flash("success", "Comment successfully added.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }); 
        }
    });
});

//edit comment
router.get("/:comment_id/edit", middleware.checkOwnershipComment, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){ 
        if (err) {
            res.redirect("back");
        } else {
            //look for comment
            Comment.findById(req.params.comment_id, function(err, foundComment){ 
                if (err) {
                    res.redirect("back");
                } else {
                    //render edit template
                    res.render("comments/edit", {campground: foundCampground, comment: foundComment});
                }
            });
        }
    });
});

//update comment
router.put("/:comment_id", middleware.checkOwnershipComment, function(req, res){

    // SANITIZE
    req.body.comment.text = req.sanitize(req.body.comment.text);

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            //redirect to show page
            req.flash("success", "Comment successfully edited.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete comment
router.delete("/:comment_id", middleware.checkOwnershipComment, function(req, res){
    //delete 
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedBlog){
        if (err) {
            res.redirect("back");
        } else {
            //redirect
            req.flash("success", "Comment successfully deleted.");
            res.redirect("back");
        }
    });
});

module.exports = router;