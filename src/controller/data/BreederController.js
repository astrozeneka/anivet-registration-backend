const BaseDataController = require("./BaseDataController");
const BreederDAO = require("../../dao/crud/BreederDAO");

class BreederController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BreederController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = BreederDAO.getInstance()
    }
}
module.exports = BreederController
