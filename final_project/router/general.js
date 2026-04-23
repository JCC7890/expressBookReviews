const Axios = require("axios")
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Check username and password" });
    }
  
    const present = users.filter((user) => user.username === username);
    if (present.length === 0) {
      users.push({ username: username, password: password });
      return res.status(201).json({ message: "User account created successfully" });
    } else {
      return res.status(400).json({ message: "Account already exists" });
    }
  });


// Async function to get books
const getBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching books');
    }
  };
  
  // Express route to send books data
  public_users.get('/', async (req, res) => {
    try {
      const books = await getBooks();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: "An error has occurred" });
    }
  });
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
  
    const booksBasedOnISBN = (ISBN) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books.find((b) => b.isbn === ISBN);
          if (book) {
            resolve(book);
          } else {
            reject(new Error("Book not found"));
          }
        }, 900);
      });
    };
  
    booksBasedOnISBN(ISBN)
      .then((book) => {
        res.json(book);
      })
      .catch((err) => {
        res.status(400).json({ error: "Book not found" });
      });
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const booksBasedOnAuthor = (auth) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = books.filter((b) => b.author === auth);
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error("Book not found"));
          }
        }, 900);
      });
    };
  
    booksBasedOnAuthor(author)
      .then((books) => {
        res.json(books);
      })
      .catch((err) => {
        res.status(400).json({ error: "Book not found" });
      });
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const booksBasedOnTitle = (booktitle) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = books.filter((b) => b.title === booktitle);
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error("Book not found"));
          }
        }, 900);
      });
    };
  
    booksBasedOnTitle(title)
      .then((new_books) => {
        res.json(new_books);
      })
      .catch((err) => {
        res.status(400).json({ error: "Book not found" });
      });
  });

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].review) {
      res.json(books[isbn].review);
    } else {
      res.status(404).json({ message: "Review not found for this ISBN" });
    }
  });
  
  module.exports.general = public_users;

