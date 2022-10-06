const BaseController = require("./BaseController");
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const path = require("path");
const AuthenticationBL = require("../businessLogic/AuthenticationBL");
const Owner = require("../model/Owner");
const Breeder = require("../model/Breeder");
const Vet = require("../model/Vet");
const jwt = require("jsonwebtoken");

class ProfileController extends BaseController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ProfileController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    bmd = null
    constructor() {
        super();
        this.bmd = BaseMemberDAO.getInstance()
    }
    register(app, prefix){
        super.register(app, prefix)

        app.post(path.join(this.prefix, "/login"), async(req, res)=>{
            let d = req.body
            let type = d.type
            let username = d.username
            let password = d.password

            let u = await AuthenticationBL.getInstance().authenticateUser(type, username, password)
            res.setHeader('Content-Type', 'application/json')

            if(!(u instanceof Owner) && !(u instanceof Breeder) && !(u instanceof Vet))
                res.send(u) // return the error from the business logic layer
            else{
                // Provide the access token
                let accessToken = jwt.sign(u.serialize(), process.env.TOKEN_SECRET, {expiresIn: 18000})
                res.send(JSON.stringify({
                    accessToken: accessToken,
                    userId: u.id
                }))
            }
        })
    }
}
module.exports = ProfileController
