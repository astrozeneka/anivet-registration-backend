const DatabaseManager = require("../../src/service/DatabaseManager")
var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")

const AdminDAO = require("../../src/dao/AdminDAO");
chai.use(chaiHttp)

describe("InstallationController", async()=>{

    beforeEach(async()=>{

    })

    it("Should do have default admin user", (done)=>{
        chai.request(server)
            .get("/api/v1/install")
            .end(async (err, res)=>{
                assert(res.body.hasOwnProperty("object"))

                let admins = await AdminDAO.getInstance().getAll()
                assert(admins.length == 1)
                assert(admins[0].username == "admin")
                assert(admins[0].password == "admin")
                done()
            })
    })
})
