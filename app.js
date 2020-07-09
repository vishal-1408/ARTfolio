const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const User = require("./models/user.js");
const Post = require("./models/post.js");
const Bio = require("./models/bio.js");


app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
  res.render("landing");
});







let port = process.env.PORT;
if(port==null||port=="") port = 3000;
app.listen(port,function(){
  console.log(`Server started on - ${port}`);
})
