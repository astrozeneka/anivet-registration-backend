const BaseController = require("./BaseController");
const TestOrderDAO = require("../dao/TestOrderDAO");
const {join} = require("path");
const TestOrderWithSamples = require("../model/TestOrderWithSamples");
const TestSample = require("../model/TestSample");
const TestOrderBL = require("../businessLogic/TestOrderBL");
const express = require("express");
const {isAdminToken} = require("../utils/token");

class TestOrderController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestOrderController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    tod = null

    constructor() {
        super();
        this.tod = TestOrderDAO.getInstance()
        this.app = express.Router()

        this.app.get("/", async (req, res)=>{
            if(!await isAdminToken(req.decodedToken)){
                res.status(401).send("Unauthorized HTTP")
                return
            }
            let list = await this.tod.getAll()
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.get("/:orderId", async(req, res)=>{
            let id = req.params.orderId
            if(!await isAdminToken(req.decodedToken)){
                res.status(401).send("Unauthorized HTTP")
                return
            }
            let u = await this.tod.getById(id)
            if(u == null){
                res.status(404).send("Not found")
            }else{
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(u.serialize()))
            }
        })

        this.app.get("/test", async (req, res)=>{
            if(!await isAdminToken(req.decodedToken)){
                res.status(401).send("Unauthorized HTTP")
                return
            }
            let list = await this.tod.getAll()
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.post("/validate/:orderId", async(req, res)=>{
            let id = req.params.orderId
            if(!await isAdminToken(req.decodedToken)) // ANd not sample owner
                res.status(403).send("Unauthorized")
            let d = req.body
            d.orderId = id
            let u = await TestOrderBL.getInstance().submitValidationInfo(d)
            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send({
                    "object": u.object.serialize()
                })
            }
        })
    }

    /*
    register(app, prefix){
        super.register(app, prefix)

        app.get(join(this.prefix, "/"), async (req, res)=>{

            if(!req.query.hasOwnProperty("token")){
                // TODO: Token verification should be done later
                res.status(403).send("Forbidden resources")
                return
            }
            let list = await this.tod.getAll()
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        app.get(join(this.prefix, "/:userId"), async(req, res)=>{
            if(!req.query.hasOwnProperty("token")){
                // TODO: Token verification should be done later
                res.status(403).send("Forbidden resources")
                return
            }
            let id = req.params.userId
            let list = await this.tod.getAllByUser(id)
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        app.get(join(this.prefix, "/:testOrderId"), async (req, res)=>{
            let id = req.params.testOrderId
            let output = await this.tod.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(join(this.prefix, "/"), async (req, res)=>{
            let d = req.body
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

            /*
            order.name1 = d.name1
            order.name2 = d.name2
            order.website = d.website
            order.email = d.email
            order.samples = []
            for(const _s of d.tests){
                let sample = new TestSample()
                // sample.id = _s.sampleId
                sample.animal = _s.animal
                sample.type = _s.type
                sample.petId = _s.petId
                sample.petSpecie = _s.petSpecie
                // sample.test = _s.test
                sample.image = _s.image
                sample.testOrderId = null
                order.samples.push(sample)
            }

            await this.tod.add(order)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(order.serialize()))
             *//*

        })
    }
    */
}

module.exports = TestOrderController
