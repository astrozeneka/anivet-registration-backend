const BaseController = require("./BaseController");
const TestOrderDAO = require("../dao/TestOrderDAO");
const {join} = require("path");
const TestOrderWithSamples = require("../model/TestOrderWithSamples");
const TestSample = require("../model/TestSample");
const TestOrderBL = require("../businessLogic/TestOrderBL");

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
    }

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
             */

        })
    }
}

module.exports = TestOrderController
