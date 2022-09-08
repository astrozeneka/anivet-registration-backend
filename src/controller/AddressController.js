const BaseController = require("./BaseController");
const AddressDAO = require("../dao/AddressDAO");
const path = require("path");


class AddressController extends BaseController{
    ad = null
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new AddressController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.ad = AddressDAO.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(path.join(this.prefix, "/ofMember/:memberId"), async(req, res)=>{
            let memberId = req.params.memberId

            if(!req.query.hasOwnProperty("token")){
                res.status(403).send("Forbidden resources")
                return
            }
            let output = await this.ad.getByMemberId(memberId)
            console.log()
            if(output == null) {
                res.status(404).send("Not found")
            }else {
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(output.serialize()))
            }
        })

        app.put(path.join(this.prefix, "/:addressId"), async(req, res)=>{
            let id = req.params.addressId
            let d = req.body

            if(!req.query.hasOwnProperty("token")){
                // TODO: Token verification should be done later
                res.status(403).send("Forbidden resources")
                return
            }

            let e = await this.ad.getById(id)
            e.address1 = d.address1 || e.address1
            e.country = d.country || e.country
            e.changwat = d.changwat || e.country
            e.amphoe = d.amphoe || e.amphoe
            e.tambon = d.tambon || e.tambon
            await this.ad.update(e)
            let output = await this.ad.getById(id)

            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })
    }
}
module.exports = AddressController
