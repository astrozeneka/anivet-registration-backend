const DatabaseManager = require("../../src/service/DatabaseManager")
var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")
const AdminDAO = require("../../src/dao/AdminDAO");
const Admin = require("../../src/model/Admin");
const resetDatabase = require("../../src/utils/resetDatabase");
const _ = require("lodash")
chai.use(chaiHttp)

describe("AdminController /api/v1/breed/", ()=>{
    let dm = DatabaseManager.getInstance()
    let add = AdminDAO.getInstance()
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

    it("Should fetch list", (done)=>{
        chai.request(server)
            .get("/api/v1/admin")
            .end((err, res)=>{
                assert(res.body.length == 2)
                assert(res.body[0].username == "john")
                done()
            })
    })

    it("Should fetch custom id", (done)=>{
        chai.request(server)
            .get("/api/v1/admin/2")
            .end((err, res)=>{
                assert(res.body.id == "2")
                assert(res.body.username == "jane")
                assert(res.body.password == "jane-password")
                done()
            })
    })

    it("Should insert in list", (done)=>{
        let obj = {
            "username": "bob",
            "password": "password-bob",
            "website": "http://www.bob.com"
        }
        chai.request(server)
            .post("/api/v1/admin")
            .send(obj)
            .end(async (err, res)=>{
                let data = res.body
                assert(data.id == 3)
                assert(data.username == "bob")
                let list = await add.getAll()
                assert(list.length == 3)
                done()
            })
    })

    it("Should update in list", (done)=>{
        let obj = {
            "id": 1,
            "username": "john",
            "password": "password",
            "website": "http://www.john.com"
        }
        chai.request(server)
            .put("/api/v1/admin")
            .send(obj)
            .end(async(err, res)=>{
                let admin = await add.getById(1)
                assert(admin.password == "password")
                done()
            })
    })

    it("Should delete from list", (done)=>{
        let obj = {
            "id": 1
        }
        chai.request(server)
            .delete("/api/v1/admin")
            .send(obj)
            .end(async(err, res)=>{
                let list = await add.getAll()
                assert(list.length == 1)
                done()
            })
    })

    it("Should return EMPTY_USERNAME error", (done)=>{
        let obj = {
            "username": "",
            "password": "pass"
        }
        chai.request(server)
            .post("/api/v1/admin/login")
            .send(obj)
            .end(async(err, res)=>{
                let data = JSON.parse(res.text)
                assert(data.errors.username == "EMPTY_USERNAME")
                done()
            })
    })

    it("Should return EMPTY_PASSWORD error", (done)=>{
        let obj = {
            "username": "john",
            "password": ""
        }
        chai.request(server)
            .post("/api/v1/admin/login")
            .send(obj)
            .end(async(err, res)=>{
                let data = JSON.parse(res.text)
                assert(Object.keys(data.errors).length == 1)
                assert(data.errors.password == "EMPTY_PASSWORD")
                done()
            })
    })

    it("Should return EMPTY_USERNAME and EMPTY_PASSWORD errors", (done)=>{
        let obj = {
            "username": "",
            "password": ""
        }
        chai.request(server)
            .post("/api/v1/admin/login")
            .send(obj)
            .end(async(err, res)=>{
                let data = JSON.parse(res.text)
                assert(Object.keys(data.errors).length == 2)
                assert(data.errors.username == "EMPTY_USERNAME")
                assert(data.errors.password == "EMPTY_PASSWORD")
                done()
            })
    })

    it("Should return INVALID_CREDENTIALS", (done)=>{
        let obj = {
            "username": "john",
            "password": "john"
        }
        chai.request(server)
            .post("/api/v1/admin/login")
            .send(obj)
            .end(async(err, res)=>{
                let data = JSON.parse(res.text)
                assert(Object.keys(data.errors).length == 1)
                assert(data.errors.form == "INVALID_CREDENTIALS")
                done()
            })
    })

    it("Should send webtoken if no error has been detected", (done)=>{
        let obj = {
            "username": "john",
            "password": "john-password"
        }
        chai.request(server)
            .post("/api/v1/admin/login")
            .send(obj)
            .end(async(err, res)=>{
                let data = JSON.parse(res.text)
                assert(data.accessToken != null)
                assert(data.userId != null)
                done()
            })
    })
})
