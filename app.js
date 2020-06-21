const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nachov301:Leavemealone3930@cluster0-ix6bg.mongodb.net/diep', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String,
  date: String,
  timeline: String,
  hand: String,
  thoughts: String,
  journey: String,
  url: String
}

const Post = mongoose.model("Post", postSchema);

// ===========================================GET requests=========================================================

app.get("/", function(req, res){
  Post.find({}, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("index", {posts:foundPost});
    }
  });
});

app.get("/37826537", function(req, res){
  res.render("compose");
});

app.get("/timeline", function(req, res){
  Post.find({timeline: "checked"}, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("categories", {title: "Timeline Posts", posts:foundPost});
    }
  });
});

app.get("/hand", function(req, res){
  Post.find({hand: "checked"}, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("categories", {title: "Hand Posts", posts:foundPost});
    }
  });
});

app.get("/thoughts", function(req, res){
  Post.find({thoughts: "checked"}, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("categories", {title: "Thoughts Posts", posts:foundPost});
    }
  });
});

app.get("/journey", function(req, res){
  Post.find({journey: "checked"}, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("categories", {title: "Journey Posts", posts:foundPost});
    }
  });
});

//=============================================POST request========================================================

app.post("/timeline", function(req, res){
  res.redirect("/timeline");
});

app.post("/hand", function(req, res){
  res.redirect("/hand");
});

app.post("/thoughts", function(req, res){
  res.redirect("/thoughts");
});

app.post("/journey", function(req, res){
  res.redirect("/journey");
});

app.post("/post", function(req, res){
  const post_id = req.body.id;
  console.log(post_id);

  Post.findById(post_id, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("post",{
        title: foundPost.title,
        content: foundPost.content
      });
    }
  })
});

app.post("/compose", function(req, res){
  const postTitle = req.body.postTitle;
  const postText = req.body.postText;
  const timeline = req.body.timeline;
  const hand = req.body.hand;
  const thoughts = req.body.thoughts;
  const journey = req.body.journey;
  const url = req.body.postURL;

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
    url: url
  });

  newPost.save();

  res.redirect("/");

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
  console.log("server has started successfully");
});
