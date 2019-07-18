var mongoose = require("mongoose");

//Schema and model
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt : {type: Date, default: Date.now},
    comments: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comment"
       }
    ],
    creator: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user"
       },
       username: String
    }
 });
 
 module.exports = mongoose.model("Campground", campgroundSchema)