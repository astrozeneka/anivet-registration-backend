const AdminDAO = require("../../dao/crud/AdminDAO");
const BaseDataController = require("./BaseDataController");

class AdminController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new AdminController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = AdminDAO.getInstance()
    }
}
module.exports = AdminController
