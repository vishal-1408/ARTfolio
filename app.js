var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var expressSession = require("express-session");
var seeds = require("./seed.js");
var upload = require("./utils/multer.js");
var s3 = require("./utils/aws.js");
var methodOverride = require("method-override");
var dotenv = require("dotenv");
var localStrategy = require("passport-local");
var User = require("./models/user.js");
var Post = require("./models/post.js");
var Bio = require("./models/bio.js");

dotenv.config();



mongoose.set("useCreateIndex",true);
mongoose.set("useUnifiedTopology",true);
mongoose.set("useNewUrlParser",true);
mongoose.connect("mongodb+srv://vishal:"+process.env.PASSWORD+"@cluster0.e3l8k.mongodb.net/artfolio");

app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.use(expressSession({
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
  res.render("landing");
});

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get("/register",(req,res)=>{
  res.render("register");
})

app.post("/register",function(req,res){
  User.register(new User({username:req.body.username}),req.body.password,(err,sol)=>{
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res,()=>{
        res.redirect("/artfolio");
      })
    }
  })
});

app.post("/login",passport.authenticate("local",{
  successRedirect:"/artfolio",
  failureRedirect:"/login"
}),(req,res)=>{});

app.get("/logout",(req,res)=>{
  req.logout();
  console.log("loggedout");
  res.redirect("/");
})

app.get("/artfolio",authenticated,(req,res)=>{
    Bio.findOne({userId:req.user._id},(e,s)=>{
      if(e) console.log(e);
      else{
        Post.find({userId:req.user._id},(er,so)=>{
          if(er) console.log(er);
          else{
            var user = {
              bio:s,
              post:so,
              username:req.user.username,
              id:req.user._id
            }
            res.render("index",{user:user});
          }
        })

      }
});
});

app.get("/artfolio/:id/posts/new",authenticated,(req,res)=>{
         var user = {
           username:req.user.username,
           id:req.user._id
         }
          res.render("postnew",{user:user});
    });

app.post("/artfolio/:id/posts",authenticated,upload.single("image"),(req,res)=>{
   var post = req.body.post;
   post.src=req.file.location;
   post.key=req.file.key;
   post.userId = req.user._id;
   Post.create(post,(e,s)=>{
      if(e) console.log(e);
      else{
                 res.redirect("/artfolio");
               }
             });
        });


app.get("/artfolio/:id1/posts/:id2/edit",authenticated,(req,res)=>{
      Post.findById(req.params.id2,(er,sol)=>{
        if(er) console.log(er);
        else{
          var obj = {
            username:req.user.username,
            id:req.user._id,
            post:sol
          }
          console.log("==========",obj);
           res.render("postedit",{obj:obj});
        }
      })

    });

app.patch("/artfolio/:id1/posts/:id2",authenticated,(req,res)=>{
  var post={};
  if(req.body.post.desc) {
    post.desc = req.body.post.desc;
  };
  post.title = req.body.post.title;
  console.log(post);
  Post.findByIdAndUpdate(req.params.id2,post,(e,s)=>{
    if(e) console.log(e);
    else{
      console.log(s);
      res.redirect("/artfolio");
    }
  })
});


app.delete("/artfolio/:id1/posts/:id2",authenticated,(req,res)=>{
  console.log("deleteeeee");
  Post.findById({_id:req.params.id2},(e,s)=>{
    if(e) console.log(e);
    else{
      var params = {
         Bucket: "artfolio-1408",
         Key: s.key
   };
         s3.deleteObject(params, (er,ds)=>{
           if(er) console.log(er);
           else{
             Post.deleteOne(s,(error)=>{
               if(error) console.log(error);
               else{
                 res.redirect("/artfolio");
               }
             })
           }
         })
    }
  })
});


app.get("/artfolio/:id/bio/new",authenticated,(req,res)=>{
  var user = {
    username:req.user.username,
    id:req.user._id
  }
      res.render("bionew",{user:user});
    });

app.post("/artfolio/:id/bio",authenticated,upload.single("image"),(req,res)=>{
  var bio = req.body.bio;
  bio.src = req.file.location;
  bio.key = req.file.key;
  bio.userId = req.user._id;
  Bio.create(bio,(error,sol)=>{
    if(error) console.log(error);
    else{
              res.redirect("/artfolio");
            }
          })
        });

app.get("/artfolio/:id/bio/edit",authenticated,(req,res)=>{
 Bio.findOne({userId:req.user._id},(er,so)=>{
   if(er) console.log(er);
   else{
     var user = {
       bio:so,
       username:req.user.username,
       id:req.user._id
     }
     res.render("bioedit",{user:user});
   }
 })
});

app.patch("/artfolio/:id/bio",authenticated,upload.single("image"),(req,res)=>{
  Bio.findOne({userId:req.user._id},(er,bio)=>{
    if(er) console.log(er);
    else{
      if(req.file){
        var params = {
           Bucket: "artfolio-1408",
           Key: bio.key,
     };
        s3.deleteObject(params,(r,sol)=>{
          if(r) console.log(r);
        });
        bio.src = req.file.location;
        bio.key = req.file.key;
      }
      if(req.body.bio.name) bio.name = req.body.bio.name;
      if(req.body.bio.fb) bio.fb = req.body.bio.fb;
      if(req.body.bio.insta) bio.insta = req.body.bio.insta;
      if(req.body.bio.phone) bio.phone= req.body.bio.phone;
      if(req.body.bio.email) bio.email = req.body.bio.email
      if(req.body.bio.desc) bio.desc = req.body.bio.desc;
      bio.save((error,solu)=>{
        if(error) console.log(error);
        else{
          res.redirect("/artfolio");
        }
      })
    }
  })
});

app.get("/:id/work",(req,res)=>{
  Bio.findOne({userId:req.params.id},(e,s)=>{
    if(e) console.log(e);
    else{
      Post.find({userId:req.params.id},(er,so)=>{
        if(er) console.log(er);
        else{
          var user = {
            bio:s,
            post:so,
            id:req.params.id
          }
          res.render("show",{user:user});
        }
      });
    }
  });
});





function authenticated(req,res,next){
  if(req.isAuthenticated()) {
    next();
  }
  else {
    console.log("not authenticated");
    res.redirect('login');
    }
}





let port = process.env.PORT;
if(port==null||port=="") port = 3000;
app.listen(port,function(){
  console.log(`Server started on - ${port}`);
});
