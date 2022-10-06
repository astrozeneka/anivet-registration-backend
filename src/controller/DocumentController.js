const BaseController = require("./BaseController");
const express = require("express");
const {isAdminToken} = require("../utils/token");
const jwt = require("jsonwebtoken");
const SecurityBL = require("../businessLogic/SecurityBL");
const ManagementBL = require("../businessLogic/ManagementBL");

class DocumentController extends BaseController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DocumentController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()

        this.app = express.Router()

        this.app.get("/", async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let list = await ManagementBL.getInstance().listDocuments()
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        });

        this.app.get("/:documentId", async(req, res)=>{

        })

        this.app.post("/", async(req, res)=>{
            if(!await isAdminToken(req.decodedToken)) // OR Scientist
                res.status(403).send("Unauthorized")
            let d = req.body
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            let triggererId = decodedToken.id
            d.triggererId = triggererId
            let u = await SecurityBL.getInstance().uploadDocument(d)
            res.setHeader('Content-type', "application/json")
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send(JSON.stringify({
                    "object": u.object.serialize()
                }))
            }
        })

        this.app.put("/", async(req, res)=>{

        })

        this.app.delete("/", async(req, res)=>{

        })
    }
}
module.exports = DocumentController
