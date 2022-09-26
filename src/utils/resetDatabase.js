const AddressDAO = require("../dao/AddressDAO");
const BreedDAO = require("../dao/BreedDAO");
const OwnerDAO = require("../dao/OwnerDAO");
const TestOrderDAO = require("../dao/TestOrderDAO");
const TestSampleDAO = require("../dao/TestSampleDAO");
const BreederDAO = require("../dao/BreederDAO");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const AdminDAO = require("../dao/AdminDAO");
const VetDAO = require("../dao/VetDAO");
const MessageDAO = require("../dao/MessageDAO");
const TrackingTypeDAO = require("../dao/TrackingTypeDAO");
const SampleStatusDAO = require("../dao/SampleStatusDAO");
const ScientistDAO = require("../dao/ScientistDAO");
const PaymentReceipt = require("../model/PaymentReceipt");
const PaymentReceiptDAO = require("../dao/PaymentReceiptDAO");

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
    let sd = ScientistDAO.getInstance()
    let md = MessageDAO.getInstance();
    let ttd = TrackingTypeDAO.getInstance();
    let ssd = SampleStatusDAO.getInstance();
    let prd = PaymentReceiptDAO.getInstance()

    await prd.destroyTable()
    await md.destroyTable()
    await ad.destroyTable()
    await od.destroyTable()
    await tsd.destroyTable()
    await tod.destroyTable()
    await ssd.destroyTable()
    await ttd.destroyTable()
    await brd.destroyTable()
    await add.destroyTable()
    await sd.destroyTable()
    await vd.destroyTable()
    await bmd.destroyTable()
    await bd.destroyTable()

    await bd.buildTable() // Breed Table
    await bmd.buildTable() // Base Member Table
    await new Promise(r => setTimeout(r, 100)) // This code has been used in order to avoid some errors
    await vd.buildTable() // Vet Table
    await sd.buildTable()
    await add.buildTable() // Admin Tabld
    await brd.buildTable() // Breeder Table
    await ttd.buildTable()
    await ssd.buildTable()
    await tod.buildTable() // TestOrder Table
    await tsd.buildTable() // TestSample Table
    await od.buildTable() // Owner Table
    await ad.buildTable() // Address Table
    await md.buildTable() // Message table (includes notification)
    await prd.buildTable() // Payment Receipt

}

module.exports = resetDatabase
