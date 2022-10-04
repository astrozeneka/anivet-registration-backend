const BaseBL = require("./BaseBL");

class FinanceBL extends BaseBL{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FinanceBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

}
module.exports = FinanceBL
