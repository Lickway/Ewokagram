const db = require("../database/connection");

const User = {};

// find all users
User.findUser = username =>
  db.one("SELECT * FROM users WHERE username =$1", [username]);

// add a user
User.addUser = (data, hasPass) =>
  db.one(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
    [data.username, hashPass]
  );
module.exports = User;
