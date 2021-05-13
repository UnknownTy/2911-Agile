const Discord = require("discord.js");
const commands = require("../commands.js")
const { messageHandler } = require("../index.js")

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

describe("Message Handling", () => {
    describe("Check commands are called", () =>{
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
        describe("Prefix Handling", () => {
            it("Check for prefix update", () => {
                message.content = "!prefix +"
                messageHandler(message)
                //Test that it sets the prefix properly
                expect(message.channel.send).lastCalledWith("Prefix updated to `+`")
                //Test that it can return the prefix using the new one
                message.content = "+prefix !"
                messageHandler(message)
                expect(message.channel.send)
                .lastCalledWith("Prefix updated to `!`")
            })
            it("Error handling", () => {
                message.content = "!prefix TEST"
                messageHandler(message)
                expect(message.channel.send)
                .lastCalledWith("Invalid new prefix TEST, cannot be longer than one character")
    
                //We aren't testing the functinonality, just that the handler passes the right args.
                let tmpFunc = commands.argsUsage
                commands.argsUsage = jest.fn()
                message.content = "!prefix"
                messageHandler(message)
                expect(commands.argsUsage).lastCalledWith(message, "prefix", prefix)
                commands.argsUsage = tmpFunc
            })
        })
        describe("Help Handling", () => {
            let tmpFunc = commands.help
            it("No Arguments", () =>{
                commands.help = jest.fn()
                message.content = "!help"
                messageHandler(message)
                expect(commands.help).lastCalledWith(message, prefix, []) 
                commands.help = tmpFunc
            })
            it("With Arguments", () => {
                commands.help = jest.fn()
                message.content = "!help TEST"
                messageHandler(message)
                expect(commands.help).lastCalledWith(message, prefix, ['TEST'])
                commands.help = tmpFunc
            })
        })
        describe("Stat Handling", () => {
            it("Population stats", () => {
                let tmpFunc = commands.statAll
                commands.statAll = jest.fn()
                message.content = "!stat"
                messageHandler(message)
                expect(commands.statAll).lastCalledWith(message)
                commands.statAll = tmpFunc
            })
            it("Country stats", () => {
                let tmpFunc = commands.statCountry
                commands.statCountry = jest.fn()
                message.content = "!stat Canada NOT_CALLED"
                messageHandler(message)
                expect(commands.statCountry).lastCalledWith(message, "canada")
                commands.statCountry = tmpFunc
            })
        })
    })

    it("Ignore bot messages", () =>{
        message.author.bot = true
        let check = messageHandler(message)
        expect(check).toBe(undefined)
    })
    it("Ignore non-prefix messages", () => {
        message.content = "NO PREFIX"
        let check = messageHandler(message)
        expect(check).toBe(undefined)
    })
})