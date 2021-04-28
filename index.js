const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session")
require("dotenv").config()
const PORT = process.env.PORT || 5050

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(ejsLayouts);
app.use(session(
  {
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }
))

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//Routes can go here




app.listen(PORT, function () {
    console.log(
      `Server running! Available on port ${PORT} 🚀`
    );
  });