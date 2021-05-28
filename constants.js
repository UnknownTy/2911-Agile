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

//Proper usage of all commands. {} indicates optional parameters (i.e. the command may be used without additional arguments)
helpCommands: {
    "stat": "stat [Country]",
    "staty": "staty [Country]",
    "when": "when {Your age OR exception}",
    "help": "help [Command]",
    "prefix": "prefix {New Prefix}",
    "restriction": "restriction ['region']",
    "info" : "info ['pfizer' OR 'moderna' OR 'astrazeneca']",
    "register" : "register ['bc']",
    "faq" : "faq",
    "phoneline" : "phoneline",
    "graph": "graph {Number of days > 1} [Country] [Province]"
},

//A description of all commands
helpDescription: {
    "stat": "Gives today's covid statistics. \nStatistics can be narrowed down to a country by giving the country's name or ID.",
    "staty": "Gives yesterday's covid statistics. \nStatistics can be narrowed down to a country by giving the country's name or ID.",
    "when": "Gives information on when a user can expect to receive their covid vaccination. \nUser may provide their age, or alternatively use 'exception' as an argument to see information on vaccination exeptions.",
    "help": "Provides the user useful information (Like this!) on what commands do. \nCan be given a command name to find more information (Like you just did!)",
    "prefix": "Updates the prefix the bot uses to respond to commands. \nThe prefix must be a single character long.",
    "restriction": "Gives information on current COVID-19 restrictions in British Columbia. Add additional argument 'region' to learn about regional travel restrictions.",
    "info": "gives information on the covid vaccine",
    "register" : "Provides province-wide links to sign up for vaccines.",
    "faq" : "Provides a list of frequently asked questions.",
    "phoneline" : "Provides a list of phone lines to contact for emergencies and assistance",
    "graph": "Provides historical data on a global scale, or a given country.\nYou can also specify the province following the country to get more detailed data."
},
}