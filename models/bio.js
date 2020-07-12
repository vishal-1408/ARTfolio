const mongoose = require("mongoose");

var bioSchema = new mongoose.Schema({
  src: String,
  name: String,
  desc: String,
  fb: String,
  insta: String,
  email: String,
  phone: String,
  key:String
});

var Bio = mongoose.model("Bio",bioSchema);

module.exports = Bio;
