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



    it("ArgsUsage backend", () => {
        message.content = "!when"
        commands.argsUsage(message, "when", prefix)
        expect(message.channel.send)
            .lastCalledWith("`Usage: !when {Your age OR exception}`")
    })
})


