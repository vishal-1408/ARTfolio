const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


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

userSchema.plugin(passportLocalMongoose);

User = mongoose.model("User",userSchema);

module.exports = User;
