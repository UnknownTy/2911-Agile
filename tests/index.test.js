const Discord = require("discord.js");
const commands = require("../commands.js")
const { messageHandler } = require("../index.js")

for (cmd in commands){
    commands[cmd] = jest.fn()
}

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
        describe("When handling", () =>{
            it("One argument (Age 88)", () => {
                message.content = "!when 88"
                messageHandler(message)
                expect(commands.vaccineWhen)
                    .lastCalledWith(message, '88')
            })
            it("Exception", () => {
                message.content = "!when exception"
                messageHandler(message)
                expect(commands.vaccineException)
                    .lastCalledWith(message)
            })
            it("No arguments", () => {
                message.content = "!when"
                messageHandler(message)
                expect(commands.argsUsage)
                    .lastCalledWith(message, "when", prefix)
            })

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
    
                message.content = "!prefix"
                messageHandler(message)
                expect(commands.argsUsage).lastCalledWith(message, "prefix", prefix)
            })
        })
        describe("Help Handling", () => {
            it("No Arguments", () =>{
                message.content = "!help"
                messageHandler(message)
                expect(commands.help).lastCalledWith(message, prefix, []) 
            })
            it("With Arguments", () => {
                commands.help = jest.fn()
                message.content = "!help TEST"
                messageHandler(message)
                expect(commands.help).lastCalledWith(message, prefix, ['TEST'])
            })
        })
        describe("Stat Handling", () => {
            it("Population stats", () => {
                message.content = "!stat"
                messageHandler(message)
                expect(commands.statAll).lastCalledWith(message)
            })
            it("Country stats", () => {
                message.content = "!stat Canada NOT_CALLED"
                messageHandler(message)
                expect(commands.statCountry).lastCalledWith(message, "canada")
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