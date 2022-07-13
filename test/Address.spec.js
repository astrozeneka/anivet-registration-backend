const DatabaseManager = require("../src/service/DatabaseManager")
const Address = require("../src/model/Address")

var chai = require('chai');
const AddressDAO = require("../src/dao/AddressDAO");
var assert = chai.assert;


describe("AddressDAO", function() {
    let dm = DatabaseManager.getInstance()
    let ad = AddressDAO.getInstance()
    let addressA = null
    let addressB = null

    beforeEach(async function(){
        dm.init()
        await ad.destroyTable()
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
    })

    it("Should destroy and create table", async function(){
    })

    it("Should insert", async function(){
        await ad.add(addressA)
        assert(addressA.id != null)
    })

    it("Should fetch list", async function(){
        await ad.add(addressA)
        await ad.add(addressB)

        list = await ad.getAll()
        assert(list.length == 2)
    })

    it("Should search by id", async function(){
        await ad.add(addressA)
        await ad.add(addressB)
        let _o = await ad.getById(addressB.id)
        assert(_o.id == addressB.id)
    })

    it("Should update", async function(){
        await ad.add(addressA)
        addressA.postcode = "11111"
        await ad.update(addressA)
        let _addressA = await ad.getById(addressA.id)
        assert(_addressA.postcode == "11111")
    })

    it("Should delete", async function(){
        await ad.add(addressA)
        await ad.add(addressB)
        var list = await ad.getAll()
        assert(list.length == 2)
        await ad.delete(addressA)
        list = await ad.getAll()
        assert(list.length == 1)

    })




})