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

    constructor() {
        super();
        this.type = "breeder"
    }

    serialize(){
        let output = super.serialize()
        if(this.address != null)
            output.address = this.address.serialize()
        output.breeds = []
        for(const breed of this.breeds)
            output.breeds.push(breed.serialize())
        return output
    }
}
module.exports = Breeder
