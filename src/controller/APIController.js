const BaseController = require("./BaseController");
var path = require("path")
const BreedController = require("./BreedController");

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

        BreedController.getInstance().register(app, path.join(prefix, "breed"))

        app.get(path.join(this.prefix, "/"), (req, res)=>{
            res.send("Hello world from the api")
        })
    }
}

module.exports = APIController