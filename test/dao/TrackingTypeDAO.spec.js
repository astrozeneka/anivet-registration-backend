
const chai = require("chai");
const DatabaseManager = require("../../src/service/DatabaseManager");
const TrackingTypeDAO = require("../../src/dao/TrackingTypeDAO");
const resetDatabase = require("../../src/utils/resetDatabase");
var assert = chai.assert;

describe("TrackingTypeDAO", function(){
    let dm = DatabaseManager.getInstance();
    let ttd = TrackingTypeDAO.getInstance();

    beforeEach(async()=>{
        await dm.init()
        await resetDatabase()
    })

    it("Should build table", ()=>{

    })
})
