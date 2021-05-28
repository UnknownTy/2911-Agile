const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
//Routes
const regionRoute = require("./routes/regionRoute")
const session = require("express-session");
const Discord = require("discord.js");
const cmd = require("./commands");
const { connect } = require("./routes/regionRoute");
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
    const unParsed = msg.content.slice(prefix.length).trim().split(/ +/);
    //Grab the command out of the list of arguments
    const command = unParsed.shift().toLowerCase();

    let args = []
    let openQuote = false
    for (let i = 0; i < unParsed.length; i++) {
      if(unParsed[i].startsWith("\'") | unParsed[i].startsWith("\"")){
        openQuote = true
        let matchQuote = unParsed[i][0]
        var connected = unParsed[i].slice(1)
        if(connected.endsWith(matchQuote)){
          connected = connected.slice(0, -1)
          openQuote = false
        } else {
          for(let v = i+1; v < unParsed.length; v++){
            if(unParsed[v].endsWith(matchQuote)){
              connected += ' '+ unParsed[v].slice(0, -1)
              i++
              openQuote = false
              continue;
            }else {
              connected += ' '+ unParsed[v]
            }
          }
        }
      } else {
        var connected = unParsed[i]
      }
      if(openQuote){
        msg.channel.send("Unmatched quote! I don't know what starts where!")
        return false
      }
      console.log("Out: "+connected)
      args.push(connected)
    }
    
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
        let value = ""
        if (args.length > 1){;
          cmd.argsUsage(msg, "register", prefix)
        }
        if (args.length > 0){
          value = args[0].toLowerCase()
        
          if (value == "bc"){
            cmd.registerbc(msg)
          }
          else if (value == "ab"){
            cmd.registerab(msg)
          }
          else if (value == 'mb'){
            cmd.registermb(msg)
          }
          else if (value == 'nb'){
            cmd.registernb(msg)
          }
          else if (value == 'nfl'){
            cmd.registerNL(msg)
          }
          else if (value == 'nwt'){
            cmd.registernwt(msg)
          }
          else if (value == 'ns'){
            cmd.registerns(msg)
          }
          else if (value == 'nt'){
            cmd.registernt(msg)
          }
          else if (value == 'ont'){
            cmd.registeront(msg)
          }
          else if (value == 'pei'){
            cmd.registerpei(msg)
          }
          else if (value == 'qc'){
            cmd.registerQC(msg)
          }
          else if (value == 'sk'){
            cmd.registerSK(msg)
          }
          else if (value == 'yt'){
            cmd.registerYT(msg)
          }}
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
        break;
      case (command == "graph"):
        if(args.length == 0 | args[0] <= 1){
          cmd.argsUsage(msg, "graph", prefix)
        } else {
          cmd.graph(msg, args)
        }
        break;
      }
      
  }

let prefix = '!' // Default prefix. Adjust this to read from some settings later.
    //Routes can go here

app.use("/region", regionRoute)


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
