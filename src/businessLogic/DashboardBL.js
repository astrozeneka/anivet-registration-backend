const BaseBL = require("./BaseBL");

class DashboardBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DashboardBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }


}
module.exports = DashboardBL
