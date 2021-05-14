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


    it("ArgsUsage backend", () => {
        message.content = "!when"
        commands.argsUsage(message, "when", prefix)
        expect(message.channel.send)
            .lastCalledWith("`Usage: !when {Your age OR exception}`")
    })
})


