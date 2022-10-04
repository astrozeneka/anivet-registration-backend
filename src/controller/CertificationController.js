const BaseController = require("./BaseController");
const express = require("express");

class CertificationController extends BaseController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new CertificationController()
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

        });

        this.app.get("/:documentId", async(req, res)=>{

        })

        this.app.post("/", async(req, res)=>{

        })

        this.app.put("/", async(req, res)=>{

        })

        this.app.delete("/", async(req, res)=>{

        })
    }
}
module.exports = CertificationController
