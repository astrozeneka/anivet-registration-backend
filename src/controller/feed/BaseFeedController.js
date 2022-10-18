const {isAdminToken} = require("../../utils/token");
const FeedBL = require("../../businessLogic/FeedBL");
const express = require("express");
const MessageDAO = require("../../dao/crud/MessageDAO");

class BaseFeedController {
    constructor(){
        this.app = express.Router()

        this.app.get('/', async(req, res)=>{
            if(!await isAdminToken(req.decodedToken))
                res.status(403).send("Unauthorized")
            let list = await FeedBL.getInstance().loadView(this.name, req.query.offset, req.query.limit)
            let output = []
            list.forEach((item)=>output.push(
                MessageDAO.getInstance().model_to_raw[this.name](item)
            ))
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = BaseFeedController
