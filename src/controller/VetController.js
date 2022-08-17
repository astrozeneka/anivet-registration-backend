const BaseController = require("./BaseController");
const VetDAO = require("../dao/VetDAO");
const {join} = require("path");
const Vet = require("../model/Vet");
const Address = require("../model/Address");


class VetController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new VetController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.vd = VetDAO.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(join(this.prefix, "/"), async (req, res)=>{
            let list = await this.vd.getAll();
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        app.get(join(this.prefix, "/:vetId"), async(req, res)=>{
            let id = req.params.vetId
            let output = await this.vd.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(join(this.prefix, "/"), async(req, res)=>{
            let d = req.body
            let vet = new Vet()
            vet.name1 = d.name1;
            vet.name2 = d.name2;
            vet.phone = d.phone;
            vet.email = d.email;
            vet.username = d.username;
            vet.password = d.password;
            vet.website = d.website;
            vet.subscribe = d.subscribe;
            vet.corp = d.corp;

            if(vet.address == null) {
                vet.address = new Address();
            } else {
                vet.address = new Address();
                vet.address.address1 = d.address.address1;
                vet.address.country = d.address.country;
                vet.address.changwat = d.address.changwat;
                vet.address.amphoe = d.address.amphoe;
                vet.address.tambon = d.address.tambon;
                vet.address.postcode = d.address.postcode;
            }

            await this.vd.add(vet)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(vet.serialize()))
        })

        app.put(join(this.prefix, "/"), async(req, res)=>{
            let d = req.body
            let vet = new Vet()
            vet.id = d.id
            let _vet = await this.vd.getById(vet.id) // The existant data from DB

            vet.name1 = d.name1 || _vet.name1
            vet.name2 = d.name2 || _vet.name2
            vet.phone = d.phone || _vet.phone
            vet.email = d.email || _vet.email
            vet.username = d.username || _vet.username
            vet.password = d.password || _vet.password
            vet.website = d.website || _vet.website
            vet.address = d.address || _vet.address
            vet.corp = d.corp || _vet.corp

            await this.vd.update(vet)
            let output = await this.vd.getById(vet.id)

            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.delete(join(this.prefix, "/"), async (req, res)=>{
            let d = req.body;
            let vet  = new Vet();
            vet.id = d.id;
            await this.vd.delete(vet)

            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })
    }
}
module.exports = VetController
