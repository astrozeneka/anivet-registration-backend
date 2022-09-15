const BaseBL = require("./BaseBL");


class TimeBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TimeBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    #time = null

    get time(){
        return this.#time;
    }

    set time(value){
        this.#time = value;
    }

    destroy(){
        this.time = null;
    }
}
module.exports = TimeBL
