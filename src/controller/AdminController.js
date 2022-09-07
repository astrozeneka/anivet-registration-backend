const AdminDAO = require("../dao/AdminDAO");
const path = require("path")
const BaseController = require("./BaseController");
const Admin = require("../model/Admin");
const isValidUrl = require("../utils/isValidUrl");
let _ = require("lodash");

/*
const jwt = require("express-jwt");
const jwksRsa = require('jwks-rsa');
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://<AUTH0_DOMAIN>/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'anivet-api',
    issuer: `https://localhost/`,
    algorithms: ['RS256']
});
 */

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const AuthenticationBL = require("../businessLogic/AuthenticationBL");
dotenv.config()


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

            /****************
             * WE ARE HERE
             * Check the conformity of the URL
             * Check the validity of the password
             * Check the availability of the username
             * ***************/
            let errors = {}
            errors["password"] = "PASSWORD_TOO_SHORT"
            errors["passwordConfirm"] = "PASSWORD_MISMATCHED"
            if(!isValidUrl(admin.website))
                errors["website"] = "INVALID_URL"
            if(_.isEmpty(errors)){
                await this.add.add(admin)
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(admin.serialize()))
            }else{
                res.send(JSON.stringify(
                    {
                        "errors": errors
                    }
                ))
            }
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

        /**
         * The login method return authentication token to the client-side application
         */
        app.post(path.join(this.prefix, "/login"), async(req, res)=>{
            let d = req.body
            let username = d.username
            let password = d.password

            let u = await AuthenticationBL.getInstance().authenticateAdmin(username, password)
            res.setHeader('Content-Type', 'application/json')
            if(!(u instanceof Admin)){
                res.send(u) // Return exception to the user
            }else{
                let accessToken = jwt.sign(u.serialize(), process.env.TOKEN_SECRET, {expiresIn: 1800})
                res.send(JSON.stringify({
                    accessToken: accessToken,
                    userId: u.id
                }))
            }
        })
    }
}

module.exports = AdminController
