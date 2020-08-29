const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect('mongodb+srv://nachov301:Leavemealone3930@cluster0-ix6bg.mongodb.net/diep', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


const userSchema = new mongoose.Schema({
  user: String,
  password: String,
  postIDs: [],
  about: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const postSchema = {
  title: String,
  content: String,
  date: String,
  timeline: String,
  hand: String,
  thoughts: String,
  journey: String,
  url: String,
  likes: Number,
  readingTime: Number,
  userName: String
}

const Post = mongoose.model("Post", postSchema);

// ===========================================GET requests=========================================================

app.get("/updateBio", function(req, res){
  res.render("updateBio");
});

app.get("/test", function(req, res){
  // res.sendFile(__dirname + "/public/test.html");
  res.render("test");
});

app.get("/myProfile", function(req, res) {

  const user = req.user.username;
  console.log(user);
  if(req.isAuthenticated){

    Post.find({userName: user},function (err, foundPost){
      if(err){
        console.log(err);
      }else{
        res.render("myProfile",{
          posts: foundPost
        });
      }
    });

  }else{
    res.redirect("/");
  }

});

app.get("/signUp", function(req, res) {
  res.render("signUp");
});

app.get("/", function(req, res) {
  res.render("login", {
    message: "Enter your user and password"
  });
});

app.get("/failureLogin", function(req, res) {
  res.render("login", {
    message: "User or password incorrect, try again :("
  });
});

app.get("/home", function(req, res) {

  if (req.isAuthenticated()) {
    Post.find({}, function(err, foundPost) {
      console.log(foundPost);
      if (err) {
        console.log(err);
      } else {
        res.render("home", {
          posts: foundPost
          // to sort the post by a key value
          // orderedPost: foundPost.sort((a, b) => (a.likes < b.likes) ? 1 : -1)
        });
      }
    });
  } else {
    res.redirect("/signUp");
  }


});

app.get("/diep", function(req, res) {

  if (req.isAuthenticated) {
    Post.find({}, function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.render("index", {
          posts: foundPost
        });
      }
    });
  } else {
    res.redirect("/");
  }


});

app.get("/write", function(req, res) {

  if (req.isAuthenticated) {
    res.render("compose");
  } else {
    res.redirect("/");
  }


});

app.get("/timeline", function(req, res) {

  if (req.isAuthenticated) {
    Post.find({
      timeline: "checked"
    }, function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.render("categories", {
          title: "Timeline Posts",
          posts: foundPost
        });
      }
    });
  } else {
    res.redirect("/");
  }


});

app.get("/hand", function(req, res) {

  if (req.isAuthenticated) {
    Post.find({
      hand: "checked"
    }, function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.render("categories", {
          title: "Hand Posts",
          posts: foundPost
        });
      }
    });
  } else {
    res.redirect("/");
  }


});

app.get("/thoughts", function(req, res) {

  if (req.isAuthenticated) {
    Post.find({
      thoughts: "checked"
    }, function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.render("categories", {
          title: "Thoughts Posts",
          posts: foundPost
        });
      }
    });
  } else {
    res.redirect("/");
  }


});

app.get("/journey", function(req, res) {

  if (req.isAuthenticated) {
    Post.find({
      journey: "checked"
    }, function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.render("categories", {
          title: "Journey Posts",
          posts: foundPost
        });
      }
    });
  } else {
    res.redirect("/");
  }


});

//=============================================POST request========================================================

app.post("/searchPosts", function(req, res){

  const search = req.body.search;
  // for capitalizing the first letter
  const searchQuery = search[0].toUpperCase() + search.substring(1)
  console.log(searchQuery);
  if (req.isAuthenticated) {
    Post.find({
      title: searchQuery
    }, function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.render("categories", {
          title: "Found posts",
          posts: foundPost
        });
      }
    });
  } else {
    res.redirect("/");
  }
});

app.post("/timeline", function(req, res){
  res.redirect("/timeline");
});

app.post("/journey", function(req, res){
  res.redirect("/journey");
});

app.post("/thoughts", function(req, res){
  res.redirect("/thoughts");
});

app.post("/hand", function(req, res){
  res.redirect("/hand");
});

app.post("/user", function(req, res){
  const user = req.body.userID;
  console.log(user);
  if(req.isAuthenticated){
// findOne returns a object and find returns an array
    User.findOne({username: user}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{

        if(foundUser){

          // findOne returns a object and find returns an array
              Post.find({userName: user},function (err, foundPost){
                if(err){
                  console.log(err);
                }else{
                      console.log("user found: " + user);
                      res.render("categories2",{
                            about: foundUser.about,
                            title: user,
                            posts: foundPost
                          });
                      }
                });

        }
      }
    });


  }else{
    res.redirect("/");
  }

});

