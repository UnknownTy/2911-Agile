const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const Discord = require("discord.js");
const axios = require("axios")
require("dotenv").config()
const client = new Discord.Client();
const PORT = process.env.PORT || 5050
const botToken = process.env.botToken

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


//Bot responses go here
client.on("ready", () => {
  console.log("Bot is ready and logged in!")
})



app.listen(PORT, function () {
    console.log(
      `Server running! Available on port ${PORT} 🚀`
    );
  });

client.login(botToken)