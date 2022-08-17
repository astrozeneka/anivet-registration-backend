const DatabaseManager = require("../../src/service/DatabaseManager");
const AddressDAO = require("../../src/dao/AddressDAO");
const VetDAO = require("../../src/dao/VetDAO");
const resetDatabase = require("../../src/utils/resetDatabase");
const Address = require("../../src/model/Address");
const Vet = require("../../src/model/Vet")
const Owner = require("../../src/model/Owner");
const chai = require("chai");

var assert = chai.assert;

describe("VetDAO", function(){
    let dm = DatabaseManager.getInstance()
    let vd = VetDAO.getInstance()
    let ad = AddressDAO.getInstance()

    let vetA = null
    let vetB = null
    let addressA = null
    let addressB = null

    beforeEach(async function(){
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
    })

    it("Should destroy and create table", async function(){
    })

    it("Should insert", async function(){
        await vd.add(vetA)
        assert(vetA.id != null)
        assert(vetA.address.id != null)
    })

    it("Should fetch list", async function(){
        await vd.add(vetA)
        await vd.add(vetB)
        let list = await vd.getAll()
        assert(list.length == 2)
        let address_list = await vd.getAll()
        assert(address_list.length == 2)
    })

    it("Should do search by id", async function(){
        await vd.add(vetA)
        await vd.add(vetB)

        let _o = await vd.getById(vetB.id)
        assert(_o.id == vetB.id)
        assert(_o.name1 == vetB.name1)
        assert(_o.address.address1 == vetB.address.address1)
    })

    it("Should update", async function(){
        await vd.add(vetA)

        vetA.username = "jane"
        vetA.name1 = "J"
        vetA.address.address1 = "Bangkok"
        await vd.update(vetA)

        let _vetA = await vd.getById(vetA.id)
        assert(_vetA.username == "jane")
        assert(_vetA.nameA = "J")
        assert(_vetA.address.address1 = "Bangkok")
    })

    it("Should delete", async function(){
        await vd.add(vetA)
        await vd.add(vetB)

        var list = await vd.getAll()
        assert(list.length == 2)

        await vd.delete(vetA)
        list = await vd.getAll()

        assert(list.length == 1)
    })
})
