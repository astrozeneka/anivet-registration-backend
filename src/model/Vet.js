const BaseMember = require("./BaseMember");


class Vet extends BaseMember{
    #address = null
    #corp = null

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

    serialize(){
        let output = super.serialize()
        if(this.address != null)
            output.address = this.address.serialize()
        output.corp = this.#corp
        return output
    }
}
module.exports = Vet
