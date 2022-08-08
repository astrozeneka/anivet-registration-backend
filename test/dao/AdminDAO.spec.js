const DatabaseManager = require("../../src/service/DatabaseManager")

var chai = require('chai');
const AdminDAO = require("../../src/dao/AdminDAO");
const Admin = require("../../src/model/Admin");
var assert = chai.assert;

describe("AdminDAO", function(){
    let dm = DatabaseManager.getInstance();
    let add = AdminDAO.getInstance();
    let adminA = null
    let adminB = null

    beforeEach(async function(){
        dm.init()
        await add.destroyTable();
        await add.buildTable();

        adminA = new Admin();
        adminA.username = "john";
        adminA.password = "john-password";
        adminA.website = "http://www.john.com";

        adminB = new Admin();
        adminB.username = "jane";
        adminB.password = "jane-password";
        adminB.website = "http://www.jane.com";
    })

    it("Should destroy and create table", async function(){
    })

    it("Should insert", async function(){
        await add.add(adminA);
        assert(adminA.id != null)
    })

    it("Should fetch list", async function(){
        await add.add(adminA);
        await add.add(adminB);
        let list = await add.getAll();
        assert(list.length == 2)
    })

    it("Should search by id", async function(){
        await add.add(adminA);
        await add.add(adminB);
        let _o = await add.getById(adminB.id)
        assert(_o.id == adminB.id);
        assert(_o.username == adminB.username);
        assert(_o.website == adminB.website);
    })

    it("Should update", async function(){
        await add.add(adminA);

        adminA.username = "j"
        await add.update(adminA);

        let _adminA = await add.getById(adminA.id);
        assert(_adminA.username == "j");
    })

    it("Should delete", async function(){
        await add.add(adminA);
        await add.add(adminB);

        var list = await add.getAll();
        assert(list.length == 2)

        await add.delete(adminA);
        list = await add.getAll();
        assert(list.length == 1)
    })
})
