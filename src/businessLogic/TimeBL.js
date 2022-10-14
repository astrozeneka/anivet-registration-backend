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

    #manual = false
    #time = null

    get time(){
        if(!this.#manual)
            this.#time = new Date()
        return this.#time;
    }

    set time(value){
        this.#manual = true
        this.#time = value;
    }

    destroy(){
        this.time = null;
        this.manual = false;
    }
}
module.exports = TimeBL
