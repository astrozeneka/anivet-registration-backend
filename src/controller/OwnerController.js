const BaseController = require("./BaseController");
const OwnerDAO = require("../dao/OwnerDAO");
const {join} = require("path");
const Owner = require("../model/Owner");
const Address = require("../model/Address");

class OwnerController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new OwnerController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.od = OwnerDAO.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(join(this.prefix, "/"), async (req, res)=>{
            let list = await this.od.getAll();
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        app.get(join(this.prefix, "/:ownerId"), async (req, res)=>{
            let id = req.params.ownerId
            let output = await this.od.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(join(this.prefix, "/"), async(req, res)=>{
            let d = req.body
            let owner = new Owner();
            owner.name1 = d.name1;
            owner.name2 = d.name2;
            owner.phone = d.phone;
            owner.email = d.email;
            owner.username = d.username;
            owner.password = d.password;
            owner.website = d.website;
            owner.subscribe = d.subscribe;
            owner.corp = d.corp;

            if(owner.address == null) {
                owner.address = new Address();
            } else {
                owner.address = new Address();
                owner.address.address1 = d.address.address1;
                owner.address.country = d.address.country;
                owner.address.changwat = d.address.changwat;
                owner.address.amphoe = d.address.amphoe;
                owner.address.tambon = d.address.tambon;
                owner.address.postcode = d.address.postcode;
            }

            await this.od.add(owner)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(owner.serialize()))

        })

        app.put(join(this.prefix, "/"), async(req, res)=>{
            let d = req.body
            let owner = new Owner()
            owner.id = d.id
            let _owner = await this.od.getById(owner.id)

            owner.name1 = d.name1 || _owner.name1
            owner.name2 = d.name2 || _owner.name2
            owner.phone = d.phone || _owner.phone
            owner.email = d.email || _owner.email
            owner.username = d.username || _owner.username
            owner.password = d.password || _owner.password
            owner.website = d.website || _owner.website
            owner.address = d.address || _owner.address

            await this.od.update(owner)
            let output = await this.od.getById(owner.id)

            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.delete(join(this.prefix, "/"), async (req, res)=>{
            let d = req.body;
            let owner = new Owner();
            owner.id = d.id;
            await this.od.delete(owner);

            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })
    }
}
module.exports = OwnerController
