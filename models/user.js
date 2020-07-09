const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  bio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bio"

  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Post"
    }
  ]
});

User = mongoose.model("User",userSchema);

module.exports = User;
