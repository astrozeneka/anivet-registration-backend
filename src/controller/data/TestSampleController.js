const BaseDataController = require("./BaseDataController");
const TestSampleDAO = require("../../dao/crud/TestSampleDAO");
const {isAdminToken} = require("../../utils/token");
const CRUDBL = require("../../businessLogic/CRUDBL");

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

        this.app.get("/custom/available", async (req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let view = ""
            let list = []
            let query = {q: {testOrderId: null}}
            list = await CRUDBL.getInstance().searchView(this.dao, view, req.query.offset, req.query.limit, query)
            let output = []
            list.forEach((item)=>output.push(
                this.dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = TestSampleController
