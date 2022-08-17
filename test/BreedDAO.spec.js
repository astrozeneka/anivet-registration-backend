const DatabaseManager = require("../src/service/DatabaseManager")
const BreedDAO = require("../src/dao/BreedDAO")
const Breed = require("../src/model/Breed")

var chai = require('chai');
const OwnerDAO = require("../src/dao/OwnerDAO");
const resetDatabase = require("../src/utils/resetDatabase");
var assert = chai.assert;

describe("BreedDAO", function(){

    let dm = DatabaseManager.getInstance()
    let bd = BreedDAO.getInstance()
    let breedA = null
    let breedB = null

    beforeEach(async function(){
        dm.init()
        await resetDatabase()

        breedA = new Breed()
        breedA.type = "Dog"
        breedA.name = "Chihuahua"

        breedB = new Breed()
        breedB.type = "Cat"
        breedB.name = "Ringtail"
    })

    it("Should destroy and create table", async function(){
    })

    it("Should insert", async function(){
        await bd.add(breedA)
        assert(breedA.id != null)
    })

    it("Should fetch list", async function(){
        await bd.add(breedA)
        await bd.add(breedB)

        list = await bd.getAll()
        assert(list.length == 2)
    })

    it("Should search by id", async function(){
        await bd.add(breedA)
        await bd.add(breedB)
        let _o = await bd.getById(breedB.id)
        assert(_o.id == breedB.id)
    })

    it("Should update", async function(){
        await bd.add(breedA)
        breedA.name = "german-shepherd"
        await bd.update(breedA)
        let _breedA = await bd.getById(breedA.id)
        assert(_breedA.name == "german-shepherd")
    })

    it("Should delete", async function(){
        await bd.add(breedA)
        await bd.add(breedB)
        var list = await bd.getAll()
        assert(list.length == 2)
        await bd.delete(breedA)
        list = await bd.getAll()
        assert(list.length == 1)

    })
})
