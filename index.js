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

let prefix = '!' // Default prefix. Adjust this to read from some settings later.
//Routes can go here


//Bot responses go here
client.on("ready", () => {
  console.log("Bot is ready and logged in!")
})

client.on("message", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();


  switch(true){
    //Used to change the prefix
    case (command === "prefix"):
      if (!args[0]){
        cmd.argsUsage(msg, "prefix", prefix)
      }
      else if(args[0].length > 1){
        msg.channel.send(`Invalid new prefix ${args[0]}, cannot be longer than one character`)
      } else {
        prefix = args[0] 
        msg.channel.send(`Prefix updated to \`${prefix}\``)
      }
      break;
    //Used to get help on the commands
    case (command === "help"):
        cmd.help(msg, prefix, args)
      break;
    //Used to show covid statistics
    case (command === "stat"):
      if (args.length == 0){
        cmd.statAll(msg)
      } else {
        cmd.statCountry(msg, args[0].toLowerCase())
      }
      break;
    //Used to show when a user can get vaccinated
    case (command === "when"):
      if (args.length === 0 || args.length > 1) {
        cmd.argsUsage(msg, "when", prefix)  
      }
      else if (args[0] === "exception") {
        cmd.vaccineException(msg)
      }
      else {
        cmd.vaccineWhen(msg, args[0])
      }
      break;
    }
})

//Hosts the express server
app.listen(PORT, function () {
    console.log(
      `Server running! Available on port ${PORT} 🚀`
    );
  });

//Logs the bot into Discord
client.login(botToken)