const BaseDataController = require("./BaseDataController");
const VetDAO = require("../../dao/crud/VetDAO");

class VetController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new VetController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = VetDAO.getInstance()
    }
}
module.exports = VetController
