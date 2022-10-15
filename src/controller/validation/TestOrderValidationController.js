const BaseValidationController = require("./BaseValidationController");
const TestOrderDAO = require("../../dao/crud/TestOrderDAO");


class TestOrderValidationController extends BaseValidationController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestOrderValidationController()
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
module.exports = TestOrderValidationController
