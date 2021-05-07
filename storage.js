const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function createCountry(countryName = "World", JSONdata) {
    // ... you will write your Prisma Client queries here
    const post = await prisma.post.create({
        data: {
            updated: JSONdata.updated,
            cases: JSONdata.cases,
            todayCases: JSONdata.todayCases,
            deaths: JSONdata.deaths,
            todayDeaths: JSONdata.todayDeaths,
            recovered: JSONdata.recovered,
            todayRecovered: JSONdata.todayRecovered,
            active: JSONdata.active,
            critical: casesPerOneMillion 20104
            deathsPerOneMillion 419.5
            tests 2238763207
            testsPerOneMillion 286173.65
            population 7823093322
            oneCasePerPeople 0
            oneDeathPerPeople 0
            oneTestPerPeople 0
            undefined 0
            activePerOneMillion 2368.45
            recoveredPerOneMillion 17244.97
            criticalPerOneMillion 13.98
            affectedCountries 222




        },
    })

}

main()
    .catch(e => {
        throw e
    })
    .finally(async() => {
        await prisma.$disconnect()
    })