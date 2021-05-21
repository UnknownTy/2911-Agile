const express = require("express")
const router = express.Router()
const {getAllRegions, getRegion, makeOrEditRegion} = require("../storage")

router.get("/all", async (req, res) =>{
    getAllRegions()
    .then(regions =>{
        console.log(regions)
        res.render("regions", regions)
    })
})

router.get("/:id", async (req, res) =>{
    getRegion(req.params.id)
    .then(region =>{
        res.render("editRegion", region)
    })
})

router.post("/:id", async (req, res) =>{
    makeOrEditRegion(
        req.body.name,
        req.body.resDesc,
        req.body.indDesc, 
        req.body.outDesc, 
        req.body.maskDesc, 
        req.body.link, 
        req.params.id
        )
    .then(region =>{
        res.render("editRegion", {region: region, updated: true})
    })
})

module.exports = router