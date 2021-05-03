const Discord = require("discord.js");
const axios = require("axios")

//This file stores all of the bot's commands.

//A dictionary used to convert API data names to properly formatted names
const properNames = {
    "updated": "Time last updated",
    "cases": "Total Cases",
    "todayCases": "Today's Cases",
    "deaths": "Total Deaths",
    "todayDeaths": "Today's Deaths",
    "recovered" : "Total Recovered",
    "todayRecovered": "Today's Recovered",
    "recoveredPerOneMillion": "Recovered per Million",
    "active": "Active Cases",
    "activePerOneMillion": "Active Cases per Million",
    "critical": "Critical Condition",
    "criticalPerOneMillion": "Critical Cases per Million",
    "casesPerOneMillion": "Cases per Million",
    "deathsPerOneMillion": "Deaths per Million",
    "tests": "Total Tests",
    "testsPerOneMillion": "Tests per Million",
    "population": "Total Population",
    "affectedCountries": "Affected Countries",
}
const defaultEmbed = (ctx) => {
    embed = new Discord.MessageEmbed()
        .setAuthor(ctx.author.username)
        .setThumbnail(ctx.author.avatarURL())
        .setTitle("Covid data")
        .setFooter("Covid statistics provided by NovelCOVID API")
    return embed
}

module.exports = {
    statAll: ctx => {
        //Gets data from public covid API
        axios.get(`https://corona.lmao.ninja/v2/all`)
        .then(response => {
            embed = defaultEmbed(ctx)
            for(let data of Object.entries(response.data)){
                let name = properNames[data[0]]
                //Check to see if the name is stored in our list of acceptable data
                if (name){
                    if (name == properNames.updated){
                        //Converts the unix timestamp to a proper format
                        let last_update = new Date(data[1])
                        //Formats the timestamp to look nice

                        //Before: 2021-05-03T19:30:437Z
                        data[1] = last_update.toISOString().replace(/T/,' ').replace(/\..+/,'')
                        //After: 2021-05-03 19:30:43
                    }
                    //Add the data to the embed
                    embed.addField(name, data[1], inline=true)
                }
            }
            //Return the data to the discord channel that requested it
            ctx.channel.send(embed=embed)
    })
    },
    statCountry: (ctx, country) => {
    }
}