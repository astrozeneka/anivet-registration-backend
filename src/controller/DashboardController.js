const BaseController = require("./BaseController");
const DashboardBL = require("../businessLogic/DashboardBL");
const path = require("path");
const {isAdminToken} = require("../utils/token");
const express = require("express");

class DashboardController extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DashboardController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.app = express.Router()

        /**
         * DEFAULT DATA LOADED
         */
        this.app.get(path.join(this.prefix, "/"), async (req, res)=>{
            if(!await isAdminToken(req.decodedToken)){
                res.status(403).send("Unauthorized")
                return
            }
            let output = await DashboardBL.getInstance().getData()
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        /**
         * MENU BADGE
         */
        this.app.get(path.join(this.prefix, "/menu-badge"), async(req, res)=>{
            if(!await isAdminToken(req.decodedToken)){
                res.status(401).send("Unauthorized HTTP")
                return
            }
            let output = await DashboardBL.getInstance().getMenuBadge()
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = DashboardController
