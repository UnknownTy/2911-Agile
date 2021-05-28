const { PrismaClient } = require('@prisma/client')
const axios = require("axios")

const prisma = new PrismaClient()
const updateTime = 15 // Update data stored in minutes


///creates new row if country is not found. Otherwise, updates the country
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

///returns list containing the matching countries object
const reportCountry = async countryname => {
    const reportstats = prisma.country.findMany({
        where: { name: countryname }
    })
    return reportstats;
}

///to test report
// const test = reportCountry()
//     .then(function(result) {
//         console.log(result);
//     })

//updates the db for countries atm
const updateDB = async () => {
    setInterval(async() => {
        //grabs the data from db
        reportCountry()
            .then(async function(result) {
                //iterates through the engire country model
                result.forEach(countryEach => {
                    axios.get(`https://corona.lmao.ninja/v2/countries/${countryEach.name}`)
                        .then(res => {
                            store(res.data)
                                // console.log(res.data)
                        })
                })
            })
            //update interval, in miliseconds
    }, updateTime * 1000 * 60) //Updates every N minutes
}

const makeOrEditRegion = async (reqName, resDesc, indDesc, outDesc, maskDesc, link, ID) => {
    if(ID){
        console.log(resDesc)
        await prisma.region.update({
            where: {id: ID},
            data:{
                restauraunt: resDesc,
                indoor: indDesc,
                outdoor: outDesc,
                masks: maskDesc,
                link: link
            }
        })
        return await getRegion(ID)
    }
    else{
        await prisma.region.create({
            data:{
                name: reqName,
                restauraunt: resDesc,
                indoor: indDesc,
                outdoor: outDesc,
                masks: maskDesc,
                link: link
            }
        })
        return prisma.region.findFirst({
            where: {name: reqName, link: link, outdoor: outDesc}
        })
    }
}
const getRegion = async (ID) => {
    return await prisma.region.findUnique({
        where: {
            id: ID
        }
    })
}
const getAllRegions = async () => {
    return await prisma.region.findMany({
        select: {
            id: true,
            name: true
        }
    })
}

// let mockData = {
//     "updated": 1620965513812,
//     "country": "Canada",
//     "countryInfo": {
//         "_id": 124,
//         "iso2": "CA",
//         "iso3": "CAN",
//         "lat": 60,
//         "long": -95,
//         "flag": "https://disease.sh/assets/img/flags/ca.png"
//     },
//     "cases": 1312414,
//     "todayCases": 6644,
//     "deaths": 24825,
//     "todayDeaths": 59,
//     "recovered": 1212114,
//     "todayRecovered": 7786,
//     "active": 75475,
//     "critical": 1327,
//     "casesPerOneMillion": 34512,
//     "deathsPerOneMillion": 653,
//     "tests": 33130218,
//     "testsPerOneMillion": 871208,
//     "population": 38027907,
//     "continent": "North America",
//     "oneCasePerPeople": 29,
//     "oneDeathPerPeople": 1532,
//     "oneTestPerPeople": 1,
//     "undefined": 1985,
//     "activePerOneMillion": 1984.73,
//     "recoveredPerOneMillion": 31874.33,
//     "criticalPerOneMillion": 34.9
// }

// store(mockData)
//     .catch(e => {
//         throw e
//     })
//     .finally(async() => {
//         await prisma.$disconnect()
//     })
module.exports = { store, reportCountry, updateDB, getAllRegions, getRegion, makeOrEditRegion };