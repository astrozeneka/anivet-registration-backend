const BaseController = require("./BaseController");
var path = require("path")
const BreedController = require("./BreedController");
const TestSampleController = require("./TestSampleController");
const TestOrderController = require("./TestOrderController");
const InstallationController = require("./InstallationController");
const AdminController = require("./AdminController");
const BreederController = require("./BreederController");
const VetController = require("./VetController");
const OwnerController = require("./OwnerController");
const RegistrationController = require("./RegistrationController");
const ProfileController = require("./ProfileController");
const BaseMemberController = require("./BaseMemberController");
const MessageController = require("./MessageController");
const AddressController = require("./AddressController");
const FakeTimeController = require("./FakeTimeController");
const DashboardController = require("./DashboardController");
const SampleStatusController = require("./SampleStatusController");

const auth = require("./middleware/auth")

class APIController extends BaseController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new APIController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    prefix = ""

    constructor (){
        super();

    }

    register(app, prefix){
        if(prefix != undefined) this.prefix = prefix

        // Authentication middleware
        //app.use(auth)

        // Installation
        InstallationController.getInstance().register(app, path.join(prefix, "install"))

        // Breed
        BreedController.getInstance().register(app, path.join(prefix, "breed"))

        // Test sample
        TestSampleController.getInstance().register(app, path.join(prefix, "testSample"))

        // Test order
        TestOrderController.getInstance().register(app, path.join(prefix, "testOrder"))

        // Admin
        //AdminController.getInstance().register(app, path.join(prefix, "admin"))
        AdminController.getInstance().register()
        app.use("/api/v1/admin", AdminController.getInstance().app)
        console.log()

        // Breeder
        BreederController.getInstance().register(app, path.join(prefix, "breeder"))

        // Vet
        VetController.getInstance().register(app,path.join(prefix, "vet"))

        // Owner
        OwnerController.getInstance().register(app, path.join(prefix, "owner"))

        // Registration (Breeder+Vet+Owner)
        RegistrationController.getInstance().register(app, path.join(prefix, "registration"))

        // Profile Controller
        ProfileController.getInstance().register(app, path.join(prefix, "profile"))

        // BaseMember Controller
        BaseMemberController.getInstance().register(app, path.join(prefix, "baseMember"))

        // Message Controller
        MessageController.getInstance().register(app, path.join(prefix, "message"))

        // Address
        AddressController.getInstance().register(app, path.join(prefix, "address"))

        // Fake time controller
        FakeTimeController.getInstance().register(app, path.join(prefix, "fakeTime"))

        // Dashboard data
        DashboardController.getInstance().register(app, path.join(prefix, "dashboard"))

        // SampleStatus data
        SampleStatusController.getInstance().register(app, path.join(prefix, "sampleStatus"))


        app.get(path.join(this.prefix, "/"), (req, res)=>{
            res.send("Hello world from the api")
        })
    }
}

module.exports = APIController
