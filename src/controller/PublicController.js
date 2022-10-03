const BaseController = require("./BaseController");
const AuthenticationBL = require("../businessLogic/AuthenticationBL");
const Admin = require("../model/Admin");
const jwt = require("jsonwebtoken");
const express = require("express");
const RegistrationBL = require("../businessLogic/RegistrationBL");
const TestOrderWithSamples = require("../model/TestOrderWithSamples");
const TestOrderBL = require("../businessLogic/TestOrderBL");
const TestOrderDAO = require("../dao/TestOrderDAO");

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
                let accessToken = jwt.sign(u.serialize(), process.env.TOKEN_SECRET, {expiresIn: 1800})
                res.send(JSON.stringify({
                    accessToken: accessToken,
                    userId: u.id
                }))
            }
        })

        this.app.post('/register', async(req, res)=>{
            let d = req.body
            let u = await RegistrationBL.getInstance().register(d)
            let accessToken = jwt.sign(u.object.serialize(), process.env.TOKEN_SECRET, {expiresIn: 1800})
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
    }

    // A Register-less component
    // No need to register
    // It is registered by itself
}
module.exports = PublicController
