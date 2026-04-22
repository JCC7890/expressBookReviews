const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = [];

// Check if username is valid (exists)
const isValid = (username) => { 
  let filtered_users = users.filter((user) => user.username === username);
  return filtered_users.length > 0;
}

// Authenticate user credentials
const authenticatedUser = (username, password) => { 
  if (isValid(username)) {
    let filtered_users = users.filter((user) => (user.username === username) && (user.password === password));
    return filtered_users.length > 0;
  }
  return false;
}

// Registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      // Generate JWT token with 1 hour expiry
      let token = jwt.sign({ username: username }, "access", { expiresIn: 60 * 60 });
      return res.status(200).json({ message: "User logged in successfully", token: token });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } else {
    return res.status(400).json({ message: "Username and password required" });
  }
});

module.exports = { regd_users, isValid, authenticatedUser, users };