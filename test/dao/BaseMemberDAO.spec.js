

var chai = require('chai');
const DatabaseManager = require("../../src/service/DatabaseManager");
const BaseMemberDAO = require("../../src/dao/BaseMemberDAO");
const resetDatabase = require("../../src/utils/resetDatabase");
const Admin = require("../../src/model/Admin");
const Address = require("../../src/model/Address");
const Owner = require("../../src/model/Owner");
const Breeder = require("../../src/model/Breeder");
const Vet = require("../../src/model/Vet");
var assert = chai.assert;

describe("BaseMemberDAO", function(){

    let dm = DatabaseManager.getInstance()
    let bmd = BaseMemberDAO.getInstance()

    let adminA, adminB;
    let owner, breeder, vet;
    let addressA, addressB, addressC;

    beforeEach(async function(){

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
    })

    it("Should init", async()=>{
    })

    it("Should add", async()=>{
        await bmd.add(vet)
        assert(vet.id == 1)
    })

    it("Should add admin", async()=> {
        await bmd.add(adminA)
        await bmd.add(adminB)
    })

    it("Should fetch all classes", async()=>{
        await bmd.add(adminA)
        await bmd.add(adminB)
        await bmd.add(vet)
        let list = await bmd.getAll();
        assert(list.length == 3)
    })

    it("Should fetch by ID", async()=>{
        await bmd.add(adminA)
        await bmd.add(adminB)
        await bmd.add(vet)
        let _vet = await bmd.getById(vet.id)
        assert(_vet instanceof Vet)
    })
})
