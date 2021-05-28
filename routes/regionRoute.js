const express = require("express")
const router = express.Router()
const {getAllRegions, getRegion, makeOrEditRegion, deleteRegion} = require("../storage")

router.get("/all", async (req, res) =>{
    getAllRegions()
    .then(regions =>{
        console.log(regions)
        res.render("regions", {regions: regions})
    })
})

router.get("/edit/:id", async (req, res) =>{
    getRegion(parseInt(req.params.id))
    .then(region =>{
        console.log(region)
        res.render("editRegion", {region: region})
    })
})

router.get("/add", async (req, res) =>{
    res.render("addRegion")
})

router.post("/edit/:id", async (req, res) =>{
    if (req.body._method === "put"){
        console.log(req.body)
        makeOrEditRegion(
            req.body.name,
            req.body.resDesc,
            req.body.indDesc, 
            req.body.outDesc, 
            req.body.maskDesc, 
            req.body.link, 
            parseInt(req.params.id)
            )
        .then(region =>{
            res.render("editRegion", {region: region, updated: true})
        })
    }
    else {
        deleteRegion(parseInt(req.params.id))
        .then(()=>{
            res.redirect("../all")
        })
    }
})

router.post("/add", async (req, res) =>{
    makeOrEditRegion(
        req.body.name,
        req.body.resDesc,
        req.body.indDesc, 
        req.body.outDesc, 
        req.body.maskDesc, 
        req.body.link,
        null
        )
    .then(region =>{
        res.redirect("./edit/" + region.id)
    })
    .catch(err => {
        res.status(500)
    })
})

module.exports = router