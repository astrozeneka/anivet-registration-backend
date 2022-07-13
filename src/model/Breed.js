

class Breed{
    #id = null
    #type = null
    #name = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    serialize(){
        return {
            id: this.id,
            type: this.type,
            name: this.name
        }
    }
}

module.exports = Breed