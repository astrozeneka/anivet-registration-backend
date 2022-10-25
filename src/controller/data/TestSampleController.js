const BaseDataController = require("./BaseDataController");
const TestSampleDAO = require("../../dao/crud/TestSampleDAO");

class TestSampleController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestSampleController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = TestSampleDAO.getInstance()
    }
}
module.exports = TestSampleController
