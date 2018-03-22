const pgp = require("pg-promise")({});

const connectionURL = "postgres://localhost:5432/ewokagram";
const db = pgp(connectionURL);
const Gram = {};

// select all posts
Gram.viewAll = () => db.any("SELECT * FROM posts");
// show one post
Gram.getPost = id => db.one("SELECT * FROM posts WHERE id = $1", [id]);

// add a new post
Gram.createPost = data =>
  db.one(
    "INSERT INTO posts(user_id, image_url, caption, latitude, longitude) VALUES($1, $2, $3, $4) RETURNING id",
    [data.user_id, data.image_url, data.caption, data.latitude, data.longitude]
  );

// delete a post
Gram.deletePost = id => db.result("DELETE FROM posts WHERE id = $1", [id]);

// update a post
Gram.updatePost = (id, post) =>
  db.none("UPDATE posts SET caption = $1 WHERE id = $2", [post.caption, id]);

// add user to DATABASE
Gram.registerUser = data =>
  db.one(
    "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id",
    [data.username, data.email, data.password]
  );

module.exports = Gram;
