const BaseValidationController = require("./BaseValidationController");
const TestSampleDAO = require("../../dao/crud/TestSampleDAO");
const {isAdminToken} = require("../../utils/token");
const jwt = require("jsonwebtoken");
const ValidationBL = require("../../businessLogic/ValidationBL");

class TestSampleValidationController extends BaseValidationController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestSampleValidationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = TestSampleDAO.getInstance()

        this.app.get("/byTestOrderId/:testOrderId", async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let testOrderId = req.params.testOrderId
            let view = "validation_details"
            let list = await ValidationBL.getInstance().testSample.byTestOrder(view, req.query.offset, req.query.limit, testOrderId)
            let output = []
            list.forEach((item)=>output.push(
                this.dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = TestSampleValidationController
