const DatabaseManager = require("../../src/service/DatabaseManager");
const resetDatabase = require("../../src/utils/resetDatabase");
const Address = require("../../src/model/Address");
const Vet = require("../../src/model/Vet");
const VetDAO = require("../../src/dao/VetDAO");
const chai = require("chai");
const server = require("../../src/main");
const chaiHttp = require("chai-http");

chai.use(chaiHttp)
var assert = chai.assert;



describe("VetController /api/v1/vet/", ()=>{
    let dm = DatabaseManager.getInstance()
    let vd = VetDAO.getInstance()
    let vetA = null
    let vetB = null
    let addressA = null
    let addressB = null

    beforeEach(async()=>{
        await dm.init()
        await resetDatabase()

        addressA = new Address()
        addressA.address1 = "192 Marlebyone Av"
        addressA.country = "RU"
        addressA.changwat = "St Petersburg"
        addressA.amphoe = ""
        addressA.tambon = ""
        addressA.postcode = "12345"

        addressB = new Address()
        addressB.address1 = "192 Infinite Loop"
        addressB.country = "TH"
        addressB.changwat = "กาฬสินธุ์"
        addressB.amphoe = "กุฉินารายณ์"
        addressB.tambon = "กุดหว้า"
        addressB.postcode = "46110"

        vetA = new Vet()
        vetA.username = "Bob"
        vetA.password = "pass"
        vetA.website = "bob.com"
        vetA.subscribe = true
        vetA.name1 = "BOB"
        vetA.name2 = "BOB"
        vetA.phone = "123456789"
        vetA.email = "bob@gmail.com"
        vetA.address = addressA
        vetA.corp = "Anivet"

        vetB = new Vet()
        vetB.username = "Bob"
        vetB.password = "pass"
        vetB.website = "bob.com"
        vetB.subscribe = true
        vetB.name1 = "B"
        vetB.name2 = "b"
        vetB.phone = "65443567"
        vetB.email = "bob@gmail.com"
        vetB.address = addressB
        vetB.corp = "Animal Tech&Cie"

        await vd.add(vetA)
        await vd.add(vetB)
    })

    it("Should fetch list", (done)=>{
        chai.request(server)
            .get("/api/v1/vet")
            .end((err, res)=>{
                assert(res.body.length == 2)
                assert(res.body[0].username == "Bob")
                done()
            })
    })

    it("Should fetch custom id", (done)=>{
        chai.request(server)
            .get("/api/v1/vet/2")
            .end((err, res)=>{
                assert(res.body.id == "2")
                assert(res.body.username == "Bob")
                assert(res.body.password == "pass")
                done()
            })
    })

    it("Should insert in list", (done)=>{
        let obj = {
            name1: "A",
            name2: "B",
            phone: "0123456789",
            email: "legal@omnivet.com",
            corp: "Omnivet Medical",
            username: "F",
            password: "G",
            passwordCheck: "G",
            website: "http://omnivet.com",
            subscribe: false,
            address: {
                address1: "192 Marlebyone Ave",
                country: "TH",
                changwat: "กาฬสินธุ์",
                amphoe: "กุฉินารายณ์",
                tambon: "กุดหว้า",
                postcode: "46110"
            }
        }
        chai.request(server)
            .post("/api/v1/vet")
            .send(obj)
            .end(async (err, res)=>{
                let data = res.body
                assert(data.id == 3)
                assert(data.username == "F")
                let list = await vd.getAll()
                assert(list.length == 3)
                done()
            })
    })

    it("Should update in list", (done)=>{
        let obj = {
            "id": 1,
            "username": "sponge-bob",
            "password": "sponge-pass"
        }
        chai.request(server)
            .put("/api/v1/vet")
            .send(obj)
            .end(async(err, res)=>{
                let vet = await vd.getById(1)
                assert(vet.password == "sponge-pass")
                done()
            })
    })

    it("SHould delete in list", (done)=>{
        let obj = {
            "id": 1
        }
        chai.request(server)
            .delete("/api/v1/vet")
            .send(obj)
            .end(async(err, res)=>{
                let list = await vd.getAll()
                assert(list.length == 1)
                done()
            })
    })
})
