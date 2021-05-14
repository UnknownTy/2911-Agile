const Discord = require("discord.js");
const commands = require("../commands.js")
const { messageHandler } = require("../index.js")

//This file is JUST to test how we handle messages, not the backend or the responses.
//Set all commands to be mocks.
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
        //!When
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
        //!Restriction
        describe("Restriction handling", () =>{
            it("One argument (BC)", () =>{
                message.content = "!restriction region"
                messageHandler(message)
                expect(commands.regionalRestriction)
                    .lastCalledWith(message)
            })
            it("No arguments", () =>{
                message.content = "!restriction"
                messageHandler(message)
                expect(commands.restrictionEmbed)
                    .lastCalledWith(message)
            })
            it("More than one argument", () => {
                message.content = "!restriction bc TEST"
                messageHandler(message)
                expect(commands.argsUsage)
                    .lastCalledWith(message, "restriction", prefix)
            })
        })

        //!info
        describe("Info Handling", () => {
            it("Pfizer", () => {
                message.content = "!info pfizer"
                messageHandler(message)
                expect(commands.pfizer)
                    .lastCalledWith(message)
            })
            it("Moderna", () => {
                message.content = "!info moderna"
                messageHandler(message)
                expect(commands.moderna)
                    .lastCalledWith(message)
            })
            it("Astrazeneca", () => {
                message.content = "!info astrazeneca"
                messageHandler(message)
                expect(commands.astra)
                    .lastCalledWith(message)
            })
        })

        //!Prefix
        describe("Prefix Handling", () => {
            it("Check for prefix update", () => {
                message.content = "!prefix +"
                messageHandler(message)
                //Test that it sets the prefix properly
                expect(message.channel.send)
                    .lastCalledWith("Prefix updated to `+`")
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
                expect(commands.argsUsage)
                    .lastCalledWith(message, "prefix", prefix)
            })
        })
        //!Help
        describe("Help Handling", () => {
            it("No Arguments", () =>{
                message.content = "!help"
                messageHandler(message)
                expect(commands.help)
                    .lastCalledWith(message, prefix, []) 
            })
            it("With Arguments", () => {
                commands.help = jest.fn()
                message.content = "!help TEST"
                messageHandler(message)
                expect(commands.help)
                    .lastCalledWith(message, prefix, ['TEST'])
            })
        })
        //!Stat
        describe("Stat Handling", () => {
            it("Population stats", () => {
                message.content = "!stat"
                messageHandler(message)
                expect(commands.statAll)
                    .lastCalledWith(message)
            })
            it("Country stats", () => {
                message.content = "!stat Canada NOT_CALLED"
                messageHandler(message)
                expect(commands.statCountry)
                    .lastCalledWith(message, "canada")
            })
            it("Yesterday Population stats", () => {
                message.content = "!staty"
                messageHandler(message)
                expect(commands.statAll)
                    .lastCalledWith(message, yesterday=true)
            })
            it("Yesterday Country stats", () =>{
                message.content = "!staty USA NOT_CALLED"
                messageHandler(message)
                expect(commands.statCountry)
                    .lastCalledWith(message, "usa", yesterday=true)
            })
        })
        //!Register handling
        describe("Register Handling", () => {
            it("With no arguments", () => {
                message.content = "!register"
                messageHandler(message)
                expect(commands.register)
                    .lastCalledWith(message)
            })
            it("With BC as argument", () => {
                message.content = "!register bc"
                messageHandler(message)
                expect(commands.registerbc)
                    .lastCalledWith(message)
            })
        })
        //!faq handling
        describe("FAQ Handling", () => {
            it("With no arguments", () => {
                message.content = "!faq"
                messageHandler(message)
                expect(commands.faq)
                    .lastCalledWith(message)
            })
        })
    })

    //Initial tests to see if bot should even respond
    it("Ignore bot messages", () =>{
        message.author.bot = true
        let check = messageHandler(message)
        expect(check).toBe(false)
        message.author.bot = false
    })
    it("Ignore non-prefix messages", () => {
        message.content = "TEST"
        let check = messageHandler(message)
        expect(check).toBe(false)
    })
})