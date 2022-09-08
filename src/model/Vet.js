const BaseMember = require("./BaseMember");


class Vet extends BaseMember{
    #address = null
    #corp = null
    #type = null

    get address() {
        return this.#address;
    }

    set address(value) {
        this.#address = value;
    }

    get corp() {
        return this.#corp;
    }

    set corp(value) {
        this.#corp = value;
    }

    get type() {
        return this.#type;
    }

    serialize(){
        let output = super.serialize()
        if(this.address != null)
            output.address = this.address.serialize()
        output.corp = this.#corp
        return output
    }
}
module.exports = Vet
