const db = require("../database/connection");

const User = {};

// find all users
User.findUser = username =>
  db.one("SELECT * FROM users WHERE username =$1", [username]);

// add a user
User.addUser = (usernameEntered, passwordSent) =>
  db.one(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
    [usernameEntered, passwordSent]
  );
module.exports = User;
