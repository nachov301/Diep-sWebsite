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
  about: String,
  favourites: []
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
  title_lower: String,
  content: String,
  date: String,
  kyRong: String,
  pangea: String,
  lemuria: String,
  atlantis: String,
  hienDay: String,
  khac: String,
  url: String,
  likes: Number,
  readingTime: Number,
  userName: String,
  visibility: String
}

const Post = mongoose.model("Post", postSchema);

// use bodyParser middleware for json requests
app.use(bodyParser.json());

// ===========================================GET requests=========================================================

app.get("/updateBio", function(req, res) {
  res.render("updateBio");
});

app.get("/test", function(req, res) {
  // res.sendFile(__dirname + "/public/test.html");
  res.render("test");
});

app.get("/myProfile", function(req, res) {

  const user = req.user.username;
  console.log(user);
  if (req.isAuthenticated) {

    Post.find({
      userName: user
    }, function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.render("myProfile", {
          posts: foundPost
        });
      }
    });

  } else {
    res.redirect("/");
  }

});
//-----------------------------------------------signUp here--------------------------------------------------------
// app.get("/signUp", function(req, res) {
//   res.render("signUp");
// });

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

// app.get("/home", function(req, res) {
//
//   if (req.isAuthenticated()) {
//     Post.find({}, function(err, foundPost) {
//       // console.log(foundPost);
//       if (err) {
//         console.log(err);
//       } else {
//         res.render("home", {
//           posts: foundPost
//           // to sort the post by a key value
//           // orderedPost: foundPost.sort((a, b) => (a.likes < b.likes) ? 1 : -1)
//         });
//       }
//     });
//   } else {
//     res.redirect("/signUp");
//   }
//
//
// });


app.get("/home", function(req, res) {

  if (req.isAuthenticated()) {

    Post.find({}, function(err, foundPost) {
      // console.log(foundPost);
      if (err) {
        console.log(err);
      } else {
        User.findOne({_id:req.user._id}, function(err, foundUser){
          console.log(foundUser);
          res.render("home", {
            posts: foundPost,
            favourites: foundUser.favourites
            // to sort the post by a key value
            // orderedPost: foundPost.sort((a, b) => (a.likes < b.likes) ? 1 : -1)
          });
        })

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


//for posts====================================================================
app.get("/favourites", function(req, res){

  if(req.isAuthenticated){

    User.findOne({_id: req.user._id}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Post.find({_id:{$in:foundUser.favourites}}, function(err, foundPost){

          if (err) {
            console.log(err);
          }else{
            res.render("favourites",{
              title: "My favourite posts",
              posts: foundPost,
              favourites: foundUser.favourites
            })
          }

        });//closes post

      }//closes else in user

    });//closes user

  }else{
    res.redirect("/");
  }



});//closes get request

app.get("/kyRong", function(req, res) {

  if(req.isAuthenticated){

    User.findOne({_id: req.user._id}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Post.find({kyRong: "checked" }, function(err, foundPost){

          if (err) {
            console.log(err);
          }else{
            res.render("categories",{
              title: "Kỷ Rồng Posts",
              posts: foundPost,
              favourites: foundUser.favourites
            })
          }

        });//closes post

      }//closes else in user

    });//closes user

  }else{
    res.redirect("/");
  }


});

app.get("/pangea", function(req, res) {

  if(req.isAuthenticated){

    User.findOne({_id: req.user._id}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Post.find({pangea: "checked" }, function(err, foundPost){

          if (err) {
            console.log(err);
          }else{
            res.render("categories",{
              title: "Pangea Posts",
              posts: foundPost,
              favourites: foundUser.favourites
            })
          }

        });//closes post

      }//closes else in user

    });//closes user

  }else{
    res.redirect("/");
  }


});

app.get("/lemuria", function(req, res) {

  if(req.isAuthenticated){

    User.findOne({_id: req.user._id}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Post.find({lemuria: "checked" }, function(err, foundPost){

          if (err) {
            console.log(err);
          }else{
            res.render("categories",{
              title: "Lemuria Posts",
              posts: foundPost,
              favourites: foundUser.favourites
            })
          }

        });//closes post

      }//closes else in user

    });//closes user

  }else{
    res.redirect("/");
  }



});

app.get("/atlantis", function(req, res) {

  if(req.isAuthenticated){

    User.findOne({_id: req.user._id}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Post.find({atlantis: "checked" }, function(err, foundPost){

          if (err) {
            console.log(err);
          }else{
            res.render("categories",{
              title: "Atlantis Posts",
              posts: foundPost,
              favourites: foundUser.favourites
            })
          }

        });//closes post

      }//closes else in user

    });//closes user

  }else{
    res.redirect("/");
  }


});

