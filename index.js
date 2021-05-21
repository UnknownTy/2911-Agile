const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const Discord = require("discord.js");
const cmd = require("./commands");
require("dotenv").config()
const client = new Discord.Client();
const PORT = process.env.PORT || 5050
const botToken = process.env.botToken


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(ejsLayouts);
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    },
}))

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

const messageHandler = msg => {
    //Check if the message starts with the prefix, or is sent by the bot
    if (!msg.content.startsWith(prefix) || msg.author.bot) return false;
    //Remove all excess spaces and splice out the args
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    //Grab the command out of the list of arguments
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
      //Shows info for vaccine
      case (command == "info"):
        if (args.length == 0){
          cmd.argsUsage(msg, "info", prefix)
        }
        else if(args[0] == "pfizer"){
          cmd.pfizer(msg)}
        else if (args[0] == "moderna"){
          cmd.moderna(msg)}
        else if(args[0] == "astrazeneca"){
          cmd.astra(msg)
        }
        break;
      //Command to obtain information on how to register for vaccines
      case (command == "register"):
        if (args.length > 1){
          cmd.argsUsage(msg, "register", prefix)
        }
        else if (args[0] == "bc"){
          cmd.registerbc(msg)
        }
        else {
          cmd.register(msg)
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
      //Used to show yesterday's statistics
      case (command == "staty"):
        if (args.length == 0){
          cmd.statAll(msg, yesterday=true)
        } else {
          cmd.statCountry(msg, args[0].toLowerCase(), yesterday=true)
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
      // Commands to show general and region-wide restrictions in BC
      case (command === "restriction"):
        if (args.length > 1) {
          cmd.argsUsage(msg, "restriction", prefix)  
        }
        else if (args[0] === "region"){
          cmd.regionalRestriction(msg)
        }
        else {
          cmd.restrictionEmbed(msg)
        }
        break;
      case (command === "faq"):
        if (args.length >= 1) {
          cmd.argsUsage(msg, "faq", prefix)
        }
        else {
        cmd.faq(msg)
        }
        break;
      case (command === "phoneline"):
        if (args.length > 0) {
          cmd.argsUsage(msg, "phoneline", prefix)
        }
        else {
          cmd.phoneline(msg)
        }
      }
      
  }

let prefix = '!' // Default prefix. Adjust this to read from some settings later.
    //Routes can go here

//WE CANNOT TEST THE FOLLOWING!
//These events only run when the server is run, and cannot be tested offline.
/* istanbul ignore next */
if(require.main === module){
//Bot responses go here
client.on("ready", () => {
  console.log("Bot is ready and logged in!")
})

client.on("message", messageHandler)

//Hosts the express server
app.listen(PORT, function () {
    console.log(
      `Server running! Available on port ${PORT} 🚀`
    );
  });

//Logs the bot into Discord
client.login(botToken)
} else {
    module.exports = { messageHandler }
}
