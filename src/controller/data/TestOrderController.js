const BaseDataController = require("./BaseDataController");
const TestOrderDAO = require("../../dao/crud/TestOrderDAO");
const {isAdminToken} = require("../../utils/token");
const CRUDBL = require("../../businessLogic/CRUDBL");

class TestOrderController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestOrderController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = TestOrderDAO.getInstance()

        // All samples related to a order
        this.app.get("/:id/testSamples", async (req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let id = req.params.id
            let view = ""
            let list = []
            let query = {q: {testOrderId: id}}
            const TestSampleDAO = require("../../dao/crud/TestSampleDAO");
            let dao = TestSampleDAO.getInstance()
            list = await CRUDBL.getInstance().searchView(dao, view, req.query.offset, req.query.limit, query)
            let output = []
            list.forEach((item)=>output.push(
                dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = TestOrderController
