const BaseController = require("./BaseController");
const {join} = require("path");
const RegistrationBL = require("../businessLogic/RegistrationBL");


class RegistrationController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new RegistrationController()
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
        super.register(app, prefix);

        app.post(join(this.prefix, '/'), async(req, res)=>{
            let d = req.body
            let u = await RegistrationBL.getInstance().register(d)
            res.setHeader('Content-Type', 'application/json')
            if(u.hasOwnProperty("errors")){
                res.send(JSON.stringify(u))
            }else{
                res.send(JSON.stringify({
                    "object": u.object.serialize()
                }))
            }
        })
    }
}
module.exports = RegistrationController
