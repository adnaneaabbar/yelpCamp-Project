var express = require("express");
var expressSanitizer = require("express-sanitizer");
var router = express.Router();

//require middleware
var middleware = require("../middleware");

var Campground = require("../models/campground");

//view campgrounds  INDEX RESTful Routing
router.get("/", function(req, res){
    //Get all campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//form for adding campgrounds  NEW RESTful Routing 
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//add campgrounds  CREATE RESTful Routing
router.post("/", middleware.isLoggedIn, function(req, res){

    //get data from the form
    var newCampground = req.body.campground;

    // SANITIZE
    req.body.campground.name = req.sanitize(req.body.campground.name);
    req.body.campground.price = req.sanitize(req.body.campground.price);
    req.body.campground.image = req.sanitize(req.body.campground.image);
    req.body.campground.description = req.sanitize(req.body.campground.description);

    //get creator data
    var creator = {
        id: req.user._id,
        username: req.user.username
    };
    //add creator to campground
    newCampground.creator = creator;
    //Create a new campground and add to the database
    Campground.create(newCampground, function(err, created){
        if (err) {
            console.log(err);
        } else {
            //redirect to campgrounds page
            req.flash("success", "Campground successfully added.");
            res.redirect("/campgrounds");
        }
    }); 
});


//show informations of campgrounds SHOW RESTful Routing
router.get("/:id", function(req, res){ //this route should be declared after the NEW one
    //find the campground with provided id + passing all the comments
    Campground.findById(req.params.id).populate("comments").exec(function(err, found){ 
        if (err) {
            console.log(err);
        } else {
            //render show template
            res.render("campgrounds/show", {campground: found}); //this time comments are included
        }
    });
});

//edit campground  EDIT RESTful Routing
router.get("/:id/edit", middleware.checkOwnershipCampground, function(req, res){
    Campground.findById(req.params.id, function(err, found){ 
        if (err) {
            res.redirect("back");
        } else {
            //render edit template
            res.render("campgrounds/edit", {campground: found});
        }
    });
});

//update campground UPDATE RESTful Routing
router.put("/:id", middleware.checkOwnershipCampground, function(req, res){

    // SANITIZE
    req.body.campground.name = req.sanitize(req.body.campground.name);
    req.body.campground.price = req.sanitize(req.body.campground.price);
    req.body.campground.image = req.sanitize(req.body.campground.image);
    req.body.campground.description = req.sanitize(req.body.campground.description);
    
    //create
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //redirect
            req.flash("success", "Campground successfully edited.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete campground DESTROY RESTful Routing
router.delete("/:id", middleware.checkOwnershipCampground, function(req, res){
    //delete 
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //redirect
            req.flash("success", "Campground successfully deleted.");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;