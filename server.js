const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const Gram = require("./models/gram");
const User = require("./models/users");
const bcrypt = require("bcrypt");

// const salt = bcrypt.genSaltSync(10);
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: "client/images/" });

const app = express();
const methodOverride = require("method-override");

const salt = "$2a$10$7/colm6V7ymxVJdP/Oiqme";

// First arg: path to expose in the web server, eg localhost/assets
// Second arg: relative path to the folder to serve in the filesystem
app.use("/client", express.static("./client/"));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const PORT = 3000;
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
    const isMatch = bcrypt.compareSync(passwordEntered, user.password);
    // checks username password isMatch
    if (request.body.username === user.name && isMatch) {
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
app.post("register", urlencodedParser, (request, response) => {
  const data = request.body;
  const passwordEntered = data.password;
  // salt and hash
  const passwordSent = bcrypt.hashSync(passwordEntered, salt);
  // add user to DATABASE
  User.addUser(data, passwordSent).then(response.redirect("/"));
});

// home page
app.get("/", requireLogin, (request, response) => {
  Gram.viewAll().then(data => {
    response.render("index", { data });
  });
});
app.post("/register", urlencodedParser, (request, response) => {
  const userRegistrationData = request.body;
  Gram.registerUser(userRegistrationData).then(userData => {
    response.redirect(`/profile`);
  });
});

// show profile
app.get("/profile", requireLogin, (request, response) => {
  Gram.profile().then(data => {
    response.render("profile", { data });
  });
});

// get one post
app.get("/post/:id", requireLogin, (request, response) => {
  const postId = Number(request.params.id);
  Gram.viewPost(postId).then(postData => {
    response.render("show", { postData });
  });
});

// create post
app.get("/profile/new", requireLogin, (req, res) => {
  res.render("new");
});

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./client/images");
  },
  filename(req, file, callback) {
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

app.post("/profile/new", (request, response) => {
  const upload = multer({
    storage,
    fileFilter(request, file, callback) {
      const ext = path.extname(file.originalname);
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        return callback(response.end("Only images are allowed"), null);
      }
      callback(null, true);
    }
  }).single("userFile");
  upload(request, response, err => {
    response.render("profile");
  });
});

// edit post
app.get("/post/:id/edit", requireLogin, (request, response) => {
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
app.delete("/post/:id", urlencodedParser, requireLogin, (request, response) => {
  const postIdToDelete = Number(request.params.id);
  Gram.deletePost(postIdToDelete).then(postData => {
    response.redirect("/");
  });
});
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