app.post("/remove", function(req, res){
  const postID = req.body.postID;
  console.log(postID);

  Post.findByIdAndRemove(postID, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully removed");
    }
  });
  res.redirect("myProfile");

});
//----------------------------------------- update ----------------------------------------
app.post("/update", function(req, res){
  console.log(req.body.postID);
  const id = req.body.postID;

  Post.findOne({_id: id}, function(err, foundItem){
    if(err){
      console.log(err);
    }else{
      if(!foundItem){
        console.log("wasnt found");
      }else{
        if(req.body.postTitle){
          foundItem.title = req.body.postTitle;

        }
        if(req.body.postText){
          foundItem.content = req.body.postText;

        }
        foundItem.save();
      }
    }
  });

res.redirect("/myProfile");

});
//----------------------------------------- update ----------------------------------------

app.post("/updateBio", function(req, res){
  const userID = req.user._id;
  console.log("user id is: " + userID);
  const bio = req.body.bio;
  console.log("req.body.bio is" + bio);

  User.findOne({_id: userID}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(!foundUser){
        console.log("user wasnt found");
      }else{
        if(req.body.bio){
          console.log(req.body.bio);
          console.log("bio updated");
          foundUser.about = bio;
        }

        foundUser.save();
      }
    }
  });

  res.redirect("/myProfile");

});

app.post("aboutMe", function(req, res){
  const userID = req.user.username;


});

app.post("/postToEdit", function(req, res){

  // const user = req.user.username;
  // console.log(user);

  const post_id = req.body.postID;
  console.log(post_id);

  Post.findById(post_id, function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", {
        title: foundPost.title,
        content: foundPost.content,
        id: post_id
      });
    }
  })

});

app.post("/like", function(req, res) {

  res.redirect("/home");

});

app.post("/logOut", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/signUp", function(req, res) {
  res.redirect("/signUp");
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/failureLogin'
  }));
// In this case, the redirect options override the default behavior. Upon successful authentication,
// the user will be redirected to the home page. If authentication fails, the user will be redirected
// back to the login page for another attempt.

app.post("/register", function(req, res) {

  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // console.log(password);
  // console.log(confirmPassword);

 User.findOne({user: username}, function(err, foundUser){
   if(err){
     console.log(err);
   }else{
     if(!foundUser){
       if (password === confirmPassword) {
         User.register({
           username: req.body.username
         }, req.body.password, function(err, user) {
           console.log(req.body.username);
           if (err) {
             console.log(err);
             console.log("error");
             res.redirect("/");
           } else {
             passport.authenticate("local")(req, res, function() {
               res.redirect("/home");
             });
           }

         });
       } else {
         res.redirect("signUp");
       }
     }else{
       res.redirect("signUp");
     }
   }
 });




});

app.post("signUp", function(req, res) {
  res.redirect("/signUp");
});

app.post("/timeline", function(req, res) {
  res.redirect("/timeline");
});

app.post("/hand", function(req, res) {
  res.redirect("/hand");
});

app.post("/thoughts", function(req, res) {
  res.redirect("/thoughts");
});

app.post("/journey", function(req, res) {
  res.redirect("/journey");
});

app.post("/post", function(req, res) {

  // we use number to convert it into a number and be able to use different math operations :)
  var likes = Number(req.body.likes);
  const postID = req.body.postID;

    // console.log("views: " + likes + " postID: " + postID);

    Post.findOne({_id: postID}, function(err, foundPost){
      if(err){
        console.log(err);
      }else{
        likes = likes + 1;
        foundPost.likes = likes;
        foundPost.save();
      }
    });


  const post_id = req.body.id;
  // console.log(post_id);

  Post.findById(post_id, function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
    }
  })
});

app.post("/compose", function(req, res) {

  // console.log("username is: " + req.user.username);

  const title = req.body.postTitle;
  const postTitle = title[0].toUpperCase() + title.substring(1);
  const postText = req.body.postText;
  const timeline = req.body.timeline;
  const hand = req.body.hand;
  const thoughts = req.body.thoughts;
  const journey = req.body.journey;
  const url = req.body.postURL;
  // to get my username
  const userName = req.user.username;
// to calculate the reading time---------------------

    const wordsPerMinute = 200;
    const noOfWords = postText.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    // to round up, if we wanted to round down we'd use floor instead
    const readTime = Math.ceil(minutes);

// ---------------------------------------------------
// we create an array which holds the name of the months so according to the number that we get from getMonth method some of
// them is gonna be picked so we can show words instead of the number of the month
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    var d = new Date();
    var n = month[d.getMonth()];


  var dateTime = new Date();
  const day = dateTime.getDate();
  // let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
  const year = dateTime.getFullYear();
  const time = n + " " + day + ", " + year;

  const newPost = new Post({
    title: postTitle,
    content: postText,
    date: time,
    timeline: timeline,
    hand: hand,
    thoughts: thoughts,
    journey: journey,
    url: url,
    likes: 1,
    readingTime: readTime,
    userName: userName
  });

  newPost.save();

  res.redirect("/home");

});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("server has started successfully");
});
