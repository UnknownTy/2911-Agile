const Discord = require("discord.js");
const axios = require("axios")
const storage = require("./storage.js")

//This file stores all of the bot's commands.

//A dictionary used to convert API data names to properly formatted names
const properNames = {
    "updated": "Time last updated",
    "cases": "Total Cases",
    "todayCases": "Today's Cases",
    "deaths": "Total Deaths",
    "todayDeaths": "Today's Deaths",
    "recovered": "Total Recovered",
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
        .setTitle("Covid data")
        .setFooter("Covid statistics provided by NovelCOVID API")
    return embed
}

const loadResponse = ((data, ctx) => {
    let embed = defaultEmbed(ctx)
    for (let stat of Object.entries(data)) {
        let name = properNames[stat[0]]
            //Check to see if the name is stored in our list of acceptable data
        if (name) {
            if (name == properNames.updated) {
                //Converts the unix timestamp to a proper format
                let last_update = new Date(stat[1])
                    //Formats the timestamp to look nice

                //Before: 2021-05-03T19:30:437Z
                var numFormatted = last_update.toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    //After: 2021-05-03 19:30:43
            } else {
                var numFormatted = new Intl.NumberFormat("en-CA").format(stat[1])
            }
            //Add the data to the embed
            embed.addField(name, numFormatted, inline = true)
        }
    }
    return embed
})

module.exports = {
    statAll: ctx => {
        //Gets data from public covid API
        axios.get(`https://corona.lmao.ninja/v2/all`)
            .then(response => {
                let statInfo = loadResponse(response.data, ctx)
                    .setThumbnail("https://eoimages.gsfc.nasa.gov/images/imagerecords/8000/8108/ipcc_bluemarble_west_front.jpg")
                    //Return the data to the discord channel that requested it
                ctx.channel.send(embed = statInfo)
            })
    },
    statCountry: (ctx, country) => {
        axios.get(`https://corona.lmao.ninja/v2/countries/${country}`)
            .then(res => {
                let statInfo = loadResponse(res.data, ctx)
                    //Set the thumbnail to be the country's flag
                statInfo.setThumbnail(res.data.countryInfo.flag)
                ctx.channel.send(embed = statInfo)
                storage.store(statInfo, country)
                    ///line above is to test
            })
            .catch(err => {
                ctx.channel.send("Country not found or doesn't have any cases")
            })
    },
    argsUsage: (msg, argtype) => {
        if (argtype === "when") {
            msg.channel.send("Usage: !when {your_age OR exception}")
        }
    },
    vaccineWhen: (msg, age) => {
        message = "If you are healthy and not part of an exception group, you may get your 1st dose "
        switch (true) {
            case (age < 18):
                msg.channel.send("There is currently no approved vaccine for minors.")
                break;
            case (age < 35):
                msg.channel.send(message + "in June.");
                break;
            case (age < 45):
                msg.channel.send(message + "between May and June.");
                break;
            case (age < 60):
                msg.channel.send(message + "in May.")
                break;
            case (age < 65):
                msg.channel.send(message + "between April and May")
                break;
            case (age < 80):
                msg.channel.send(message + "in April")
                break;
            case (age >= 80):
                msg.channel.send("If you are 80 and over and living or assessed for living in long-term care facilities or assisted living, " +
                    "you may get your 1st dose between December 2020 to February 2021. Otherwise, you may get your first dose between February to April.")
                break;
        }
    },
    vaccineException: (msg) => {
        const exceptionEmbed = new Discord.MessageEmbed()
            .setTitle("Vaccine Exceptions")
            .setURL("https://www2.gov.bc.ca/gov/content/covid-19/vaccine/plan#phases")
            .setImage(url = "https://www2.gov.bc.ca/assets/gov/covid-19/immunization/immunization-plan-phase-3.png")
            .setTimestamp()
            .setDescription("You may be eligible to get your vaccine sooner, regardless of age, if you are part of an exception or priority group. Some examples include those who are clinically vulnerable," +
                "those who work in volunerable settings, and those who are indigenous. Please check the following link to determine whether you are part of an exception group.")
            .addField("Link to BC's Immunization Plan and Exceptions:", "https://www2.gov.bc.ca/gov/content/covid-19/vaccine/plan#phases");
        msg.channel.send(exceptionEmbed);
    }
}