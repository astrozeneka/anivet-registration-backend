const BaseController = require("./BaseController");
//const path = require("path")
const TestSampleDAO = require("../dao/TestSampleDAO");
const {join} = require("path");
const path = require("path");
const TestSample = require("../model/TestSample");

class TestSampleController extends BaseController{
    tsd = null

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestSampleController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor() {
        super();
        this.tsd = TestSampleDAO.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(join(this.prefix, "/"), async (req, res)=>{
            let list = await this.tsd.getAll()
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        app.get(join(this.prefix, "/:testSampleId"), async(req, res)=>{
            let id = req.params.testSampleId
            let output = await this.tsd.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(path.join(this.prefix, "/"), async (req, res)=>{
            let d = req.body
            let sample = new TestSample()
            sample.animal = d.animal
            sample.type = d.type
            sample.petId = d.petId
            sample.petSpecie = d.petSpecie
            sample.test = d.test
            sample.sampleType = d.sampleType
            sample.image = d.image
            await this.tsd.add(sample)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(sample.serialize()))
        })

        app.put(path.join(this.prefix, "/"), async (req, res)=>{
            let d = req.body
            let sample = new TestSample()
            sample.id = d.id
            sample.animal = d.animal
            sample.type = d.type
            sample.petId = d.petId
            sample.petSpecie = d.petSpecie
            sample.test = d.test
            sample.sampleType = d.sampleType
            sample.image = d.image
            await this.tsd.update(sample)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(sample.serialize()))
        })

        app.delete(path.join(this.prefix, "/"), async (req, res)=> {
            let d = req.body
            let sample = new TestSample()
            sample.id = d.id
            await this.tsd.delete(sample)
            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })
    }
}

module.exports = TestSampleController