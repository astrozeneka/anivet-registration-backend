const DatabaseManager = require("../../src/service/DatabaseManager");
const AdminDAO = require("../../src/dao/AdminDAO");
const resetDatabase = require("../../src/utils/resetDatabase");
const Admin = require("../../src/model/Admin");
const Message = require("../../src/model/Message");
const BreederDAO = require("../../src/dao/BreederDAO");
const OwnerDAO = require("../../src/dao/OwnerDAO");
const VetDAO = require("../../src/dao/VetDAO");
const Owner = require("../../src/model/Owner");
const Breeder = require("../../src/model/Breeder");
const Vet = require("../../src/model/Vet");
const Address = require("../../src/model/Address");
const MessageDAO = require("../../src/dao/MessageDAO");

const chai = require("chai");
var assert = chai.assert;

describe("MessageDAO", function(){

    let dm = DatabaseManager.getInstance();
    let add = AdminDAO.getInstance();
    let brd = BreederDAO.getInstance();
    let od = OwnerDAO.getInstance();
    let vd = VetDAO.getInstance();
    let md = MessageDAO.getInstance();

    let adminA, adminB;
    let owner, breeder, vet;
    let addressA, addressB, addressC;


    let messageA, messageB, messageC;

    beforeEach(async function(){
        await dm.init()
        await resetDatabase()

        adminA = new Admin();
        adminA.username = "john";
        adminA.password = "john-password";
        adminA.website = "http://www.john.com";

        adminB = new Admin();
        adminB.username = "jane";
        adminB.password = "jane-password";
        adminB.website = "http://www.jane.com";


        addressA = new Address();
        addressA.address1 = "124 Charles Ave"
        addressA.country = "RU"
        addressA.changwat = "Moscow"
        addressA.amphoe = ""
        addressA.tambon = ""
        addressA.postcode = "1234"

        addressB = new Address();
        addressB.address1 = "34 Russia Ave"
        addressB.country = "RU"
        addressB.changwat = "Moscow"
        addressB.amphoe = ""
        addressB.tambon = ""
        addressB.postcode = "1234"

        addressC = new Address();
        addressC.address1 = "192 Infinite Ave"
        addressC.country = "TH"
        addressC.changwat = "กาฬสินธุ์"
        addressC.amphoe = "กุฉินารายณ์"
        addressC.tambon = "กุดหว้า"
        addressC.postcode = "46110"

        owner = new Owner();
        owner.username = "bob";
        owner.password = "bob";
        owner.subscribe = true;
        owner.address = addressA;

        breeder = new Breeder();
        breeder.username = "somchai"
        breeder.password = "somchai"
        breeder.subscribe = false;
        breeder.address = addressB;

        vet = new Vet();
        vet.username = "steve"
        vet.password = "steve"
        vet.subscribe = true;
        vet.address = addressC;


        await add.add(adminA)
        await add.add(adminB)
        await od.add(owner)
        await brd.add(breeder)
        await vd.add(vet)

        messageA = new Message()
        messageA.title = "WELCOME"
        messageA.content = "Welcome to the backoffice platform"
        messageA.senderId = null
        messageA.receiverId = owner.id

        messageB = new Message()
        messageB.title = "WELCOME"
        messageB.content = "Welcome to the backoffice platform"
        messageB.senderID = null
        messageB.receiverId = breeder.id

        messageC = new Message()
        messageC.title = "Hello from admin"
        messageC.content = "Hello"
        messageC.senderId = adminA.id
        messageC.receiverId = owner.id
    })

    it("Should destroy and create the table", async()=>{

    })

    it("Should add message", async ()=> {
        await md.add(messageA)
        await md.add(messageB)
        let messageList = await md.getAll()
        assert(messageList.length == 2)
    })

    it("Should check message received by one member", async()=>{
        await md.add(messageA)
        await md.add(messageB)
        await md.add(messageC)
        let list = await md.getAllReceivedBy(owner.id)
        assert(list.length == 2)
        list = await md.getAllReceivedBy(breeder.id)
        assert(list.length == 1)
        list = await md.getAllReceivedBy(vet.id)
        assert(list.length == 0)
    })

    it("Should check message send by one member", async()=>{
        await md.add(messageA)
        await md.add(messageB)
        await md.add(messageC)
        let list = await md.getAllSentBy(adminA.id)
        assert(list.length == 1)
        list = await md.getAllSentBy(adminB.id)
        assert(list.length == 0)
    })

    it("Should store date", async()=>{
        messageA.date = new Date()
        messageA.date.setMilliseconds(0)// The date of today
        await md.add(messageA)
        let _messageA = await md.getById(messageA.id)
        assert(_messageA.date.getTime() == messageA.date.getTime())
    })
})



