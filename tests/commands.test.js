const Discord = require("discord.js");
const commands = require("../javaScript/commands.js")
const constants = require("../javaScript/constants")
//Mock API get request
const mockData = require("./mockAPIData")
const axios = require("axios");
jest.mock('axios')

let message = ({
    channel: {
        send: jest.fn(),
    },
    content: "",
    author: {
        bot: false,
        username: "TEST"
    }
})

let prefix = '!'

beforeEach(() => {
    jest.clearAllMocks();
})

afterAll(() => {})

describe("Individual Commands", () => {
    describe("!Help command", () =>{
        let prefix = '!'
        message.content = "!help"
        it("No arguments", () => {
            commands.help(message, prefix, [])
            let expectedEmbed = message.channel.send.mock.calls[0][0]
            expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)

            expect(expectedEmbed.fields).toEqual(
                expect.arrayContaining([{ name: 'Stat', value: `\`!${constants.helpCommands.stat}\``, inline: true }])
            )
        })

        it("With `help` as argument", () =>{
            commands.help(message, prefix, ['help'])
            let expectedEmbed = message.channel.send.mock.calls[0][0]
            expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)

            expect(expectedEmbed.fields).toEqual(
                expect.arrayContaining([
                    {name: "Usage", value: "`!help [Command]`", inline: false},
                    {name: "Description", value: "Provides the user useful information (Like this!) on what commands do. \nCan be given a command name to find more information (Like you just did!)", inline: false}
                ])
            )
        })
    })
    
    describe("!Stat command", () =>{
        message.content = "!stat"
        it("No arguments (All stats)", async () => {
            axios.get.mockResolvedValue(mockData.all)
            await commands.statAll(message)
            let expectedEmbed = message.channel.send.mock.calls[0][0]
            expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)

            expect(expectedEmbed.fields).toEqual(
                //Check to see the embed contains the two following values
                //These are the first and last values to ensure that all values are accounted for.
                expect.arrayContaining([
                    {"inline": true, "name": "Time last updated", "value": "2021-05-12 20:41:35"},
                    {"inline": true, "name": "Deaths per Million", "value": "428.5"},
                    {"inline": true, "name": "Affected Countries", "value": "222"}])
            )
        })

        it("Country Argument (Canada)", async () => {
            await axios.get.mockResolvedValue(mockData.canada)
            await commands.statCountry(message, 'canada')

            let expectedEmbed = message.channel.send.mock.calls[0][0]
            expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)

            expect(expectedEmbed.thumbnail.url).toBe("https://disease.sh/assets/img/flags/ca.png")
            expect(expectedEmbed.fields).toEqual(
                //Check to see the embed contains the two following values
                //These are the first and last values to ensure that all values are accounted for.
                expect.arrayContaining([
                    {"inline": true, "name": "Time last updated", "value": "2021-05-13 21:11:51"},
                    {"inline": true, "name": "Deaths per Million", "value": "651"},
                    {"inline": true, "name": "Critical Cases per Million", "value": "34.9"}])
            )
        })
        it("Yesterday All Stats", async () =>{
            axios.get.mockResolvedValue(mockData.yesterdayAll)
            await commands.statAll(message, yesterday=true)

            let expectedEmbed = message.channel.send.mock.calls[0][0]
            expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
            expect(expectedEmbed.title).toBe("Yesterday's Global Statistics")
            expect(expectedEmbed.thumbnail.url).toBe("https://eoimages.gsfc.nasa.gov/images/imagerecords/8000/8108/ipcc_bluemarble_west_front.jpg")

            expect(expectedEmbed.fields).toEqual(
                expect.arrayContaining([
                    {"inline": true, "name": "Time last updated", "value": "2021-05-14 02:11:54"},
                    {"inline": true, "name": "Deaths per Million", "value": "430.9"},
                    {"inline": true, "name": "Critical Cases per Million", "value": "13.32"}
                ]))
        })
        it("Yesterday Country Stats (CAD)", async () => {
            axios.get.mockResolvedValue(mockData.yesterdayCanada)
            await commands.statCountry(message, 'canada', yesterday=true)

            let expectedEmbed = message.channel.send.mock.calls[0][0]
            expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
            expect(expectedEmbed.title).toBe("Yesterday's Canada Statistics")
            expect(expectedEmbed.thumbnail.url).toBe("https://disease.sh/assets/img/flags/ca.png")

            expect(expectedEmbed.fields).toEqual(
                expect.arrayContaining([
                    {"inline": true, "name": "Time last updated", "value": "2021-05-14 02:11:55"},
                    {"inline": true, "name": "Deaths per Million", "value": "653"},
                    {"inline": true, "name": "Critical Cases per Million", "value": "34.9"}
                ])
            )
        })
    })

    it("Register without Argument", () => {
        commands.register(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(13);

        let provinceArray = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", 
        "Newfoundland & Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", 
        "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"]

        for (i = 0; i < expectedEmbed.fields.length; i++) {
            expect(expectedEmbed.fields[i]['name']).toEqual(provinceArray[i])
        }
    })

    it("Register with BC Argument", () => {
        commands.registerbc(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{"inline": false, "name": "Link to know more on registering for your vaccine", 
            "value": "https://www2.gov.bc.ca/gov/content/covid-19/vaccine/register"}])))
    })
    
    it("Register with AB Argument", () => {
        commands.registerab(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name: 'Link to know more on registering for your vaccine',
            value: 'https://www.alberta.ca/covid19-vaccine.aspx',
            inline: false
          }])))})

    it("Register with MB Argument", () => {
        commands.registermb(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name: "Link to know more on registering for your vaccine", 
            value:'https://protectmb.ca/making-your-appointment-is-easy/',
            inline: false
            }])))
    })

    it("Register with NB Argument", () => {
        commands.registernb(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name: "Link to know more on registering for your vaccine", 
            value: 'https://www2.gnb.ca/content/gnb/en/corporate/promo/covid-19/nb-vaccine/Get-Vaccinated/vaccine-pharmacy.html',
            inline: false
            }])))
    })

    it("Register with NL Argument", () => {
        commands.registerNL(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name:"Link to know more on registering for your vaccine", 
            value:"https://www.gov.nl.ca/covid-19/vaccine/gettheshot/",
            inline: false
            }])))
    })

    it("Register with NWT Argument", () => {
        commands.registernwt(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name:"Link to know more on registering for your vaccine", 
            value:"https://www.nthssa.ca/en/services/coronavirus-disease-covid-19-updates/covid-vaccine",
            inline: false
            }])))
    })

    it("Register with NS Argument", () => {
        commands.registerns(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name:"Link to know more on registering for your vaccine", 
            value:"https://novascotia.ca/coronavirus/book-your-vaccination-appointment/",
            inline: false
            }])))
    })

    it("Register with NT Argument", () => {
        commands.registernt(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name:"Link to know more on registering for your vaccine", 
            value:"https://www.gov.nu.ca/health/information/covid-19-vaccination",
            inline: false
            }])))
    })
    it("Register with ONT Argument", () => {
        commands.registeront(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name:"Link to know more on registering for your vaccine", 
            value:"https://covid19.ontariohealth.ca/",
            inline: false
            }])))
    })
    
    it("Register with PEI Argument", () => {
        commands.registerpei(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name:"Link to know more on registering for your vaccine", 
            value:"https://www.princeedwardisland.ca/en/information/health-and-wellness/getting-covid-19-vaccine",
            inline: false
            }])))
    })

    it("Register with QC Argument", () => {
        commands.registerQC(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{ name:"Link to know more on registering for your vaccine", 
            value:"https://www.quebec.ca/en/health/health-issues/a-z/2019-coronavirus/progress-of-the-covid-19-vaccination",
            inline: false
            }])))
    })

    it("When command", () => {
        msg = "If you are healthy and not part of an exception group, you may get your 1st dose "
        commands.vaccineWhen(message, -5)
        expect(message.channel.send).lastCalledWith(`Are you sure you're -5 years-old?`)
        commands.vaccineWhen(message, 5)
        expect(message.channel.send).lastCalledWith(`There is currently no approved vaccine for children under 12. Please wait for government updates on authorized vaccines for minors.`)
        commands.vaccineWhen(message, 13)
        expect(message.channel.send).lastCalledWith(msg + "between June and July.")
        commands.vaccineWhen(message, 25)
        expect(message.channel.send).lastCalledWith(msg + "in June.")
        commands.vaccineWhen(message, 37)
        expect(message.channel.send).lastCalledWith(msg + "between May and June.")
        commands.vaccineWhen(message, 55)
        expect(message.channel.send).lastCalledWith(msg + "in May.")
        commands.vaccineWhen(message, 62)
        expect(message.channel.send).lastCalledWith(msg + "between April and May")
        commands.vaccineWhen(message, 75)
        expect(message.channel.send).lastCalledWith(msg + "in April")
        commands.vaccineWhen(message, 90)
        expect(message.channel.send).lastCalledWith("If you are 80 and over and living or assessed for living in long-term care facilities or assisted living, " +
        "you may get your 1st dose between December 2020 to February 2021. Otherwise, you may get your first dose between February to April.")
        commands.vaccineWhen(message, 160)
        expect(message.channel.send).lastCalledWith("Are you sure you're 160 years-old?")
    })

    it("When Exception", () => {
        commands.vaccineException(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(1);
        expect(expect(expectedEmbed.fields).toEqual(
            expect.arrayContaining([{"inline": false, "name": "Link to BC's Immunization Plan and Exceptions:", 
            "value": "https://www2.gov.bc.ca/gov/content/covid-19/vaccine/plan#phases"}])))
    })

    it("FAQ Command", () => {
        commands.faq(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
        expect(expectedEmbed.fields.length).toEqual(8);
        expect(expect(expectedEmbed.title).toEqual("Frequently Asked Questions"))
    })

    describe ("!Info command", () => {
        it("Checking to see if pfizer works", () =>{
        message.content = "!info pfizer"
        
        commands.pfizer(message)
        let mockCall = message.channel.send.mock.calls
        expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
        expect(mockCall[0][0].fields).toEqual(
            expect.arrayContaining( [{"inline": false, "name": "Link to more information on the Pfizer vaccine", "value": "https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/pfizer-biontech.html"}])
        )})
        it("Checking to see if moderna link works", () =>{
            message.content = "!info moderna"
            commands.moderna(message)
            let mockCall = message.channel.send.mock.calls
            expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
            expect(mockCall[0][0].fields).toEqual(
                expect.arrayContaining( [{'name':'Link to know more information on moderna', 'value': 'https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/moderna.html', 'inline': false}])
            )})
        
        it("Checking to see if the AstraZeneca Link works", () => {
            message.content = "!info astrazeneca"
            commands.astra(message)
            let mockCall = message.channel.send.mock.calls
            expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
            expect(mockCall[0][0].fields).toEqual(
                expect.arrayContaining( [{"inline": false, "name": "Link to more information on the AstraZeneca vaccine", "value": "https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/astrazeneca.html"}])
                )})})
        
    describe("!restriction function", () => {
        message.content = "!restriction"
        it ("Checking to see if !restriction works", () =>{
            commands.restrictionEmbed(message)
            let mockCall = message.channel.send.mock.calls
            expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
            expect(mockCall[0][0].fields).toEqual(
                expect.arrayContaining( [
                    {
                      name: 'Stronger Province-Wide Restrictions',
                      value: 'Restrictions are currently in effect in order to reduce the spread of COVID-19. Notably, large gatherings are currently not permitted.',
                      inline: false
                    },
                    {
                      name: 'Restaurant Dining',
                      value: 'Indoor up to groups of 6',
                      inline: false
                    },
                    {
                      name: 'Indoor gatherings',
                      value: 'Core bubble or household only',
                      inline: false
                    },
                    {
                      name: 'Outdoor Gatherings',
                      value: 'Up to 10 people',
                      inline: false
                    },
                    {
                      name: 'Masks',
                      value: 'Mandatory in indoor settings',
                      inline: false
                    },
                    {
                      name: 'Link for additional information on province-wide restrictions',
                      value: 'https://www2.gov.bc.ca/gov/content/covid-19/info/restrictions',
                      inline: false
                    }
                  ])
                )})
        it("test the reigonal restriction", () =>{
            message.content = "!restriction region"
            commands.regionalRestriction(message)
            let mockCall = message.channel.send.mock.calls
            expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
            expect(mockCall[0][0].fields).toEqual(
                expect.arrayContaining([{
                    name: 'Travel Regions',
                    value: '1.  !reLower Mainland and Fraser Valley\n' +
                      '2. Northern/Interior\n' +
                      '3. Vancouver Island',
                    inline: false
                  },
                  {
                    name: "Link to BC's Travel and Regional Restrictions:",
                    value: 'https://www2.gov.bc.ca/gov/content/covid-19/travel/current',
                    inline: false}]))})})


        


    it("ArgsUsage backend", () => {
        message.content = "!when"
        commands.argsUsage(message, "when", prefix)
        expect(message.channel.send)
            .lastCalledWith("`Usage: !when {Your age OR exception}`")
    })
})
