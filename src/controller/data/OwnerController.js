const BaseDataController = require("./BaseDataController");
const OwnerDAO = require("../../dao/crud/OwnerDAO");

class OwnerController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new OwnerController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = OwnerDAO.getInstance()
    }
}
module.exports = OwnerController
