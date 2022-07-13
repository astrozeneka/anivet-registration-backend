const DatabaseManager = require("../src/service/DatabaseManager")
var chai = require('chai');
var assert = chai.assert;


describe("Database Manager", function(){
    it("Should connect", async function(){
        let dm = DatabaseManager.getInstance()
        await dm.init()
        assert(dm.connection != null)
    })
})