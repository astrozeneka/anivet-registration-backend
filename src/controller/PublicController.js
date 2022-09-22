const BaseController = require("./BaseController");
const AuthenticationBL = require("../businessLogic/AuthenticationBL");
const Admin = require("../model/Admin");
const jwt = require("jsonwebtoken");
const express = require("express");

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
    }

    // A Register-less component
    // No need to register
    // It is registered by itself
}
module.exports = PublicController
