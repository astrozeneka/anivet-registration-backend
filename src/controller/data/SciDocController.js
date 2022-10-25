const BaseDataController = require("./BaseDataController");
const SciDocDAO = require("../../dao/crud/SciDocDAO");

class SciDocController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SciDocController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = SciDocDAO.getInstance()
    }
}
module.exports = SciDocController
