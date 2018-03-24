const express = require("express");
// const session = require("express-session");
const bodyParser = require("body-parser");
const Gram = require("./models/gram");
// const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: "client/images/" });

const app = express();
const methodOverride = require("method-override");

// const salt = "$2a$10$7/colm6V7ymxVJdP/Oiqme";

// First arg: path to expose in the web server, eg localhost/assets
// Second arg: relative path to the folder to serve in the filesystem
app.use("/client", express.static("./client/"));
// app.use(express.static(`${__dirname}/assets/`));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const PORT = 3000;
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));

// home page
app.get("/", (request, response) => {
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
app.get("/profile", (request, response) => {
  Gram.profile().then(data => {
    response.render("profile", { data });
  });
});

// get one post
app.get("/post/:id", (request, response) => {
  const postId = Number(request.params.id);
  Gram.viewPost(postId).then(postData => {
    response.render("show", { postData });
  });
});

// create post
app.get("/profile/new", (req, res) => {
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
