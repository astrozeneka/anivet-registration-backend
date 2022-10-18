const BaseController = require("./BaseController");
const express = require("express");
const DashboardController = require("./DashboardController");
const auth = require("./middleware/auth")
const MessageController = require("./MessageController");
const TestOrderController = require("./TestOrderController");
const TestSampleController = require("./TestSampleController");
const SampleStatusController = require("./SampleStatusController");
//const VetController = require("./VetController");
//const ScientistController = require("./ScientistController");
const RegistrationController = require("./RegistrationController");
const BaseMemberControllerOld = require("./BaseMemberController");
const PaymentReceiptController = require("./PaymentReceiptController");
const ParcelController = require("./ParcelController");
const DocumentController = require("./DocumentController");
const CertificationController = require("./CertificationController");

// New Generation Controller
const BreederController = require("./data/BreederController");
const OwnerController = require("./data/OwnerController");
const VetController = require("./data/VetController");
const ScientistController = require("./data/ScientistController");
const AdminController = require("./data/AdminController");
const RegistrationValidationController = require("./validation/RegistrationValidationController")
const TestOrderValidationController = require("./validation/TestOrderValidationController");
const TestSampleValidationController = require("./validation/TestSampleValidationController");
const PaymentReceiptValidationController = require("./validation/PaymentReceiptValidationController");
const FeedRegistrationController = require("./feed/FeedRegistrationController");
const FeedProcessController = require("./feed/FeedProcessController");
const FeedMessageController = require("./feed/FeedMessageController");
const FeedSiteController = require("./feed/FeedSiteController");

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
        //this.app.use("/owner", OwnerController.getInstance().app)
        this.app.use("/vet", VetController.getInstance().app)
        //this.app.use("/breeder", BreederController.getInstance().app)
        this.app.use("/scientist", ScientistController.getInstance().app)
        this.app.use("/registration", RegistrationController.getInstance().app)
        this.app.use("/baseMember", BaseMemberControllerOld.getInstance().app)
        this.app.use("/paymentReceipt", PaymentReceiptController.getInstance().app)

        this.app.use("/parcel", ParcelController.getInstance().app)
        this.app.use("/document", DocumentController.getInstance().app)
        this.app.use("/certification", CertificationController.getInstance().app)

        // New generation controller
        this.app.use("/data/breeder", BreederController.getInstance().app)
        this.app.use("/data/owner", OwnerController.getInstance().app)
        this.app.use("/data/vet", VetController.getInstance().app)
        this.app.use("/data/scientist", ScientistController.getInstance().app)
        this.app.use("/data/admin", AdminController.getInstance().app)

        this.app.use("/validation/registration", RegistrationValidationController.getInstance().app)
        this.app.use("/validation/testOrder", TestOrderValidationController.getInstance().app)
        this.app.use("/validation/testSample", TestSampleValidationController.getInstance().app)
        this.app.use("/validation/paymentReceipt", PaymentReceiptValidationController.getInstance().app)

        this.app.use("/feed/registration", FeedRegistrationController.getInstance().app)
        this.app.use("/feed/message", FeedMessageController.getInstance().app)
        this.app.use("/feed/process", FeedProcessController.getInstance().app)
        this.app.use("/feed/site", FeedSiteController.getInstance().app)
    }

}
module.exports = APIV1Controller
