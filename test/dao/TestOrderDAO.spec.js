const DatabaseManager = require("../../src/service/DatabaseManager")

var chai = require('chai');
const TestSampleDAO = require("../../src/dao/TestSampleDAO");
const TestSample = require("../../src/model/TestSample");
const TestOrderDAO = require("../../src/dao/TestOrderDAO");
const TestOrderWithSamples = require("../../src/model/TestOrderWithSamples");
const resetDatabase = require("../../src/utils/resetDatabase");
var assert = chai.assert;

describe("TestOrderDAO", function(){

    let dm = DatabaseManager.getInstance()
    let tsd = TestSampleDAO.getInstance()
    let tod = TestOrderDAO.getInstance()

    let sampleA = null
    let sampleB = null
    let sampleC = null

    let orderA = null
    let orderB = null

    beforeEach(async function(){

        await dm.init()
        await resetDatabase()
        /*await tsd.destroyTable()
        await tod.destroyTable()
        await tod.buildTable()
        await tsd.buildTable()
         */

        sampleA = new TestSample()
        sampleA.animal = "Bird"
        sampleA.type = ""
        sampleA.petId = "0123"
        sampleA.petSpecie = "Macau"
        sampleA.test = "sexing"
        sampleA.sampleType = "blood"
        sampleA.image = "image" // Maybe a one-to-one reference

        sampleB = new TestSample()
        sampleB.animal = "Dog"
        sampleB.type = ""
        sampleB.petId = "0124"
        sampleB.petSpecie = "Canis Lupus"
        sampleB.test = "sexing"
        sampleB.sampleType = "blood"
        sampleB.image = "image2"

        sampleC = new TestSample()
        sampleC.animal = "Cat"
        sampleC.type = ""
        sampleC.petId = "0125"
        sampleC.petSpecie = "RingTail"
        sampleC.test = "sexing"
        sampleC.sampleType = "blood"
        sampleC.image = "Image3"

        orderA = new TestOrderWithSamples()
        orderA.name1 = "Order A"
        orderA.name2 = "order-a"
        orderA.website = "http://google.com"
        orderA.samples = [sampleA, sampleB]

        orderB = new TestOrderWithSamples()
        orderB.name1 = "Order B"
        orderB.name2 = "order-b"
        orderB.website = "http://anivet.th"
        orderB.samples = [sampleC]

    })

    it("Should destroy and create testOrder tables", async function(){

    })

    it("Should insert testOrder", async function(){
        await tod.add(orderA)
        assert(orderA.id == 1)
        assert(sampleA.id == 1)
        assert(sampleB.id == 2)
    })

    it("Should fetch all testOrder", async function(){
        await tod.add(orderA)
        await tod.add(orderB)

        let list = await tod.getAll()
        assert(list.length == 2)
        assert(list[0].name1 == "Order A")
        assert(list[0].samples.length == 2)
        assert(list[1].samples.length == 1)
    })

    it("Should fetch testOrder by ID", async function(){
        await tod.add(orderA)
        await tod.add(orderB)

        let _o = await tod.getById(orderA.id)
        assert(_o.id == orderA.id)
        assert(_o.samples.length == 2)

        _o = await tod.getById(orderB.id)
        assert(_o.id == orderB.id)
        assert(_o.samples.length == 1)
    })

    it("Should update testOrder", async function(){
        await tod.add(orderA)
        await tod.add(orderB)

        orderA.name1 = "New1"
        orderA.samples[0].animal = "BIRD"
        await tod.update(orderA)

        let _o = await tod.getById(orderA.id)
        assert(_o.name1 == "New1")
        assert(_o.samples[0].animal == "BIRD")
    })

    it("Should update testOrder(2)", async function(){
        await tod.add(orderA)

        orderA.name1 = "New1"
        orderA.samples[0].animal = "BIRD"
        orderA.samples.push(sampleC)

        await tod.update(orderA)

        let _o = await tod.getById(orderA.id)
        assert(_o.name1 == "New1")
        assert(_o.samples.length == 3)
    })

    it("Should delete testOrder", async function(){
        await tod.add(orderA)
        await tod.add(orderB)

        var orderList = await tod.getAll();
        var sampleList = await tsd.getAll();

        await tod.delete(orderA)
        orderList = await tod.getAll();
        sampleList = await tsd.getAll();

        assert(orderList.length == 1)
        assert(sampleList.length == 1)

    })
})