app.get("/hienDay", function(req, res) {

  // if (req.isAuthenticated) {
  //   Post.find({
  //     hienDay: "checked"
  //   }, function(err, foundPost) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("categories", {
  //         title: "Hiện đại Posts",
  //         posts: foundPost
  //       });
  //     }
  //   });
  // } else {
  //   res.redirect("/");
  // }

  if(req.isAuthenticated){

    User.findOne({_id: req.user._id}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Post.find({hienDay: "checked" }, function(err, foundPost){

          if (err) {
            console.log(err);
          }else{
            res.render("categories",{
              title: "Hiện đại Posts",
              posts: foundPost,
              favourites: foundUser.favourites
            })
          }

        });//closes post

      }//closes else in user

    });//closes user

  }else{
    res.redirect("/");
  }



});

app.get("/khac", function(req, res) {

  if(req.isAuthenticated){

    User.findOne({_id: req.user._id}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Post.find({khac: "checked" }, function(err, foundPost){

          if (err) {
            console.log(err);
          }else{
            res.render("categories",{
              title: "Khác Posts",
              posts: foundPost,
              favourites: foundUser.favourites
            })
          }

        });//closes post

      }//closes else in user

    });//closes user

  }else{
    res.redirect("/");
  }


});

//=============================================POST request========================================================

// app.post("/searchPosts", function(req, res){
//
//   const search = req.body.search;
//   if(search.length>0){
//     // for capitalizing the first letter
//     const searchQuery = search[0].toUpperCase() + search.substring(1)
//     console.log(searchQuery);
//
//     if (req.isAuthenticated) {
//       Post.find({
//         title: searchQuery
//       }, function(err, foundPost) {
//         if (err) {
//           console.log(err);
//         } else {
//           res.render("categories", {
//             title: "Found posts",
//             posts: foundPost
//           });
//         }
//       });
//     } else {
//       res.redirect("/");
//     }
//
//   }else{
//     res.redirect("/home");
//   }
//
//
// });

app.post("/", function(req, res){

  const userId = req.user._id;
  const postId = req.body.data;
  console.log(postId);
  console.log(userId);


    User.findOne({_id: userId}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          console.log(foundUser);
          foundUser.favourites.push(postId);
          foundUser.save();
        }else{
          console.log("error, no user was found");
        }
      }
    })

    res.send("");
});

app.post("/deleteData", function(req, res){

  const userId = req.user._id;
  const postId = req.body.data;
  console.log(postId);
  console.log(userId);


    User.findOne({_id: userId}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          console.log(foundUser);
          for (var i=0; i<foundUser.favourites.length; i++){
            console.log("array in position " + i + " is " + foundUser.favourites[i]);
            console.log("postId is " + postId);
            if(foundUser.favourites[i]==postId){
              foundUser.favourites.splice(i, 1);
            }
          }

          foundUser.save();
        }else{
          console.log("error, no user was found");
        }
      }
    })

    res.send("");
});

app.post("/searchPosts", function(req, res) {

  const search = req.body.search;
  console.log("++++++++++++++++++++++++++++++++" + search);
  if (search.length > 0) {
    // for capitalizing the first letter
    // const searchQuery = search[0].toUpperCase() + search.substring(1)
    // console.log(searchQuery);
    // UserSchema.find({name: { $regex: '.*' + name + '.*' } }).limit(5);
    if (req.isAuthenticated) {
      // to find all the posts which contains the key word that we introduced in the query
      Post.find({
        title_lower: {
          $regex: '.*' + search.toLowerCase() + '.*'
        }
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

  } else {
    res.redirect("/home");
  }


});

app.post("/kyRong", function(req, res) {
  res.redirect("/kyRong");
});

app.post("/pangea", function(req, res) {
  res.redirect("/pangea");
});

app.post("/lemuria", function(req, res) {
  res.redirect("/lemuria");
});

app.post("/atlantis", function(req, res) {
  res.redirect("/atlantis");
});

app.post("/hienDay", function(req, res) {
  res.redirect("/hienDay");
});

app.post("/khac", function(req, res) {
  res.redirect("/khac");
});

app.post("/user", function(req, res) {
  const user = req.body.userID;
  console.log(user);
  if (req.isAuthenticated) {
    // findOne returns a object and find returns an array
    User.findOne({
      username: user
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {

        if (foundUser) {

          // findOne returns a object and find returns an array
          Post.find({
            userName: user
          }, function(err, foundPost) {
            if (err) {
              console.log(err);
            } else {
              console.log("user found: " + user);
              res.render("categories2", {
                about: foundUser.about,
                title: user,
                posts: foundPost,
                favourites: foundUser.favourites
              });
            }
          });

        }
      }
    });


  } else {
    res.redirect("/");
  }

});

app.post("/remove", function(req, res) {
  const postID = req.body.postID;
  console.log(postID);

  Post.findByIdAndRemove(postID, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully removed");
    }
  });
  res.redirect("myProfile");

});
//----------------------------------------- update ----------------------------------------



app.post("/update", function(req, res) {
  console.log(req.body.postID);
  const id = req.body.postID;
  // const kyRong = req.body.kyRong;
  // const pangea = req.body.pangea;
  // const lemuria = req.body.lemuria;
  // const atlantis = req.body.atlantis;
  // const hienDay = req.body.hienDay;
  // const khac = req.body.khac;

  const category = req.body.category;
  const visibility = req.body.visibility;
  console.log("category when editing is: " + category);
  console.log("visibility when editing is: " + visibility);
  var kyRong = "";
  var pangea = "";
  var lemuria = "";
  var atlantis = "";
  var hienDay = "";
  var khac = "";

  switch (category) {
    case "kyRong":
      kyRong = "checked";
      break;
    case "pangea":
      pangea = "checked";
      break;
    case "lemuria":
      lemuria = "checked";
      break;
    case "atlantis":
      atlantis = "checked";
      break;
    case "hienDay":
      hienDay = "checked";
      break;
    case "khac":
      khac = "checked";
      break;
    default:

  }

  Post.findOne({
    _id: id
  }, function(err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      if (!foundItem) {
        console.log("wasnt found");
      } else {
        if (req.body.postTitle) {
          foundItem.title = req.body.postTitle;

        }

        if (req.body.postText) {
          foundItem.content = req.body.postText;

        }


          foundItem.kyRong = kyRong;
          foundItem.pangea = pangea;
          foundItem.lemuria = lemuria;
          foundItem.atlantis = atlantis;
          foundItem.hienDay = hienDay;
          foundItem.khac = khac;

          foundItem.visibility = visibility;
        foundItem.save();
      }
    }
  });

  res.redirect("/myProfile");

});
//----------------------------------------- update ----------------------------------------

