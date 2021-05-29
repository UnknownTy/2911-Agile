const Discord = require("discord.js");
const axios = require("axios")
const storage = require("./storage.js")
const { properNames, helpCommands, helpDescription } = require("./constants")
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")
const graph = require("./graph")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
//Node canvas created once to avoid memory leaks.
const nodeCanvas = new ChartJSNodeCanvas({
    width: 800,
    height: 500,
    chartCallback: (ChartJS) =>{
        ChartJS.defaults.global.defaultFontColor = '#FFFFFF'
        ChartJS.defaults.global.defaultFontSize = 16
    }
})

//This file stores all of the bot's commands.
const defaultEmbed = (ctx) => {
    //Creates an easy embed that I can grab later for covid data
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
    graph: async (ctx, args) =>{
        if(args.length == 2){
            var res = await axios.get(`https://corona.lmao.ninja/v2/historical/${args[1]}?lastdays=${args[0]}`)
            .catch(err => {
                ctx.channel.send(err.response.data.message)})
        } else if(args.length == 3) {
            var res = await axios.get(`https://corona.lmao.ninja/v2/historical/${args[1]}/${args[2]}?lastdays=${args[0]}`)
            .catch(err => {
                ctx.channel.send(err.response.data.message)})
        } else {
            var res = await axios.get(`https://corona.lmao.ninja/v2/historical/all?lastdays=${args[0]}`)
            .catch(err => {
                ctx.channel.send(err.response.data.message)})
        }
        if(res){
            let conf = graph.all(res)
            //This renders the graph and converts it to an image to be streamed
            //This streams the image to Discord and uploads it for viewing
            ctx.channel.send(new Discord.MessageAttachment(nodeCanvas.renderToStream(conf)))
        }
    },

    help: (ctx, prefix, args) => {
        //If there are no arguments
        var res = new Discord.MessageEmbed
        res.setTitle("Help")
            .setFooter(`For more information, use ${prefix}help [command] 
        \n{} = Required [] = Optional`)
            .setColor(0x800080) //Purple

        if (!args.length) {
            res.setDescription("All available commands.")
            for (let command of Object.entries(helpCommands)) {
                //Because Node doesn't have an easier option :L
                //This sets the first letter to be capitalized
                let cmdCapitalized = `${command[0][0].toUpperCase()}${command[0].slice(1)}`
                res.addField(cmdCapitalized, `\`${prefix}${command[1]}\``, true)
            }
        } else {
            //Gets helpful information on the given command.
            let command = args[0]
            res.setTitle(`Help ${command}`)
                .addField("Usage", `\`${prefix}${helpCommands[command]}\``)
                .addField("Description", helpDescription[command])
        }
        ctx.channel.send(res)
    },

    argsUsage: (msg, argType, prefix) => {
        //Sends back the proper usage of a command
        let res = `\`Usage: ${prefix}${helpCommands[argType]}\``
        msg.channel.send(res)
    },

    statAll: (ctx, yesterday = false) => {
        //Gets data from public covid API
        axios.get(`https://corona.lmao.ninja/v2/all?yesterday=${yesterday}`)
            .then(response => {
                let statInfo = loadResponse(response.data, ctx)
                    .setThumbnail("https://eoimages.gsfc.nasa.gov/images/imagerecords/8000/8108/ipcc_bluemarble_west_front.jpg")
                    //Update the title if displaying previous day's stats
                if (yesterday) { statInfo.setTitle("Yesterday's Global Statistics") }
                //Return the data to the discord channel that requested it
                ctx.channel.send(embed = statInfo)
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    ctx.channel.send(`${err.response.status}: Error Occured`)
                } else {
                    ctx.channel.send("Backend error occured, check console for information.")
                    console.log(err)
                }
            })
    },

    statCountry: (ctx, country, yesterday = false) => {
        axios.get(`https://corona.lmao.ninja/v2/countries/${country}?yesterday=${yesterday}`)
            .then(res => {
                let statInfo = loadResponse(res.data, ctx)
                    //Set the thumbnail to be the country's flag
                statInfo.setThumbnail(res.data.countryInfo.flag)
                if (yesterday) { statInfo.setTitle(`Yesterday's ${res.data.country} Statistics`) }
                storage.store(res.data)
                ctx.channel.send(embed = statInfo)
            })
            .catch(err => {
                ctx.channel.send("Country not found or doesn't have any cases")
            })
    },

    vaccineWhen: (msg, age) => {
        message = "If you are healthy and not part of an exception group, you may get your 1st dose " //default message prefix for when command
        switch (true) {
            case (age < 0):
                msg.channel.send(`Are you sure you're ${age} years-old?`)
                break;
            case (age < 12):
                msg.channel.send("There is currently no approved vaccine for children under 12. Please wait for government updates on authorized vaccines for minors.")
                break;
            case (age < 18):
                msg.channel.send(message + "between June and July.")
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
            case (age <= 150):
                msg.channel.send("If you are 80 and over and living or assessed for living in long-term care facilities or assisted living, " +
                    "you may get your 1st dose between December 2020 to February 2021. Otherwise, you may get your first dose between February to April.")
                break;
            case (age > 150):
                msg.channel.send(`Are you sure you're ${age} years-old?`)

                break;
        }
    },

    vaccineException: (msg) => {
        const exceptionEmbed = new Discord.MessageEmbed()
            .setTitle("Vaccine Exceptions")
            .setURL("https://www2.gov.bc.ca/gov/content/covid-19/vaccine/plan#phases")
            .setImage(url = "https://www2.gov.bc.ca/assets/gov/covid-19/immunization/immunization-plan-phase-3.png")
            .setColor(0xa7ff78)
            .setTimestamp()
            .setDescription("You may be eligible to get your vaccine sooner, regardless of age, if you are part of an exception or priority group. Some examples include those who are clinically vulnerable," +
                "those who work in volunerable settings, and those who are indigenous. Please check the following link to determine whether you are part of an exception group.")
            .addField("Link to BC's Immunization Plan and Exceptions:", "https://www2.gov.bc.ca/gov/content/covid-19/vaccine/plan#phases");
        msg.channel.send(exceptionEmbed);
    },
    
    //Sends information of pfizer
    pfizer: (msg) => {
        const pfizerEmbed = new Discord.MessageEmbed()
            .setTitle("Information on Pfizer Vaccine")
            .setURL("https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/pfizer-biontech.htmlss")
            .setImage(url = "https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fi.forbesimg.com%2Fmedia%2Flists%2Fcompanies%2Fpfizer_416x416.jpg")
            .setColor(0xa7ff78)
            .setTimestamp()
            .setDescription("The Pfizer vaccine is currently approved for those 12 and older in Canada. The Pfizer-BioNTech vaccine was 95% effective at preventing laboratory-confirmed COVID-19 illness in people without evidence of previous infection.")
            .addField("Link to more information on the Pfizer vaccine", "https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/pfizer-biontech.html");
        msg.channel.send(pfizerEmbed);
    },

    //send information on moderna
    moderna: (msg) => {
        const modernaEmbed = new Discord.MessageEmbed()
            .setTitle("Information on the Moderna vaccine")
            .setURL("https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/moderna.html")
            .setImage(url = "https://mms.businesswire.com/media/20201223005397/en/848810/23/KO_LOGO.jpg")
            .setColor(0xa7ff78)
            .setTimestamp()
            .setDescription("The Moderna COVID-19 vaccine is currently approved for usage in adults 18 and over in Canada.")
            .addField("Link to know more information on moderna", "https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/moderna.html");
        msg.channel.send(modernaEmbed);
    },

    // send information on AstraZeneca 
    astra: (msg) => {
        const astraZEmbed = new Discord.MessageEmbed()
            .setTitle("Information on the AstraZeneca vaccine")
            .setURL("https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/astrazeneca.html")
            .setImage(url = "https://zerocancer.org/wp-content/uploads/2020/04/AstraZeneca-Logo.png")
            .setColor(0xa7ff78)
            .setTimestamp()
            .setDescription("The AstraZeneca COVID-19 vaccine is currently only approved for usage in certain provinces.")
            .addField("Link to more information on the AstraZeneca vaccine", "https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/astrazeneca.html");
        msg.channel.send(astraZEmbed);
    },

    register: msg => {
        const registerEmbed = new Discord.MessageEmbed()
            .setTitle("Province-Specific COVID Vaccine Registration and Booking Sites")
            .setThumbnail(url = "https://i.pinimg.com/originals/df/83/70/df8370f1292163c519d35ad66746eefa.png")
            .setColor(0xa1fff9)
            .setTimestamp()
            .setDescription("For information on COVID-19 vaccine eligibility and booking services, please check the site associated with your province below:")
            .addFields(
                { name: "Alberta", value: "https://www.alberta.ca/covid19-vaccine.aspx" }, 
                { name: "British Columbia", value: "https://www2.gov.bc.ca/gov/content/covid-19/vaccine/register" },
                { name: "Manitoba", value: "https://protectmb.ca/making-your-appointment-is-easy/" },
                { name: "New Brunswick", value: "https://www2.gnb.ca/content/gnb/en/corporate/promo/covid-19/nb-vaccine/Get-Vaccinated/vaccine-pharmacy.html" },
                { name: "Newfoundland & Labrador", value: "https://www.gov.nl.ca/covid-19/vaccine/gettheshot/" },
                { name: "Northwest Territories", value: "https://www.nthssa.ca/en/services/coronavirus-disease-covid-19-updates/covid-vaccine" },
                { name: "Nova Scotia", value: "https://novascotia.ca/coronavirus/book-your-vaccination-appointment/" },
                { name: "Nunavut", value: "https://www.gov.nu.ca/health/information/covid-19-vaccination" },
                { name: "Ontario", value: "https://covid19.ontariohealth.ca/" },
                { name: "Prince Edward Island", value: "https://www.princeedwardisland.ca/en/information/health-and-wellness/getting-covid-19-vaccine" },
                { name: "Quebec", value: "https://www.quebec.ca/en/health/health-issues/a-z/2019-coronavirus/progress-of-the-covid-19-vaccination" },
                { name: "Saskatchewan", value: "https://www.saskatchewan.ca/covid19-vaccine-booking." },
                { name: "Yukon", value: "https://yukon.ca/en/appointments" })
        msg.channel.send(registerEmbed);
    },

    registerbc: (msg) => {
        const registerBCEmbed = new Discord.MessageEmbed()
            .setTitle("British Columbia Vaccine Registration")
            .setURL("https://www2.gov.bc.ca/gov/content/covid-19/vaccine/register")
            .setImage(url = "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052015/bcid_v_cmyk_pos.png?itok=6JGopq54")
            .setColor(0xa1fff9)
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in BC. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www2.gov.bc.ca/gov/content/covid-19/vaccine/register");
        msg.channel.send(registerBCEmbed);
    },

    registerab: (msg) => {
        const registerABEmbed = new Discord.MessageEmbed()
            .setTitle("Alberta Vaccine Registration")
            .setURL("https://www.alberta.ca/covid19-vaccine.aspx")
            .setImage(url='https://www.electronicrecyclingassociation.ca/wp-content/uploads/2020/11/Alberta-Health-Services-Logo.jpg')
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Alberta. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www.alberta.ca/covid19-vaccine.aspx");
        msg.channel.send(registerABEmbed);
    },
    registermb: (msg) => {
        const registerMBEmbed = new Discord.MessageEmbed()
            .setTitle("Manitoba Vaccine Registration")
            .setURL("https://protectmb.ca/making-your-appointment-is-easy/")
            .setImage(url='https://www.gov.mb.ca/health/images/mb-logo.png')
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Manitoba. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", 'https://protectmb.ca/making-your-appointment-is-easy/');
        msg.channel.send(registerMBEmbed);
    },
    registernb: (msg) => {
        const registerMBEmbed = new Discord.MessageEmbed()
            .setTitle("New Brunswik Vaccine Registration")
            .setURL("https://www2.gnb.ca/content/gnb/en/corporate/promo/covid-19/nb-vaccine/Get-Vaccinated/vaccine-pharmacy.html")
            .setImage(url='https://upload.wikimedia.org/wikipedia/en/thumb/2/24/New_Brunswick_Canada_Logo.svg/1200px-New_Brunswick_Canada_Logo.svg.png')
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in New Brunswick. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", 'https://www2.gnb.ca/content/gnb/en/corporate/promo/covid-19/nb-vaccine/Get-Vaccinated/vaccine-pharmacy.html');
        msg.channel.send(registerMBEmbed);
    },
    registerNL: (msg) => {
        const registerNWTEmbed = new Discord.MessageEmbed()
            .setTitle("NewfoundLand  Vaccine Registration")
            .setURL("https://www.gov.nl.ca/covid-19/vaccine/gettheshot/")
            .setImage(url="https://www.insurdinary.ca/wp-content/uploads/2019/10/newfoundland-labrador-logo.png")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in NewFoundLand. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www.gov.nl.ca/covid-19/vaccine/gettheshot/");
        msg.channel.send(registerNWTEmbed);
    },
    registernwt: (msg) => {
        const registerNWLEmbed = new Discord.MessageEmbed()
            .setTitle("NorthWest Territories  Vaccine Registration")
            .setURL("https://www.nthssa.ca/en/services/coronavirus-disease-covid-19-updates/covid-vaccine/")
            .setImage(url="https://www.nthssa.ca/sites/nthssa/themes/nthssa_theme/en-logo-NTHSSA.jpg")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in NorthWest Territories. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www.nthssa.ca/en/services/coronavirus-disease-covid-19-updates/covid-vaccine");
        msg.channel.send(registerNWLEmbed);
    },
    registerns: (msg) => {
        const registerNSEmbed = new Discord.MessageEmbed()
            .setTitle("Nova Scotia  Vaccine Registration")
            .setURL("https://novascotia.ca/coronavirus/book-your-vaccination-appointment/")
            .setImage(url="https://i.cbc.ca/1.5941197.1615229418!/fileImage/httpImage/image.JPG_gen/derivatives/16x9_780/nova-scotia-health-logo.JPG")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Nova Scotia. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://novascotia.ca/coronavirus/book-your-vaccination-appointment/");
        msg.channel.send(registerNSEmbed);
    },
    registernt: (msg) => {
        const registerNtEmbed = new Discord.MessageEmbed()
            .setTitle("Nunavut  Vaccine Registration")
            .setURL("https://www.gov.nu.ca/health/information/covid-19-vaccination")
            .setImage(url="https://pbs.twimg.com/profile_images/1782827261/Twitter_logo.jpg")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Nunavut. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www.gov.nu.ca/health/information/covid-19-vaccination");
        msg.channel.send(registerNtEmbed);
    },
    registeront: (msg) => {
        const registerONTEmbed = new Discord.MessageEmbed()
            .setTitle("Ontario Vaccine Registration")
            .setURL("https://covid19.ontariohealth.ca/")
            .setImage(url="https://www.baywardbulletin.ca/wp-content/uploads/2020/07/Ontario-Health-710x355.png")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Ontario. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://covid19.ontariohealth.ca/");
        msg.channel.send(registerONTEmbed);
    },
    registerpei: (msg) => {
        const registerPEIEmbed = new Discord.MessageEmbed()
            .setTitle("Prince Edward Island Vaccine Registration")
            .setURL("https://www.princeedwardisland.ca/en/information/health-and-wellness/getting-covid-19-vaccine")
            .setImage(url="https://kidsportcanada.ca/wp-content/uploads/sites/110/PEI-healthandwellness.png")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Prince Edward Island. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www.princeedwardisland.ca/en/information/health-and-wellness/getting-covid-19-vaccine");
        msg.channel.send(registerPEIEmbed);
    },
    registerQC: (msg) => {
        const registerQCEmbed = new Discord.MessageEmbed()
            .setTitle("Quebec Vaccine Registration")
            .setURL("https://www.quebec.ca/en/health/health-issues/a-z/2019-coronavirus/progress-of-the-covid-19-vaccination")
            .setImage(url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Flag_of_Quebec.svg/1200px-Flag_of_Quebec.svg.png")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Quebec. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www.quebec.ca/en/health/health-issues/a-z/2019-coronavirus/progress-of-the-covid-19-vaccination");
        msg.channel.send(registerQCEmbed);
    },
    
    registerSK: (msg) => {
        const registerSKEmbed = new Discord.MessageEmbed()
            .setTitle("Saskatchewan Vaccine Registration")
            .setURL("https://www.saskatchewan.ca/covid19-vaccine-booking.")
            .setImage(url="https://media.socastsrm.com/wordpress/wp-content/blogs.dir/343/files/2018/05/health-authority.png")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Saskatchewan. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://www.saskatchewan.ca/covid19-vaccine-booking.");
        msg.channel.send(registerSKEmbed);
    },

    registerYT: (msg) => {
        const registerYTEmbed = new Discord.MessageEmbed()
            .setTitle("Yukon Vaccine Registration")
            .setURL("https://yukon.ca/en/appointments")
            .setImage(url="https://phabc.org/wp-content/uploads/2018/01/Government-of-Yukon.png")
            .setColor(0xa1fff9) 
            .setTimestamp()
            .setDescription("Information on how to register for a COVID 19 Vaccine in Saskatchewan. If you are above 18 you may be eligible for early vaccination if you are in a high-transmission neighbourhood")
            .addField("Link to know more on registering for your vaccine", "https://yukon.ca/en/appointments");
        msg.channel.send(registerYTEmbed);
    },

    regionalRestriction: (msg) => {
        const exceptionEmbed = new Discord.MessageEmbed()
            .setTitle("Regional Restrictions")
            .setURL("https://www2.gov.bc.ca/gov/content/covid-19/travel/current")
            .setImage(url = "https://www2.gov.bc.ca/assets/gov/covid-19/core-info/covid-health-region-bubbles-website.png")
            .setColor(0xfa6e6e)
            .setTimestamp()
            .setDescription("Non-essential travel restrictions are in-place until May 25th to reduce the spread of COVID-19. " +
                "You may be stopped for a travel road check and fined if you are found to be traveling for non-essential reasons between the regions below.")
            .addFields({
                name: "Travel Regions",
                value: "1.  !reLower Mainland and Fraser Valley\n2. Northern/Interior\n3. Vancouver Island"
            })
            .addField("Link to BC's Travel and Regional Restrictions:", "https://www2.gov.bc.ca/gov/content/covid-19/travel/current");
        msg.channel.send(exceptionEmbed);
    },

    restrictionEmbed: (msg) => {
        const exceptionEmbed = new Discord.MessageEmbed()
            .setTitle("BC Province-Wide Restrictions")
            .setURL("https://www2.gov.bc.ca/gov/content/covid-19/info/restrictions")
            .setImage(url = "https://www2.gov.bc.ca/assets/gov/covid-19/core-info/covid-health-region-bubbles-website.png")
            .setColor(0xfa6e6e)
            .setTimestamp()
            .addFields(
                { name: "Stronger Province-Wide Restrictions", value: "Restrictions are currently in effect in order to reduce the spread of COVID-19. Notably, large gatherings are currently not permitted."},
                { name: "Restaurant Dining", value: "Indoor up to groups of 6" }, 
                { name: "Indoor gatherings", value: "Core bubble or household only" }, 
                { name: "Outdoor Gatherings", value: "Up to 10 people" }, 
                { name: "Masks", value: "Mandatory in indoor settings" })
            .addField("Link for additional information on province-wide restrictions", "https://www2.gov.bc.ca/gov/content/covid-19/info/restrictions");
        msg.channel.send(exceptionEmbed);
    },

    faq: msg => {
        const exceptionEmbed = new Discord.MessageEmbed()
            .setTitle("Frequently Asked Questions")
            .setColor(0xffd400)
            .setTimestamp()
            .setThumbnail("https://img.icons8.com/bubbles/2x/question-mark.png")
            .addFields(
                { name: "When will I get my vaccine?", value: "Please use the !when {age} command to find out when you can get your vaccine" }, 
                { name: "What are the key symptoms of COVID-19?", value: "Fever or chills, cough, loss of sense of smell or taste, and difficulty breathing" }, 
                { name: "What should I do if I think I have COVID-19?", value: "Please go to your province's testing page to find out how to get tested for free, and take a COVID-19 self-assessment tool." }, 
                { name: "When should I get tested for COVID-19?", value: "Please get tested if you develop COVID-19-like symptoms (listed above) or if someone close to you has tested positive for COVID-19." }, 
                { name: "How is COVID-19 treated?", value: "There is no specific treatment besides common home treatments for the cold and flu. Hospitalization may be required if symptoms are more severe." }, 
                { name: "Where can I find information on COVID-19 restrictions?", value: "Please use the !restriction command or check your local province's restrictions page for the latest information." }, 
                { name: "Do I have to wear a mask?", value: "Masks are currently required in all indoor public spaces, in stores, and on public transportation." }, 
                { name: "When would I have to quarantine?", value: "If you have travelled outside of Canada and are returning, or if you have been in close contact with someone who has tested positive for COVID-14, you must self-isolate for 14 days even if you do not have symptoms."
            })
        msg.channel.send(exceptionEmbed);
    },

    phoneline: msg => {
        const phoneEmbed = new Discord.MessageEmbed()
        .setTitle("Phone Lines for COVID-related help or advice")
        .setColor(0x9feb94) 
        .setTimestamp()
        .setURL("https://bc.thrive.health/covid19app/resources/559894d8-8df3-4243-9246-bf7a46323744")
        .setThumbnail("https://icons-for-free.com/iconfiles/png/512/phone+telephone+icon-1320087273381945535.png")
        .addFields({name: "9-1-1: Emergency Line", value: "Call 9-1-1 immediately if you or someone around you has chest pain, difficulty breathing, severe bleeding."},
            {name:"8-1-1: Health Information and Health Advice Line", value:"Available 24/7. Translation services available.\nCall 8-1-1 for information and advice on your health. You can be connected to a registered nurse, registered dietition, exercise professional, or pharmacist depending on your needs."},
            {name:"1-888-268-4319: COVID-19 Questions", value: "Available from 7:30AM to 8:00PM PST. Translation services available.\nCall for non-medical information about COVID-19, including information on travel recommendations, social distancing, and government support."},
            {name:"2-1-1: Community, Social and Government Services", value: "Available 24/7. Call for information on financial assistance or income support, legal aid, child and fmaily services, temporary financial relief, and home support."},
            {name:"1-800-563-0808: VictimLinkBC", value: "Available 24/7. Call VictimLinkBC for immediate crisis support and information to victims of family and sexual violence."},
            {name:"1-855-687-1868: Women's Support Services", value: "Available 24/7. Call Women's Support Services for immediate help and support to those experiencing gender-based violence and uncertainty."},
            )
        msg.channel.send(phoneEmbed);
    }
}