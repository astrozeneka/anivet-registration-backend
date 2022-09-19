const BaseController = require("./BaseController");
const BreederDAO = require("../dao/BreederDAO");
const SampleStatusDAO = require("../dao/SampleStatusDAO");
const {join} = require("path");

class SampleStatusController extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SampleStatusController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
    }

    register(app, prefix){
        super.register(app, prefix);

        app.get(join(this.prefix, "/:trackingTypeId"), async(req, res)=>{
            let id = req.params.trackingTypeId
            let list = await SampleStatusDAO.getInstance().getAllByTrackingId(id)
            let output = []
            list.forEach((item)=>{output.push(item.serialize())})
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = SampleStatusController
