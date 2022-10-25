const BaseDataController = require("./BaseDataController");
const TestResultDAO = require("../../dao/crud/TestResultDAO");

class TestResultController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestResultController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = TestResultDAO.getInstance()
    }
}
module.exports = TestResultController
