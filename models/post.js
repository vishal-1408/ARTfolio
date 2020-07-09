const mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  title: String,
  src: String,
  desc: String
});

var Post = mongoose.model("Post",postSchema);

module.exports = Post;
