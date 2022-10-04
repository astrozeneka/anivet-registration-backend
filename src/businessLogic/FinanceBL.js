const BaseBL = require("./BaseBL");
const _ = require('lodash')

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
