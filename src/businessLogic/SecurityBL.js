const BaseBL = require("./BaseBL");

class SecurityBL extends BaseBL{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SecurityBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async addParcel(){

    }

    async uploadDocument(){

    }

    async uploadCertification(){

    }
}
module.exports = SecurityBL
