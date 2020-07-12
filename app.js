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
  postIDs: []
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
  likes: Number
}

const Post = mongoose.model("Post", postSchema);

// ===========================================GET requests=========================================================

app.get("/test", function(req, res){
  // res.sendFile(__dirname + "/public/test.html");
  res.render("test");
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
      if (err) {
        console.log(err);
      } else {
        res.render("home", {
          posts: foundPost
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

app.get("/37826537", function(req, res) {

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

app.post("/like", function(req, res) {
  // we use number to convert it into a number and be able to use different math operations :)
  var likes = Number(req.body.likes);
  const postID = req.body.postID;
  var flag = true;

  User.findById(req.user.id, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){

        for(var i = 0; i < foundUser.postIDs.length; i++) {

          if(foundUser.postIDs[i] === postID){
            flag = false;
          }

        }
        if(flag === true){
          foundUser.postIDs.push(postID);
          foundUser.save();

          console.log("likes: " + likes + " postID: " + postID);

          Post.findOne({_id: postID}, function(err, foundPost){
            if(err){
              console.log(err);
            }else{
              likes = likes + 1;
              foundPost.likes = likes;
              foundPost.save();
            }
          });

        }

      }
    }
  });

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

  console.log(password);
  console.log(confirmPassword);

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
  const post_id = req.body.id;
  console.log(post_id);

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

  console.log(req.body);

  const postTitle = req.body.postTitle;
  const postText = req.body.postText;
  const timeline = req.body.timeline;
  const hand = req.body.hand;
  const thoughts = req.body.thoughts;
  const journey = req.body.journey;
  const url = req.body.postURL;

  const likes = req.body.likes;

  var dateTime = new Date();
  const day = dateTime.getDate();
  let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
  const year = dateTime.getFullYear();
  const time = day + "/" + month + "/" + year;

  const newPost = new Post({
    title: postTitle,
    content: postText,
    date: time,
    timeline: timeline,
    hand: hand,
    thoughts: thoughts,
    journey: journey,
    url: url,
    likes: likes
  });

  newPost.save();

  res.redirect("/diep");

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("server has started successfully");
});
