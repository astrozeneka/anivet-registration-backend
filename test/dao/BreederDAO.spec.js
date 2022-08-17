const DatabaseManager = require("../../src/service/DatabaseManager");
const BreederDAO = require('../../src/dao/BreederDAO')
const AddressDAO = require("../../src/dao/AddressDAO");
const BreedDAO = require("../../src/dao/BreedDAO");
const Breed = require("../../src/model/Breed");
const Address = require("../../src/model/Address");
const Breeder = require("../../src/model/Breeder");
const chai = require("chai");
const BaseMemberDAO = require("../../src/dao/BaseMemberDAO");
var assert = chai.assert;

describe("BreederDAO", function(){
    let dm = DatabaseManager.getInstance()
    let bmd = BaseMemberDAO.getInstance()
    let brd = BreederDAO.getInstance()
    let ad = AddressDAO.getInstance()
    let bd = BreedDAO.getInstance()

    let breedA = null;
    let breedB = null;
    let breedC = null;
    let breedD = null;
    let addressA = null;
    let addressB = null;
    let breederA = null;
    let breederB = null;

    beforeEach(async function(){
        dm.init()

        await ad.destroyTable();
        await brd.destroyTable();
        await bmd.destroyTable();
        await bd.destroyTable();

        await bd.buildTable();
        await bmd.buildTable();
        await brd.buildTable();
        await ad.buildTable();

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

    })

    it("should bread and destroy table correctly", ()=>{
    })

    it("Should insert into database", async()=>{
        await brd.add(breederA)
        assert(breederA.id == 1)
        assert(breederA.breeds[0].id == 1)
        assert(breederA.address.id == 1)
    })

    it("Should fetch in list", async ()=>{
        await brd.add(breederA)
        await brd.add(breederB)
        let brdList = await brd.getAll();
        let bdList = await bd.getAll();
        let adList = await ad.getAll();
        assert(brdList.length == 2);
        assert(bdList.length == 4);
        assert(adList.length == 2);
    })

    it("Shouldn't insert breed if it has been already inserted", async()=>{
        breederA.breeds = [breedA]
        breederB.breeds = [breedA, breedB]
        await brd.add(breederA)
        await brd.add(breederB)

        let bdList = await bd.getAll();
        assert(bdList.length == 2);
    })

    it("Shouldn't insert breed if it has been already inserted (2)", async()=>{
        breederA.breeds = [breedA]
        await brd.add(breederA);

        breederB.breeds = [breedA, breedB]
        await brd.add(breederB);

        let bdList = await bd.getAll();
        assert(bdList.length == 2);
    })

    it("Should fetch breeder by id", async()=>{
        await brd.add(breederA)
        await brd.add(breederB)

        let _o = await brd.getById(breederA.id)
        assert(_o.name1 == breederA.name1)
        assert(_o.breeds.length == breederA.breeds.length)

        _o = await brd.getById(breederB.id)
        assert(_o.id == breederB.id)
        assert(_o.breeds.length == breederB.breeds.length)
    })

    it("Should update the database", async()=>{
        await brd.add(breederA)
        await brd.add(breederB)

        breederA.name2 = "Obama"
        breederA.breeds[0].name = "CHIHUAHUA"
        await brd.update(breederA)

        let _o = await brd.getById(breederA.id)
        assert(_o.name2 = "Obama")
        assert(_o.breeds[0].name == "CHIHUAHUA")

        let _b = await bd.getById(breederA.breeds[0].id)
        assert(_b.name == "CHIHUAHUA")
    })

    it("Should delete from the database", async()=>{
        await brd.add(breederA)
        await brd.add(breederB);

        let brdList = await brd.getAll();
        let adList = await ad.getAll();
        let bdList = await bd.getAll();
        assert(brdList.length == 2)
        assert(adList.length == 2)
        assert(bdList.length == 4)

        await brd.delete(breederB)
        brdList = await brd.getAll();
        adList = await ad.getAll();
        assert(brdList.length == 1);
        assert(adList.length == 1);
    })


    // IMPORTANT : check if the breed has already added

})
