const BaseController = require("./BaseController");
const express = require("express");
const {join} = require("path");
const {isAdminToken} = require("../utils/token");
const ScientistDAO = require("../dao/ScientistDAO");


class ScientistController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ScientistController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.app = express.Router()

        this.app.get(join(this.prefix, "/"), async (req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let list = await ScientistDAO.getInstance().getAll(); // VERY IMPORTANT, UPDATE THIS INFORMATION
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = ScientistController
