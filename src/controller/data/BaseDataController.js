const express = require("express");
const {isAdminToken} = require("../../utils/token");

class BaseDataController{
    constructor(){
        this.app = express.Router()

        this.app.get('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let view = ""
            let list = await this.dao.getAll(view)
            let output = []
            list.forEach((item)=>output.push(
                this.dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = BaseDataController
