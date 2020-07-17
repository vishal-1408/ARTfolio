var mongoose = require("mongoose");

var bioSchema = new mongoose.Schema({
  src: String,
  name: String,
  desc: String,
  fb: String,
  insta: String,
  email: String,
  phone: String,
  key:String,
  userId:String,
  link: [],
});

var Bio = mongoose.model("Bio",bioSchema);

module.exports = Bio;
