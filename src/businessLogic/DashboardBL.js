const BaseBL = require("./BaseBL");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const TestOrderDAO = require("../dao/TestOrderDAO");
const TestSampleDAO = require("../dao/TestSampleDAO");

class DashboardBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DashboardBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async getData(){
        return {
            "registeredUsers": await BaseMemberDAO.getInstance().count(),
            "testOrders": await TestOrderDAO.getInstance().count(),
            "testSamples": await TestSampleDAO.getInstance().count()
        }
    }
}
module.exports = DashboardBL
