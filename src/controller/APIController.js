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

        // Installation
        InstallationController.getInstance().register(app, path.join(prefix, "install"))

        // Breed
        BreedController.getInstance().register(app, path.join(prefix, "breed"))

        // Test sample
        TestSampleController.getInstance().register(app, path.join(prefix, "testSample"))

        // Test order
        TestOrderController.getInstance().register(app, path.join(prefix, "testOrder"))

        // Admin
        AdminController.getInstance().register(app, path.join(prefix, "admin"))

        // Breeder
        BreederController.getInstance().register(app, path.join(prefix, "breeder"))

        // Vet
        VetController.getInstance().register(app,path.join(prefix, "vet"))

        // Owner
        OwnerController.getInstance().register(app, path.join(prefix, "owner"))

        // Registration (Breeder+Vet+Owner)
        RegistrationController.getInstance().register(app, path.join(prefix, "registration"))

        app.get(path.join(this.prefix, "/"), (req, res)=>{
            res.send("Hello world from the api")
        })
    }
}

module.exports = APIController
