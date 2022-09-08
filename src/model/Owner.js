const BaseMember = require("./BaseMember");

/**
 * Owner is a Base Member with ONE address
 */
class Owner extends BaseMember{
    #type = "owner"
    #address = null

    get address() {
        return this.#address;
    }

    set address(value) {
        this.#address = value;
    }


    get type() {
        return this.#type;
    }
}
module.exports = Owner
