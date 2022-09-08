const BaseController = require("./BaseController");
const MessageDAO = require("../dao/MessageDAO");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const MemberBL = require("../businessLogic/MemberBL");
const path = require("path");


class MessageController extends BaseController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new MessageController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    md = null
    bmd = null
    mbl = null

    constructor() {
        super();
        this.md = MessageDAO.getInstance()
        this.bmd = BaseMemberDAO.getInstance()
        this.mbl = MemberBL.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(path.join(this.prefix, "/to/:memberId"), async(req, res)=>{
            let id = req.params.memberId

            if(!req.query.hasOwnProperty("token")){
                // TODO: Token verification should be done later
                res.status(403).send("Forbidden resources")
                return
            }
            let user = await this.bmd.getById(id)
            if(user == null) {
                res.status(403).send("Forbidden resources")
                return
            }

            let messages = await this.mbl.messageList(user)
            let output = []
            messages.forEach((message)=>{
                output.push(message.serialize())
            })
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = MessageController
