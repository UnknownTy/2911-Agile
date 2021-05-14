const { PrismaClient } = require('@prisma/client')
const axios = require("axios")

const prisma = new PrismaClient()


async function store(country = "world", stats) {

    const post = await prisma.post.create({

        data: {
            statsJSON: stats,
            updatedAt: Date.now(),
            Country: {
                name: country,
                updatedAt: Date.now(),
                createdAt: Date.now(),
            },
        },

    })

    console.log(post)


    const allUsers = await prisma.post.findMany({

        include: { posts: true },

    })

    console.dir(allUsers, { depth: null })

}

// store()
//     .catch(e => {
//         throw e
//     })
//     .finally(async() => {
//         await prisma.$disconnect()
//     })

module.exports = store();