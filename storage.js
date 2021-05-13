const { PrismaClient } = require('@prisma/client')
const axios = require("axios")

const prisma = new PrismaClient()


async function store(countryName = "World", JSONdata) {

    const post = await prisma.post.create({

        data: {
            statsJSON: JSONdata,
            updatedAt: Date.now(),
            Country: {
                name: countryName,
                updatedAt: Date.now(),
                createdAt: Date.now()
            },
        },

    })

    console.log(post)


    const allUsers = await prisma.user.findMany({

        include: { posts: true },

    })

    console.dir(allUsers, { depth: null })

}

// main()
//     .catch(e => {
//         throw e
//     })
//     .finally(async() => {
//         await prisma.$disconnect()
//     })

module.exports = store();