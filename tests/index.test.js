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
            it("With AB as argument", () => {
                message.content = "!register ab"
                messageHandler(message)
                expect(commands.registerab)
                    .lastCalledWith(message)
            })
            it("With mb as argument", () => {
                message.content = "!register mb"
                messageHandler(message)
                expect(commands.registermb)
                    .lastCalledWith(message)
            })
            it("With nb as argument", () => {
                message.content = "!register NB"
                messageHandler(message)
                expect(commands.registernb)
                    .lastCalledWith(message)
            })
            it("With nl as argument", () => {
                message.content = "!register NfL"
                messageHandler(message)
                expect(commands.registerNL)
                    .lastCalledWith(message)
            })
            it("With nwl as argument", () => {
                message.content = "!register Nwt"
                messageHandler(message)
                expect(commands.registernwt)
                    .lastCalledWith(message)
            })
            it("With ns as argument", () => {
                message.content = "!register ns"
                messageHandler(message)
                expect(commands.registerns)
                    .lastCalledWith(message)
            })
            it("With nt as argument", () => {
                message.content = "!register nt"
                messageHandler(message)
                expect(commands.registernt)
                    .lastCalledWith(message)
            })
            it("With ont as argument", () => {
                message.content = "!register ont"
                messageHandler(message)
                expect(commands.registeront)
                    .lastCalledWith(message)
            })
            it("With PEI as argument", () => {
                message.content = "!register PEI"
                messageHandler(message)
                expect(commands.registerpei)
                    .lastCalledWith(message)
            })
            it("With QC as argument", () => {
                message.content = "!register QC"
                messageHandler(message)
                expect(commands.registerQC)
                    .lastCalledWith(message)
            })
            it("With SK as argument", () => {
                message.content = "!register SK"
                messageHandler(message)
                expect(commands.registerSK)
                    .lastCalledWith(message)
            })
            it("With YT as argument", () => {
                message.content = "!register YT"
                messageHandler(message)
                expect(commands.registerYT)
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
            it("With arguments leading to ArgsUsage", () => {
                message.content = "!faq nowpls"
                messageHandler(message)
                expect(commands.argsUsage).lastCalledWith(message, "faq", prefix)

                message.content = "!prefix"
                messageHandler(message)
                expect(commands.argsUsage).lastCalledWith(message, "prefix", prefix)
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