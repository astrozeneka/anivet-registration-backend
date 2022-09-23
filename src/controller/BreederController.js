
const {join} = require("path");
const BaseController = require("./BaseController");
const BreederDAO = require("../dao/BreederDAO");
const Breeder = require("../model/Breeder");
const Address = require("../model/Address");
const express = require("express");
const {isAdminToken} = require("../utils/token");

class BreederController extends BaseController{
    brd = null
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BreederController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
        this.brd = BreederDAO.getInstance();

        this.app = express.Router()
        this.app.get(join(this.prefix, "/"), async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let list = await this.brd.getAll();
            let output = []
            list.forEach((item)=>{output.push(item.serialize())})
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

    }

    register(app, prefix){
        super.register(app, prefix);



        app.get(join(this.prefix, "/:breederId"), async(req, res)=>{
            let id = req.params.breederId
            let output = await this.brd.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.post(join(this.prefix, "/"), async(req, res)=>{
            let d = req.body
            let breeder = new Breeder()
            breeder.name1 = d.name1;
            breeder.name2 = d.name2;
            breeder.phone = d.phone;
            breeder.email = d.email;
            breeder.username = d.username;
            breeder.password = d.password;
            breeder.website = d.website;
            breeder.subscribe = d.subscribe;

            if(breeder.address == null) {
                breeder.address = new Address();
            } else {
                breeder.address = new Address();
                breeder.address.address1 = d.address.address1;
                breeder.address.country = d.address.country;
                breeder.address.changwat = d.address.changwat;
                breeder.address.amphoe = d.address.amphoe;
                breeder.address.tambon = d.address.tambon;
                breeder.address.postcode = d.address.postcode;
            }

            if(d.breeds == null){
                d.breeds = []
            }

            breeder.breeds = []
            for(const _b of d.breeds){
                //_b.id = parseInt(_b.id)
                if(_b.id == undefined){
                    let breed = new Breeder();
                    breed.type = _b.type;
                    breed.name = _b.name;
                    breeder.breeds.push(breed)
                }else{
                    let id = parseInt(_b.id)
                    let breed = await this.brd.getById(id)
                    if(breed == null)
                        console.log(`ERROR: id ${id} is undefined`)
                    breeder.breeds.push(breed)
                }
            }

            await this.brd.add(breeder)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(breeder.serialize()))

        })

        app.put(join(this.prefix, "/"), async(req, res)=>{
            let d = req.body;
            let breeder = new Breeder()
            breeder.id = d.id;
            let _breeder = await this.brd.getById(breeder.id)

            breeder.name1 = d.name1 || _breeder.name1
            breeder.name2 = d.name2 || _breeder.name2
            breeder.phone = d.phone || _breeder.phone
            breeder.email = d.email || _breeder.email
            breeder.username = d.username || _breeder.username
            breeder.password = d.password || _breeder.password
            breeder.website = d.website || _breeder.website
            breeder.address = d.address || _breeder.address
            breeder.breeds = d.breeds || _breeder.breeds

            await this.brd.update(breeder)
            let output = await this.brd.getById(breeder.id)

            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output.serialize()))
        })

        app.delete(join(this.prefix, "/"), async(req, res)=>{
            let d = req.body;
            let breeder = new Breeder()
            breeder.id = d.id;
            await this.brd.delete(breeder)
            res.setHeader('Content-Type', 'application/json')
            res.send(null)
        })
    }
}

module.exports = BreederController
