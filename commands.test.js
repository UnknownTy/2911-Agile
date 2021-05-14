const Discord = require("discord.js");
const commands = require("./commands.js")
const request = require("supertest")
const { messageHandler } = require("./index.js")

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
beforeEach(() => {
    jest.clearAllMocks();
})
afterAll(() => {})

// Test for the "When Can I get a vaccine"
describe("!when command & Message Handling", () => {
    it("test age 6", () => {
            message.content = "!when 6"
            messageHandler(message)
            expect(message.channel.send)
                .lastCalledWith("There is currently no approved vaccine for children under 12. Please wait for government updates on authorized vaccines for minors.")
        })
        // Test for when I can get a vaccine for 88 years
    it("test age 88", () => {
        message.content = "!when 88"
        messageHandler(message)
        expect(message.channel.send)
            .lastCalledWith("If you are 80 and over and living or assessed for living in long-term care facilities or assisted living, " +
                "you may get your 1st dose between December 2020 to February 2021. Otherwise, you may get your first dose between February to April.")
    })
    it("test exception", () => {
        message.content = "!when exception"
        messageHandler(message)
        let mockCall = message.channel.send.mock.calls
        expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
    })
})

describe ("Making sure the !info works", () => {
    it("Checking to see if pfizer works", () =>{
    message.content = "!info pfizer"
    messageHandler(message)
    let mockCall = message.channel.send.mock.calls
    expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
    expect(mockCall[0][0].fields).toEqual(
        expect.arrayContaining( [{"inline": false, "name": "Link to know more information on pfizer", "value": "https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/pfizer-biontech.html"}])
    )})
    it("Checking to see if moderna link works", () =>{
        message.content = "!info moderna"
        messageHandler(message)
        let mockCall = message.channel.send.mock.calls
        expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
        expect(mockCall[0][0].fields).toEqual(
            expect.arrayContaining( [{'name':'Link to know more information on moderna', 'value': 'https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/moderna.html', 'inline': false}])
        )})
    
    it("Checking to see if the AstraZeneca Link works", () => {
        message.content = "!info astrazeneca"
        messageHandler(message)
        let mockCall = message.channel.send.mock.calls
        expect(mockCall[0][0]).toBeInstanceOf(Discord.MessageEmbed)
        expect(mockCall[0][0].fields).toEqual(
            expect.arrayContaining( [{
                'name': 'Link to know more information on AstraZeneca',
                'value': 'https://www.canada.ca/en/health-canada/services/drugs-health-products/covid19-industry/drugs-vaccines-treatments/vaccines/astrazeneca.html',
                'inline': false
            }])
            )})})

it("Making sure argsUsage works", () => {
    message.content = "when"
    commands.argsUsage(message, "when")
    expect(message.channel.send)
        .lastCalledWith("`Usage: undefinedwhen {Your age OR exception}`")

})