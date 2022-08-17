

class Address {
    #id = null
    #address1 = null
    #country = null
    #changwat = null
    #amphoe = null
    #tambon = null
    #postcode = null

    #ownerId = null
    #breederId = null
    #vetId = null
    #baseMemberId = null

    serialize(){
        return {
            id: this.id,
            address1: this.address1,
            country: this.country,
            changwat: this.changwat,
            amphoe: this.amphoe,
            tambon: this.tambon,
            postcode: this.postcode
        }
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get address1() {
        return this.#address1;
    }

    set address1(value) {
        this.#address1 = value;
    }

    get country() {
        return this.#country;
    }

    set country(value) {
        this.#country = value;
    }

    get changwat() {
        return this.#changwat;
    }

    set changwat(value) {
        this.#changwat = value;
    }

    get amphoe() {
        return this.#amphoe;
    }

    set amphoe(value) {
        this.#amphoe = value;
    }

    get tambon() {
        return this.#tambon;
    }

    set tambon(value) {
        this.#tambon = value;
    }

    get postcode() {
        return this.#postcode;
    }

    set postcode(value) {
        this.#postcode = value;
    }

    get ownerId() {
        return this.#ownerId;
    }

    set ownerId(value) {
        this.#ownerId = value;
    }

    get breederId() {
        return this.#breederId;
    }

    set breederId(value) {
        this.#breederId = value;
    }

    get vetId() {
        return this.#vetId;
    }

    set vetId(value) {
        this.#vetId = value;
    }
}

module.exports = Address
