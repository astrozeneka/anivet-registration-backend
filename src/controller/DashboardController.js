const BaseController = require("./BaseController");
const DashboardBL = require("../businessLogic/DashboardBL");
const path = require("path");
const {isAdminToken} = require("../utils/token");


class DashboardController extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DashboardController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(path.join(this.prefix, "/"), async (req, res)=>{
            if(!req.query.hasOwnProperty("token")){
                // TODO: Token verification should be done later
                res.status(403).send("Forbidden resources")
                return
            }
            let output = await DashboardBL.getInstance().getData()
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })

        app.get(path.join(this.prefix, "/menu-badge"), async(req, res)=>{
            if(!await isAdminToken(req.decodedToken)){
                res.return(403).send("Unauthorized")
            }

            let output = await DashboardBL.getInstance().getMenuBadge()
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(output))
        })
    }
}
module.exports = DashboardController
