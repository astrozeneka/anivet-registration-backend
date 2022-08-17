const DatabaseManager = require("../service/DatabaseManager");

class BaseController {

    ad = null
    bd = null
    od = null
    tod = null
    tsd = null
    brd = null
    vd = null

    prefix = ""

    constructor(){
        // Initialize the connection to the database
        DatabaseManager.getInstance().init()
    }

    register(app, prefix){
        if(prefix != undefined) this.prefix = prefix
    }
}

module.exports = BaseController
