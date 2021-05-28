const { PrismaClient } = require('@prisma/client')
const axios = require("axios")

const prisma = new PrismaClient()


///creates new row if country is not found. Otherwise, updates the country
const store = async covidstats => {
    const checkExisting = await prisma.country.findUnique({
        where: { id: covidstats.countryInfo._id }
    })

    if (checkExisting) {
        await prisma.country.update({
            where: { id: covidstats.countryInfo._id },
            data: { 
                stats: covidstats,
            }
            
        })
    } else {
        await prisma.country.create({
            data: {
                id: covidstats.countryInfo._id,
                name: covidstats.country,
                stats: covidstats,
                countryInfo: covidstats.countryInfo

            }
        })
    }
}

///returns list containing the matching countries object
const reportCountry = async countryname => {
    const reportstats = await prisma.country.findFirst({
        where: { name: countryname }
    })
    //duplicate countries shouldnt exist unless manually created
        return reportstats

}


//updates the db for countries atm
const updateDB = async function() {
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
    }, 3000)
}

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
const getAllRegions = async () => {
    return await prisma.region.findMany({
        select: {
            id: true,
            name: true
        }
    })
}

module.exports = { store, reportCountry, updateDB, getAllRegions};
