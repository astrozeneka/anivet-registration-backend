const DatabaseManager = require("../../src/service/DatabaseManager");
const BreederDAO = require('../../src/dao/BreederDAO')
const AddressDAO = require("../../src/dao/AddressDAO");
const BreedDAO = require("../../src/dao/BreedDAO");
const Breed = require("../../src/model/Breed");
const Address = require("../../src/model/Address");
const Breeder = require("../../src/model/Breeder");
const chai = require("chai");
var assert = chai.assert;

describe("BreederDAO", function(){
    let dm = DatabaseManager.getInstance()
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
        await bd.destroyTable();

        await bd.buildTable();
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



    // IMPORTANT : check if the breed has already added

})
