const BaseMember = require("./BaseMember");

class Breeder extends BaseMember{
    #address = null
    #breeds = []
    
    get address() {
        return this.#address;
    }

    set address(value) {
        this.#address = value;
    }

    get breeds() {
        return this.#breeds;
    }

    set breeds(value) {
        this.#breeds = value;
    }
}
module.exports = Breeder
