const express = require("express");
const {isAdminToken} = require("../../utils/token");
const CRUDBL = require("../../businessLogic/CRUDBL");
const jwt = require("jsonwebtoken");

class BaseDataController{

    get name(){
        return this.dao.name
    }

    constructor(){
        this.app = express.Router()

        this.app.get('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let view = ""
            let list = await CRUDBL.getInstance().loadView(this.dao, view)
            let output = []
            list.forEach((item)=>output.push(
                this.dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.post('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            let u = await CRUDBL.getInstance()[this.name].insert(req.body)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(u))
        })
    }
}
module.exports = BaseDataController
