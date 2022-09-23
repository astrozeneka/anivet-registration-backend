const BaseController = require("./BaseController");
const AddressDAO = require("../dao/AddressDAO");
const BreedDAO = require("../dao/BreedDAO");
const OwnerDAO = require("../dao/OwnerDAO");
const TestOrderDAO = require("../dao/TestOrderDAO");
const TestSampleDAO = require("../dao/TestSampleDAO");
const path = require("path");
const BreederDAO = require("../dao/BreederDAO");
const InstallationBL = require("../businessLogic/InstallationBL");
const SeedBL = require("../businessLogic/SeedBL");
const express = require("express");


class InstallationController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new InstallationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    prefix = ""

    constructor(){
        super();

        this.ad = AddressDAO.getInstance()
        this.bd = BreedDAO.getInstance()
        this.od = OwnerDAO.getInstance()
        this.tod = TestOrderDAO.getInstance()
        this.tsd = TestSampleDAO.getInstance()
        this.brd = BreederDAO.getInstance()

        this.app = express.Router()
        this.app.get("/", async (req, res)=>{
            await InstallationBL.getInstance().installDB()
            res.send({
                object: ""
            })
        })
    }

    register(app, prefix){
        super.register(app, prefix)



        app.get(path.join(this.prefix, "seed"), async(req, res)=>{
            await InstallationBL.getInstance().installDB()
            await SeedBL.getInstance().initData()
            res.send({
                object: ""
            })
        })
    }

}

module.exports = InstallationController
