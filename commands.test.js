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



it("Making sure argsUsage works", () => {
    message.content = "when"
    commands.argsUsage(message, "when")
    expect(message.channel.send)
        .lastCalledWith("`Usage: undefinedwhen {Your age OR exception}`")

})

it("With `register` as argument", () => {
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