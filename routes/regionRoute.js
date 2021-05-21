const express = require("express")
const router = express.Router()
const {getAllRegions, getRegion, makeOrEditRegion} = require("../storage")

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

router.post("/edit/:id", async (req, res) =>{
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
})

router.post("/new", async (req, res) =>{
    console.log(req.body)
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
        res.redirect("all")
    })
    .catch(err => {
        res.status(500)
    })
})

module.exports = router