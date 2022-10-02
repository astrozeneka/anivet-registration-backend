const BaseController = require("./BaseController");
const {isAdminToken} = require("../utils/token");
const PaymentReceiptDAO = require("../dao/PaymentReceiptDAO");
const express = require("express");
const RegistrationBL = require("../businessLogic/RegistrationBL");

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

        this.app.get("/:receiptId", async(req, res)=>{
            let id = req.params.receiptId
            if(!await isAdminToken(req.decodedToken)){ // OR the owner
                res.status(401).send("Unauthorized HTTP")
                return
            }
            let u = await PaymentReceiptDAO.getInstance().getById(id)
            if(u == null){
                res.status(404).send("Not found")
            }else{
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(u.serialize()))
            }
        })


        this.app.post("/validate/:receiptId", async (req, res)=>{
            let id = req.params.receiptId
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let d = req.body
            d.receiptId = id
            let u = await RegistrationBL.getInstance().validateReceipt(d)
            res.setHeader('Content', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send({
                    "object": u.object.serialize()
                })
            }
        })
    }

}
module.exports = PaymentReceiptController
