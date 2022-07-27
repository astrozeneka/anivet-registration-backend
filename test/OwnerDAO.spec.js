const DatabaseManager = require("../src/service/DatabaseManager")
const OwnerDAO = require("../src/dao/OwnerDAO")
const Owner = require("../src/model/Owner")

var chai = require('chai');
const AddressDAO = require("../src/dao/AddressDAO");
const Address = require("../src/model/Address");
var assert = chai.assert;

describe("OwnerDAO", function(){
    let dm = DatabaseManager.getInstance()
    let od = OwnerDAO.getInstance()
    let ad = AddressDAO.getInstance()

    let ownerA = null
    let ownerB = null
    let addressA = null
    let addressB = null

    beforeEach(async function(){
        dm.init()
        await ad.destroyTable()
        await od.destroyTable()
        await od.buildTable()
        await ad.buildTable()

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
    })

    it("Should destroy and create table", async function(){
    })

    it("Should insert", async function(){
        await od.add(ownerA)
        assert(ownerA.id != null)
        assert(ownerA.address.id != null)
    })

    it("Should fetch list", async function(){
        await od.add(ownerA)
        await od.add(ownerB)
        let list = await od.getAll()
        assert(list.length == 2)
        let address_list = await ad.getAll()
        assert(address_list.length == 2)
    })

    it("Should do search by id", async function(){
        await od.add(ownerA)
        await od.add(ownerB)

        let _o = await od.getById(ownerB.id)
        assert(_o.id == ownerB.id)
        assert(_o.name1 == "B")
        assert(_o.address.address1 == addressB.address1)
    })

    it("Should update", async function(){
        await od.add(ownerA)

        ownerA.username = "jane"
        ownerA.name1 = "J"
        ownerA.address.address1 = "Anivet"
        await od.update(ownerA)

        let _ownerA = await od.getById(ownerA.id)
        assert(_ownerA.username == "jane")
        assert(_ownerA.name1 == "J")
        assert(_ownerA.address.address1 == "Anivet")
    })

    it("Should delete", async function(){
        await od.add(ownerA)
        await od.add(ownerB)

        var list = await od.getAll()
        assert(list.length == 2)

        await od.delete(ownerA)
        list = await od.getAll()
        assert(list.length == 1)


    })
})