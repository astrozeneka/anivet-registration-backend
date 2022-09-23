const BaseController = require("./BaseController");
const BreederDAO = require("../dao/BreederDAO");
const SampleStatusDAO = require("../dao/SampleStatusDAO");
const {join} = require("path");
const express = require("express");
const {isAdminToken} = require("../utils/token");

class SampleStatusController extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SampleStatusController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.app = express.Router()


        this.app.get(join(this.prefix, "/:trackingTypeId"), async(req, res)=>{
            if(!await isAdminToken(req.decodedToken)){ // ANd not sample owner
                res.status(403).send("Unauthorized")
            }
            let id = req.params.trackingTypeId
            let list = await SampleStatusDAO.getInstance().getAllByTrackingId(id)
            let output = []
            list.forEach((item)=>{output.push(item.serialize())})
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }

    register(app, prefix){

    }
}
module.exports = SampleStatusController
