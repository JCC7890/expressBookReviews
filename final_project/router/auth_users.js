const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let filtered_users = users.filter((user)=> user.username === user);
  if(filtered_users){
    return true;
}
  return false;
}

const authenticatedUser = (username,password)=>{ 
  if(isValid(username)){
    let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
    if(filtered_users){
      return true;
}
    return false;

  }
  return flase;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
    const present = users.filter((user)=> user.name === username)
    if(present.length===0){
      users.push({"username":req.body.username, "password":req.body.password});
      return res.status(201).json({message:"User created successfully"})
    }
    else{
      return res.status(400).json({message:"You already have an account"})
    }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Check usrename and/or password"})
  }

});

regd_users.post("/login", (req,res)=> {
  let user = req.body.username;
  let pass = req.body.password;
  if(!authentictedUser(user, pass)){
    return res.status(403).json({message:"User not authenticated"})
  }

  let accessToken = jwt.sign({
    data: user
  },'access',{expires In:60*60})
  req.session.authorization = {
    accessToken
  }
  res.send("User log in successfull")

});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let users = req.session.username;
  let ISBN = req.params.isbn;
  let details = req.query.review;
  let rev = {user:users,review:details}
  books[ISBN] .reviews = rev;
  return res.status(201).json({message:"Review now added"})

});

regd users.delete("/auth/review/:isbn", (req, res) => {
  let ISBN = req.params.isbn;
  books[ISBN].reviews = {}
    return res.status(200).json({message:"Review deleted"})
});

module.exports.authenticated = regd_users;
module.exports,isValid;
module.exports.users = users;
