const DatabaseManager = require("../../src/service/DatabaseManager");
const OwnerDAO = require("../../src/dao/OwnerDAO");
const resetDatabase = require("../../src/utils/resetDatabase");
const Address = require("../../src/model/Address");
const Vet = require("../../src/model/Vet");
const chai = require("chai");
const server = require("../../src/main");
const Owner = require("../../src/model/Owner");
const chaiHttp = require("chai-http");

chai.use(chaiHttp)
var assert = chai.assert;

describe("OwnerController /api/v1/owner/", ()=>{
    let dm = DatabaseManager.getInstance()
    let od = OwnerDAO.getInstance()
    let ownerA = null
    let ownerB = null
    let addressA = null
    let addressB = null

    beforeEach(async()=>{
        await dm.init()
        await resetDatabase();

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

        ownerA = new Owner()
        ownerA.username = "Bob"
        ownerA.password = "pass"
        ownerA.website = "bob.com"
        ownerA.subscribe = true
        ownerA.name1 = "BOB"
        ownerA.name2 = "BOB"
        ownerA.phone = "123456789"
        ownerA.email = "bob@gmail.com"
        ownerA.address = addressA

        ownerB = new Owner()
        ownerB.username = "Bob"
        ownerB.password = "pass"
        ownerB.website = "bob.com"
        ownerB.subscribe = true
        ownerB.name1 = "B"
        ownerB.name2 = "b"
        ownerB.phone = "65443567"
        ownerB.email = "bob@gmail.com"
        ownerB.address = addressB

        await od.add(ownerA)
        await od.add(ownerB)
    })

    it("Should fetch in list", (done)=>{
        chai.request(server)
            .get("/api/v1/owner")
            .end((err, res)=>{
                assert(res.body.length == 2)
                assert(res.body[0].username == "Bob")
                done()
            })
    })

    it("Should fetch custom id of pet owner", (done)=>{
        chai.request(server)
            .get("/api/v1/owner/2")
            .end((err, res)=>{
                assert(res.body.id == "2")
                assert(res.body.username == "Bob")
                assert(res.body.password == "pass")
                done()
            })
    })

    it("Should register pet owner",  (done)=>{
        let obj = {
            name1: "A",
            name2: "B",
            phone: "0123456789",
            email: "A@gmail.com",
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
            .post("/api/v1/owner")
            .send(obj)
            .end(async (err, res)=>{
                let data = res.body
                assert(data.id == 3)
                assert(data.username == "F")
                let list = await od.getAll()
                assert(list.length == 3)
                done()
            })
    })
})
