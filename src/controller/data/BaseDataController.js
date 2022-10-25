const express = require("express");
const {isAdminToken} = require("../../utils/token");
const CRUDBL = require("../../businessLogic/CRUDBL");
const jwt = require("jsonwebtoken");
const TimeBL = require("../../businessLogic/TimeBL");
const fs = require("fs")
const stream = require("stream");

class BaseDataController{

    get name(){
        return this.dao.name
    }

    constructor(){
        this.app = express.Router()

        this.app.get('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let view = ""
            let list = []
            list = await CRUDBL.getInstance().loadView(this.dao, view, req.query.offset, req.query.limit)
            /*if(req.query.hasOwnProperty('offset') && req.query.hasOwnProperty('limit'))
                list = await CRUDBL.getInstance().loadView(this.dao, view, req.query.offset, req.query.limit)
            else
                list = await CRUDBL.getInstance().loadView(this.dao, view)*/
            let output = []
            list.forEach((item)=>output.push(
                this.dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.post('/search', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let view = ""
            let list = []
            list = await CRUDBL.getInstance().searchView(this.dao, view, req.query.offset, req.query.limit, req.query)
            let output = []
            list.forEach((item)=>output.push(
                this.dao.model_to_raw[view](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        this.app.get('/props', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let props = await CRUDBL.getInstance().loadProps(this.dao)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(props))
        })

        this.app.get('/:id', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let id = req.params.id
            let view = "edit"
            let item = await CRUDBL.getInstance().loadOne(this.dao, view, id)
            let output = await this.dao.model_to_raw[view](item)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        // Be careful, id of entity, not of file
        // Only for a restricted number of controllers
        this.app.get("/file/:id", async(req, res)=>{
            if(!["sciDoc"].includes(this.dao.name))
                res.status(403).send("Unauthorized")
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let id = req.params.id
            let view = "file"
            let item = await CRUDBL.getInstance().loadOne(this.dao, view, id)
            let output = await this.dao.model_to_raw[view](item)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })


        /*
         * TO BE SOLVED
         */
        this.app.get("/_file/:id", async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let id = req.params.id
            let view = "file"
            let item = await CRUDBL.getInstance().loadOne(this.dao, view, id)

            /*
            let buffer = new Buffer(item.file, 'base64')
            let readStream = new stream.PassThrough();
            readStream.end(buffer)
            res.set('Content-disposition', 'attachment; filename=file.pdf')
            res.set('Content-type', 'application/pdf')
            readStream.pipe(res)

             */

            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-disposition': 'attachment; filename=file.pdf'
            })
            res.end(Buffer.from(item.file, 'base64'))

            console.log()
        })

        this.app.post('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            req.body.date = TimeBL.getInstance().time
            // Password encryption will be performed here
            let u = await CRUDBL.getInstance()[this.name].insert(req.body)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(u))
        })

        this.app.put('/:id', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let id = req.params.id
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.triggererId = decodedToken.id
            req.body.id = id
            // Password encryption will be performed here
            let u = await CRUDBL.getInstance()[this.name].update(req.body)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(u))
        })

        // To be moved downward
        this.app.delete('/:ids', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let idList = req.params.ids.split(",")
            let o = {affectedRows: 0}
            for(const id of idList) {
                let u = await CRUDBL.getInstance()[this.name].delete({id: id})
                o.affectedRows+= u.affectedRows
            }
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(o))
        })
    }
}
module.exports = BaseDataController
