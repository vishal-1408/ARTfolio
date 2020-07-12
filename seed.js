var User = require("./models/user.js");
var Bio = require("./models/bio.js");
var Post = require("./models/post.js");

userData = [
  {
    username:"vishal",
    password:123,
  },
  {
    username:"vishalreddy",
    password:123,
  },
  {
    username:"v",
    password:123,
  }
];

bioData = [
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=426&q=80",
    name: "Vishal",
    desc: "Coder </>",
    fb: "vishal.fb.com",
    insta: "https://www.instagram.com/vishal_chintham_/",
    email: "chinthamvishal1408@gmail.com",
    phone: "8106717061"
  },
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=426&q=80",
    name: "Vishal",
    desc: "Coder </>",
    fb: "vishal.fb.com",
    insta: "https://www.instagram.com/vishal_chintham_/",
    email: "chinthamvishal1408@gmail.com",
    phone: "8106717061"
  },
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=426&q=80",
    name: "Vishal",
    desc: "Coder </>",
    fb: "vishal.fb.com",
    insta: "https://www.instagram.com/vishal_chintham_/",
    email: "chinthamvishal1408@gmail.com",
    phone: "8106717061"
  }
];

posts=[
  {
    title: 1,
    src: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    desc: "First"
  },
  {
    title: 2,
    src: "https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    desc: "First"
  },
  {
    title: 3,
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    desc: "First"
  },
  {
    title: 4,
    src: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    desc: "First"
  },
  {
    title: 5,
    src: "https://images.unsplash.com/photo-1554188248-986adbb73be4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
    desc: "First"
  },


];

function seeds(){
   User.deleteMany({},(e)=>{
     if(e) console.log(e);
     Bio.deleteMany({},(er)=>{
       if(er) console.log(er);
       Post.deleteMany({},(err)=>{
         if(err) console.log(err);
         User.insertMany(userData,(ue,s)=>{
           if(ue) console.log(ue);
           else{
             Post.insertMany(posts,(eror,so)=>{
             if(eror) console.log(eror);
             else{
               Bio.insertMany(bioData,(be,sol)=>{
                 if(be) console.log(be);
                 else{
                   for(var i=0;i<=2;i++){
                     s[i].bio = sol[i];
                     for(var j=0;j<=4;j++){
                       s[i].post.push(so[j])
                     }
                   }
                   s.forEach((sl)=>{
                     sl.save((r,q)=>{
                       if(e) console.log(r);
                       // else console.log(q);
                     });
                   })

                 }
               })
             }
           })}

         })
       })
     })
   });
}


module.exports = seeds;
