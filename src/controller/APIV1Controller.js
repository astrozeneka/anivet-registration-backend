const BaseController = require("./BaseController");
const express = require("express");
const DashboardController = require("./DashboardController");
const auth = require("./middleware/auth")

class APIV1Controller extends BaseController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new APIV1Controller()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.app = express.Router()
        this.app.use(auth)

        this.app.use("/dashboard", DashboardController.getInstance().app)
    }

}
module.exports = APIV1Controller
