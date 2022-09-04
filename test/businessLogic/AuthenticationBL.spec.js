
var chai = require('chai');
let chaiHttp = require('chai-http');
const DatabaseManager = require("../../src/service/DatabaseManager");
const AdminDAO = require("../../src/dao/AdminDAO");
const Admin = require("../../src/model/Admin");
const AuthenticationBL = require("../../src/businessLogic/AuthenticationBL");
const resetDatabase = require("../../src/utils/resetDatabase");
var assert = chai.assert;

describe("Business Logic", ()=>{
    let dm = DatabaseManager.getInstance()
    let add = AdminDAO.getInstance()
    let bl = AuthenticationBL.getInstance()
    let adminA = null
    let adminB = null

    beforeEach(async()=>{
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

        await add.add(adminA);
        await add.add(adminB);
    })

    it("Should authenticate", async()=>{
        let u = await bl.authenticateAdmin("jane", "jane-password")
        assert(u instanceof Admin)
    })

    it("Should throw EMPTY_USERNAME error", async()=>{
        let u = await bl.authenticateAdmin("", "pass")
        assert(Object.keys(u.errors).length == 1)
        assert(u.errors.username == "EMPTY_USERNAME")
    })

    it("Should throw EMPTY_PASSWORD error", async()=>{
        let u = await bl.authenticateAdmin("user", "")
        assert(Object.keys(u.errors).length == 1)
        assert(u.errors.password == "EMPTY_PASSWORD")
    })

    it("Should throw the two errors mentionned above", async()=>{
        let u = await bl.authenticateAdmin("", "")
        assert(Object.keys(u.errors).length == 2)
    })

    it("Should throw INVALID CREDENTIALS", async()=>{
        let u = await bl.authenticateAdmin("john", "john")
        assert(u.errors.form == "INVALID_CREDENTIALS")
    })
})
