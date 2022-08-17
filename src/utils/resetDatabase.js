const AddressDAO = require("../dao/AddressDAO");
const BreedDAO = require("../dao/BreedDAO");
const OwnerDAO = require("../dao/OwnerDAO");
const TestOrderDAO = require("../dao/TestOrderDAO");
const TestSampleDAO = require("../dao/TestSampleDAO");
const BreederDAO = require("../dao/BreederDAO");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const AdminDAO = require("../dao/AdminDAO");
const VetDAO = require("../dao/VetDAO");

async function resetDatabase(){
    let ad = AddressDAO.getInstance()
    let bd = BreedDAO.getInstance()
    let od = OwnerDAO.getInstance()
    let tod = TestOrderDAO.getInstance()
    let tsd = TestSampleDAO.getInstance()
    let brd = BreederDAO.getInstance()
    let bmd = BaseMemberDAO.getInstance()
    let add = AdminDAO.getInstance()
    let vd = VetDAO.getInstance()


    await ad.destroyTable()
    await od.destroyTable()
    await tsd.destroyTable()
    await tod.destroyTable()
    await brd.destroyTable()
    await add.destroyTable()
    await vd.destroyTable()
    await bmd.destroyTable()
    await bd.destroyTable()

    await bd.buildTable() // Breed Table
    await bmd.buildTable() // Base Admin Table
    await vd.buildTable() // Vet Table
    await add.buildTable() // Admin Tabld
    await brd.buildTable() // Breeder Table
    await tod.buildTable() // TestOrder Table
    await tsd.buildTable() // TestSample Table
    await od.buildTable() // Owner Table
    await ad.buildTable() // Address Table
}

module.exports = resetDatabase
