const BaseMember = require("./BaseMember");

/**
 * Owner is a Base Member with ONE address
 */
class Owner extends BaseMember{
    #address = null

    get address() {
        return this.#address;
    }

    set address(value) {
        this.#address = value;
    }
}
module.exports = Owner