const DatabaseManager = require("../src/service/DatabaseManager")
const OwnerDAO = require("../src/dao/OwnerDAO")
const Owner = require("../src/model/Owner")

var chai = require('chai');
var assert = chai.assert;

describe("OwnerDAO", function(){
    let dm = DatabaseManager.getInstance()
    let od = OwnerDAO.getInstance()

    let ownerA = null
    let ownerB = null

    beforeEach(async function(){
        dm.init()
        await od.destroyTable()
        await od.buildTable()


        ownerA = new Owner()
        ownerA.username = "Bob"
        ownerA.password = "pass"
        ownerA.website = "bob.com"
        ownerA.subscribe = true
        ownerA.name1 = "BOB"
        ownerA.name2 = "BOB"
        ownerA.phone = "123456789"
        ownerA.email = "bob@gmail.com"

        ownerB = new Owner()
        ownerB.username = "Bob"
        ownerB.password = "pass"
        ownerB.website = "bob.com"
        ownerB.subscribe = true
        ownerB.name1 = "B"
        ownerB.name2 = "b"
        ownerB.phone = "65443567"
        ownerB.email = "bob@gmail.com"
    })

    it("Should destroy and create table", async function(){
    })

    it("Should insert", async function(){
        await od.add(ownerA)
        assert(ownerA.id != null)
    })

    it("Should fetch list", async function(){
        await od.add(ownerA)
        await od.add(ownerB)
        list = await od.getAll()
        assert(list.length == 2)
    })

    it("Should do search by id", async function(){
        await od.add(ownerA)
        await od.add(ownerB)

        let _o = await od.getById(ownerB.id)
        assert(_o.id == ownerB.id)
        assert(_o.name1 == "B")
    })

    it("Should update", async function(){
        await od.add(ownerA)

        ownerA.username = "jane"
        ownerA.name1 = "J"
        await od.update(ownerA)

        let _ownerA = await od.getById(ownerA.id)
        assert(_ownerA.username == "jane")
        assert(_ownerA.name1 == "J")
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