app.post("/updateBio", function(req, res) {
  const userID = req.user._id;
  console.log("user id is: " + userID);
  const bio = req.body.bio;
  console.log("req.body.bio is" + bio);

  User.findOne({
    _id: userID
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (!foundUser) {
        console.log("user wasnt found");
      } else {
        if (req.body.bio) {
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

app.post("aboutMe", function(req, res) {
  const userID = req.user.username;


});

app.post("/postToEdit", function(req, res) {

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

  User.findOne({
    user: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (!foundUser) {
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
      } else {
        res.redirect("signUp");
      }
    }
  });




});

app.post("signUp", function(req, res) {
  res.redirect("/signUp");
});

app.post("/kyRong", function(req, res) {
  res.redirect("/kyRong");
});

app.post("/pangea", function(req, res) {
  res.redirect("/pangea");
});

app.post("/lemuria", function(req, res) {
  res.redirect("/lemuria");
});

app.post("/atlantis", function(req, res) {
  res.redirect("/atlantis");
});

app.post("/hienDay", function(req, res) {
  res.redirect("/hienDay");
});

app.post("/khac", function(req, res) {
  res.redirect("/khac");
});

app.post("/post", function(req, res) {

  // we use number to convert it into a number and be able to use different math operations :)
  var likes = Number(req.body.likes);
  const postID = req.body.postID;

  // console.log("views: " + likes + " postID: " + postID);

  Post.findOne({
    _id: postID
  }, function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {
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
  // store the same as title but in lower case
  const title_lower = req.body.postTitle.toLowerCase();
  const postText = req.body.postText;
  // const kyRong = req.body.kyRong;
  // const pangea = req.body.pangea;
  // const lemuria = req.body.lemuria;
  // const atlantis = req.body.atlantis;
  // const hienDay = req.body.hienDay;
  // const khac = req.body.khac;
  const category = req.body.category;
  const visibility = req.body.visibility;
  console.log("The selected category is: " + category);
  console.log("The selected visibility is: " + visibility);

  var kyRong = "";
  var pangea = "";
  var lemuria = "";
  var atlantis = "";
  var hienDay = "";
  var khac = "";

  switch (category) {
    case "kyRong":
      kyRong = "checked";
      break;
    case "pangea":
      pangea = "checked";
      break;
    case "lemuria":
      lemuria = "checked";
      break;
    case "atlantis":
      atlantis = "checked";
      break;
    case "hienDay":
      hienDay = "checked";
      break;
    case "khac":
      khac = "checked";
      break;
    default:

  }

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
    title_lower: title_lower,
    content: postText,
    date: time,
    kyRong: kyRong,
    pangea: pangea,
    lemuria: lemuria,
    atlantis: atlantis,
    hienDay: hienDay,
    khac: khac,
    url: url,
    likes: 1,
    readingTime: readTime,
    userName: userName,
    visibility: visibility
  });

  newPost.save();

  res.redirect("/home");

});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log(port);
  console.log("server has started successfully");
});
