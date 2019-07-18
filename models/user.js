var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose"); //necessary

//Schema and model
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose); //necessary

module.exports = mongoose.model("user", userSchema);