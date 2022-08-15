

var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")
const DatabaseManager = require("../../src/service/DatabaseManager");
const BreederDAO = require("../../src/dao/BreederDAO");
const AddressDAO = require("../../src/dao/AddressDAO");
const BreedDAO = require("../../src/dao/BreedDAO");
const Breeder = require("../../src/model/Breeder");
const Address = require("../../src/model/Address");
const Breed = require("../../src/model/Breed");

chai.use(chaiHttp)

describe("Test Breeder Controller", ()=>{
    let dm = DatabaseManager.getInstance()
    let brd = BreederDAO.getInstance()
    let ad = AddressDAO.getInstance()
    let bd = BreedDAO.getInstance()

    let breedA = null;
    let breedB = null;
    let breedC = null;
    let breedD = null;
    let addressA = null;
    let addressB = null;
    let breederA = null;
    let breederB = null;

    beforeEach(async function(){
        dm.init()
        await ad.destroyTable();
        await brd.destroyTable();
        await bd.destroyTable();

        await bd.buildTable();
        await brd.buildTable();
        await ad.buildTable();

        breedA = new Breed();
        breedA.type = "Dog";
        breedA.name = "Chihuahua";

        breedB = new Breed();
        breedB.type = "Dog";
        breedB.name = "German shepherd";

        breedC = new Breed();
        breedC.type = "Cag";
        breedC.name = "Ringtail";

        breedD = new Breed();
        breedD.type = "Dog";
        breedD.name = "Ridgeback";

        addressA = new Address()
        addressA.address1 = "192 Marlebyone Ave";
        addressA.country = "TH";
        addressA.changwat = "กรุงทพมหานคร";
        addressA.amphoe = "ดุสิต";
        addressA.tambon = "วชิรพยาบาล";
        addressA.postcode = "10300";

        addressB = new Address()
        addressB.address1 = "192 Infinite Loop"
        addressB.country = "TH"
        addressB.changwat = "กาฬสินธุ์"
        addressB.amphoe = "กุฉินารายณ์"
        addressB.tambon = "กุดหว้า"
        addressB.postcode = "46110"

        breederA = new Breeder()
        breederA.name1 = "John"
        breederA.name2 = "Doe"
        breederA.phone = "0987780987"
        breederA.email = "john.doe@mail.com"
        breederA.username = "john.doe"
        breederA.password = "john.doe"
        breederA.subscribe = true
        breederA.address = addressA
        breederA.breeds = [breedA]

        breederB = new Breeder()
        breederB.name1 = "Jane"
        breederB.name2 = "Doe"
        breederB.phone = "0987712345"
        breederB.email = "jane.doe@gmail.com"
        breederB.username = "jane.doe"
        breederB.password = "jane.doe"
        breederB.subscribe = false
        breederB.address = addressB
        breederB.breeds = [breedB, breedC, breedD]

        await brd.add(breederA)
        await brd.add(breederB)
    })

    it("Should fetch list",  (done)=>{
        chai.request(server)
            .get("/api/v1/breeder")
            .end((err, res)=>{
                assert(res.body.length == 2)
                assert(res.body[0].name1 == "John")
                done()
            })
    })

    it("Should fetch custom ID", (done)=>{
        chai.request(server)
            .get("/api/v1/breeder/2")
            .end((err, res)=>{
                assert(res.body.name1 == "Jane")
                assert(res.body.breeds.length == 3)
                done()
            })
    })

    it("Should insert in List (new breed)", (done)=>{
        let obj = {
            "name1": "Bob",
            "name2": "Sponge",
            "phone": "1234567",
            "email":"sponge@bob.com",
            "username": "bob",
            "password": "bob",
            "passwordCheck": "bob",
            "website": "www.bob.com",
            "subscribe": true,
            "address": {
                "address1": "202 Senanikom",
                "country": "TH",
                "changwat": "",
                "amphoe": "Jatujak",
                "tambon": "Bangkok",
                "postcode": "10900"
            },
            "breeds": [
                {
                    "type": "bird",
                    "name": "ไก่"
                },
                {
                    "type": "Dog",
                    "name": "Shiba Inu"
                }
            ]
        }
        chai.request(server)
            .post("/api/v1/breeder")
            .send(obj)
            .end(async (err, res)=>{
                let breederList = await brd.getAll()
                let addressList = await ad.getAll()
                let breedList = await bd.getAll()
                assert(breederList.length == 3)
                assert(addressList.length == 3)
                assert(breedList.length == 6)
                done()
            })
    })

    it("Should insert in list (breed already exist)", (done)=>{
        let obj = {
            "name1": "Bob",
            "name2": "Sponge",
            "phone": "1234567",
            "email":"sponge@bob.com",
            "username": "bob",
            "password": "bob",
            "passwordCheck": "bob",
            "website": "www.bob.com",
            "subscribe": true,
            "address": {
                "address1": "202 Senanikom",
                "country": "TH",
                "changwat": "",
                "amphoe": "Jatujak",
                "tambon": "Bangkok",
                "postcode": "10900"
            },
            "breeds": [
                {
                    "id": 1
                }
            ]
        }
        chai.request(server)
            .post("/api/v1/breeder")
            .send(obj)
            .end(async (err, res)=>{
                let breederList = await brd.getAll()
                let addressList = await ad.getAll()
                let breedList = await bd.getAll()
                assert(breederList.length == 3)
                assert(addressList.length == 3)
                assert(breedList.length == 4)
                done()
            })
    })

    it("Should update in list", (done)=>{
        let obj = {
            "id": "1",
            "email": "john@facebook.com"
        }
        chai.request(server)
            .put("/api/v1/breeder")
            .send(obj)
            .end(async(err, res)=>{
                let breeder = await brd.getById(1)
                assert(breeder.email == "john@facebook.com")
                assert(breeder.password == "john.doe")
                assert(breeder.breeds.length == 1)
                done()
            })
    })

    it("Should delete in list", (done)=>{
        let obj = {
            "id": "2"
        }
        chai.request(server)
            .delete("/api/v1/breeder")
            .send(obj)
            .end(async(err, res)=>{
                let breederList = await brd.getAll()
                let addressList = await ad.getAll()
                assert(breederList.length == 1)
                assert(addressList.length == 1)
                done()
            })
    })
})
