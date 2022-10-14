const express = require("express");
const {isAdminToken} = require("../../utils/token");
const ValidationBL = require("../../businessLogic/ValidationBL");
const jwt = require("jsonwebtoken");

class BaseValidationController {

    constructor(){
        this.app = express.Router()

        this.app.get('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let view = "validation"
            let list = []
            list = await ValidationBL.getInstance().loadView(this.dao, "validation", req.query.offset, req.query.limit)
            let output = []
            list.forEach((item)=>output.push(
                this.dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.get("/:id", async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let id = req.params.id
            let view = "validation_details"
            let item = await ValidationBL.getInstance().loadOne(this.dao, view, req.params.id)
            let output = await this.dao.model_to_raw[view](item)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.post("/", async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            let u = await ValidationBL.getInstance().validateRegistration(req.body)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(u))
        })
    }
}
module.exports = BaseValidationController
