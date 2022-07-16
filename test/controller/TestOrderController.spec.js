
const DatabaseManager = require("../../src/service/DatabaseManager")
var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")
const TestOrderDAO = require("../../src/dao/TestOrderDAO");
const TestSampleDAO = require("../../src/dao/TestSampleDAO");
const TestSample = require("../../src/model/TestSample");
const TestOrderWithSamples = require("../../src/model/TestOrderWithSamples");

chai.use(chaiHttp)

describe("TestOrder /api/v1/testOrder", ()=>{

    let dm = DatabaseManager.getInstance()
    let tsd = TestSampleDAO.getInstance()
    let tod = TestOrderDAO.getInstance()

    let sampleA = null
    let sampleB = null
    let sampleC = null

    let orderA = null
    let orderB = null

    beforeEach(async function(){

        await dm.init()
        await tsd.destroyTable()
        await tod.destroyTable()
        await tod.buildTable()
        await tsd.buildTable()

        sampleA = new TestSample()
        sampleA.animal = "Bird"
        sampleA.type = ""
        sampleA.petId = "0123"
        sampleA.petSpecie = "Macau"
        sampleA.test = "sexing"
        sampleA.sampleType = "blood"
        sampleA.image = "image" // Maybe a one-to-one reference

        sampleB = new TestSample()
        sampleB.animal = "Dog"
        sampleB.type = ""
        sampleB.petId = "0124"
        sampleB.petSpecie = "Canis Lupus"
        sampleB.test = "sexing"
        sampleB.sampleType = "blood"
        sampleB.image = "image2"

        sampleC = new TestSample()
        sampleC.animal = "Cat"
        sampleC.type = ""
        sampleC.petId = "0125"
        sampleC.petSpecie = "RingTail"
        sampleC.test = "sexing"
        sampleC.sampleType = "blood"
        sampleC.image = "Image3"

        orderA = new TestOrderWithSamples()
        orderA.name1 = "Order A"
        orderA.name2 = "order-a"
        orderA.website = "http://google.com"
        orderA.samples = [sampleA, sampleB]

        orderB = new TestOrderWithSamples()
        orderB.name1 = "Order B"
        orderB.name2 = "order-b"
        orderB.website = "http://anivet.th"
        orderB.samples = [sampleC]

        await tod.add(orderA)
        await tod.add(orderB)
    })

    it("Should fetch list", (done)=>{
        chai.request(server)
            .get("/api/v1/testOrder")
            .end((err, res)=>{
                assert(res.body.length == 2)
                assert(res.body[1].name2 == "order-b")
                assert(res.body[1].samples.length == 1)
                assert(res.body[1].samples[0].animal == "Cat")
                done()
            })
    })

    it("Should fetch custom", (done)=>{
        chai.request(server)
            .get("/api/v1/testOrder/1")
            .end((err, res)=>{
                assert(res.body.name1 == "Order A")
                assert(res.body.samples.length == 2)
                assert(res.body.samples[1].animal == "Dog")
                done()
            })
    })

    it("Should insert in list", (done)=>{
        let obj = {
            "name1": "nameC",
            "name2": "name C",
            "tests": [
                {
                    "sampleId": "Jo 001",
                    "animal": "bird",
                    "type": "",
                    "petID": "0123",
                    "petSpecies": "Macau",
                    "test": "sexing",
                    "sampleType": "blood",
                    "image": "12369" // Image identifier returned from the other endponint goes here
                }
            ],
            "website": "https://facebook.com"
        }
        chai.request(server)
            .post("/api/v1/testOrder")
            .send(obj)
            .end(async(err, res)=>{
                let orderList = await tod.getAll()
                assert(orderList.length == 3)
                let sampleList = await tsd.getAll()
                assert(sampleList.length == 4)
                done()
            })
    })

})
