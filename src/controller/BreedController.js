const BaseController = require("./BaseController");
const path = require("path")
const BreedDAO = require("../dao/BreedDAO");
const Breed = require("../model/Breed");

class BreedController extends BaseController{
    bd = null

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BreedController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();

        this.bd = BreedDAO.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        /**
         * LIST
         */
        app.get(path.join(this.prefix, "/"), async (req, res)=>{
            let list = await this.bd.getAll()
            let output = []
            list.forEach((item)=>output.push(item.serialize()))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })


        app.get(path.join(this.prefix, "/:breedId"), async(req, res)=>{
            let id = req.params.breedId
            let output = await this.bd.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(path.join(this.prefix, "/"), async (req, res)=>{
            let d = req.body
            let breed = new Breed()
            breed.type = d.type
            breed.name = d.name
            await this.bd.add(breed)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(breed.serialize()))
        })

        app.put(path.join(this.prefix, "/"), async (req, res)=>{
            let d = req.body
            let breed = new Breed()
            breed.id = d.id
            breed.type = d.type
            breed.name = d.name
            await this.bd.update(breed)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(breed.serialize()))
        })

        app.delete(path.join(this.prefix, "/"), async (req, res)=>{
            let d = req.body
            let breed = new Breed()
            breed.id = d.id
            await this.bd.delete(breed)
            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })
    }

}

module.exports = BreedController