const BaseDataController = require("./BaseDataController");
const TestOrderDAO = require("../../dao/crud/TestOrderDAO");

class TestOrderController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestOrderController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = TestOrderDAO.getInstance()
    }
}
module.exports = TestOrderController
