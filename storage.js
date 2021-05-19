const { PrismaClient } = require('@prisma/client')
const axios = require("axios")

const prisma = new PrismaClient()


const store = async covidstats => {
    const checkExisting = await prisma.country.findUnique({
        where: { id: covidstats.countryInfo._id }
    })

    if (checkExisting) {
        await prisma.country.update({
            where: { id: covidstats.countryInfo._id },
            data: { stats: covidstats }
        })
    } else {
        await prisma.country.create({
            data: {
                id: covidstats.countryInfo._id,
                name: covidstats.country,
                stats: covidstats,

            }
        })
    }
}

///suppose to return the queried country stats
const report = async countryname => {
    const reportstats = prisma.country.findMany({
        where: { name: countryname }
    })
    return reportstats;
}

///to test the return, just runs when bot starts, also how the function is called
const test = report("malta")
    .then(function(result) {
        console.log(result);
    })

//to update the DB
//not sure where this should be called from
// async function updateDB() {
//     const countryModel = await prisma.country.findMany()
//     for ( i = 0; i < countryModel.length; i++){
//         axios.get(`https://corona.lmao.ninja/v2/all`)
//             .then()
//     }
// }

let mockData = {
    "updated": 1620965513812,
    "country": "Canada",
    "countryInfo": {
        "_id": 124,
        "iso2": "CA",
        "iso3": "CAN",
        "lat": 60,
        "long": -95,
        "flag": "https://disease.sh/assets/img/flags/ca.png"
    },
    "cases": 1312414,
    "todayCases": 6644,
    "deaths": 24825,
    "todayDeaths": 59,
    "recovered": 1212114,
    "todayRecovered": 7786,
    "active": 75475,
    "critical": 1327,
    "casesPerOneMillion": 34512,
    "deathsPerOneMillion": 653,
    "tests": 33130218,
    "testsPerOneMillion": 871208,
    "population": 38027907,
    "continent": "North America",
    "oneCasePerPeople": 29,
    "oneDeathPerPeople": 1532,
    "oneTestPerPeople": 1,
    "undefined": 1985,
    "activePerOneMillion": 1984.73,
    "recoveredPerOneMillion": 31874.33,
    "criticalPerOneMillion": 34.9
}

// store(mockData)
//     .catch(e => {
//         throw e
//     })
//     .finally(async() => {
//         await prisma.$disconnect()
//     })

module.exports = { store };