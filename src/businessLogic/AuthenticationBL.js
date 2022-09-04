const BaseBL = require("./BaseBL");
const AdminDAO = require("../dao/AdminDAO");

let _ = require("lodash");

class AuthenticationBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new AuthenticationBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    add = null

    constructor(){
        super();
        this.add = AdminDAO.getInstance()
    }

    /**
     * A Typical example of business logic algorithm
     * @param username
     * @param password
     * @returns {Promise<{}|any>}
     */
    async authenticateAdmin(username, password){
        let errors = {}
        if(username == "")
            errors["username"] = "EMPTY_USERNAME"
        if(password == "")
            errors["password"] = "EMPTY_PASSWORD"
        if(!_.isEmpty(errors))
            return {"errors":errors}
        let a = await this.add.authenticate(username, password)
        if(a == null) {
            errors["form"] = "INVALID_CREDENTIALS"
            return {"errors":errors}
        }
        return a
    }
}
module.exports = AuthenticationBL
