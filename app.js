//import
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");
//model exports
var seedDB = require("./seeds");
//authentication import
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
//for delete and put methods
var methodOverride = require("method-override");
//flashy messages
var flash = require("connect-flash");


//connecting to mongoDB
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser:true});

//ejs formatting + body-parser + public dir + sanitizer
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); // for the Sanitizer to work it should come after bodyParser
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seeding the database
// seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "secrets",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//providing every page with the currentUser information
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    app.locals.moment = require("moment"); //momentjs moment(var.createdAt).fromNow()
    next();
});

//requiring routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");

app.use(authRoutes); //all the routes are different
app.use("/campgrounds", campgroundRoutes); //routes follow a pattern /campgrounds
app.use("/campgrounds/:id/comments", commentRoutes); //routes follow a pattern /campgrounds/:id/comments

//starting the localhost
app.listen("3000", function(){
    console.log("YelpCamp Server has Started!");
});