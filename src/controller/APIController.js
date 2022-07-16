const BaseController = require("./BaseController");
var path = require("path")
const BreedController = require("./BreedController");
const TestSampleController = require("./TestSampleController");
const TestOrderController = require("./TestOrderController");

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

        // Breed
        BreedController.getInstance().register(app, path.join(prefix, "breed"))

        // Test sample
        TestSampleController.getInstance().register(app, path.join(prefix, "testSample"))

        // Test order
        TestOrderController.getInstance().register(app, path.join(prefix, "testOrder"))

        app.get(path.join(this.prefix, "/"), (req, res)=>{
            res.send("Hello world from the api")
        })
    }
}

module.exports = APIController