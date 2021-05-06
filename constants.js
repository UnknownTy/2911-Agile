module.exports = {
//A dictionary used to convert API data names to properly formatted names
properNames: {
    "updated": "Time last updated",

    "cases": "Total Cases",
    "todayCases": "Today's Cases",
    "casesPerOneMillion": "Cases per Million",

    "deaths": "Total Deaths",
    "todayDeaths": "Today's Deaths",
    "deathsPerOneMillion": "Deaths per Million",

    "recovered" : "Total Recovered",
    "todayRecovered": "Today's Recovered",
    "recoveredPerOneMillion": "Recovered per Million",

    "active": "Active Cases",
    "activePerOneMillion": "Active Cases per Million",

    "critical": "Critical Condition",
    "criticalPerOneMillion": "Critical Cases per Million",

    "tests": "Total Tests",
    "testsPerOneMillion": "Tests per Million",

    "population": "Total Population",
    "affectedCountries": "Affected Countries",
},

//Proper usage of all commands
helpCommands: {
    "stat": "stat [Country]",
    "when": "when {Your age OR Exception}",
    "help": "help [Command]",
    "prefix": "prefix {New Prefix}"
},

//A description of all commands
helpDescription: {
    "stat": "Gives today's covid statistics. \nStatistics can be narrowed down to a country by giving the country's name or ID.",
    "when": "Gives information on when a user can expect to receive their covid vaccination. \nUser must provide their age.",
    "help": "Provides the user useful information (Like this!) on what commands do. \nCan be given a command name to find more information (Like you just did!)",
    "prefix": "Updates the prefix the bot uses to respond to commands. \nThe prefix must be a single character long."
},
}