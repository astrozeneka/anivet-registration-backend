const DatabaseManager = require("../../src/service/DatabaseManager")
var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")
const TestSampleDAO = require("../../src/dao/TestSampleDAO");
const TestSample = require("../../src/model/TestSample");
const resetDatabase = require("../../src/utils/resetDatabase");

chai.use(chaiHttp)

describe("TestSample /api/v1/testSample/", ()=>{

    let dm = DatabaseManager.getInstance()
    let tsd = TestSampleDAO.getInstance()
    let sampleA = null
    let sampleB = null

    beforeEach(async()=>{
        await dm.init()
        await resetDatabase()

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

        await tsd.add(sampleA)
        await tsd.add(sampleB)
    })

    it("Should fetch list", (done)=>{
        chai.request(server)
            .get("/api/v1/testSample")
            .end((err, res)=>{
                assert(res.body.length == 2)
                assert(res.body[0].petId == "0123")
                done()
            })
    })

    it("Should insert", (done)=>{
        let obj = {
            "animal": "Cat",
            "type": "",
            "petId": "0125",
            "petSpecie": "",
            "test": "sexing",
            "sampleType": "blood",
            "image": "image4"
        }
        chai.request(server)
            .post("/api/v1/testSample")
            .send(obj)
            .end(async(err, res)=>{
                let data = res.body
                assert(data.id == 3)
                assert(data.animal == "Cat")

                let list = await tsd.getAll()
                assert(list.length == 3)

                done()
            })
    })

    it("Should update in list", (done)=>{
        let obj = {
            "id": 2,
            "animal": "Dog",
            "type": "",
            "petId": "0124",
            "petSpecie": "German Shepherd",
            "test": "sexing",
            "sampleType": "blood",
            "image": "image2"
        }
        chai.request(server)
            .put("/api/v1/testSample")
            .send(obj)
            .end(async(err, res)=>{
                let sample2 = await tsd.getById(2)
                assert(sample2.petSpecie == "German Shepherd")
                done()
            })
    })

    it("Should fetch custom id", (done)=>{
        chai.request(server)
            .get("/api/v1/testSample/2")
            .end((err, res)=>{
                assert(res.body.petId == "0124")
                assert(res.body.animal == "Dog")
                done()
        })
    })

    it("Should delete TestSample", (done)=>{
        let obj = {
            "id": 1
        }
        chai.request(server)
            .delete("/api/v1/testSample")
            .send(obj)
            .end(async(err, res)=>{
                let list = await tsd.getAll()
                assert(list.length == 1)
                done()
            })
    })
})
