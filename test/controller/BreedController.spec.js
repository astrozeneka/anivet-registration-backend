const DatabaseManager = require("../../src/service/DatabaseManager")
var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")
const BreedDAO = require("../../src/dao/BreedDAO");
const Breed = require("../../src/model/Breed");

chai.use(chaiHttp)

describe("BreedController /api/v1/breed/", ()=>{

    let dm = DatabaseManager.getInstance()
    let bd  = BreedDAO.getInstance()
    let breedA = null
    let breedB = null

    beforeEach(async()=>{
        dm.init()
        await bd.destroyTable()
        await bd.buildTable()

        breedA = new Breed()
        breedA.type = "Dog"
        breedA.name = "Chihuahua"

        breedB = new Breed()
        breedB.type = "Cat"
        breedB.name = "Ringtail"

        await bd.add(breedA)
        await bd.add(breedB)
    })

    it("Should fetch list", (done)=>{
        chai.request(server)
            .get("/api/v1/breed")
            .end((err, res)=>{
                assert(res.body.length == 2)
                assert(res.body[0].type == "Dog")
                done()
            });
    })

    it("Should fetch custom id", (done)=>{
        chai.request(server)
            .get("/api/v1/breed/2")
            .end((err, res)=>{
                assert(res.body.type == "Cat")
                assert(res.body.name = "RingTail")
                done()
            })
    })

    it("Should insert in list", (done)=>{
        let obj = {
            "type": "Snake",
            "name": "Python"
        }
        chai.request(server)
            .post("/api/v1/breed")
            .send(obj)
            .end(async (err, res)=>{
                let data = res.body
                assert(data.id == 3)
                assert(data.type == "Snake")

                let list = await bd.getAll()
                assert(list.length == 3)

                done()
            })
    })

    it("Should update in list", (done)=>{
        let obj = {
            "id": 1,
            "type": "Dog",
            "name": "German Shepherd"
        }
        chai.request(server)
            .put("/api/v1/breed")
            .send(obj)
            .end(async(err, res)=>{
                let dog = await bd.getById(1)
                assert(dog.name == "German Shepherd")

                done()
            })
    })

    it("Should delete in list", (done)=>{
        let obj = {
            "id": 1
        }
        chai.request(server)
            .delete("/api/v1/breed")
            .send(obj)
            .end(async(err, res)=>{
                let list = await bd.getAll()
                assert(list.length == 1)

                done()
            })
    })
})