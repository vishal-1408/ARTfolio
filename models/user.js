var mongoose = require("mongoose");
var plm = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password:String
});

userSchema.plugin(plm);

module.exports = mongoose.model("User",userSchema);
