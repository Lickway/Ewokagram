const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const Gram = require("./models/gram");

const app = express();
const methodOverride = require("method-override");

app.use("/assets", express.static("./assets/"));
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
    response.redirect(`/tasks`);
  });
});

// get one post
app.get("/post/:id", (request, response) => {
  const postId = parseInt(request.params.id);
  Gram.viewPost(postId).then(postData => {
    response.render("show", { postData });
  });
});

app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
