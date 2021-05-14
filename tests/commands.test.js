const Discord = require("discord.js");
const commands = require("../commands.js")
const constants = require("../constants")
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
    it("Register with Argument", () => {
        commands.register(message)
        let expectedEmbed = message.channel.send.mock.calls[0][0]
        expect(expectedEmbed).toBeInstanceOf(Discord.MessageEmbed)
    
        let provinceArray = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", 
        "Newfoundland & Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", 
        "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"]
        
        for (i = 0; i < expectedEmbed.fields.length; i++) {
            expect(expectedEmbed.fields[i]['name']).toEqual(provinceArray[i])
        }
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
                      value: 'Extra restrictions are currently in effect in order to reduce the spread of COVID-19. Notably, indoor dining and indoor religious gatherings are currently not permitted.',
                      inline: false
                    },
                    {
                      name: 'Restaurant Dining',
                      value: 'Outdoor/Patio only',
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
            
            })

        

    it("ArgsUsage backend", () => {
        message.content = "!when"
        commands.argsUsage(message, "when", prefix)
        expect(message.channel.send)
            .lastCalledWith("`Usage: !when {Your age OR exception}`")
    })
})


