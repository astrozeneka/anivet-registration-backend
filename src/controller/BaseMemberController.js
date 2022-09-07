const BaseController = require("./BaseController");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const path = require("path");

class BaseMemberController extends BaseController {
    bmd = null

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BaseMemberController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.bmd = BaseMemberDAO.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        /*
        TODO GetALL
         */
        app.get(path.join(this.prefix, "/:memberId"), async(req, res)=>{
            let id = req.params.memberId

            if(!req.query.hasOwnProperty("token")){
                res.status(403).send("Forbidden resources")
                return
            }
            // TODO: Token verification should be done later
            let output = await this.bmd.getById(id)
            if(output == null) {
                res.status(404).send("Not found")
            }else {
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(output.serialize()))
            }
        })

        app.put(path.join(this.prefix, "/:memberId"), async(req, res)=>{
            let id = req.params.memberId
            let d = req.body

            if(!req.query.hasOwnProperty("token")){
                res.status(403).send("Forbidden resources")
                return
            }
            // TODO: Token verification should be done later

            let e = await this.bmd.getById(id)
            e.name1 = d.name1 || e.name1
            e.name2 = d.name2 || e.name2
            e.phone = d.phone || e.phone
            e.email = d.email || e.email
            await this.bmd.update(e)
            let output = await this.bmd.getById(id)

            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })
    }
}
module.exports = BaseMemberController
