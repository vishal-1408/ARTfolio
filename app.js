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
const upload = require("./utils/multer.js");
const s3 = require("./utils/aws.js");
const methodOverride = require("method-override");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

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
      console.log("populated==========",s);
      res.render("index",{user:s});
    }

  })

  // }else{
  //   res.redirect("/login");
  // }
});

app.get("/artfolio/:id/posts/new",(req,res)=>{
  User.findOne({_id:req.params.id},(e,s)=>{
    if(e) console.log(e);
    else{
      console.log(s);
         var obj = {
           username:s.username,
           id:s._id
         }
         console.log("==========",obj);
          res.render("postnew",{user:obj});
    }
  });
});

app.post("/artfolio/:id/posts",upload.single("image"),(req,res)=>{
  console.log(req.file);
   var post = req.body.post;
   post.src=req.file.location;
   post.key=req.file.key;
   Post.create(post,(e,s)=>{
      if(e) console.log(e);
      else{
        User.findOne({_id:req.params.id},(err,sol)=>{
           if(err) console.log(err);
           else {
             sol.post.push(s);
             sol.save((error,so)=>{
               if(error) console.log(error);
               else{
                 console.log(so);
                 res.redirect("/artfolio");
               }
             })

           }
        })
      }
   })
});

app.get("/artfolio/:id1/posts/:id2/edit",(req,res)=>{
  User.findOne({_id:req.params.id1},(e,s)=>{
    if(e) console.log(e);
    else{
      console.log(s);
      Post.findOne({_id:req.params.id2},(er,sol)=>{
        if(er) console.log(er);
        else{
          var obj = {
            username:s.username,
            id:req.params.id1,
            post:sol
          }
          console.log("==========",obj);
           res.render("postedit",{obj:obj});
        }
      })

    }
  });
});

app.patch("/artfolio/:id1/posts/:id2",(req,res)=>{
  var post={};
  if(req.body.post.desc) {
    post.desc = req.body.post.desc;
  };
  post.title = req.body.post.title;
  console.log(post["$set"]);
  Post.findByIdAndUpdate({_id:req.params.id2},{$set:post},(e,s)=>{
    if(e) console.log(e);
    else{
      res.redirect("/artfolio");
    }
  })
});


app.delete("/artfolio/:id1/posts/:id2",(req,res)=>{
  console.log("deleteeeee");
  Post.findById({_id:req.params.id2},(e,s)=>{
    if(e) console.log(e);
    else{
      const params = {
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


app.get("/artfolio/:id/bio/new",(req,res)=>{
  User.findOne({_id:req.params.id},(e,s)=>{
    if(e) console.log(e);
    else{
      res.render("bionew",{user:s});
    }
  })
})

app.post("/artfolio/:id/bio",(req,res)=>{
  var bio = req.body.bio;
  bio.src = req.file.location;
  bio.key = req.file.key;
  Bio.create(bio,(error,sol)=>{
    if(error) console.log(error);
    else{
      User.findOne({_id:req.params.id},(e,s)=>{
        if(e) console.log(e);
        else{
          s.bio = sol;
          s.save((er,so)=>{
            if(er) console.log(er);
            else{
              res.redirect("/artfolio");
            }
          })
        }
      })
    }
  })

});

app.get("/artfolio/:id/bio/edit",(req,res)=>{
  User.findOne({_id:req.params.id}).populate("bio").exec((er,so)=>{
    if(er) console.log(er);
    else{
      res.render("bioedit",{user:so});
    }
  })
});

app.patch("/artfolio/:id/bio",upload.single("image"),(req,res)=>{
  User.findOne({_id:req.params.id},(er,so)=>{
    if(er) console.log(er);
    else{
      var bio = {};
      if(req.file){
        const params = {
           Bucket: "artfolio-1408",
           Key: so.bio.key
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



      Bio.findByIdAndUpdate({_id:so.bio._id},bio,(e,s)=>{
        if(e) console.log(e);
        else{
          res.redirect("/artfolio");
        }
      })
    }
  })
});










let port = process.env.PORT;
if(port==null||port=="") port = 3000;
app.listen(port,function(){
  console.log(`Server started on - ${port}`);
})
