const AdminDAO = require("../dao/AdminDAO");
const path = require("path")
const BaseController = require("./BaseController");
const Admin = require("../model/Admin");

class AdminController extends BaseController{
    add = null
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new AdminController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.add = AdminDAO.getInstance();
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(path.join(this.prefix, "/"), async(req, res)=>{
            let list = await this.add.getAll();
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        app.get(path.join(this.prefix, "/:adminId"), async(req, res)=>{
            let id = req.params.adminId
            let output = await this.add.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(path.join(this.prefix, "/"), async (req, res)=>{
            let d = req.body
            let admin = new Admin()
            admin.username = d.username
            admin.password = d.password
            admin.website = d.website
            await this.add.add(admin)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(admin.serialize()))
        })

        app.put(path.join(this.prefix, "/"), async(req, res)=>{
            let d = req.body
            let admin = new Admin()
            admin.id = d.id
            admin.username = d.username
            admin.password = d.password
            admin.website = d.website
            await this.add.update(admin)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(admin.serialize()))
        })

        app.delete(path.join(this.prefix, "/"), async(req, res)=>{
            let d = req.body
            let admin = new Admin()
            admin.id = d.id
            await this.add.delete(admin)
            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })
    }
}

module.exports = AdminController
