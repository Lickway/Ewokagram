// Heroku deployment
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const Gram = require("./models/gram");
const User = require("./models/users");
const bcrypt = require("bcrypt");
const aws = require("aws-sdk");

// const salt = bcrypt.genSaltSync(10);
const path = require("path");
// const multer = require("multer");

// const upload = multer({ dest: "client/images/" });

const app = express();
const methodOverride = require("method-override");

const salt = "$2a$10$7/colm6V7ymxVJdP/Oiqme";

// First arg: path to expose in the web server, eg localhost/assets
// Second arg: relative path to the folder to serve in the filesystem
app.use("/client", express.static("./client/"));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
const ewokagram = "ewokagram";
aws.config.region = "us-east-1";
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(
  session({
    secret: "jordan",
    resave: false,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

const requireLogin = (request, response, next) => {
  if (!request.session.authenticated) {
    response.redirect("/login");
    return;
  }
  next();
};
let message = "";
// render log in
app.get("/login", (request, response) => {
  response.render("login");
});
// log them in if password and username are a match
app.post("/login", urlencodedParser, (request, response) => {
  message = "";
  // salt and hashPass

  // get username and Password
  User.findUser(request.body.username).then(user => {
    // get password entered from user
    const passwordEntered = request.body.password;
    // const isMatch = passwordEntered === user.password;
    const isMatch = bcrypt.hashSync(passwordEntered, user.password);
    // checks username password isMatch
    if (request.body.username === user.username && isMatch) {
      request.session.authenticated = true;
      response.redirect("/");
    } else {
      message = "Incorrect username or password";
      response.render("login", { message });
    }
  });
});

// register form
app.get("/register", (request, response) => {
  message = "";
  response.render("register", { message });
});
app.post("/register", urlencodedParser, (request, response) => {
  const data = request.body;
  const usernameEntered = data.username;
  const passwordEntered = data.password;
  // salt and hash
  const passwordSent = bcrypt.hashSync(passwordEntered, salt);
  // // add user to DATABASE
  User.addUser(usernameEntered, passwordSent).then(response.redirect("/"));
});

// get one post
app.get("/post/:id", (request, response) => {
  const postId = Number(request.params.id);
  Gram.viewPost(postId).then(postData => {
    response.render("show", { postData });
  });
});

app.get("/profile/new", (request, response) => {
  response.render("new");
});
// create post using S3
app.get("/sign-s3", (request, response) => {
  const s3 = new aws.S3();
  const fileName = request.query["file-name"];
  const fileType = request.query["file-type"];
  const s3Params = {
    Bucket: ewokagram,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read"
  };
  aws.config.update({
    accessKeyId: "AKIAJIGYGVSRF2UVYL6A",
    secretAccessKey: "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"
  });
  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log("ERROR!!", err);
      return response.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${ewokagram}.s3.amazonaws.com/${fileName}`
    };
    response.write(JSON.stringify(returnData));
    response.end();
  });
});
app.post("/save-details", (request, response) => {
  response.render("new");
  // console.log(req);
});

// home page
app.get("/", (request, response) => {
  Gram.viewAll().then(data => {
    response.render("index", { data });
  });
});

// show profile
app.get("/profile", (request, response) => {
  Gram.profile().then(data => {
    response.render("profile", { data });
  });
});

// using multer
//
// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     callback(null, "./client/images");
//   },
//   filename(req, file, callback) {
//     callback(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   }
// });
//
// app.post("/profile/new", (request, response) => {
//   const upload = multer({
//     storage,
//     fileFilter(request, file, callback) {
//       const ext = path.extname(file.originalname);
//       if (
//         ext !== ".png" &&
//         ext !== ".jpg" &&
//         ext !== ".gif" &&
//         ext !== ".jpeg"
//       ) {
//         return callback(response.end("Only images are allowed"), null);
//       }
//       callback(null, true);
//     }
//   }).single("userFile");
//   upload(request, response, err => {
//     response.render("profile");
//   });
// });

// edit post
app.get("/post/:id/edit", (request, response) => {
  const id = Number(request.params.id);
  Gram.viewPost(id).then(post => {
    response.render("edit.ejs", { post });
  });
});

app.put("/post/:id", urlencodedParser, (request, response) => {
  const id = Number(request.params.id);
  const userInput = request.body;
  Gram.updatePost(id, userInput).then(() => {
    response.redirect(`/post/${id}`);
  });
});

// delete post
app.delete("/post/:id", urlencodedParser, (request, response) => {
  const postIdToDelete = Number(request.params.id);
  Gram.deletePost(postIdToDelete).then(postData => {
    response.redirect("/");
  });
});
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
