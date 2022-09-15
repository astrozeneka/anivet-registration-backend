const BaseController = require("./BaseController");
const TimeBL = require("../businessLogic/TimeBL");
const {join} = require("path");


class FakeTimeController extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FakeTimeController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(join(this.prefix, "/"), async(req, res)=>{
            let time = TimeBL.getInstance().time
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(time))
        })

        app.post(join(this.prefix, "/"), async(req, res)=>{
            let time = req.body;
            TimeBL.getInstance().time = new Date(time);
            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })

        app.get(join(this.prefix, "/set"), async(req, res)=>{
            let time = req.query.time
            TimeBL.getInstance().time = new Date(time);
            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })
    }
}
module.exports = FakeTimeController
