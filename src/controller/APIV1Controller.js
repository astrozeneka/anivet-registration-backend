const BaseController = require("./BaseController");
const express = require("express");
const DashboardController = require("./DashboardController");
const auth = require("./middleware/auth")
const MessageController = require("./MessageController");
const TestOrderController = require("./TestOrderController");
const TestSampleController = require("./TestSampleController");
const SampleStatusController = require("./SampleStatusController");
const OwnerController = require("./OwnerController");
const VetController = require("./VetController");
const BreederController = require("./BreederController");
const ScientistController = require("./ScientistController");

class APIV1Controller extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new APIV1Controller()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.app = express.Router()
        this.app.use(auth)

        this.app.use("/dashboard", DashboardController.getInstance().app)
        this.app.use("/message", MessageController.getInstance().app)
        this.app.use("/testOrder", TestOrderController.getInstance().app)
        this.app.use("/testSample", TestSampleController.getInstance().app)
        this.app.use("/sampleStatus", SampleStatusController.getInstance().app)
        this.app.use("/owner", OwnerController.getInstance().app)
        this.app.use("/vet", VetController.getInstance().app)
        this.app.use("/breeder", BreederController.getInstance().app)
        this.app.use("/scientist", ScientistController.getInstance().app)
    }

}
module.exports = APIV1Controller
