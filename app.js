const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/diep', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
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

app.get("/compose", function(req, res){
  res.render("compose");
});

//=============================================POST request========================================================

app.post("/compose", function(req, res){
  const postTitle = req.body.postTitle;
  const postText = req.body.postText;

  console.log(postTitle);
  console.log(postText);

  const newPost = new Post({
    title: postTitle,
    content: postText
  });

  newPost.save();

  res.redirect("/");

});

app.listen(3000, function(){
  console.log("listening on port 3000");
});
