
const BaseDataController = require("./BaseDataController");
const ScientistDAO = require("../../dao/crud/ScientistDAO");

class ScientistController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ScientistController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = ScientistDAO.getInstance()
    }
}
module.exports = ScientistController
