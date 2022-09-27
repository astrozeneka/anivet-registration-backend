const BaseController = require("./BaseController");
const {isAdminToken} = require("../utils/token");
const PaymentReceiptDAO = require("../dao/PaymentReceiptDAO");
const express = require("express");

class PaymentReceiptController extends BaseController {

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new PaymentReceiptController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.app = express.Router()

        this.app.get('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let list = await PaymentReceiptDAO.getInstance().getAll()
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = PaymentReceiptController
