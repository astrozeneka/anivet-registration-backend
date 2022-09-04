
var chai = require('chai');
let chaiHttp = require('chai-http');
const DatabaseManager = require("../../src/service/DatabaseManager");
const AdminDAO = require("../../src/dao/AdminDAO");
const Admin = require("../../src/model/Admin");
const AuthenticationBL = require("../../src/businessLogic/AuthenticationBL");
const resetDatabase = require("../../src/utils/resetDatabase");
const RegistrationBL = require("../../src/businessLogic/RegistrationBL");
const Breed = require("../../src/model/Breed");
const Address = require("../../src/model/Address");
const Breeder = require("../../src/model/Breeder");
const BreederDAO = require("../../src/dao/BreederDAO");
var assert = chai.assert;

describe("Registration Logic", ()=>{
    let dm = DatabaseManager.getInstance()
    let rbl = null
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

    beforeEach(async()=>{
        await dm.init()
        await resetDatabase()
        await initBreeder()
        rbl = RegistrationBL.getInstance()
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

    it("Should register successfully", async()=>{
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("object"))
        let e = u.object
        assert(u.object.id != null)
        assert(u.object.name2 == "doe")
    })

    it("Should detect empty name1", async()=>{
        defaultParams.name1 = ""
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.name1 == "EMPTY_NAME1")
    })

    it("Should detect empty name2", async()=>{
        defaultParams.name2 = ""
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.name2 == "EMPTY_NAME2")
    })

    it("Should detect invalid phone", async()=>{
        defaultParams.phone = "abc"
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.phone == "INVALID_PHONE")
    })

    it("Should detect invalid email", async()=>{
        defaultParams.email = "abc"
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.email == "INVALID_EMAIL")
    })

    it("Should detect empty address", async()=>{
        defaultParams.address = ""
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.address == "EMPTY_ADDRESS")
    })

    it("Should detect empty changwat", async()=>{
        defaultParams.changwat = ""
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.changwat == "EMPTY_CHANGWAT")
    })

    it("Should detect invalid postcode", async()=>{
        defaultParams.postcode = ""
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.postcode == "INVALID_POSTCODE")
    })

    it("Should detect empty username", async()=>{
        defaultParams.username = ""
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.username == "EMPTY_USERNAME")
    })

    it("Should detect used username", async()=>{
        defaultParams.username = "john.doe"
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.username == "UNAVAILABLE_USERNAME")
    })

    it("Should detect empty password", async()=>{
        defaultParams.password = ""
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.password == "INVALID_PASSWORD")
    })

    it("should detect mismatched password", async()=>{
        defaultParams.password = "mypass"
        defaultParams.passwordCheck = "myppss"
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.passwordCheck == "MISMATCHED_PASSWORD")
    })

    it("Should detect invalid website", async()=>{
        defaultParams.website = "httpppp"
        let u = await rbl.register(defaultParams)
        assert(u.hasOwnProperty("errors"))
        assert(u.errors.website == "INVALID_WEBSITE")
    })
})
