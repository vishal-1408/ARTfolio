const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/user.js");
const Post = require("./models/post.js");
const Bio = require("./models/bio.js");
const seeds = require("./seed.js");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");

app.use(express({
  secret:process.env.SECRET,
  resave:false,
  saveUnintialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("useCreateIndex",true);
mongoose.set("useUnifiedTopology",true);
mongoose.set("useNewUrlParser",true);
mongoose.connect("mongodb://localhost/artfolio");

seeds();

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
})

app.get("/",(req,res)=>{
  res.render("landing");
});

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get("/register",(req,res)=>{
  res.render("register");
})

app.post("/register",(req,res)=>{
  User.register({username: req.body.user.username},req.body.user.password,(err,sol)=>{
    if(err) {
      // console.log(err);
      // res.send(err+"<div><a src=\"/register\">Register Again</a></div>");
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,()=>{
        res.redirect("/artfolio");
      });
    }
  })
})
app.post("/login",(req,res)=>{
  var user = req.body.user;
    req.login(user,(e,s)=>{
      if(e) {
        res.redirect("/login");
      }else{
        passport.authenticate("local")(req,res,()=>{
          res.redirect("/artfolio");
        })
      }
    })
});

app.get("/artfolio",(req,res)=>{
  // if(req.isAuthenticated()) {
  User.findOne({username:"vishalreddy"}).populate("bio").populate("post").exec((e,s)=>{
    if(e) console.log(e);
    else{
      res.render("index",{user:s});
    }

  })

  // }else{
  //   res.redirect("/login");
  // }
});








let port = process.env.PORT;
if(port==null||port=="") port = 3000;
app.listen(port,function(){
  console.log(`Server started on - ${port}`);
})
