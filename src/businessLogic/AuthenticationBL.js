const BaseBL = require("./BaseBL");
const AdminDAO = require("../dao/AdminDAO");

let _ = require("lodash");
const BaseMemberDAO = require("../dao/BaseMemberDAO");

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
    bmd = null

    constructor(){
        super();
        this.add = AdminDAO.getInstance()
        this.bmd = BaseMemberDAO.getInstance()
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

    async authenticateUser(type, username, password){
        let errors = {}
        if(!["owner", "breeder", "vet"].includes(type))
            errors["type"] = "UNKNOWN_TYPE"
        if(username == "")
            errors["username"] = "EMPTY_USERNAME"
        if(password == "")
            errors["password"] = "EMPTY_PASSWORD"
        if(!_.isEmpty(errors))
            return {"errors": errors}

        let a = await this.bmd.authenticate(type, username, password)
        if(a == null) {
            errors["form"] = "INVALID_CREDENTIALS"
            return {"errors":errors}
        }
        return a
    }
}
module.exports = AuthenticationBL
