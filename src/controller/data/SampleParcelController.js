const BaseDataController = require("./BaseDataController");
const SampleParcelDAO = require("../../dao/SampleParcelDAO");

class SampleParcelController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SampleParcelController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = SampleParcelDAO.getInstance()
    }
}
module.exports = SampleParcelController
