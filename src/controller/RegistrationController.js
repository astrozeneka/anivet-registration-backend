const BaseController = require("./BaseController");
const {join} = require("path");
const RegistrationBL = require("../businessLogic/RegistrationBL");
const express = require("express");
const {isAdminToken} = require("../utils/token");


class RegistrationController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new RegistrationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.app = express.Router()

        this.app.post(join(this.prefix, '/'), async(req, res)=>{
            if(!await isAdminToken(req.decodedToken)) // ANd not sample owner
                res.status(403).send("Unauthorized")
            let d = req.body
            let u = await RegistrationBL.getInstance().register(d)
            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send(JSON.stringify({
                    "object": u.object.serialize()
                }))
            }
        })
    }

    register(app, prefix){
        super.register(app, prefix);



        app.put(join(this.prefix, '/:memberId'), async(req, res)=>{
            let id = req.params.memberId
            let d = req.body
            d.id = id
            let u = await RegistrationBL.getInstance().updateUserBackoffice(d)
            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send(JSON.stringify({
                    "object": u.object.serialize()
                }))
            }
        })
    }
}
module.exports = RegistrationController
