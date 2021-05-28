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
    const reportstats = await prisma.country.findMany({
        where: { name: countryname }
    })
    //duplicate countries shouldnt exist unless manually created
        return reportstats

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
const deleteRegion = async (ID) => {
    return await prisma.region.delete({
        where: {
            id: ID
        }
    })
}

<<<<<<< Updated upstream
module.exports = { store, reportCountry, updateDB, getAllRegions, getRegion, makeOrEditRegion, deleteRegion};
=======
module.exports = { store, reportCountry, updateDB, getAllRegions, getRegion, makeOrEditRegion };
>>>>>>> Stashed changes
