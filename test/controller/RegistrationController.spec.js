
const DatabaseManager = require("../../src/service/DatabaseManager")
var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")
const AdminDAO = require("../../src/dao/AdminDAO");
const Admin = require("../../src/model/Admin");
const resetDatabase = require("../../src/utils/resetDatabase");
const _ = require("lodash")
const Breed = require("../../src/model/Breed");
const Address = require("../../src/model/Address");
const Breeder = require("../../src/model/Breeder");
const BreederDAO = require("../../src/dao/BreederDAO");
chai.use(chaiHttp)

describe("Registration Controller", ()=>{
    let dm = DatabaseManager.getInstance()
    let defaultParams = null


    let initBreeder = async()=>{
        let breedA = null;
        let breedB = null;
        let breedC = null;
        let breedD = null;
        let addressA = null;
        let addressB = null;
        let breederA = null;
        let breederB = null;

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

        let brd = BreederDAO.getInstance()
        await brd.add(breederA)
        await brd.add(breederB)
    }


    beforeEach(async ()=>{
        await dm.init()
        await resetDatabase()
        await initBreeder()

        defaultParams = {
            type: "breeder",

            name1: "john",
            name2: "doe",
            phone: '1234',
            email: 'john@gmail.com',

            address: '1234 Ave 3',
            country: 'RU',
            changwat: 'Moscow',
            postcode: '2345',

            username: 'jj',
            password: 'pass-john',
            passwordCheck: 'pass-john',

            website: 'http://john.com',
            subscribe: false
        }
    })
    it("Should register successfully", (done)=>{
        chai.request(server)
            .post("/api/v1/registration")
            .send(defaultParams)
            .end(async(err, res)=>{
                let data = res.body
                assert(data.hasOwnProperty("object"))
                assert(data.object.id == 3)
                done()
            })
    })

    it("Should detect errors Phone invalid and empty username", (done)=>{
        defaultParams.phone = "abc"
        defaultParams.username = ""
        chai.request(server)
            .post("/api/v1/registration")
            .send(defaultParams)
            .end(async(err, res)=>{
                let data = res.body
                assert(data.hasOwnProperty("errors"))
                assert(Object.keys(data.errors).length == 2)
                assert(data.errors.phone == "INVALID_PHONE")
                assert(data.errors.username == "EMPTY_USERNAME")
                done()
            })
    })

    it("Should detect unavailable username", (done)=>{
        defaultParams.username = "john.doe"
        chai.request(server)
            .post("/api/v1/registration")
            .send(defaultParams)
            .end(async(err, res)=> {
                let data = res.body
                assert(data.hasOwnProperty("errors"))
                assert(Object.keys(data.errors).length == 1)
                assert(data.errors.username = "UNAVAILABLE_USERNAME")
                done()
            })
    })
})
