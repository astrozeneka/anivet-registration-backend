const BaseController = require("./BaseController");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const path = require("path");
const _ = require('lodash')
const RegistrationController = require("./RegistrationController");
const RegistrationBL = require("../businessLogic/RegistrationBL");
const express = require("express");
const {isAdminToken} = require("../utils/token");

class BaseMemberController extends BaseController {
    bmd = null

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BaseMemberController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.bmd = BaseMemberDAO.getInstance()

        this.app = express.Router()

        this.app.get("/:memberId", async(req, res)=>{
            let id = req.params.memberId
            if(!await isAdminToken(req.decodedToken)) // ANd not sample owner
                res.status(403).send("Unauthorized")
            let u = await RegistrationBL.getInstance().userDetails(id)
            u.object.password = "" // Never send password to the user
            if(u == null) {
                res.status(404).send("Not found")
            }else {
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(
                    Object.assign({}, u.object.address.serialize(), u.object.serialize())
                ))
            }
        })
    }

    register(app, prefix){
        super.register(app, prefix)

        /*
        TODO GetALL
         */
        app.get(path.join(this.prefix, "/:memberId"), async(req, res)=>{
            let id = req.params.memberId

            if(!req.query.hasOwnProperty("token")){
                res.status(403).send("Forbidden resources")
                return
            }
            let u = await RegistrationBL.getInstance().userDetails(id)
            u.object.password = "" // Never send password to the user
            if(u == null) {
                res.status(404).send("Not found")
            }else {
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(
                    Object.assign({}, u.object.address.serialize(), u.object.serialize())
                ))
            }
        })

        app.put(path.join(this.prefix, "/:memberId"), async(req, res)=>{
            let id = req.params.memberId
            let d = req.body

            if(!req.query.hasOwnProperty("token")){
                // TODO: Token verification should be done later
                res.status(403).send("Forbidden resources")
                return
            }

            let e = await this.bmd.getById(id)
            e.name1 = d.name1 || e.name1
            e.name2 = d.name2 || e.name2
            e.phone = d.phone || e.phone
            e.email = d.email || e.email
            await this.bmd.update(e)
            let output = await this.bmd.getById(id)

            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(path.join(this.prefix, "/changePassword/:memberId"), async(req, res)=>{
            let id = req.params.memberId

            let d = req.body
            d.memberId = id
            let u = await RegistrationBL.getInstance().changePassword(d)
            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send({
                    "object": u.object.serialize()
                })
            }

        })

        app.delete(path.join(this.prefix, "/:memberId"), async(req, res)=>{
            // Should use Business Logic
            let id = req.params.memberId

            if(!req.query.hasOwnProperty("token")){
                res.status(403).send("Forbidden resources")
                return
            }
            let entity = await this.bmd.getById(id)
            await this.bmd.delete(entity)

            res.setHeader('Content-Type', 'application/json')
            res.status(200).send({})
        })
    }
}
module.exports = BaseMemberController
