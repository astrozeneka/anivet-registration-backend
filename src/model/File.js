
class File {
    #id = null
    #type = null
    #name = null // With extension
    #content = null // base64 encoded

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

    get content() {
        return this.#content;
    }

    set content(value) {
        this.#content = value;
    }
}
module.exports = File
