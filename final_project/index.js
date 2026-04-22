const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { regd_users } = require('./router/auth_users.js');
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authorized" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

app.use("/customer", regd_users);
app.use("/", genl_routes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));