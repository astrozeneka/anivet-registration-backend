const BaseController = require("./BaseController");
const AuthenticationBL = require("../businessLogic/AuthenticationBL");
const Admin = require("../model/Admin");
const jwt = require("jsonwebtoken");
const express = require("express");
const RegistrationBL = require("../businessLogic/RegistrationBL");
const TestOrderWithSamples = require("../model/TestOrderWithSamples");
const TestOrderBL = require("../businessLogic/TestOrderBL");
const TestOrderDAO = require("../dao/crud/TestOrderDAO");
const TimeBL = require("../businessLogic/TimeBL");
const BaseMemberDAO = require("../dao/crud/BaseMemberDAO");
const TestSampleDAO = require("../dao/crud/TestSampleDAO");
const CRUDBL = require("../businessLogic/CRUDBL");
const TestTypeDAO = require("../dao/crud/TestTypeDAO");

/**
 * The public controller does not require authentication
 */
class PublicController extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new PublicController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.app = express.Router()

        this.app.post("/login", async (req, res)=>{
            let d = req.body
            let username = d.username
            let password = d.password
            let u = await AuthenticationBL.getInstance().authenticateAdmin(username, password)
            res.setHeader('Content-Type', 'application/json')
            if(!(u instanceof Admin)){
                res.send(u) // Return exception to the user
            }else{
                let accessToken = jwt.sign(u.serialize(), process.env.TOKEN_SECRET, {expiresIn: 18000})
                res.send(JSON.stringify({
                    accessToken: accessToken,
                    userId: u.id
                }))
            }
        })

        this.app.post('/register', async(req, res)=>{
            let d = req.body
            let u = await RegistrationBL.getInstance().register(d)
            let accessToken = jwt.sign(u.object.serialize(), process.env.TOKEN_SECRET, {expiresIn: 18000})
            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send(JSON.stringify({
                    "object": u.object.serialize(),
                    "accessToken": accessToken
                }))
            }
        })

        this.app.post("/submit-receipt", async(req, res)=>{
            let d = req.body
            console.log()
            let u = await RegistrationBL.getInstance().submitReceipt(d)
            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send(JSON.stringify({
                    "object": u.object.serialize()
                }))
            }
        })

        this.app.post("/submit-orders", async(req, res)=>{
            // Get who register the order
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            const userId = decodedToken.id


            let d = req.body
            d.memberId = userId
            let order = new TestOrderWithSamples()
            let u = await TestOrderBL.getInstance().registerTest(d)

            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send(JSON.stringify({
                    "object": u.object.serialize()
                }))
            }
        })

        this.app.get("/order/:testOrderId", async(req, res)=>{
            let id = req.params.testOrderId
            let output = await TestOrderDAO.getInstance().getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })


        /**
         * New generation script (using new DAO classes)
         * Anyways, the script above doesn't work anymore
         */
        this.app.post("/registration/account", async(req, res)=>{
            // No token verification
            req.body.date = TimeBL.getInstance().time
            let output = await RegistrationBL.getInstance().post_account(req.body)
            res.setHeader('Content-Type', 'application/json')
            if(!output.hasOwnProperty("object")) {
                res.send(JSON.stringify(output)) // Have errors
                return
            }
            let u = output.object
            // After, the system give a token to the user
            let accessToken = jwt.sign(BaseMemberDAO.getInstance().model_to_raw[""](u), process.env.TOKEN_SECRET, {expiresIn: 3600})

            res.send(JSON.stringify({
                entity: BaseMemberDAO.getInstance().model_to_raw[""](u),
                accessToken: accessToken
            }))
        })

        this.app.post("/registration/test-sample", async(req, res)=>{
            // Use token verification
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            let u = await RegistrationBL.getInstance().post_testSample(req.body)
            res.setHeader('Content-Type', 'application/json')

            if(!u.hasOwnProperty("entity"))
                res.send(JSON.stringify(u)) // Have errors
            else
                res.send(JSON.stringify({
                    entity: BaseMemberDAO.getInstance().model_to_raw[""](u.entity)
                }))
        })

        this.app.get("/registration/test-sample", async (req, res)=>{
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            let list = await RegistrationBL.getInstance().get_testSample(req.body)
            let output = []
            list.forEach((item)=>output.push(
                TestSampleDAO.getInstance().model_to_raw[""](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        // Relatively easy script
        // But with a good security system
        this.app.get("/registration/test-type", async(req, res)=>{
            // The first four lines should be inserted in a middleware script
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            // Relatively easy script
            let list = await CRUDBL.getInstance().loadView(TestTypeDAO.getInstance(), "", undefined, undefined)
            let output = []
            list.forEach((item)=>output.push(
                TestTypeDAO.getInstance().model_to_raw[""](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.get("/registration/base-member", async(req, res)=>{
            // The first four lines should be inserted in a middleware script
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            let item = await CRUDBL.getInstance().loadOne(BaseMemberDAO.getInstance(), "edit", req.body.triggererId)
            let output = await BaseMemberDAO.getInstance().model_to_raw["edit"](item)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.get("/registration/test-sample/:id", async(req, res)=>{
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.id = req.params.id
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            let item = await RegistrationBL.getInstance().getOne_testSample(req.body)
            let output = await TestSampleDAO.getInstance().model_to_raw["edit"](item)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.put("/registration/test-sample/:id", async(req, res)=>{
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.id = req.params.id
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            let u = await RegistrationBL.getInstance().put_testSample(req.body)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(u))
        })

        this.app.delete("/registration/test-sample/:ids", async(req, res)=>{
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.id = req.params.id
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            let idList = req.params.ids.split(",")
            let o = {affectedRows: 0}
            for(const id of idList) {
                let u = await CRUDBL.getInstance().testSample.delete({id: id})
                o.affectedRows+= u.affectedRows
            }
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(o))
        })

        this.app.post("/registration/payment-receipt", async(req, res)=>{
            // The first four lines should be inserted in a middleware script
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            let u = await RegistrationBL.getInstance().post_paymentReceipt(req.body)
            res.setHeader('Content-Type', 'application/json')
            if(!u.hasOwnProperty("entity"))
                res.send(JSON.stringify(u)) // Have errors
            else
                res.send(JSON.stringify({
                    entity: BaseMemberDAO.getInstance().model_to_raw[""](u.entity)
                }))
        })
    }

    // A Register-less component
    // No need to register
    // It is registered by itself
}
module.exports = PublicController
