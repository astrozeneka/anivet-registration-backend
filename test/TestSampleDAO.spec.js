const DatabaseManager = require("../src/service/DatabaseManager")

var chai = require('chai');
const BreedDAO = require("../src/dao/BreedDAO");
const TestSampleDAO = require("../src/dao/TestSampleDAO");
const TestSample = require("../src/model/TestSample");
var assert = chai.assert;

describe("TestSampleDAO", function(){

    let dm = DatabaseManager.getInstance()
    let tsd = TestSampleDAO.getInstance()

    let sampleA = null
    let sampleB = null

    beforeEach(async function(){
        await dm.init()
        await tsd.destroyTable()
        await tsd.buildTable()

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
    })

    it("Should destroy and create table", async function(){

    })

    it("Should insert", async function(){
        await tsd.add(sampleA)
        assert(sampleA.id != null)
    })

    it("Should fetch list", async function(){
        await tsd.add(sampleA)
        await tsd.add(sampleB)

        list = await tsd.getAll()
        assert(list.length == 2)
    })

    it("Should search by id", async function(){
        await tsd.add(sampleA)
        await tsd.add(sampleB)

        let _o = await tsd.getById(sampleB.id)
        assert(_o.id == sampleB.id)
    })

    it("Should update", async function(){
        await tsd.add(sampleA)
        sampleA.petSpecie = "german-shepherd"
        await tsd.update(sampleA)
        let _sampleA = await tsd.getById(sampleA.id)
        assert(_sampleA.petSpecie == "german-shepherd")
    })

    it("Should delete", async function(){
        await tsd.add(sampleA)
        await tsd.add(sampleB)

        var list = await tsd.getAll()
        assert(list.length == 2)

        await tsd.delete(sampleA)
        list = await tsd.getAll()
        assert(list.length == 1)

    })
})
