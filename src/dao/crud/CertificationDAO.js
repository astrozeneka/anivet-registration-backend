const SciDocDAO = require("./SciDocDAO");

class CertificationDAO extends SciDocDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new CertificationDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "certification"
}
module.exports = CertificationDAO
