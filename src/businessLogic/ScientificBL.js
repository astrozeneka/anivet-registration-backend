const BaseBL = require("./BaseBL");


class ScientificBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ScientificBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

}
