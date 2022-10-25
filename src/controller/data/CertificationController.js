const BaseDataController = require("./BaseDataController");
const CertificationDAO = require("../../dao/crud/CertificationDAO");

class CertificationController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new CertificationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = CertificationDAO.getInstance()
    }
}
module.exports = CertificationController
