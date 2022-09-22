const BaseBL = require("./BaseBL");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const TestOrderDAO = require("../dao/TestOrderDAO");
const TestSampleDAO = require("../dao/TestSampleDAO");
const OwnerDAO = require("../dao/OwnerDAO");
const BreederDAO = require("../dao/BreederDAO");
const VetDAO = require("../dao/VetDAO");

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

    async getMenuBadge(){
        return {
            "testOrders": await TestOrderDAO.getInstance().count(),
            "testSamples": await TestSampleDAO.getInstance().count(),
            "owners": await OwnerDAO.getInstance().count(),
            "breeders": await BreederDAO.getInstance().count(),
            "vets": await VetDAO.getInstance().count()
        }
    }
}
module.exports = DashboardBL
