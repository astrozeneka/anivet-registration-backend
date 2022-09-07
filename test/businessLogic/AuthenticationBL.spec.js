
var chai = require('chai');
let chaiHttp = require('chai-http');
const DatabaseManager = require("../../src/service/DatabaseManager");
const AdminDAO = require("../../src/dao/AdminDAO");
const Admin = require("../../src/model/Admin");
const AuthenticationBL = require("../../src/businessLogic/AuthenticationBL");
const resetDatabase = require("../../src/utils/resetDatabase");
const Address = require("../../src/model/Address");
const Owner = require("../../src/model/Owner");
const Breeder = require("../../src/model/Breeder");
const Vet = require("../../src/model/Vet");
const BaseMemberDAO = require("../../src/dao/BaseMemberDAO");
var assert = chai.assert;

describe("Business Logic", ()=>{
    let dm = DatabaseManager.getInstance()
    let add = AdminDAO.getInstance()
    let bmd = BaseMemberDAO.getInstance()
    let bl = AuthenticationBL.getInstance()
    let adminA = null
    let adminB = null
    let owner, breeder, vet;
    let addressA, addressB, addressC;

    beforeEach(async()=>{
        await dm.init()
        await resetDatabase()

        adminA = new Admin();
        adminA.username = "john";
        adminA.password = "john-password";
        adminA.website = "http://www.john.com";

        adminB = new Admin();
        adminB.username = "jane";
        adminB.password = "jane-password";
        adminB.website = "http://www.jane.com";


        addressA = new Address();
        addressA.address1 = "124 Charles Ave"
        addressA.country = "RU"
        addressA.changwat = "Moscow"
        addressA.amphoe = ""
        addressA.tambon = ""
        addressA.postcode = "1234"

        addressB = new Address();
        addressB.address1 = "34 Russia Ave"
        addressB.country = "RU"
        addressB.changwat = "Moscow"
        addressB.amphoe = ""
        addressB.tambon = ""
        addressB.postcode = "1234"

        addressC = new Address();
        addressC.address1 = "192 Infinite Ave"
        addressC.country = "TH"
        addressC.changwat = "กาฬสินธุ์"
        addressC.amphoe = "กุฉินารายณ์"
        addressC.tambon = "กุดหว้า"
        addressC.postcode = "46110"

        owner = new Owner();
        owner.username = "bob";
        owner.password = "bob";
        owner.subscribe = true;
        owner.address = addressA;

        breeder = new Breeder();
        breeder.username = "somchai"
        breeder.password = "somchai"
        breeder.subscribe = false;
        breeder.address = addressB;

        vet = new Vet();
        vet.username = "steve"
        vet.password = "steve"
        vet.subscribe = true;
        vet.address = addressC;

        await add.add(adminA);
        await add.add(adminB);
        await bmd.add(owner);
        await bmd.add(breeder);
        await bmd.add(vet);
    })

    it("Should authenticate", async()=>{
        let u = await bl.authenticateAdmin("jane", "jane-password")
        assert(u instanceof Admin)
    })

    it("Should throw EMPTY_USERNAME error", async()=>{
        let u = await bl.authenticateAdmin("", "pass")
        assert(Object.keys(u.errors).length == 1)
        assert(u.errors.username == "EMPTY_USERNAME")
    })

    it("Should throw EMPTY_PASSWORD error", async()=>{
        let u = await bl.authenticateAdmin("user", "")
        assert(Object.keys(u.errors).length == 1)
        assert(u.errors.password == "EMPTY_PASSWORD")
    })

    it("Should throw the two errors mentionned above", async()=>{
        let u = await bl.authenticateAdmin("", "")
        assert(Object.keys(u.errors).length == 2)
    })

    it("Should throw INVALID CREDENTIALS", async()=>{
        let u = await bl.authenticateAdmin("john", "john")
        assert(u.errors.form == "INVALID_CREDENTIALS")
    })


    it("Should authenticate simple user", async()=>{
        let u = await bl.authenticateUser("owner", owner.username, owner.password)
        assert(u instanceof Owner)

        u = await bl.authenticateUser("breeder", breeder.username, breeder.password)
        assert(u instanceof Breeder)

        u = await bl.authenticateUser("vet", vet.username, vet.password)
        assert(u instanceof Vet)
    })

    it("Should throw INVALID CREDENTIALS on vet", async()=>{
        u = await bl.authenticateUser("vet", vet.username, "aaa")
        assert(u.errors.form == "INVALID_CREDENTIALS")
    })
})
