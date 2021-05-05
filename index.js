const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const Discord = require("discord.js");
const cmd = require("./commands")
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

let prefix = '!'
//Routes can go here


//Bot responses go here
client.on("ready", () => {
  console.log("Bot is ready and logged in!")
})

client.on("message", msg => {
  //Check if the message starts with the prefix, or is sent by the bot
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  //Remove all excess spaces and splice out the args
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  //Grab the command out of the list of arguments
  const command = args.shift().toLowerCase();
  msg.channel.send("DEV BRANCH -- REMOVE THIS BEFORE MAIN")
  if (command === "stat"){
    if (args.length == 0){
      cmd.statAll(msg)
    } else {
      cmd.statCountry(msg, args[0].toLowerCase())
    }
  }
  else if (command === "when") {
    if (args.length === 0 || args.length > 1) {
      cmd.argsUsage(msg, "when")  
    }
    else if (args[0] === "exception") {
      cmd.vaccineException(msg)
    }
    else {
      cmd.vaccineWhen(msg, args[0])
    }
  }
  
})


app.listen(PORT, function () {
    console.log(
      `Server running! Available on port ${PORT} 🚀`
    );
  });

client.login(botToken)